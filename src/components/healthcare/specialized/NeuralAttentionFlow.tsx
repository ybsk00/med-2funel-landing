"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

/**
 * NeuralAttentionFlow: 신경외과 테마를 위한 시선 유도 인터랙션
 * 커서 주변의 빛 입자들이 화면 하단의 CTA(Primary Button) 방향으로 흐르는 연출
 */
export const NeuralAttentionFlow = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            setMousePos({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // 파티클들 생성
    const particles = Array.from({ length: 15 });

    return (
        <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            {particles.map((_, i) => (
                <Particle key={i} mousePos={mousePos} index={i} />
            ))}
        </div>
    );
};

const Particle = ({ mousePos, index }: { mousePos: { x: number, y: number }, index: number }) => {
    const controls = useAnimation();

    useEffect(() => {
        let isCancelled = false;

        const animate = async () => {
            while (!isCancelled) {
                // 마우스 주변에서 시작
                const startX = mousePos.x + (Math.random() - 0.5) * 150;
                const startY = mousePos.y + (Math.random() - 0.5) * 150;

                // 화면 하단 중앙(대략 CTA 위치)으로 이동
                const endX = window.innerWidth / 2 + (Math.random() - 0.5) * 100;
                const endY = window.innerHeight * 0.8;

                await controls.start({
                    x: [startX, (startX + endX) / 2, endX],
                    y: [startY, (startY + endY) / 2, endY],
                    opacity: [0, 0.8, 0],
                    scale: [0.3, 1.0, 0.2],
                    transition: {
                        duration: 3 + Math.random() * 3,
                        ease: "easeInOut",
                    }
                });

                // 잠시 대기 후 재생성
                await new Promise(resolve => setTimeout(resolve, Math.random() * 2000));
            }
        };

        animate();

        return () => { isCancelled = true; };
    }, [controls, index]); // mousePos를 의존성에 넣으면 너무 자주 재시작하므로 제외 (최초 위치만 참조)

    return (
        <motion.div
            animate={controls}
            className="absolute w-1 h-1 rounded-full bg-indigo-400 blur-[0.5px] shadow-[0_0_10px_#818CF8]"
            initial={{ opacity: 0, x: 0, y: 0 }}
        />
    );
};
