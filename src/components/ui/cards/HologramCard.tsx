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

export default function HologramCard({ id, title, description, icon: Icon, color, sound }: CardProps) {
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
            <div className="h-full bg-gradient-to-br from-white/10 to-transparent backdrop-blur-lg rounded-xl p-1 relative overflow-hidden transition-all duration-300 hover:scale-[1.02]">
                {/* Holographic Border Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-20 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Inner Content */}
                <div className="h-full bg-white/5 rounded-lg p-6 relative z-10 flex flex-col items-start border border-white/20">
                    <div className="flex items-center justify-between w-full mb-6">
                        <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md border border-white/10">
                            <Icon className="w-6 h-6 text-pink-300 group-hover:text-white transition-colors" />
                        </div>
                        <Sparkles className="w-4 h-4 text-cyan-300 opacity-50 group-hover:opacity-100 animate-pulse" />
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 tracking-wide group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-300 group-hover:to-cyan-300 transition-all">
                        {title}
                    </h3>

                    <p className="text-gray-400 text-sm font-light leading-relaxed group-hover:text-gray-200 transition-colors">
                        {description}
                    </p>

                    {/* Iridescent overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </div>
            </div>
        </Link>
    );
}
