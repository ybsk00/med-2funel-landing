"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function UrologyBackground3D() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#020204]">
      {/* Deep Navy/Black Gradient Base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#050b1a] via-[#020204] to-[#010102]" />

      {/* Generated AI Image: Obsidian Glass + Metallic Rings */}
      <div className="absolute inset-0 opacity-25 mix-blend-screen overflow-hidden">
        <Image
          src="/images/urology_hero_bg.png"
          alt="Urology Premium Background"
          fill
          className="object-cover scale-110"
          priority
        />
      </div>

      {/* Privacy Texture: Fine Vertical Lines */}
      <div
        className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '4px 100%'
        }}
      />

      {/* Strong Rim Lights & Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] mix-blend-screen" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[150px] mix-blend-screen" />

      {/* Moving Light Bar (Scan line) */}
      <motion.div
        initial={{ y: "-100%" }}
        animate={{ y: "200%" }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent blur-sm"
      />

      {/* Vignette for Cinematic Feel */}
      <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.9)]" />
    </div>
  );
}
