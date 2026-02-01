"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Lock, Scan, ShieldCheck, Fingerprint } from "lucide-react";
import { useEffect, useState } from "react";
import { useSoundEffect } from "@/hooks/useSoundEffect";
import { haptic } from "@/lib/utils/haptics";

interface PrivacyScreenProps {
    onUnlock: () => void;
    isLocked?: boolean;
    title?: string;
    subtitle?: string;
}

export default function PrivacyScreen({ onUnlock, isLocked = true, title = "Security Clearance", subtitle = "Verifying Identity..." }: PrivacyScreenProps) {
    const [scanState, setScanState] = useState<'idle' | 'scanning' | 'success'>('idle');
    const { playSound } = useSoundEffect();

    useEffect(() => {
        if (isLocked) {
            setScanState('scanning');
            // Start scanning sound
            // playSound('/sounds/scan_loop.mp3', 0.2); 

            // Simulate bio-scan duration
            const timer = setTimeout(() => {
                setScanState('success');
                haptic.success();
                // playSound('/sounds/unlock.mp3', 0.5);

                // Auto unlock after success visual
                setTimeout(() => {
                    onUnlock();
                }, 800);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [isLocked, onUnlock, playSound]);

    return (
        <AnimatePresence>
            {isLocked && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, filter: "blur(20px)", scale: 1.1 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center text-white overflow-hidden"
                >
                    {/* Background Noise/Grid */}
                    <div className="absolute inset-0 bg-[url('/textures/grid-small.png')] opacity-10 pointer-events-none"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 via-transparent to-emerald-900/20"></div>

                    {/* Scanner Container */}
                    <div className="relative w-72 h-72 mb-12 flex items-center justify-center">
                        {/* Rotating Rings */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 border border-emerald-500/30 rounded-full border-dashed"
                        />
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-4 border border-emerald-400/20 rounded-full"
                        />

                        {/* Central Icon */}
                        <div className="relative z-10">
                            <AnimatePresence mode="wait">
                                {scanState === 'success' ? (
                                    <motion.div
                                        key="success"
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 1.5, opacity: 0 }}
                                    >
                                        <ShieldCheck className="w-16 h-16 text-emerald-400" strokeWidth={1.5} />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="lock"
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <Fingerprint className="w-16 h-16 text-emerald-600" strokeWidth={1} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Scanning Beam */}
                        {scanState === 'scanning' && (
                            <motion.div
                                animate={{ top: ["0%", "100%", "0%"] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="absolute left-0 right-0 h-[2px] bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)] z-20 opacity-80"
                            />
                        )}
                    </div>

                    {/* Text Status */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center space-y-2 relative z-10"
                    >
                        <h2 className="text-2xl font-mono tracking-[0.2em] text-emerald-100 font-light uppercase">
                            {title}
                        </h2>
                        <motion.div
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="text-emerald-500/80 font-mono text-sm uppercase tracking-widest"
                        >
                            {scanState === 'success' ? "Access Granted" : subtitle}
                        </motion.div>
                    </motion.div>

                    {/* Tech Decorators */}
                    <div className="absolute top-10 left-10 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 flex gap-2">
                        <div className="w-1 h-4 bg-emerald-900/50"></div>
                        <div className="w-1 h-4 bg-emerald-900/50"></div>
                        <div className="w-1 h-4 bg-emerald-500 animate-pulse"></div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
