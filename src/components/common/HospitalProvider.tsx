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
    // Keep internal state synced if needed, but for now just use props directly for side effects
    // to ensure updates propagate immediately.

    useEffect(() => {
        if (!initialConfig?.theme) return;

        console.log('Applying Theme:', initialConfig.theme.concept);
        const root = document.documentElement;
        root.style.setProperty('--skin-primary', initialConfig.theme.primary);
        root.style.setProperty('--skin-secondary', initialConfig.theme.secondary);
        root.style.setProperty('--skin-accent', initialConfig.theme.accent);
        root.style.setProperty('--skin-bg', initialConfig.theme.background);
        root.style.setProperty('--skin-text', initialConfig.theme.text);

        // Dental compatibility
        root.style.setProperty('--dental-primary', initialConfig.theme.primary);
        root.style.setProperty('--dental-bg', initialConfig.theme.background);
    }, [initialConfig]);

    return (
        <HospitalContext.Provider value={initialConfig}>
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
