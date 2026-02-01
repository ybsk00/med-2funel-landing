"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { RotateCcw, ScanFace, Spline, Sparkles, Loader2 } from "lucide-react";
import { DEPARTMENT_SIMULATIONS, DEFAULT_SIMULATION } from "@/lib/constants/simulations";

interface HeroExperienceProps {
    className?: string;
    department?: string;
}

type SymmetryMode = 'original' | 'left-mirror' | 'right-mirror';

export default function HeroExperience({ className = "", department = "dermatology" }: HeroExperienceProps) {
    const config = DEPARTMENT_SIMULATIONS[department] || DEFAULT_SIMULATION;
    const [mode, setMode] = useState<SymmetryMode>('original');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showFlash, setShowFlash] = useState(false);

    const baseImage = config.baseImage || "/base.png";

    const handleModeChange = (newMode: SymmetryMode) => {
        if (mode === newMode) return;

        if (newMode === 'original') {
            setMode('original');
            return;
        }

        // AI Analysis Animation Sequence
        setIsAnalyzing(true);
        setMode(newMode); // Switch content immediately but hide it under blur

        // 1. Analyzing Phase (Blur)
        setTimeout(() => {
            setIsAnalyzing(false);
            // 2. Reveal Phase (Flash)
            setShowFlash(true);
            setTimeout(() => setShowFlash(false), 500);
        }, 1500);
    };

    return (
        <div className={`relative ${className} w-full max-w-xl mx-auto`}>
            {/* Header */}
            <div className="text-center mb-6">
                <h3 className="text-xl font-bold tracking-wider text-skin-text">
                    {department === 'plastic-surgery' ? '황금비율 페이스 분석' : 'AI 안면 대칭 분석'}
                </h3>
                <p className="text-sm text-skin-subtext mt-1">
                    좌우 얼굴을 각각 대칭시켜 숨겨진 비대칭을 확인해보세요.
                </p>
            </div>

            {/* Main Viewport */}
            <div className="relative w-full aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/20 bg-skin-bgSecondary group">
                
                {/* 1. Original / Result Layer */}
                <div className={`absolute inset-0 transition-all duration-700 ${isAnalyzing ? 'blur-xl scale-105 opacity-80' : 'blur-0 scale-100 opacity-100'}`}>
                    
                    {mode === 'original' ? (
                        <Image
                            src={baseImage}
                            alt="Original"
                            fill
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <div className="absolute inset-0 flex">
                            {/* Left Half Container */}
                            <div className="relative w-1/2 h-full overflow-hidden">
                                <div className="absolute inset-0 w-[200%] h-full">
                                    <Image
                                        src={baseImage}
                                        alt="Left Side Source"
                                        fill
                                        className={`object-cover ${mode === 'right-mirror' ? 'scale-x-[-1]' : ''}`} // Right Mirror: Left side shows FLIPPED Right side
                                        style={{ transformOrigin: 'center' }} 
                                        // Logic:
                                        // Left Mirror: Left half is Normal Left. Right half is Flipped Left.
                                        // Right Mirror: Left half is Flipped Right. Right half is Normal Right.
                                    />
                                    {/* 
                                      Correction for Image Positioning:
                                      We need to carefully position the image to show the correct half.
                                      If w=200%, left=0 shows left half. left=-100% shows right half.
                                    */}
                                </div>
                                {/* CSS-only approach is tricky with Next/Image fill. Let's use specific positioning. */}
                                <img 
                                    src={baseImage}
                                    className={`absolute top-0 w-[200%] h-full max-w-none object-cover ${
                                        mode === 'left-mirror' ? 'left-0' : 'right-0 scale-x-[-1]'
                                    }`}
                                    style={{ left: mode === 'left-mirror' ? '0%' : '-100%' }} // Right mirror needs right side of img flipped
                                    // Wait, simplified logic:
                                    // Left Mirror:
                                    //   Left Box:  Img (Left Half)
                                    //   Right Box: Img (Left Half Flipped)
                                    // Right Mirror:
                                    //   Left Box:  Img (Right Half Flipped)
                                    //   Right Box: Img (Right Half)
                                />
                            </div>

                            {/* Right Half Container */}
                            <div className="relative w-1/2 h-full overflow-hidden">
                                <img 
                                    src={baseImage}
                                    className={`absolute top-0 w-[200%] h-full max-w-none object-cover ${
                                        mode === 'left-mirror' ? 'scale-x-[-1]' : ''
                                    }`}
                                    style={{ left: mode === 'left-mirror' ? '0%' : '-100%' }}
                                    // Left Mirror: Right box shows Left Half (0%) but Flipped.
                                    // Right Mirror: Right box shows Right Half (-100%) Normal.
                                />
                            </div>
                        </div>
                    )}

                    {/* Vignette Mask (Face Focus) */}
                    {mode !== 'original' && (
                        <div className="absolute inset-0 pointer-events-none bg-skin-bgSecondary"
                             style={{
                                 maskImage: 'radial-gradient(circle at 50% 45%, transparent 35%, black 80%)',
                                 WebkitMaskImage: 'radial-gradient(circle at 50% 45%, transparent 35%, black 80%)'
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
                            얼굴 대칭 분석 중...
                        </p>
                    </div>
                )}

                {/* 3. Flash Effect (Transition) */}
                <div className={`absolute inset-0 z-30 bg-white pointer-events-none transition-opacity duration-500 ease-out ${showFlash ? 'opacity-80' : 'opacity-0'}`} />

                {/* 4. Center Line (Guide) */}
                {mode !== 'original' && !isAnalyzing && (
                    <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/30 z-10">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-white/30 rounded-full flex items-center justify-center">
                            <div className="w-1 h-1 bg-white rounded-full" />
                        </div>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="mt-8 grid grid-cols-2 gap-4">
                <button
                    onClick={() => handleModeChange('left-mirror')}
                    disabled={isAnalyzing}
                    className={`relative p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-2 group overflow-hidden ${
                        mode === 'left-mirror' 
                        ? 'bg-skin-primary text-white border-skin-primary shadow-lg scale-[1.02]' 
                        : 'bg-white/5 border-skin-text/10 hover:bg-white/10 text-skin-text hover:border-skin-primary/50'
                    }`}
                >
                    <div className="p-2 rounded-full bg-white/10 group-hover:scale-110 transition-transform">
                        <Spline className="w-6 h-6" />
                    </div>
                    <span className="font-bold">좌측 얼굴 대칭</span>
                    <span className="text-[10px] opacity-70">부드럽고 여성스러운 인상</span>
                    {mode === 'left-mirror' && !isAnalyzing && (
                        <span className="absolute top-2 right-2 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                        </span>
                    )}
                </button>

                <button
                    onClick={() => handleModeChange('right-mirror')}
                    disabled={isAnalyzing}
                    className={`relative p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-2 group overflow-hidden ${
                        mode === 'right-mirror' 
                        ? 'bg-skin-primary text-white border-skin-primary shadow-lg scale-[1.02]' 
                        : 'bg-white/5 border-skin-text/10 hover:bg-white/10 text-skin-text hover:border-skin-primary/50'
                    }`}
                >
                    <div className="p-2 rounded-full bg-white/10 group-hover:scale-110 transition-transform">
                        <Spline className="w-6 h-6 transform scale-x-[-1]" />
                    </div>
                    <span className="font-bold">우측 얼굴 대칭</span>
                    <span className="text-[10px] opacity-70">지적이고 날카로운 인상</span>
                    {mode === 'right-mirror' && !isAnalyzing && (
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
}
/ /   F a c e   S y m m e t r y   A n a l y s i s   I m p l e m e n t e d  
 