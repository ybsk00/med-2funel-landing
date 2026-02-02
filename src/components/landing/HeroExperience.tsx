// Glow and Whitening Simulation Implemented
"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { RotateCcw, ScanFace, Sparkles, Droplet, Sun, Loader2 } from "lucide-react";
import { DEPARTMENT_SIMULATIONS, DEFAULT_SIMULATION } from "@/lib/constants/simulations";
import DentistrySimulationSlider from "@/components/healthcare/specialized/DentistrySimulationSlider";

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
        // Keep showing original during analysis, switch later

        // 1. Analyzing Phase (Blur) - 1.5s
        setTimeout(() => {
            setIsAnalyzing(false);
            setMode(newMode); // Switch content now
            // 2. Reveal Phase (Flash)
            setShowFlash(true);
            setTimeout(() => setShowFlash(false), 800);
        }, 1500);
    };

    // Retrieve full variant config
    const getVariantConfig = (currentMode: EffectMode) => {
        const variantKeyMap: Record<string, string> = {
            'glow': 'water-glow',
            'whitening': 'toning'
        };
        const targetKey = variantKeyMap[currentMode];
        return config.variants.find(v => v.key === targetKey);
    };

    const currentVariant = getVariantConfig(mode);
    const filterStyle = currentVariant ? currentVariant.filter : 'none';
    const overlayStyle = currentVariant && currentVariant.overlayColor ? {
        backgroundColor: currentVariant.overlayColor,
        mixBlendMode: currentVariant.mixBlendMode as any,
        opacity: currentVariant.overlayOpacity ?? 1
    } : null;

    if (department === 'dentistry') {
        return (
            <div className={`relative ${className} w-full max-w-xl mx-auto`}>
                <div className="text-center mb-6">
                    <h3 className="text-xl font-bold tracking-wider text-skin-text">
                        AI 치아 미백 시뮬레이션
                    </h3>
                    <p className="text-sm text-skin-subtext mt-1">
                        분석 버튼을 눌러 나의 예상 미백 결과를 확인하세요.
                    </p>
                </div>
                <DentistrySimulationSlider baseImage={baseImage} />
            </div>
        );
    }

    return (
        // ... (keeping structure)
        <div className={`relative ${className} w-full max-w-xl mx-auto`}>
            {/* Header */}
            <div className="text-center mb-6">
                <h3 className="text-xl font-bold tracking-wider text-skin-text">
                    {department === 'plastic-surgery' ? 'AI 가상 성형' : 'AI 피부 시뮬레이션'}
                </h3>
                <p className="text-sm text-skin-subtext mt-1">
                    {mode === 'original'
                        ? '원하는 효과를 선택하여 시뮬레이션을 시작하세요.'
                        : '왼쪽(Before)과 오른쪽(After)을 비교해보세요.'}
                </p>
            </div>

            {/* Main Viewport */}
            <div className="relative w-full aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/20 bg-skin-bgSecondary group">

                {/* 1. Content Layer */}
                <div className={`absolute inset-0 transition-all duration-700 ${isAnalyzing ? 'blur-xl scale-105 opacity-80' : 'blur-0 scale-100 opacity-100'}`}>

                    {mode === 'original' || isAnalyzing ? (
                        // Single Full Image (Original)
                        <div className="relative w-full h-full">
                            <Image
                                src={baseImage}
                                alt="Original"
                                fill
                                className="object-cover"
                                priority
                            />
                            {/* Vignette Mask */}
                            <div className="absolute inset-0 pointer-events-none bg-skin-bgSecondary"
                                style={{
                                    maskImage: 'radial-gradient(circle at 50% 45%, transparent 40%, black 85%)',
                                    WebkitMaskImage: 'radial-gradient(circle at 50% 45%, transparent 40%, black 85%)'
                                }}
                            />
                        </div>
                    ) : (
                        // Split View (Before & After)
                        <div className="absolute inset-0 flex">
                            {/* Left Half: Original */}
                            <div className="relative w-1/2 h-full overflow-hidden border-r-2 border-white/50 z-10">
                                <div className="absolute inset-0 w-[200%] h-full">
                                    <Image
                                        src={baseImage}
                                        alt="Original Left"
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                    {/* Vignette Mask (Applied individually to match alignment) */}
                                    <div className="absolute inset-0 pointer-events-none bg-skin-bgSecondary"
                                        style={{
                                            maskImage: 'radial-gradient(circle at 50% 45%, transparent 40%, black 85%)',
                                            WebkitMaskImage: 'radial-gradient(circle at 50% 45%, transparent 40%, black 85%)'
                                        }}
                                    />
                                </div>
                                <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/60 text-white text-xs font-bold rounded-lg backdrop-blur-md z-20">
                                    Before
                                </div>
                            </div>

                            {/* Right Half: Effect */}
                            <div className="relative w-1/2 h-full overflow-hidden">
                                <div className="absolute inset-0 w-[200%] h-full -left-full">
                                    <Image
                                        src={baseImage}
                                        alt="Effect Right"
                                        fill
                                        className="object-cover transition-all duration-700"
                                        style={{
                                            filter: filterStyle
                                        }}
                                    />

                                    {/* NEW: Overlay Effect Layer */}
                                    {overlayStyle && (
                                        <div
                                            className="absolute inset-0 z-10 pointer-events-none transition-all duration-700"
                                            style={overlayStyle}
                                        />
                                    )}

                                    {/* Vignette Mask */}
                                    <div className="absolute inset-0 pointer-events-none bg-skin-bgSecondary z-20"
                                        style={{
                                            maskImage: 'radial-gradient(circle at 50% 45%, transparent 40%, black 85%)',
                                            WebkitMaskImage: 'radial-gradient(circle at 50% 45%, transparent 40%, black 85%)'
                                        }}
                                    />
                                </div>
                                <div className="absolute top-4 right-4 px-3 py-1.5 bg-skin-primary text-white text-xs font-bold rounded-lg backdrop-blur-md shadow-lg z-20">
                                    After
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. Scanning Overlay (Animation) */}
                {isAnalyzing && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
                        <div className="relative">
                            <ScanFace className="w-20 h-20 text-white/90 animate-pulse" />
                            <div className="absolute top-0 left-0 w-full h-1 bg-skin-primary shadow-[0_0_20px_rgba(255,255,255,1)] animate-scan-down" />
                        </div>
                        <p className="mt-6 text-white font-black text-xl animate-pulse tracking-widest">
                            AI ANALYSIS...
                        </p>
                    </div>
                )}

                {/* 3. Flash Effect (Transition) */}
                <div className={`absolute inset-0 z-30 bg-white pointer-events-none transition-opacity duration-700 ease-out ${showFlash ? 'opacity-90' : 'opacity-0'}`} />

                {/* 4. Center Line (Guide) - Only in Split View */}
                {mode !== 'original' && !isAnalyzing && (
                    <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/80 z-20 shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 border-2 border-white rounded-full flex items-center justify-center bg-white/20 backdrop-blur-md shadow-lg">
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        </div>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="mt-8 grid grid-cols-2 gap-4">
                <button
                    onClick={() => handleModeChange('glow')}
                    disabled={isAnalyzing}
                    className={`relative p-5 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 group overflow-hidden ${mode === 'glow'
                        ? 'bg-skin-primary text-white border-skin-primary shadow-xl scale-[1.02]'
                        : 'bg-white/5 border-skin-text/10 hover:bg-white/10 text-skin-text hover:border-skin-primary/50 hover:-translate-y-1'
                        }`}
                >
                    <div className={`p-3 rounded-full transition-transform group-hover:scale-110 ${mode === 'glow' ? 'bg-white/20' : 'bg-skin-surface shadow-sm'}`}>
                        <Droplet className={`w-6 h-6 ${mode === 'glow' ? 'text-white' : 'text-skin-primary'}`} />
                    </div>
                    <div className="text-center">
                        <span className="block font-bold text-lg">물광 효과</span>
                        <span className={`text-xs ${mode === 'glow' ? 'opacity-90' : 'opacity-60'}`}>수분 가득한 광채</span>
                    </div>
                    {mode === 'glow' && !isAnalyzing && (
                        <span className="absolute top-3 right-3 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                        </span>
                    )}
                </button>

                <button
                    onClick={() => handleModeChange('whitening')}
                    disabled={isAnalyzing}
                    className={`relative p-5 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 group overflow-hidden ${mode === 'whitening'
                        ? 'bg-skin-primary text-white border-skin-primary shadow-xl scale-[1.02]'
                        : 'bg-white/5 border-skin-text/10 hover:bg-white/10 text-skin-text hover:border-skin-primary/50 hover:-translate-y-1'
                        }`}
                >
                    <div className={`p-3 rounded-full transition-transform group-hover:scale-110 ${mode === 'whitening' ? 'bg-white/20' : 'bg-skin-surface shadow-sm'}`}>
                        <Sun className={`w-6 h-6 ${mode === 'whitening' ? 'text-white' : 'text-skin-primary'}`} />
                    </div>
                    <div className="text-center">
                        <span className="block font-bold text-lg">미백 효과</span>
                        <span className={`text-xs ${mode === 'whitening' ? 'opacity-90' : 'opacity-60'}`}>투명하고 뽀얀 피부</span>
                    </div>
                    {mode === 'whitening' && !isAnalyzing && (
                        <span className="absolute top-3 right-3 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                        </span>
                    )}
                </button>
            </div>

            {/* Reset Button */}
            {mode !== 'original' && (
                <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-4">
                    <button
                        onClick={() => handleModeChange('original')}
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-skin-surface border border-skin-text/10 text-skin-text font-medium hover:bg-skin-text/5 hover:border-skin-text/30 transition-all shadow-sm"
                    >
                        <RotateCcw className="w-4 h-4" />
                        처음으로 돌아가기
                    </button>
                </div>
            )}
        </div>

    );
}
