"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * DentistryMorphing: 치과 테마를 위한 "교정 전/후" 시각적 시뮬레이션
 * 스크롤 위치에 따라 치아 아이콘들의 정렬 상태가 변화함
 */
export const DentistryMorphing = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // 0: 비뚤어진 상태, 1: 완벽하게 정렬된 상태
    const alignment = useScroll().scrollYProgress; // 전역 스크롤 사용 (또는 섹션 스크롤)

    // 개별 치아들의 좌표 변화 (비뚤어짐 -> 정렬)
    const teeth = [
        { initial: { x: -10, y: 5, rotate: -15 }, target: { x: -40, y: 0, rotate: 0 } },
        { initial: { x: -5, y: -2, rotate: 10 }, target: { x: -20, y: 0, rotate: 0 } },
        { initial: { x: 0, y: 0, rotate: 0 }, target: { x: 0, y: 0, rotate: 0 } },
        { initial: { x: 5, y: 3, rotate: -8 }, target: { x: 20, y: 0, rotate: 0 } },
        { initial: { x: 12, y: -4, rotate: 12 }, target: { x: 40, y: 0, rotate: 0 } },
    ];

    return (
        <div ref={containerRef} className="relative py-20 overflow-hidden bg-white/50 backdrop-blur-sm rounded-3xl border border-white/60 shadow-inner">
            <div className="max-w-md mx-auto text-center">
                <h3 className="text-2xl font-bold mb-8 text-slate-800">
                    AI가 예측하는 <span className="text-cyan-600">완벽한 미소</span>
                </h3>

                <div className="relative h-32 flex items-center justify-center gap-2">
                    {teeth.map((tooth, i) => (
                        <motion.div
                            key={i}
                            style={{
                                x: useTransform(scrollYProgress, [0.3, 0.6], [tooth.initial.x, tooth.target.x]),
                                y: useTransform(scrollYProgress, [0.3, 0.6], [tooth.initial.y, tooth.target.y]),
                                rotate: useTransform(scrollYProgress, [0.3, 0.6], [tooth.initial.rotate, tooth.target.rotate]),
                            }}
                            className="w-8 h-12 bg-white rounded-t-xl rounded-b-md shadow-md border-b-4 border-slate-100 flex items-end justify-center pb-1"
                        >
                            <div className="w-4 h-1 bg-cyan-100 rounded-full mb-2 opacity-50" />
                        </motion.div>
                    ))}

                    {/* 교정 브라켓 라인 (정렬 완벽해질 때 나타남) */}
                    <motion.div
                        style={{
                            opacity: useTransform(scrollYProgress, [0.5, 0.7], [0, 1]),
                            scaleX: useTransform(scrollYProgress, [0.5, 0.7], [0.8, 1]),
                        }}
                        className="absolute w-64 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-1/2 -translate-y-1/2"
                    />
                </div>

                <motion.p
                    style={{
                        opacity: useTransform(scrollYProgress, [0.4, 0.6], [0.5, 1]),
                        y: useTransform(scrollYProgress, [0.4, 0.6], [10, 0]),
                    }}
                    className="mt-12 text-slate-500 font-medium"
                >
                    스크롤을 내려 <br />정밀 교정 후의 변화를 확인하세요
                </motion.p>
            </div>

            {/* 배경 빛무리 */}
            <motion.div
                style={{
                    opacity: useTransform(scrollYProgress, [0.4, 0.7], [0, 0.6]),
                    scale: useTransform(scrollYProgress, [0.4, 0.7], [0.8, 1.2]),
                }}
                className="absolute inset-0 bg-radial-gradient from-cyan-400/10 to-transparent pointer-events-none"
            />
        </div>
    );
};
