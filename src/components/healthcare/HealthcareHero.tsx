"use client";

import { HospitalConfig } from "@/lib/config/hospital";
import { Camera, Sparkles } from "lucide-react";
import Link from "next/link";

interface HealthcareHeroProps {
    config: HospitalConfig;
    onOpenCamera?: () => void;
}

export default function HealthcareHero({ config, onOpenCamera }: HealthcareHeroProps) {
    if (!config.theme) return null;

    // Unified Darkness Check (Re-refined)
    const isColorDark = (hex?: string) => {
        if (!hex) return false;
        let h = hex.replace('#', '');
        if (h.length === 3) {
            h = h.split('').map(c => c + c).join('');
        }
        if (h.length !== 6) return false;
        const r = parseInt(h.substring(0, 2), 16);
        const g = parseInt(h.substring(2, 4), 16);
        const b = parseInt(h.substring(4, 6), 16);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance < 0.5;
    };

    const isThemeDark = isColorDark(config.theme.background);
    const isPrimaryBright = config.theme.primary ? !isColorDark(config.theme.primary) : false;

    // Visibility Logic: Prefer theme text color but ensure contrast against media
    // If background is extreme (too bright/dark), we might need to nudge it
    const heroTitleColor = config.theme.text || (isThemeDark ? "#FFFFFF" : "#111111");
    const heroSubtitleColor = isThemeDark ? "#FFFFFF" : "#333333";
    const buttonTextColor = (isPrimaryBright && !isThemeDark) ? "text-slate-900 font-extrabold" : "text-white";

    return (
        <header
            className="relative px-6 pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden min-h-screen flex flex-col justify-center"
            style={{ backgroundColor: config.theme.background }}
        >
            {/* 배경 (영상 또는 이미지) */}
            <div className="absolute inset-0 z-0">
                {(() => {
                    const source = config.video || config.videoSource || "/2.mp4";
                    const isImage = source.match(/\.(jpg|jpeg|png|gif|webp)$/i);

                    if (isImage) {
                        return (
                            <img
                                src={source}
                                alt="Background"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        );
                    }

                    return (
                        <video
                            key={source}
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="metadata"
                            className="absolute inset-0 w-full h-full object-cover"
                        >
                            <source src={source} type="video/mp4" />
                        </video>
                    );
                })()}
            </div>

            {/* Hero Content - 1컬럼 중앙 정렬 */}
            <div className="relative z-10 max-w-3xl mx-auto w-full text-center">
                <div className="space-y-6 animate-fade-in">
                    {/* Eyebrow */}
                    <p
                        className="font-semibold tracking-[0.15em] uppercase text-xs"
                        style={{ color: config.theme.secondary }}
                    >
                        PREMIUM AI HEALTHCARE
                    </p>

                    {/* H1: Branded Gradient + Theme Text */}
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter leading-[1.05] drop-shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
                        <span
                            className="bg-clip-text text-transparent drop-shadow-none block mb-1"
                            style={{
                                backgroundImage: `linear-gradient(to right, ${config.theme.primary}, ${config.theme.accent})`,
                                WebkitBackgroundClip: 'text'
                            }}
                        >
                            {config.hero?.title.split(',')[0] || config.marketingName}
                        </span>
                        <span
                            className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.08)] block"
                            style={{ color: heroTitleColor }}
                        >
                            {config.hero?.title.split(',')[1] || "스마트 케어 솔루션"}
                        </span>
                    </h1>

                    {/* Body: Enhanced for Background Contrast */}
                    <p
                        className="text-lg md:text-xl leading-relaxed max-w-xl mx-auto drop-shadow-md font-medium px-4"
                        style={{ color: heroSubtitleColor, opacity: 0.85 }}
                    >
                        {config.hero?.subtitle || "지금 내 상태를 빠르게 체크하고, 맞춤형 솔루션을 확인해보세요."}
                    </p>

                    {/* CTA 3종 */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        {/* Primary CTA - AI 시뮬레이션 */}
                        {onOpenCamera && (
                            <button
                                onClick={onOpenCamera}
                                className={`px-8 py-4 ${buttonTextColor} text-base font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 border border-white/10`}
                                style={{
                                    backgroundColor: isThemeDark ? 'rgba(255,255,255,0.1)' : config.theme.primary,
                                    backdropFilter: isThemeDark ? 'blur(12px)' : 'none'
                                }}
                            >
                                <Sparkles className="w-5 h-5" />
                                AI 시뮬레이션 보기
                            </button>
                        )}

                        {/* Secondary CTA - 30초 체크 */}
                        <Link
                            href="healthcare/chat?topic=glow-booster"
                            className={`px-6 py-3 border-2 backdrop-blur-md text-sm font-semibold rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center gap-2`}
                            style={{
                                borderColor: isThemeDark ? 'rgba(255,255,255,0.2)' : config.theme.primary,
                                color: isThemeDark ? '#FFFFFF' : config.theme.primary,
                                backgroundColor: isThemeDark ? 'rgba(255,255,255,0.05)' : 'transparent'
                            }}
                        >
                            <Sparkles className="w-4 h-4" />
                            30초 체크 시작
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
