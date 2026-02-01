"use client";

import Link from "next/link";
import { Leaf } from "lucide-react";
import { useSensoryInteraction } from "@/hooks/useSensoryInteraction";

interface CardProps {
    id: string;
    title: string;
    description: string;
    icon: any;
    color: string;
    sound?: string;
}

export default function BotanicCard({ id, title, description, icon: Icon, color, sound }: CardProps) {
    const { handleHover, handleClick } = useSensoryInteraction({
        soundUrl: sound,
        vibration: 'light'
    });

    return (
        <Link
            href={`healthcare/chat?topic=${id}`}
            className="group relative block h-full"
            onMouseEnter={handleHover}
            onClick={handleClick}
        >
            <div className="h-full bg-[#FAFAF9] rounded-lg p-6 border border-stone-200 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group-hover:-translate-y-1">
                {/* Botanic Texture Overlay */}
                <div className="absolute inset-0 bg-[url('/textures/paper-grain.png')] opacity-30 pointer-events-none mix-blend-multiply"></div>

                <div className="relative z-10 flex flex-col h-full">
                    {/* Floating Leaf Decoration */}
                    <div className="absolute -top-3 -right-3 text-green-100 opacity-0 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-500">
                        <Leaf className="w-24 h-24" />
                    </div>

                    <div className="w-12 h-12 border border-green-200 rounded-full flex items-center justify-center text-green-600 mb-4 bg-white/50 backdrop-blur-sm">
                        <Icon className="w-5 h-5" />
                    </div>

                    <h3 className="text-lg font-bold text-[#2F4F4F] mb-1">
                        {title}
                    </h3>

                    <p className="text-[#556B2F] text-xs font-medium tracking-wider mb-3">
                        NATURAL CARE
                    </p>

                    <p className="text-stone-500 text-sm leading-relaxed z-10 relative">
                        {description}
                    </p>
                </div>
            </div>
        </Link>
    );
}
