"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import { useSensoryInteraction } from "@/hooks/useSensoryInteraction";

interface CardProps {
    id: string;
    title: string;
    description: string;
    icon: any;
    color: string;
    sound?: string;
}

export default function CarbonCard({ id, title, description, icon: Icon, color, sound }: CardProps) {
    const { handleHover, handleClick } = useSensoryInteraction({
        soundUrl: sound,
        vibration: 'heavy'
    });

    return (
        <Link
            href={`healthcare/chat?topic=${id}`}
            className="group relative block h-full transform skew-x-[-6deg] hover:skew-x-0 transition-transform duration-300 origin-bottom-left"
            onMouseEnter={handleHover}
            onClick={handleClick}
        >
            <div className="h-full bg-zinc-900 rounded-xl p-8 relative overflow-hidden transition-all duration-300 border-l-4 border-indigo-600 hover:border-lime-400 shadow-[10px_10px_0_0_rgba(79,70,229,0.2)] hover:shadow-[10px_10px_0_0_rgba(163,230,53,0.3)]">
                {/* Carbon Texture */}
                <div className="absolute inset-0 bg-[url('/textures/carbon.png')] opacity-30 pointer-events-none mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

                <div className="relative z-10 skew-x-[6deg] group-hover:skew-x-0 transition-transform duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 rounded-full border-2 border-indigo-500 group-hover:border-lime-400 flex items-center justify-center bg-black/50 transition-colors">
                            <Icon className="w-6 h-6 text-indigo-400 group-hover:text-lime-400" />
                        </div>
                        <Zap className="w-5 h-5 text-zinc-600 group-hover:text-lime-400 group-hover:animate-pulse transition-colors" />
                    </div>

                    <h3 className="text-xl font-black italic text-white mb-2 uppercase tracking-wide group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-lime-400 transition-all">
                        {title}
                    </h3>

                    <p className="text-zinc-400 font-medium text-sm">
                        {description}
                    </p>

                    {/* RPM Gauge Effect (Simplified Visual) */}
                    <div className="mt-4 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-600 to-lime-400 w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
