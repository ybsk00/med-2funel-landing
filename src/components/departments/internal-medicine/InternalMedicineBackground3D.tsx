"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function InternalMedicineBackground3D() {
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#0a0f1a]">
            {/* Blue-gray to Deep Green Gradient Base */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0c1a2b] via-[#0a0f1a] to-[#041d1a]" />

            {/* Generated AI Image: Frosted Glass + Data Orbs */}
            <div className="absolute inset-0 opacity-30 mix-blend-screen overflow-hidden">
                <Image
                    src="/images/internal_medicine_hero_bg.png"
                    alt="Internal Medicine Dashboard Background"
                    fill
                    className="object-cover scale-105"
                    priority
                />
            </div>

            {/* Subtle Data Grid Texture */}
            <div
                className="absolute inset-0 opacity-[0.08] pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)`,
                    backgroundSize: '32px 32px'
                }}
            />

            {/* Soft Ambient Orbs */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.4, 0.3],
                    x: [0, 20, 0],
                    y: [0, -20, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px] mix-blend-screen"
            />
            <motion.div
                animate={{
                    scale: [1.1, 1, 1.1],
                    opacity: [0.2, 0.3, 0.2],
                    x: [0, -30, 0],
                    y: [0, 30, 0]
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-20 -right-20 w-[700px] h-[700px] bg-cyan-500/10 rounded-full blur-[120px] mix-blend-screen"
            />

            {/* Rim Light Lines */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.4)_100%)] px-4" />
        </div>
    );
}
