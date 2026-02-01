"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useSensoryInteraction } from "@/hooks/useSensoryInteraction";

interface CardProps {
    id: string;
    title: string;
    description: string;
    icon: any;
    color: string;
    sound?: string;
}

export default function GlassCard({ id, title, description, icon: Icon, color, sound }: CardProps) {
    const { handleHover, handleClick } = useSensoryInteraction({
        soundUrl: sound,
        vibration: 'medium'
    });

    return (
        <Link
            href={`healthcare/chat?topic=${id}`}
            className="group relative block h-full"
            onMouseEnter={handleHover}
            onClick={handleClick}
        >
            <div className="h-full bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] hover:shadow-[0_8px_32px_0_rgba(6,182,212,0.15)] hover:border-cyan-200 transition-all duration-300 group-hover:-translate-y-1">
                <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-50 to-white flex items-center justify-center shadow-inner text-cyan-500 group-hover:text-cyan-600 transition-colors">
                            <Icon className="w-6 h-6" />
                        </div>
                        <Sparkles className="w-4 h-4 text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
                    </div>

                    <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-cyan-600 transition-colors">
                        {title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        {description}
                    </p>

                    {/* Glowing highlight at top */}
                    <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
            </div>
        </Link>
    );
}
