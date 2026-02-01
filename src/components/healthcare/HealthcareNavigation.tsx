"use client";

import Link from "next/link";
import { HospitalConfig } from "@/lib/config/hospital";

interface HealthcareNavigationProps {
    config: HospitalConfig;
}

export default function HealthcareNavigation({ config }: HealthcareNavigationProps) {
    if (!config.theme) return null;

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
                    className="px-6 py-2.5 text-white text-sm font-medium rounded-full hover:shadow-lg transition-all duration-300"
                    style={{ backgroundColor: config.theme.primary }}
                >
                    로그인
                </Link>
            </div>
        </nav>
    );
}
