"use client";

import React, { useRef, useState, useCallback, useMemo } from "react";
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
} from "framer-motion";

interface TiltInteractionProps {
    children: React.ReactNode;
    className?: string;
    intensity?: number; // 기울기 강도 (기본값: 15)
    damping?: number;   // 부드러움 (기본값: 20)
    stiffness?: number; // 복원력 (기본값: 150)
    glare?: boolean;    // 글레어(반사) 효과 여부
}

/**
 * TiltInteraction: 카드 등에 3D 기울기 효과와 동적 글레어 효과를 부여하는 래퍼
 */
export const TiltInteraction = ({
    children,
    className = "",
    intensity = 15,
    damping = 20,
    stiffness = 150,
    glare = true,
}: TiltInteractionProps) => {
    const ref = useRef<HTMLDivElement>(null);

    // 마우스 상태에 따른 모션 변수
    const x = useMotionValue(0.5);
    const y = useMotionValue(0.5);

    // 스프링 설정을 통한 부드러운 감쇄(Damping) 적용
    const springConfig = { damping, stiffness };
    const rotateX = useSpring(useTransform(y, [0, 1], [intensity, -intensity]), springConfig);
    const rotateY = useSpring(useTransform(x, [0, 1], [-intensity, intensity]), springConfig);

    // 글레어(광택) 레이어를 위한 변수
    const glareX = useSpring(useTransform(x, [0, 1], [0, 100]), springConfig);
    const glareY = useSpring(useTransform(y, [0, 1], [0, 100]), springConfig);
    const glareOpacity = useSpring(0, springConfig);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        x.set(mouseX / rect.width);
        y.set(mouseY / rect.height);
        glareOpacity.set(0.4);
    }, [x, y, glareOpacity]);

    const handleMouseLeave = useCallback(() => {
        x.set(0.5);
        y.set(0.5);
        glareOpacity.set(0);
    }, [x, y, glareOpacity]);

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                perspective: 1000,
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className={`relative transition-shadow duration-300 ${className}`}
        >
            {/* 텍스트 레이어 정적 유지를 위해 실제 콘텐츠는 preserve-3d 내부에서 렌더링 */}
            <div style={{ transform: "translateZ(0px)" }} className="w-full h-full">
                {children}
            </div>

            {/* 동적 글레어(광택) 효과 */}
            {glare && (
                <motion.div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: useTransform(
                            [glareX, glareY],
                            ([latestX, latestY]) =>
                                `radial-gradient(circle at ${latestX}% ${latestY}%, rgba(255,255,255,0.4) 0%, transparent 70%)`
                        ),
                        opacity: glareOpacity,
                        pointerEvents: "none",
                        borderRadius: "inherit",
                        zIndex: 10,
                    }}
                />
            )}
        </motion.div>
    );
};

interface MagneticInteractionProps {
    children: React.ReactNode;
    className?: string;
    distance?: number; // 예약 반응 거리
    strength?: number; // 끌어당기는 힘
}

/**
 * MagneticInteraction: CTA 버튼 등이 커서를 끌어당기는 자석 효과를 부여하는 래퍼
 */
export const MagneticInteraction = ({
    children,
    className = "",
    distance = 60,
    strength = 0.4,
}: MagneticInteractionProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 150 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (dist < distance) {
            x.set(deltaX * strength);
            y.set(deltaY * strength);
        } else {
            x.set(0);
            y.set(0);
        }
    }, [distance, strength, x, y]);

    const handleMouseLeave = useCallback(() => {
        x.set(0);
        y.set(0);
    }, [x, y]);

    // 전역 마우스 이벤트 등록 (반응 범위 최적화)
    React.useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [handleMouseMove]);

    return (
        <motion.div
            ref={ref}
            onMouseLeave={handleMouseLeave}
            style={{
                x: springX,
                y: springY,
            }}
            className={`inline-block ${className}`}
        >
            {children}
        </motion.div>
    );
};

interface ParallaxLayerProps {
    children: React.ReactNode;
    speed?: number; // 관성/속도 비율 (기본값: 0.05)
    className?: string;
}

/**
 * ParallaxLayer: 마우스 움직임에 따라 반대 방향으로 미세하게 움직여 깊이감을 주는 레이어
 */
export const ParallaxLayer = ({
    children,
    speed = 0.05,
    className = "",
}: ParallaxLayerProps) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springX = useSpring(x, { damping: 30, stiffness: 100 });
    const springY = useSpring(y, { damping: 30, stiffness: 100 });

    React.useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const moveX = (e.clientX - window.innerWidth / 2) * speed;
            const moveY = (e.clientY - window.innerHeight / 2) * speed;
            x.set(-moveX);
            y.set(-moveY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [speed, x, y]);

    return (
        <motion.div
            style={{
                x: springX,
                y: springY,
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};
