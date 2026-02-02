"use client";

import { useState, useEffect } from "react";
import { Loader2, Sparkles, MoveHorizontal } from "lucide-react";

interface DentistrySimulationSliderProps {
    baseImage: string;
}

export default function DentistrySimulationSlider({ baseImage }: DentistrySimulationSliderProps) {
    const [step, setStep] = useState<'intro' | 'analyzing' | 'result'>('intro');
    const [sliderPosition, setSliderPosition] = useState(50);

    const handleMeasure = () => {
        setStep('analyzing');
        setTimeout(() => {
            setStep('result');
        }, 1500);
    };

    if (step === 'intro') {
        return (
            <div className="flex flex-col items-center justify-center p-8 space-y-6 bg-white/5 rounded-3xl border border-white/10">
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-2 border-white/20">
                    <img src={baseImage} alt="Intro" className="w-full h-full object-cover" />
                </div>
                <button
                    onClick={handleMeasure}
                    className="w-full py-4 bg-cyan-500 text-white font-black rounded-xl hover:bg-cyan-600 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                    <Sparkles className="w-5 h-5" />
                    내 치아 쉐이드 정밀 분석하기
                </button>
            </div>
        );
    }

    if (step === 'analyzing') {
        return (
            <div className="flex flex-col items-center justify-center p-12 space-y-6 bg-white/5 rounded-3xl border border-white/10 min-h-[400px]">
                <Loader2 className="w-16 h-16 text-cyan-400 animate-spin" />
                <p className="text-xl font-bold text-white animate-pulse tracking-widest text-center">
                    AI가 치아 쉐이드와 <br />구조를 정밀 분석 중입니다...
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center space-y-6">
            <div className="relative w-full aspect-square rounded-[2.5rem] overflow-hidden border-4 border-white/20 shadow-2xl bg-black group">
                {/* Result (After) Image - BOTTOM LAYER */}
                <div className="absolute inset-0">
                    <img
                        src={baseImage}
                        alt="After"
                        className="w-full h-full object-cover"
                        style={{
                            filter: 'brightness(1.2) saturate(0.65) contrast(1.1)',
                            maskImage: 'radial-gradient(ellipse at center, black 55%, transparent 80%)',
                            WebkitMaskImage: 'radial-gradient(ellipse at center, black 55%, transparent 80%)'
                        }}
                    />
                </div>

                {/* Original (Before) Image - TOP LAYER with Clip Path */}
                <div
                    className="absolute inset-0 z-10 overflow-hidden"
                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                    <img src={baseImage} alt="Before" className="w-full h-full object-cover" />
                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/60 text-white text-xs font-bold rounded-lg backdrop-blur-md">
                        Before (A3)
                    </div>
                </div>

                {/* After Label */}
                <div className="absolute top-4 right-4 px-3 py-1.5 bg-cyan-500 text-white text-xs font-bold rounded-lg backdrop-blur-md shadow-lg z-20">
                    After (B1)
                </div>

                {/* Slider bar */}
                <div
                    className="absolute top-0 bottom-0 z-30 w-1 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] cursor-ew-resize"
                    style={{ left: `${sliderPosition}%` }}
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 border-2 border-white rounded-full flex items-center justify-center bg-white/20 backdrop-blur-md shadow-lg">
                        <MoveHorizontal className="w-6 h-6 text-white" />
                    </div>
                </div>

                {/* Input Slider (Invisible over the image) */}
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPosition}
                    onChange={(e) => setSliderPosition(parseInt(e.target.value))}
                    className="absolute inset-0 z-40 w-full h-full opacity-0 cursor-ew-resize"
                />
            </div>

            <div className="w-full bg-white/10 rounded-2xl p-4 border border-white/10 text-center">
                <p className="text-white font-bold mb-1">분석 결과: <span className="text-cyan-400">약 2단계 밝기 개선 가능</span></p>
                <p className="text-white/60 text-xs">A3 쉐이드에서 B1 쉐이드로의 변화가 예측됩니다.</p>
            </div>

            <button
                onClick={() => setStep('intro')}
                className="text-white/40 text-sm hover:text-white/60 transition-colors underline"
            >
                다시 분석하기
            </button>
        </div>
    );
}
