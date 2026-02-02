"use client";

import { HospitalConfig } from "@/modules/config/schema";
import { Camera, MessageCircle, Search, Sparkles } from "lucide-react";
import { isColorDark } from "@/lib/utils/theme";

interface HealthcareHeroProps {
    config: HospitalConfig;
    onOpenCamera?: () => void;
    ctaLabels?: { cta1: string; cta2: string };
    onScrollToClinic?: () => void;
    onScrollToSimulation?: () => void;
    onScrollToChat?: () => void;
}

export default function HealthcareHero({ config, onOpenCamera, ctaLabels, onScrollToClinic, onScrollToSimulation, onScrollToChat }: HealthcareHeroProps) {
    if (!config.theme) return null;

    const theme = config.theme.healthcare;
    const hero = theme.hero;

    const isThemeDark = isColorDark(theme.colors.background);
    const isPrimaryBright = theme.colors.primary ? !isColorDark(theme.colors.primary) : false;

    const ensureVisibility = (hex: string, backgroundIsDark: boolean) => {
        if (!hex) return backgroundIsDark ? "#FFFFFF" : "#000000";
        let h = hex.replace('#', '');
        if (h.length === 3) h = h.split('').map(c => c + c).join('');
        const r = parseInt(h.substring(0, 2), 16);
        const g = parseInt(h.substring(2, 4), 16);
        const b = parseInt(h.substring(4, 6), 16);
        const colorLuminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        if (backgroundIsDark) return "#FFFFFF";
        if (!backgroundIsDark) {
            if (colorLuminance > 0.5) {
                const nr = Math.floor(r * 0.35).toString(16).padStart(2, '0');
                const ng = Math.floor(g * 0.35).toString(16).padStart(2, '0');
                const nb = Math.floor(b * 0.35).toString(16).padStart(2, '0');
                return `#${nr}${ng}${nb}`;
            }
            return hex;
        }
        return hex;
    };

    const heroTitleColor = ensureVisibility(theme.colors.accent || theme.colors.primary, isThemeDark);
    const eyebrowColor = ensureVisibility(theme.colors.primary, isThemeDark);
    const primaryButtonBg = theme.colors.primary || "#000000";
    const primaryButtonText = isPrimaryBright ? "text-slate-900" : "text-white";
    const primaryButtonBorder = isPrimaryBright ? "border-slate-900/10" : "border-white/20";
    const secondaryButtonText = ensureVisibility(theme.colors.secondary, isThemeDark);
    const secondaryButtonBorder = isThemeDark ? "border-white/30" : "border-slate-800/30";

    return (
        <header
            className="relative px-6 pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden min-h-screen flex flex-col justify-center"
            style={{ backgroundColor: theme.colors.background }}
        >
            {/* 배경 (영상 또는 이미지) */}
            <div className="absolute inset-0 z-0">
                {(() => {
                    const media = hero.media;
                    if (media.type === 'image') {
                        return (
                            <img
                                src={media.src}
                                alt="Background"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        );
                    }
                    return (
                        <video
                            key={media.src}
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="metadata"
                            poster={media.poster}
                            className="absolute inset-0 w-full h-full object-cover"
                        >
                            <source src={media.src} type="video/mp4" />
                        </video>
                    );
                })()}
                {/* Gradient overlay for text readability */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: isThemeDark
                            ? `linear-gradient(180deg, ${theme.colors.background}cc 0%, ${theme.colors.background}88 40%, ${theme.colors.background}cc 100%)`
                            : `linear-gradient(180deg, ${theme.colors.background}dd 0%, ${theme.colors.background}99 40%, ${theme.colors.background}dd 100%)`
                    }}
                />
            </div>

            {/* Hero Content */}
            <div className="relative z-10 max-w-3xl mx-auto w-full text-center">
                <div className="space-y-6 animate-fade-in">
                    {/* Eyebrow */}
                    <p
                        className="font-black tracking-[0.25em] uppercase text-xs"
                        style={{ color: eyebrowColor }}
                    >
                        PREMIUM AI HEALTHCARE
                    </p>

                    {/* Headline */}
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter leading-[1.05] drop-shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
                        <span
                            className="bg-clip-text text-transparent drop-shadow-none block mb-1"
                            style={{
                                backgroundImage: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
                                WebkitBackgroundClip: 'text'
                            }}
                        >
                            {hero.headline.split('\n')[0] || config.hospital.name}
                        </span>
                        <span
                            className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.08)] block"
                            style={{ color: heroTitleColor }}
                        >
                            {hero.headline.split('\n')[1] || "스마트 케어 솔루션"}
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p
                        className={`text-lg md:text-xl leading-relaxed max-w-xl mx-auto drop-shadow-md font-bold px-4 ${isThemeDark ? 'text-white/80' : ''}`}
                        style={{ color: isThemeDark ? undefined : ensureVisibility(theme.colors.secondary || theme.colors.primary, isThemeDark), opacity: 0.95 }}
                    >
                        {hero.subheadline || "지금 내 상태를 빠르게 체크하고, 맞춤형 솔루션을 확인해보세요."}
                    </p>

                    {/* CTA Section: 3 buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 flex-wrap">
                        {/* CTA1: 유명한 병원 찾기 → Session 2 스크롤 */}
                        <button
                            onClick={onScrollToClinic}
                            className={`group relative px-10 py-5 ${primaryButtonText} text-lg font-black rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 border ${primaryButtonBorder} overflow-hidden`}
                            style={{ backgroundColor: primaryButtonBg }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <Search className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            <span className="relative z-10">{ctaLabels?.cta1 || "유명한 병원 찾기"}</span>
                            <div className="absolute inset-0 rounded-2xl ring-4 ring-white/20 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity" />
                        </button>

                        {/* CTA2: 시뮬레이션 → Session 3 스크롤 */}
                        <button
                            onClick={onScrollToSimulation || onOpenCamera}
                            className={`px-8 py-4 border-2 ${secondaryButtonBorder} backdrop-blur-xl transition-all duration-300 flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 text-base font-bold rounded-2xl`}
                            style={{
                                color: secondaryButtonText,
                                backgroundColor: isThemeDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
                            }}
                        >
                            <Camera className="w-5 h-5" style={{ color: theme.colors.primary }} />
                            {ctaLabels?.cta2 || "시뮬레이션 해보기"}
                        </button>

                        {/* CTA3: 상담하기 → Chat Session 스크롤 */}
                        <button
                            onClick={onScrollToChat}
                            className={`px-8 py-4 border-2 ${secondaryButtonBorder} backdrop-blur-xl transition-all duration-300 flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 text-base font-bold rounded-2xl`}
                            style={{
                                color: secondaryButtonText,
                                backgroundColor: isThemeDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
                            }}
                        >
                            <MessageCircle className="w-5 h-5" style={{ color: theme.colors.primary }} />
                            상담하기
                        </button>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
                <div className={`w-6 h-10 rounded-full border-2 flex items-start justify-center pt-2 ${isThemeDark ? 'border-white/30' : 'border-slate-800/30'}`}>
                    <div className={`w-1.5 h-2.5 rounded-full ${isThemeDark ? 'bg-white/50' : 'bg-slate-800/50'} animate-pulse`} />
                </div>
            </div>
        </header>
    );
}
