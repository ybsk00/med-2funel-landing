"use client";

import { HospitalConfig } from "@/lib/config/hospital";
import { Camera, Sparkles } from "lucide-react";
import Link from "next/link";

interface HealthcareHeroProps {
    config: HospitalConfig;
    onOpenCamera: () => void;
}

export default function HealthcareHero({ config, onOpenCamera }: HealthcareHeroProps) {
    if (!config.theme) return null;

    return (
        <header className="relative px-6 pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden min-h-[85vh] flex flex-col justify-center">
            {/* 영상 배경 */}
            <div className="absolute inset-0 z-0">
                <video
                    key={config.videoSource}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src={config.videoSource || "/2.mp4"} type="video/mp4" />
                </video>
                {/* Overlays - Dynamic Background Based */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: `linear-gradient(to right, ${config.theme.background}E6, ${config.theme.background}B3, ${config.theme.background}66)`
                    }}
                />
                <div
                    className="absolute inset-0"
                    style={{
                        background: `linear-gradient(to bottom, ${config.theme.background}4D, transparent, ${config.theme.background}CC)`
                    }}
                />
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

                    {/* H1 */}
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] drop-shadow-[0_4px_4px_rgba(0,0,0,0.1)]">
                        <span
                            className="bg-clip-text text-transparent drop-shadow-none"
                            style={{
                                backgroundImage: `linear-gradient(to right, ${config.theme.primary}, ${config.theme.accent})`,
                                WebkitBackgroundClip: 'text'
                            }}
                        >
                            {config.hero?.title.split(',')[0] || config.marketingName}
                        </span><br />
                        <span
                            className="drop-shadow-[0_4px_4px_rgba(0,0,0,0.1)]"
                            style={{ color: config.theme.text }}
                        >
                            {config.hero?.title.split(',')[1] || "스마트 케어 솔루션"}
                        </span>
                    </h1>

                    {/* Body */}
                    <p
                        className="text-base md:text-lg leading-relaxed max-w-lg mx-auto drop-shadow-sm font-medium"
                        style={{ color: config.theme.text, opacity: 0.9 }}
                    >
                        {config.hero?.subtitle || "지금 내 상태를 빠르게 체크하고, 맞춤형 솔루션을 확인해보세요."}
                    </p>

                    {/* CTA 3종 */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        {/* Primary CTA - 사진으로 스타일 보기 */}
                        <button
                            onClick={onOpenCamera}
                            className="px-8 py-4 text-white text-base font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
                            style={{ backgroundColor: config.theme.primary, opacity: 0.95 }}
                        >
                            <Camera className="w-5 h-5" />
                            사진으로 스타일 보기
                        </button>

                        {/* Secondary CTA - 30초 체크 */}
                        <Link
                            href="healthcare/chat?topic=glow-booster"
                            className="px-6 py-3 border-2 backdrop-blur-sm text-sm font-semibold rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
                            style={{
                                borderColor: config.theme.primary,
                                color: config.theme.primary
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
