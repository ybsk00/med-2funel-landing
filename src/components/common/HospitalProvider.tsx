"use client";

import React, { createContext, useContext } from 'react';
import { HospitalConfig } from '@/lib/config/hospital';

const HospitalContext = createContext<HospitalConfig | null>(null);

/**
 * isColorDark - 색상 밝기 판단 유틸리티
 */
function isColorDark(hex?: string): boolean {
    if (!hex) return false;
    let h = hex.replace('#', '');
    if (h.length === 3) {
        h = h.split('').map(c => c + c).join('');
    }
    if (h.length !== 6) return false;
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
}

export function HospitalProvider({
    children,
    initialConfig
}: {
    children: React.ReactNode;
    initialConfig: HospitalConfig;
}) {
    // SSR-Safe: useEffect 대신 inline style로 CSS 변수를 즉시 주입
    // document.documentElement 조작을 제거하여 부모 의존성 완전 차단

    const themeIsDark = initialConfig?.theme ? isColorDark(initialConfig.theme.background) : false;

    // 래퍼 div에 직접 CSS 변수 주입 (SSR에서도 즉시 렌더링)
    const scopeStyle: React.CSSProperties = {
        // CSS Custom Properties
        ['--skin-primary' as string]: initialConfig.theme?.primary || '#666666',
        ['--skin-secondary' as string]: initialConfig.theme?.secondary || '#888888',
        ['--skin-accent' as string]: initialConfig.theme?.accent || '#666666',
        ['--skin-bg' as string]: initialConfig.theme?.background || 'transparent',
        ['--skin-text' as string]: initialConfig.theme?.text || 'inherit',
        ['--skin-bg-secondary' as string]: themeIsDark ? '#0F2535' : '#F8FAFC',
        ['--skin-surface' as string]: themeIsDark ? '#152A3D' : '#FFFFFF',
        ['--skin-subtext' as string]: themeIsDark ? '#94A3B8' : '#64748B',
        ['--skin-muted' as string]: themeIsDark ? '#1E3A5F' : '#E2E8F0',
        ['--dental-primary' as string]: initialConfig.theme?.primary || '#666666',
        ['--dental-bg' as string]: initialConfig.theme?.background || 'transparent',
        ['--dental-glow' as string]: 'rgba(59, 130, 246, 0.3)',
        // 직접 color/backgroundColor 설정으로 부모 body 스타일 완전 오버라이드
        color: initialConfig.theme?.text,
        backgroundColor: initialConfig.theme?.background,
    };

    return (
        <HospitalContext.Provider value={initialConfig}>
            <div style={scopeStyle} className="min-h-screen">
                {children}
            </div>
        </HospitalContext.Provider>
    );
}

export function useHospital() {
    const context = useContext(HospitalContext);
    if (!context) {
        throw new Error('useHospital must be used within a HospitalProvider');
    }
    return context;
}
