'use client';

import { useEffect } from 'react';
import { useMarketingTracker } from '@/hooks/useMarketingTracker';

interface MarketingTrackerProps {
    eventName: string;
    loginSource?: 'direct' | 'chat';
    metadata?: Record<string, unknown>;
    children?: React.ReactNode;
}

/**
 * 마케팅 이벤트 트래킹 래퍼 컴포넌트
 * 컴포넌트 마운트 시 자동으로 이벤트를 전송합니다.
 */
export function MarketingTracker({ eventName, loginSource, metadata, children }: MarketingTrackerProps) {
    const { track } = useMarketingTracker();

    useEffect(() => {
        track(eventName, { login_source: loginSource, metadata });
    }, [eventName, loginSource, track]);

    return <>{children}</>;
}

/**
 * F1 View 트래킹 (랜딩 페이지용)
 */
export function TrackF1View({ children }: { children?: React.ReactNode }) {
    return <MarketingTracker eventName="f1_view">{children}</MarketingTracker>;
}

/**
 * F1 Chat Start 트래킹 (헬스케어 챗 시작)
 */
export function TrackF1ChatStart({ children }: { children?: React.ReactNode }) {
    return <MarketingTracker eventName="f1_chat_start">{children}</MarketingTracker>;
}

/**
 * F2 Enter 트래킹 (로그인 성공)
 */
export function TrackF2Enter({ loginSource, children }: { loginSource: 'direct' | 'chat'; children?: React.ReactNode }) {
    return <MarketingTracker eventName="f2_enter" loginSource={loginSource}>{children}</MarketingTracker>;
}

/**
 * 기존 고객 페이지 뷰 트래킹 (로그인된 환자 포털)
 */
export function TrackReturningCustomerView({ children }: { children?: React.ReactNode }) {
    return <MarketingTracker eventName="returning_customer_view">{children}</MarketingTracker>;
}
