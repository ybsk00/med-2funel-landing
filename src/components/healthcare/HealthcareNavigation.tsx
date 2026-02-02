"use client";

import Link from "next/link";
import { HospitalConfig } from "@/modules/config/schema";
import { isColorDark } from "@/lib/utils/theme";

interface HealthcareNavigationProps {
    config: HospitalConfig;
}

export default function HealthcareNavigation({ config }: HealthcareNavigationProps) {
    if (!config.theme) return null;

    const isDark = isColorDark(config.theme.healthcare.colors.background);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/10" style={{ backgroundColor: `${config.theme.healthcare.colors.background}cc` }}>
            <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
                <Link href="/" className="flex items-center gap-3 group cursor-pointer">
                    <span className="text-2xl">✨</span>
                    <span
                        className="text-xl font-bold tracking-wide"
                        style={{ color: config.theme.healthcare.colors.text }}
                    >
                        {config.healthcare.branding.logoText || config.hospital.name}
                    </span>
                </Link>
                <Link
                    href="/login"
                    className="px-6 py-2.5 text-white text-sm font-medium rounded-full hover:shadow-lg transition-all duration-300 border border-white/10"
                    style={{
                        backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : config.theme.healthcare.colors.primary,
                        backdropFilter: isDark ? 'blur(12px)' : 'none'
                    }}
                >
                    로그인
                </Link>
            </div>
        </nav>
    );
}
