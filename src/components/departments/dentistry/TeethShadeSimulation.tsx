"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Scan, ShieldCheck, Camera } from "lucide-react";
import Image from "next/image";
import { useHospital } from "@/components/common/HospitalProvider";

export default function TeethShadeSimulation() {
    const config = useHospital();
    const [step, setStep] = useState<'intro' | 'analyzing' | 'result'>('intro');
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Mock Analysis
    const startAnalysis = () => {
        setStep('analyzing');
        setTimeout(() => {
            setStep('result');
        }, 2000); // 2 seconds delay
    };

    return (
        <div className="w-full max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
                <span className="px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold tracking-wider uppercase mb-4 inline-block">
                    AI Dental Analysis
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                    내 치아 <span className="text-blue-400">쉐이드(Shade)</span> 측정
                </h2>
                <p className="text-white/60 text-lg">
                    AI가 치아 색상을 분석하고 미백 후 모습을 예측합니다.
                </p>
            </div>

            <div className="relative rounded-[2.5rem] overflow-hidden bg-black/40 border border-white/10 backdrop-blur-sm p-8 min-h-[600px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {step === 'intro' && (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center space-y-8 max-w-2xl"
                        >
                            <div className="relative w-64 h-64 mx-auto rounded-full overflow-hidden border-4 border-white/10 shadow-2xl">
                                <Image
                                    src="/치과/오리지날.png"
                                    alt="Original Teeth"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-6 left-0 right-0 text-center">
                                    <span className="text-white font-bold">Original</span>
                                </div>
                            </div>

                            <button
                                onClick={startAnalysis}
                                className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-xl shadow-xl shadow-blue-600/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto"
                            >
                                <Scan className="w-6 h-6" />
                                치아 쉐이드 측정하기
                            </button>
                        </motion.div>
                    )}

                    {step === 'analyzing' && (
                        <motion.div
                            key="analyzing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center"
                        >
                            <div className="relative w-32 h-32 mx-auto mb-8">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 border-4 border-blue-500/30 border-t-blue-500 rounded-full"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Scan className="w-12 h-12 text-blue-400 animate-pulse" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">분석 중입니다...</h3>
                            <p className="text-white/60">치아 색상과 밝기를 측정하고 있습니다.</p>
                        </motion.div>
                    )}

                    {step === 'result' && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="w-full flex flex-col items-center"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full h-[500px]">
                                {/* Original */}
                                <div className="relative rounded-3xl overflow-hidden border border-white/10 group">
                                    <Image
                                        src="/치과/오리지날.png"
                                        alt="Original"
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute top-4 left-4 px-4 py-2 bg-black/60 backdrop-blur rounded-lg border border-white/10">
                                        <span className="text-white font-bold text-sm">BEFORE</span>
                                    </div>
                                    <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end">
                                        <div className="flex items-center justify-between">
                                            <span className="text-white/80">현재 쉐이드</span>
                                            <span className="text-2xl font-bold text-yellow-100">A3</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Simulation Result */}
                                <div className="relative rounded-3xl overflow-hidden border-2 border-blue-500/50 shadow-[0_0_50px_rgba(59,130,246,0.2)] group">
                                    {/* Enlarged + Whitened Image */}
                                    <div className="absolute inset-0 overflow-hidden">
                                        <Image
                                            src="/치과/오리지날.png"
                                            alt="Simulation"
                                            fill
                                            className="object-cover scale-125 object-center transition-transform duration-700"
                                            style={{ filter: 'brightness(1.2) contrast(1.1) saturate(0.9)' }}
                                        />
                                    </div>

                                    <div className="absolute top-4 left-4 px-4 py-2 bg-blue-600 rounded-lg shadow-lg">
                                        <span className="text-white font-bold text-sm flex items-center gap-2">
                                            <Sparkles size={14} />
                                            SIMULATION
                                        </span>
                                    </div>

                                    <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-blue-900/90 to-transparent p-6 flex flex-col justify-end">
                                        <div className="flex items-center justify-between">
                                            <span className="text-white/80">예측 쉐이드</span>
                                            <span className="text-3xl font-black text-white">B1</span>
                                        </div>
                                        <div className="mt-2 text-blue-200 text-sm">
                                            * 미백 치료 후 예상되는 결과입니다.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex gap-4">
                                <button
                                    onClick={() => setStep('intro')}
                                    className="px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
                                >
                                    다시 측정하기
                                </button>
                                <button
                                    onClick={() => window.location.href = '/medical/patient-dashboard'}
                                    className="px-8 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20 flex items-center gap-2"
                                >
                                    상담 예약하기 <ArrowRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
