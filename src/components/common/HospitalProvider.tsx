"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { HospitalConfig } from '@/lib/config/hospital';

const HospitalContext = createContext<HospitalConfig | null>(null);

export function HospitalProvider({
    children,
    initialConfig
}: {
    children: React.ReactNode;
    initialConfig: HospitalConfig;
}) {
    const [config] = useState<HospitalConfig>(initialConfig);

    useEffect(() => {
        console.log('HospitalProvider mounted, config:', config);
        // 테마 색상을 CSS 변수로 적용
        const root = document.documentElement;
        root.style.setProperty('--skin-primary', config.theme.primary);
        root.style.setProperty('--skin-secondary', config.theme.secondary);
        root.style.setProperty('--skin-accent', config.theme.accent);
        root.style.setProperty('--skin-bg', config.theme.background);
        root.style.setProperty('--skin-text', config.theme.text);

        // 기존 dental 변수들도 호환성을 위해 업데이트 (필요시)
        root.style.setProperty('--dental-primary', config.theme.primary);
        root.style.setProperty('--dental-bg', config.theme.background);
    }, [config]);

    return (
        <HospitalContext.Provider value={config}>
            {children}
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
