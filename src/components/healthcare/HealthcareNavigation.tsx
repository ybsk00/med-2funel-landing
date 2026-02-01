"use client";

import Link from "next/link";
import { HospitalConfig } from "@/lib/config/hospital";

interface HealthcareNavigationProps {
    config: HospitalConfig;
}

export default function HealthcareNavigation({ config }: HealthcareNavigationProps) {
    if (!config.theme) return null;

    // Theme Darkness Check
    const isThemeDark = () => {
        const hex = config.theme.background;
        if (!hex || hex.length < 4) return false;
        const h = hex.replace('#', '');
        const r = parseInt(h.substring(0, 2), 16);
        const g = parseInt(h.substring(2, 4), 16);
        const b = parseInt(h.substring(4, 6), 16);
        return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
    };

    const isDark = isThemeDark();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/10" style={{ backgroundColor: `${config.theme.background}cc` }}>
            <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
                <Link href="/" className="flex items-center gap-3 group cursor-pointer">
                    <span className="text-2xl">✨</span>
                    <span
                        className="text-xl font-bold tracking-wide"
                        style={{ color: config.theme.text }}
                    >
                        {config.marketingName || config.name}
                    </span>
                </Link>
                <Link
                    href="/login"
                    className="px-6 py-2.5 text-white text-sm font-medium rounded-full hover:shadow-lg transition-all duration-300 border border-white/10"
                    style={{
                        backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : config.theme.primary,
                        backdropFilter: isDark ? 'blur(12px)' : 'none'
                    }}
                >
                    로그인
                </Link>
            </div>
        </nav>
    );
}
