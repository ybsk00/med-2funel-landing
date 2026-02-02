"use client";

import { useState, useEffect } from "react";
import { Loader2, Sparkles, MoveHorizontal } from "lucide-react";

interface DentistrySimulationSliderProps {
    baseImage: string;
}

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
        }, 2000);
    };

    return (
        <div className="flex flex-col items-center space-y-6 w-full max-w-xl mx-auto">
            {step === 'intro' && (
                <div className="flex flex-col items-center justify-center p-8 space-y-6 bg-white/5 rounded-3xl border border-white/10 w-full">
                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-2 border-white/20">
                        <img src={baseImage} alt="Intro" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center space-y-2">
                        <h4 className="text-xl font-bold text-white">치아 쉐이드 측정</h4>
                        <p className="text-white/60 text-sm">사진을 기준으로 현재 쉐이드를 분석합니다.</p>
                    </div>
                    <button
                        onClick={handleMeasure}
                        className="w-full py-4 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                        <Loader2 className="w-5 h-5" />
                        쉐이드 측정하기
                    </button>
                </div>
            )}

            {step === 'analyzing' && (
                <div className="relative w-full aspect-square rounded-[2.5rem] overflow-hidden border-4 border-white/20 shadow-2xl bg-black">
                    <img
                        src={baseImage}
                        alt="Analyzing"
                        className="w-full h-full object-cover blur-md scale-100 transition-all duration-700"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-10">
                        <Loader2 className="w-16 h-16 text-cyan-400 animate-spin mb-4" />
                        <p className="text-xl font-bold text-white animate-pulse tracking-widest text-center shadow-black drop-shadow-lg">
                            분석 중...
                        </p>
                    </div>
                </div>
            )}

            {step === 'result' && (
                <>
                    <div className="relative w-full aspect-square rounded-[2.5rem] overflow-hidden border-4 border-white/20 shadow-2xl bg-black group">
                        {/* Result (After) Image - BOTTOM LAYER - Zoomed 1.6x */}
                        <div className="absolute inset-0 w-full h-full">
                            <img
                                src={baseImage}
                                alt="After"
                                className="w-full h-full object-cover origin-center"
                                style={{
                                    transform: 'scale(1.6)',
                                    filter: 'brightness(1.2) saturate(0.65) contrast(1.1)',
                                    maskImage: 'radial-gradient(ellipse at center, black 55%, transparent 80%)',
                                    WebkitMaskImage: 'radial-gradient(ellipse at center, black 55%, transparent 80%)'
                                }}
                            />
                        </div>

                        {/* Original (Before) Image - TOP LAYER - Zoomed 1.6x */}
                        <div
                            className="absolute inset-0 z-10 overflow-hidden"
                            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                        >
                            <div className="relative w-full h-full">
                                <img
                                    src={baseImage}
                                    alt="Before"
                                    className="w-full h-full object-cover origin-center"
                                    style={{ transform: 'scale(1.6)' }}
                                />
                            </div>
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

                        {/* Input Slider */}
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
                        <p className="text-white/60 text-xs text-balance">
                            치아 확대 분석을 통해 미세한 표면 착색과 쉐이드 변화를 예측했습니다.
                        </p>
                    </div>

                    <button
                        onClick={() => setStep('intro')}
                        className="text-white/40 text-sm hover:text-white/60 transition-colors underline"
                    >
                        다시 측정하기
                    </button>
                </>
            )}
        </div>
    );
}
