"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function TitaniumBackground() {
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#050505]">
            {/* Base AI Generated Titanium Image */}
            <div className="absolute inset-0 opacity-40">
                <Image
                    src="/images/orthopedics_hero_bg.png"
                    alt="Orthopedics Titanium Background"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Subtle Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-[#050505]/40 to-[#050505]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]/60" />

            {/* Dynamic Grid Overlay */}
            <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                    backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Floating Light Bars (Dynamic) */}
            <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/3 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent blur-sm"
            />
            <motion.div
                initial={{ y: '-100%' }}
                animate={{ y: '200%' }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 2 }}
                className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-white/10 to-transparent blur-sm"
            />

            {/* Cinematic Edge Vignette */}
            <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)]" />
        </div>
    );
}
