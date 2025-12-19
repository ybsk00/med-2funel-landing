'use client';

import { useCallback, useEffect, useRef } from 'react';

// Cookie 설정: Host-only, Path=/, Secure, SameSite=Lax, 30일
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in ms

// UUID v4 생성
function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

// Cookie 읽기
function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
}

// Cookie 설정
function setCookie(name: string, value: string, maxAge: number): void {
    if (typeof document === 'undefined') return;
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

// URL에서 UTM 파라미터 파싱
function parseUTMParams(): Record<string, string> {
    if (typeof window === 'undefined') return {};

    const params = new URLSearchParams(window.location.search);
    const utmParams: Record<string, string> = {};

    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'sub1', 'sub2'].forEach(key => {
        const value = params.get(key);
        if (value) utmParams[key] = value;
    });

    // Click IDs
    const clickIds: Record<string, string> = {};
    ['gclid', 'fbclid', 'naver_ad_id', 'ttclid'].forEach(key => {
        const value = params.get(key);
        if (value) clickIds[key] = value;
    });
    if (Object.keys(clickIds).length > 0) {
        utmParams.click_ids = JSON.stringify(clickIds);
    }

    return utmParams;
}

// 디바이스 타입 감지
function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    if (typeof navigator === 'undefined') return 'desktop';
    const ua = navigator.userAgent.toLowerCase();
    if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
    if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return 'mobile';
    return 'desktop';
}

interface TrackOptions {
    login_source?: 'direct' | 'chat';
    metadata?: Record<string, unknown>;
}

export function useMarketingTracker() {
    const utmParamsRef = useRef<Record<string, string>>({});
    const landingUrlRef = useRef<string>('');
    const isInitialized = useRef(false);

    // Initialize visitor_id and session_id
    useEffect(() => {
        if (typeof window === 'undefined' || isInitialized.current) return;
        isInitialized.current = true;

        // visitor_id: cookie (30 days)
        let visitorId = getCookie('visitor_id');
        if (!visitorId) {
            visitorId = generateUUID();
            setCookie('visitor_id', visitorId, COOKIE_MAX_AGE);
        }

        // session_id: sessionStorage + timeout check
        let sessionId = sessionStorage.getItem('session_id');
        const lastActivity = sessionStorage.getItem('last_activity');
        const now = Date.now();

        if (!sessionId || !lastActivity || (now - parseInt(lastActivity)) > SESSION_TIMEOUT) {
            sessionId = generateUUID();
            sessionStorage.setItem('session_id', sessionId);
        }
        sessionStorage.setItem('last_activity', now.toString());

        // Parse UTM params on first load
        const utmParams = parseUTMParams();
        if (Object.keys(utmParams).length > 0) {
            utmParamsRef.current = utmParams;
            // Store in sessionStorage for persistence during session
            sessionStorage.setItem('utm_params', JSON.stringify(utmParams));
        } else {
            // Retrieve from sessionStorage if available
            const storedUtm = sessionStorage.getItem('utm_params');
            if (storedUtm) {
                try {
                    utmParamsRef.current = JSON.parse(storedUtm);
                } catch {
                    // Ignore parse errors
                }
            }
        }

        // Store landing URL
        landingUrlRef.current = sessionStorage.getItem('landing_url') || window.location.href;
        if (!sessionStorage.getItem('landing_url')) {
            sessionStorage.setItem('landing_url', window.location.href);
        }
    }, []);

    // Track event
    const track = useCallback(async (eventName: string, options?: TrackOptions) => {
        if (typeof window === 'undefined') return;

        const visitorId = getCookie('visitor_id') || 'unknown';
        const sessionId = sessionStorage.getItem('session_id') || 'unknown';

        // Update last activity
        sessionStorage.setItem('last_activity', Date.now().toString());

        const payload = {
            visitor_id: visitorId,
            session_id: sessionId,
            event_name: eventName,
            page_url: window.location.href,
            landing_url: landingUrlRef.current,
            referrer: document.referrer || null,
            ...utmParamsRef.current,
            click_ids: utmParamsRef.current.click_ids ? JSON.parse(utmParamsRef.current.click_ids) : null,
            login_source: options?.login_source,
            metadata: options?.metadata
        };

        try {
            await fetch('/api/marketing/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } catch (error) {
            // Silent fail
            console.debug('Marketing track failed:', error);
        }
    }, []);

    // Attach user_id to visitor
    const attach = useCallback(async (userId: string, retroactive = false) => {
        if (typeof window === 'undefined') return;

        const visitorId = getCookie('visitor_id');
        if (!visitorId) return;

        try {
            await fetch('/api/marketing/attach', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    visitor_id: visitorId,
                    user_id: userId,
                    retroactive
                })
            });
        } catch (error) {
            console.debug('Marketing attach failed:', error);
        }
    }, []);

    // Record conversion
    const recordConversion = useCallback(async (reservationId: string, userId?: string) => {
        if (typeof window === 'undefined') return;

        const visitorId = getCookie('visitor_id');
        const sessionId = sessionStorage.getItem('session_id');

        try {
            const response = await fetch('/api/marketing/conversion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reservation_id: reservationId,
                    visitor_id: visitorId,
                    session_id: sessionId,
                    user_id: userId,
                    page_url: window.location.href
                })
            });
            return await response.json();
        } catch (error) {
            console.debug('Marketing conversion failed:', error);
            return null;
        }
    }, []);

    // Helper: Get current visitor_id
    const getVisitorId = useCallback(() => {
        return getCookie('visitor_id');
    }, []);

    return {
        track,
        attach,
        recordConversion,
        getVisitorId
    };
}

// 간단한 함수형 API (훅 없이도 사용 가능)
export async function trackEvent(eventName: string, options?: TrackOptions) {
    if (typeof window === 'undefined') return;

    const visitorId = getCookie('visitor_id') || 'unknown';
    const sessionId = sessionStorage.getItem('session_id') || 'unknown';
    const utmParams = JSON.parse(sessionStorage.getItem('utm_params') || '{}');
    const landingUrl = sessionStorage.getItem('landing_url') || window.location.href;

    try {
        await fetch('/api/marketing/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                visitor_id: visitorId,
                session_id: sessionId,
                event_name: eventName,
                page_url: window.location.href,
                landing_url: landingUrl,
                referrer: document.referrer || null,
                ...utmParams,
                login_source: options?.login_source,
                metadata: options?.metadata
            })
        });
    } catch {
        // Silent fail
    }
}
