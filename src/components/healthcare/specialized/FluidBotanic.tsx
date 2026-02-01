"use client";

import React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * FluidBotanic: 내과, 소아과 등 오가닉 테마를 위한 인터랙션
 * 마우스 위치에 따라 배경의 나뭇잎이나 유기적 형태들이 부드럽게 흔들림
 */
export const FluidBotanic = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 40, stiffness: 80 };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    React.useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX - window.innerWidth / 2);
            mouseY.set(e.clientY - window.innerHeight / 2);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    // 여러 개의 잎사귀/오브젝트 레이어
    const layers = [
        { id: 1, color: "bg-green-100/40", size: "w-64 h-64", speed: 0.05, pos: "top-10 left-10" },
        { id: 2, color: "bg-emerald-50/30", size: "w-96 h-96", speed: 0.03, pos: "bottom-10 right-10" },
        { id: 3, color: "bg-teal-50/20", size: "w-48 h-48", speed: 0.08, pos: "top-1/2 left-1/4" },
    ];

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60">
            {layers.map((layer) => (
                <motion.div
                    key={layer.id}
                    style={{
                        x: useTransform(x, (val) => val * layer.speed),
                        y: useTransform(y, (val) => val * layer.speed),
                        rotate: useTransform(x, (val) => val * layer.speed * 0.1),
                    }}
                    className={`absolute ${layer.pos} ${layer.size} ${layer.color} rounded-[40%_60%_70%_30%/40%_50%_60%_50%] blur-3xl`}
                />
            ))}

            {/* 미세한 부유 입자 */}
            <div className="absolute inset-0">
                {Array.from({ length: 12 }).map((_, i) => (
                    <FloatingSeed key={i} />
                ))}
            </div>
        </div>
    );
};

const FloatingSeed = () => {
    return (
        <motion.div
            initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: 0
            }}
            animate={{
                y: [null, "-=100"],
                x: [null, `+=${(Math.random() - 0.5) * 50}`],
                opacity: [0, 0.4, 0],
            }}
            transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                ease: "linear"
            }}
            className="absolute w-1 h-1 bg-green-200 rounded-full"
        />
    );
};
