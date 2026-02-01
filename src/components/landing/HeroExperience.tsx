"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { RotateCcw, ScanFace, Sparkles, Droplet, Sun, Loader2 } from "lucide-react";
import { DEPARTMENT_SIMULATIONS, DEFAULT_SIMULATION } from "@/lib/constants/simulations";

interface HeroExperienceProps {
    className?: string;
    department?: string;
}

type EffectMode = 'original' | 'glow' | 'whitening';

export default function HeroExperience({ className = "", department = "dermatology" }: HeroExperienceProps) {
    const config = DEPARTMENT_SIMULATIONS[department] || DEFAULT_SIMULATION;
    const [mode, setMode] = useState<EffectMode>('original');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showFlash, setShowFlash] = useState(false);

    const baseImage = config.baseImage || "/base.png";

    const handleModeChange = (newMode: EffectMode) => {
        if (mode === newMode) return;

        if (newMode === 'original') {
            setMode('original');
            return;
        }

        // AI Analysis Animation Sequence
        setIsAnalyzing(true);
        setMode(newMode);

        // 1. Analyzing Phase (Blur)
        setTimeout(() => {
            setIsAnalyzing(false);
            // 2. Reveal Phase (Flash)
            setShowFlash(true);
            setTimeout(() => setShowFlash(false), 500);
        }, 1500);
    };

    // Define filters for effects
    const getFilterStyle = (currentMode: EffectMode) => {
        switch (currentMode) {
            case 'glow':
                // 물광: 밝기 증가, 대비 증가, 약간의 채도 증가
                return 'brightness(1.1) contrast(1.1) saturate(1.1) drop-shadow(0 0 5px rgba(255,255,255,0.3))';
            case 'whitening':
                // 미백: 밝기 대폭 증가, 채도 약간 감소 (하얗게)
                return 'brightness(1.25) saturate(0.9) contrast(1.05)';
            default:
                return 'none';
        }
    };

    return (
        <div className={`relative ${className} w-full max-w-xl mx-auto`}>
            {/* Header */}
            <div className="text-center mb-6">
                <h3 className="text-xl font-bold tracking-wider text-skin-text">
                    {department === 'plastic-surgery' ? 'AI 가상 성형' : 'AI 피부 시뮬레이션'}
                </h3>
                <p className="text-sm text-skin-subtext mt-1">
                    왼쪽은 원본, 오른쪽은 시술 후 예상 모습입니다.
                </p>
            </div>

            {/* Main Viewport */}
            <div className="relative w-full aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/20 bg-skin-bgSecondary group">
                
                {/* 1. Original / Result Layer */}
                <div className={`absolute inset-0 transition-all duration-700 ${isAnalyzing ? 'blur-xl scale-105 opacity-80' : 'blur-0 scale-100 opacity-100'}`}>
                    
                    {/* Split View Container */}
                    <div className="absolute inset-0 flex">
                        {/* Left Half: Original (Always) */}
                        <div className="relative w-1/2 h-full overflow-hidden border-r border-white/20">
                            <div className="absolute inset-0 w-[200%] h-full">
                                <Image
                                    src={baseImage}
                                    alt="Original Left"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                            <div className="absolute top-4 left-4 px-2 py-1 bg-black/50 text-white text-[10px] rounded backdrop-blur-md">
                                Before
                            </div>
                        </div>

                        {/* Right Half: Effect (or Original) */}
                        <div className="relative w-1/2 h-full overflow-hidden">
                            <div className="absolute inset-0 w-[200%] h-full -left-full">
                                <Image
                                    src={baseImage}
                                    alt="Effect Right"
                                    fill
                                    className="object-cover transition-all duration-700"
                                    style={{ 
                                        filter: getFilterStyle(mode) 
                                    }}
                                />
                            </div>
                            <div className="absolute top-4 right-4 px-2 py-1 bg-skin-primary/80 text-white text-[10px] rounded backdrop-blur-md font-bold">
                                {mode === 'original' ? 'Before' : 'After'}
                            </div>
                        </div>
                    </div>

                    {/* Vignette Mask (Face Focus) */}
                    {mode !== 'original' && (
                        <div className="absolute inset-0 pointer-events-none bg-skin-bgSecondary"
                             style={{
                                 maskImage: 'radial-gradient(circle at 50% 45%, transparent 40%, black 85%)',
                                 WebkitMaskImage: 'radial-gradient(circle at 50% 45%, transparent 40%, black 85%)'
                             }}
                        />
                    )}
                </div>

                {/* 2. Scanning Overlay (Animation) */}
                {isAnalyzing && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/20 backdrop-blur-[2px]">
                        <div className="relative">
                            <ScanFace className="w-16 h-16 text-white/80 animate-pulse" />
                            <div className="absolute top-0 left-0 w-full h-1 bg-skin-primary shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-scan-down" />
                        </div>
                        <p className="mt-4 text-white font-bold text-lg animate-pulse">
                            AI 피부 분석 중...
                        </p>
                    </div>
                )}

                {/* 3. Flash Effect (Transition) */}
                <div className={`absolute inset-0 z-30 bg-white pointer-events-none transition-opacity duration-500 ease-out ${showFlash ? 'opacity-80' : 'opacity-0'}`} />

                {/* 4. Center Line (Guide) */}
                <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/50 z-10 shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-white/50 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-sm">
                        <div className="w-1 h-1 bg-white rounded-full" />
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="mt-8 grid grid-cols-2 gap-4">
                <button
                    onClick={() => handleModeChange('glow')}
                    disabled={isAnalyzing}
                    className={`relative p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-2 group overflow-hidden ${
                        mode === 'glow' 
                        ? 'bg-skin-primary text-white border-skin-primary shadow-lg scale-[1.02]' 
                        : 'bg-white/5 border-skin-text/10 hover:bg-white/10 text-skin-text hover:border-skin-primary/50'
                    }`}
                >
                    <div className="p-2 rounded-full bg-white/10 group-hover:scale-110 transition-transform">
                        <Droplet className="w-6 h-6" />
                    </div>
                    <span className="font-bold">물광 효과</span>
                    <span className="text-[10px] opacity-70">수분 가득한 촉촉함</span>
                    {mode === 'glow' && !isAnalyzing && (
                        <span className="absolute top-2 right-2 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                        </span>
                    )}
                </button>

                <button
                    onClick={() => handleModeChange('whitening')}
                    disabled={isAnalyzing}
                    className={`relative p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-2 group overflow-hidden ${
                        mode === 'whitening' 
                        ? 'bg-skin-primary text-white border-skin-primary shadow-lg scale-[1.02]' 
                        : 'bg-white/5 border-skin-text/10 hover:bg-white/10 text-skin-text hover:border-skin-primary/50'
                    }`}
                >
                    <div className="p-2 rounded-full bg-white/10 group-hover:scale-110 transition-transform">
                        <Sun className="w-6 h-6" />
                    </div>
                    <span className="font-bold">미백 효과</span>
                    <span className="text-[10px] opacity-70">투명하고 환한 피부</span>
                    {mode === 'whitening' && !isAnalyzing && (
                        <span className="absolute top-2 right-2 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                        </span>
                    )}
                </button>
            </div>

            {/* Reset Button */}
            {mode !== 'original' && (
                <div className="mt-6 text-center">
                    <button
                        onClick={() => handleModeChange('original')}
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-skin-surface border border-skin-text/10 text-skin-text text-sm hover:bg-skin-text/5 transition-colors"
                    >
                        <RotateCcw className="w-4 h-4" />
                        원본 보기
                    </button>
                </div>
            )}
        </div>
    );
}/ /   G l o w   a n d   W h i t e n i n g   S i m u l a t i o n   I m p l e m e n t e d  
 