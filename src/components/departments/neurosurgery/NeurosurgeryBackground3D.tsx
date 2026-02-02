"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function NeurosurgeryBackground3D() {
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#050a14]">
            {/* Near-black to Deep Navy Gradient Base */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a1525] via-[#050a14] to-[#02050a]" />

            {/* AI Generated Neural Grid + Glass Image */}
            <div className="absolute inset-0 opacity-40 mix-blend-screen">
                <Image
                    src="/images/neurosurgery_hero_bg.png"
                    alt="Neural Grid 3D Background"
                    fill
                    className="object-cover scale-110"
                    priority
                />
            </div>

            {/* Subtle Scanning Light Line */}
            <motion.div
                animate={{
                    y: ["-100%", "100%"]
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent z-1"
            />

            {/* Neural Pulse Orbs (Very Subtle) */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px]"
            />

            {/* Vignette Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
        </div>
    );
}
