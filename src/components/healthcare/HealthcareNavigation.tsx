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
    const colors = config.theme.healthcare.colors;

    return (
        <nav
            className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-all duration-300"
            style={{
                backgroundColor: `${colors.background}e6`,
                borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'
            }}
        >
            <div className="flex items-center justify-between px-6 py-3.5 max-w-7xl mx-auto">
                <Link href="/" className="flex items-center gap-3 group cursor-pointer">
                    {/* Branded dot */}
                    <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black"
                        style={{ backgroundColor: colors.primary }}
                    >
                        {(config.healthcare.branding.logoText || config.hospital.name).charAt(0)}
                    </div>
                    <span
                        className="text-lg font-bold tracking-wide"
                        style={{ color: colors.text }}
                    >
                        {config.healthcare.branding.logoText || config.hospital.name}
                    </span>
                </Link>

                <div className="flex items-center gap-3">
                    <Link
                        href={`/login?dept=${config.hospital.department}`}
                        className={`px-6 py-2.5 text-sm font-bold rounded-full transition-all duration-300 hover:shadow-lg active:scale-95 ${isDark ? 'text-white border border-white/15 hover:bg-white/10' : 'text-white'}`}
                        style={{
                            backgroundColor: isDark ? 'transparent' : colors.primary,
                            backdropFilter: isDark ? 'blur(12px)' : 'none'
                        }}
                    >
                        로그인
                    </Link>
                </div>
            </div>
        </nav>
    );
}
