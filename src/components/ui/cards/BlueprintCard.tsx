"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useSensoryInteraction } from "@/hooks/useSensoryInteraction";

interface CardProps {
    id: string;
    title: string;
    description: string;
    icon: any;
    color: string;
    sound?: string;
    onClick?: () => void;
}

export default function BlueprintCard({ id, title, description, icon: Icon, color, sound, onClick }: CardProps) {
    const { handleHover, handleClick } = useSensoryInteraction({
        soundUrl: sound,
        vibration: 'medium'
    });

    const Container = onClick ? 'div' : Link;
    const props = onClick ? { onClick: (e: any) => { handleClick(); onClick(); }, className: "group relative block h-full cursor-pointer" } : { href: `healthcare/chat?topic=${id}`, className: "group relative block h-full", onMouseEnter: handleHover, onClick: handleClick };

    return (
        <Container
            {...props as any}
        >
            <div className="h-full bg-[#000080] text-blue-100 rounded-none p-6 relative overflow-hidden transition-all duration-300 hover:bg-[#000090] border-2 border-white/20">
                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[url('/textures/grid-small.png')] opacity-20 pointer-events-none"></div>

                {/* Corner Markers */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/50"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/50"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/50"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/50"></div>

                <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2 border border-dashed border-white/40 rounded bg-[#000080]">
                            <Icon className="w-6 h-6 text-orange-400" />
                        </div>
                        <span className="text-[10px] font-mono opacity-50">FIG. 0{Math.floor(Math.random() * 9) + 1}</span>
                    </div>

                    <h3 className="text-xl font-mono font-bold text-white mb-2 uppercase tracking-wider group-hover:text-orange-400 transition-colors">
                        {title}
                    </h3>

                    {/* Measurement Line */}
                    <div className="flex items-center gap-2 mb-4 opacity-50">
                        <div className="h-[1px] bg-white flex-1"></div>
                        <span className="text-[10px] font-mono">100%</span>
                        <div className="h-[1px] bg-white flex-1"></div>
                    </div>

                    <p className="text-sm font-mono text-blue-200 leading-relaxed">
                        {description}
                    </p>

                    <div className="mt-auto pt-4 flex justify-end">
                        <ArrowRight className="w-4 h-4 text-orange-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>
        </Container>
    );
}
