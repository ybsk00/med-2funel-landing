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

        // Helper to check if color is dark (simple hex check)
        const isDark = (hex: string) => {
            const h = hex.replace('#', '');
            if (h.length === 3) return false; // Default to light if short
            const r = parseInt(h.substring(0, 2), 16);
            const g = parseInt(h.substring(2, 4), 16);
            const b = parseInt(h.substring(4, 6), 16);
            const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            return luminance < 0.5;
        };

        const themeIsDark = isDark(initialConfig.theme.background);

        root.style.setProperty('--skin-primary', initialConfig.theme.primary);
        root.style.setProperty('--skin-secondary', initialConfig.theme.secondary);
        root.style.setProperty('--skin-accent', initialConfig.theme.accent);
        root.style.setProperty('--skin-bg', initialConfig.theme.background);
        root.style.setProperty('--skin-text', initialConfig.theme.text);

        // Dynamic Sub-colors
        if (themeIsDark) {
            root.style.setProperty('--skin-bg-secondary', '#0F2535');
            root.style.setProperty('--skin-surface', '#152A3D');
            root.style.setProperty('--skin-subtext', '#94A3B8');
            root.style.setProperty('--skin-muted', '#1E3A5F');
        } else {
            root.style.setProperty('--skin-bg-secondary', '#F8FAFC');
            root.style.setProperty('--skin-surface', '#FFFFFF');
            root.style.setProperty('--skin-subtext', '#64748B');
            root.style.setProperty('--skin-muted', '#E2E8F0');
        }

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
