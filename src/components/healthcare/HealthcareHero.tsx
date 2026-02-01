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
    const heroTitleColor = config.theme.text || (isThemeDark ? "#FFFFFF" : "#111111");
    const heroSubtitleColor = isThemeDark ? "#FFFFFF" : "#333333";

    // Primary CTA Button: Use primary theme color, text depends on how bright that color is
    const primaryButtonBg = config.theme.primary || "#000000";
    const primaryButtonText = isPrimaryBright ? "text-slate-900" : "text-white";
    const primaryButtonBorder = isPrimaryBright ? "border-slate-900/10" : "border-white/20";

    // Secondary CTA Button: Glass effect but high visibility
    const secondaryButtonText = isThemeDark ? "text-white" : "text-slate-800";
    const secondaryButtonBorder = isThemeDark ? "border-white/30" : "border-slate-800/30";

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

                    {/* CTA Section: High-Impact Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-8">
                        {/* Primary CTA - AI 시뮬레이션 */}
                        {onOpenCamera && (
                            <button
                                onClick={onOpenCamera}
                                className={`group relative px-10 py-5 ${primaryButtonText} text-lg font-black rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 border ${primaryButtonBorder} overflow-hidden`}
                                style={{ backgroundColor: primaryButtonBg }}
                            >
                                {/* Button Shine Effect */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                                <Camera className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                <span className="relative z-10">AI 시뮬레이션 보기</span>

                                {/* Glow pulse */}
                                <div className="absolute inset-0 rounded-2xl ring-4 ring-white/20 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity"></div>
                            </button>
                        )}

                        {/* Secondary CTA - 30초 체크 */}
                        <Link
                            href="healthcare/chat?topic=glow-booster"
                            className={`px-8 py-4 border-2 ${secondaryButtonBorder} backdrop-blur-xl ${secondaryButtonText} text-base font-bold rounded-2xl hover:bg-white/10 hover:border-white/50 transition-all duration-300 flex items-center gap-2 shadow-xl`}
                            style={{
                                backgroundColor: isThemeDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
                            }}
                        >
                            <Sparkles className="w-5 h-5 text-skin-primary animate-pulse" />
                            30초 체크 시작
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
