"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useSensoryInteraction } from "@/hooks/useSensoryInteraction";
import { TiltInteraction } from "@/components/ui/ThreeDInteraction";

interface CardProps {
    id: string;
    title: string;
    description: string;
    icon: any;
    color?: string;
    sound?: string;
    onClick?: () => void;
    isDark?: boolean; // NEW: Passed from parent or calculated
}

export default function GlassCard({ id, title, description, icon: Icon, color, sound, onClick, isDark }: CardProps) {
    const { handleHover, handleClick } = useSensoryInteraction({
        soundUrl: sound,
        vibration: 'medium'
    });

    const Container = 'div';
    const props = {
        onClick: (e: any) => { handleClick(); onClick?.(); },
        className: "group relative block h-full w-full cursor-pointer"
    };

    // Text color logic based on theme
    const titleColor = isDark ? "text-white" : "text-slate-800";
    const descColor = isDark ? "text-white/60" : "text-slate-500";
    const iconBg = isDark ? "bg-white/10" : "bg-gradient-to-br from-cyan-50 to-white";
    const iconColor = isDark ? "text-white" : "text-cyan-500";

    return (
        <Container
            {...props as any}
        >
            <TiltInteraction intensity={10} damping={25} className="h-full w-full">
                <div className={`h-full ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/40 border-white/60'} backdrop-blur-xl rounded-2xl p-6 border shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] hover:shadow-[0_8px_32px_0_rgba(6,182,212,0.15)] hover:border-cyan-200/50 transition-all duration-300`}>
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center shadow-inner ${iconColor} group-hover:scale-110 transition-transform`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <Sparkles className="w-4 h-4 text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
                        </div>

                        <h3 className={`text-lg font-bold ${titleColor} mb-2 group-hover:text-cyan-400 transition-colors`}>
                            {title}
                        </h3>
                        <p className={`${descColor} text-sm leading-relaxed flex-1`}>
                            {description}
                        </p>

                        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                </div>
            </TiltInteraction>
        </Container>
    );
}
