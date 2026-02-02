"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Scan, Camera, GripVertical, RefreshCw } from "lucide-react";
import Image from "next/image";
import { useHospital } from "@/components/common/HospitalProvider";

export default function TeethShadeSimulation() {
    const config = useHospital();
    const [step, setStep] = useState<'intro' | 'analyzing' | 'result'>('intro');
    const [sliderPosition, setSliderPosition] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Mock Analysis
    const startAnalysis = () => {
        setStep('analyzing');
        setTimeout(() => {
            setStep('result');
        }, 2500);
    };

    // Slider Logic
    const handleMove = (clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        setSliderPosition((x / rect.width) * 100);
    };

    const onMouseDown = () => setIsDragging(true);
    const onMouseUp = () => setIsDragging(false);
    const onMouseMove = (e: React.MouseEvent) => {
        if (isDragging) handleMove(e.clientX);
    };
    const onTouchMove = (e: React.TouchEvent) => {
        handleMove(e.touches[0].clientX);
    };

    // Global mouse up to stop dragging
    useEffect(() => {
        const handleGlobalMouseUp = () => setIsDragging(false);
        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }, []);

    return (
        <div className="w-full max-w-4xl mx-auto px-6">
            <div className="text-center mb-10">
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

            <div className="relative rounded-[2.5rem] overflow-hidden bg-[#0F172A] border border-white/10 shadow-2xl min-h-[600px] flex flex-col items-center justify-center p-8">
                <AnimatePresence mode="wait">
                    {step === 'intro' && (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="w-full max-w-md text-center space-y-8"
                        >
                            <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl mx-auto">
                                <Image
                                    src="/images/dentistry_original.png"
                                    alt="Original Teeth"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end pb-8">
                                    <p className="text-white/80 font-medium">정면 치아 사진이 필요합니다</p>
                                </div>
                            </div>

                            <button
                                onClick={startAnalysis}
                                className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-xl shadow-xl shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                            >
                                <Camera className="w-6 h-6" />
                                쉐이드 측정하기
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
                            <h3 className="text-2xl font-bold text-white mb-2">AI 분석 중...</h3>
                            <p className="text-white/60">치아 표면의 쉐이드를 정밀 측정하고 있습니다.</p>
                        </motion.div>
                    )}

                    {step === 'result' && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="w-full h-full flex flex-col"
                        >
                            <div className="flex-1 relative w-full max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-white/10 group bg-black">
                                {/* Header */}
                                <div className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-start pointer-events-none">
                                    <div className="px-3 py-1.5 bg-black/60 backdrop-blur rounded-lg border border-white/10">
                                        <span className="text-white/80 text-xs font-bold uppercase">Before</span>
                                    </div>
                                    <div className="px-3 py-1.5 bg-blue-600/80 backdrop-blur rounded-lg border border-blue-400/30 shadow-lg">
                                        <span className="text-white text-xs font-bold uppercase">After</span>
                                    </div>
                                </div>

                                {/* Comparison Slider Container */}
                                <div
                                    ref={containerRef}
                                    className="relative w-full h-[400px] cursor-col-resize touch-none select-none"
                                    onMouseMove={onMouseMove}
                                    onMouseDown={onMouseDown}
                                    onTouchMove={onTouchMove}
                                >
                                    {/* Right Image (After) - Underneath */}
                                    <div className="absolute inset-0 w-full h-full">
                                        <Image
                                            src="/images/dentistry_original.png"
                                            alt="After"
                                            fill
                                            className="object-cover scale-[2.0] object-center"
                                            style={{ filter: 'brightness(1.3) contrast(1.1) saturate(0.8)' }}
                                            priority
                                        />
                                    </div>

                                    {/* Left Image (Before) - Overlay with clip-path */}
                                    <div
                                        className="absolute inset-0 w-full h-full overflow-hidden"
                                        style={{ width: `${sliderPosition}%` }}
                                    >
                                        <div className="relative w-full h-full"> {/* Fix width to container width to prevent squishing */}
                                            {/* We need to render the image full width of the container, but visible only in the clipped area.
                                                However, standard `width: percentage` on a div crops the div. 
                                                If we put an image inside with `width: 100vw` or container width it works.
                                                Better: Use standard next/image with object-cover and make sure the parent div crops it.
                                                But parent div is `width: sliderPosition%`. 
                                                So the child image must be `width: (100 / sliderPosition * 100)%`? No.
                                                Correct approach for slider: 
                                                The 'Before' image container has `width: sliderPosition%`.
                                                The 'Before' image inside matches the MAIN CONTAINER dimensions.
                                            */}
                                            <div className="absolute inset-0" style={{ width: `${10000 / sliderPosition}%` }}> {/* Inverse scaling logic is complex. simpler to use fixed width container inside */}
                                            </div>
                                            {/* Let's try simpler absolute positioning approach */}
                                        </div>
                                        {/* Re-implementing Left Image Correctly */}
                                        <Image
                                            src="/images/dentistry_original.png"
                                            alt="Before"
                                            fill
                                            className="object-cover scale-[2.0] object-center max-w-none"
                                            style={{ width: `${100 * (100 / sliderPosition)}%` }} // This is hacky.
                                            priority
                                        />
                                        {/* Better approach: The parent div clips. The image inside is fixed size equal to container. */}
                                    </div>

                                    {/* Corrected Left Image Implementation */}
                                    <div
                                        className="absolute inset-0 h-full border-r-2 border-white/50 shadow-[0_0_20px_rgba(0,0,0,0.5)] bg-black"
                                        style={{ width: `${sliderPosition}%`, overflow: 'hidden' }}
                                    >
                                        {/* The image inside must be the size of the CONTAINER (400px height, full width) */}
                                        <div className="relative w-full h-full" style={{ width: containerRef.current ? containerRef.current.clientWidth : '100%' }}>
                                            {/* Since we don't have exact width on first render, stick to `100vw` or similar? No.
                                                Absolute positioning with `left: 0` and `width: (container width)` works.
                                                We can use `width: 100 / (sliderPosition/100) %`.
                                            */}
                                            <div style={{ width: `${10000 / Math.max(sliderPosition, 0.1)}%`, height: '100%', position: 'relative' }}>
                                                <Image
                                                    src="/images/dentistry_original.png"
                                                    alt="Before"
                                                    fill
                                                    className="object-cover scale-[2.0] object-center"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Slider Handle */}
                                    <div
                                        className="absolute top-0 bottom-0 w-10 -ml-5 z-30 flex items-center justify-center cursor-col-resize"
                                        style={{ left: `${sliderPosition}%` }}
                                        onMouseDown={onMouseDown}
                                        onTouchStart={onMouseDown}
                                    >
                                        <div className="w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center transform hover:scale-110 transition-transform">
                                            <GripVertical size={20} className="text-blue-600" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Result Card & Bar */}
                            <div className="w-full max-w-2xl mx-auto mt-6 bg-white/5 border border-white/10 rounded-3xl p-6">
                                <div className="flex justify-between items-center text-sm font-bold text-white/80 mb-2">
                                    <span className="text-yellow-400">현재: A3</span>
                                    <span className="text-white">예상: B1</span>
                                </div>
                                {/* Gradient Bar */}
                                <div className="h-4 w-full rounded-full bg-gradient-to-r from-yellow-700 via-yellow-200 to-white shadow-inner mb-6 relative">
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-yellow-400 rounded-full border border-black shadow" />
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border border-black shadow" />
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setStep('intro')}
                                        className="flex-1 py-4 rounded-xl bg-white/10 text-white hover:bg-white/15 transition-colors font-bold text-sm"
                                    >
                                        다시 측정하기
                                    </button>
                                    <button
                                        onClick={() => window.location.href = '/medical/patient-dashboard'}
                                        className="flex-[2] py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20 text-sm flex items-center justify-center gap-2"
                                    >
                                        치아 미백 상담 예약 <ArrowRight size={16} />
                                    </button>
                                </div>
                                <p className="text-center text-xs text-white/30 mt-4">
                                    * 시뮬레이션 결과는 이해를 돕기 위한 예시이며, 실제 효과는 개인차가 있을 수 있습니다.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
