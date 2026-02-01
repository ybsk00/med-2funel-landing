"use client";

import Link from "next/link";
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

export default function FlowerCard({ id, title, description, icon: Icon, color, sound, onClick }: CardProps) {
    const { handleHover, handleClick } = useSensoryInteraction({
        soundUrl: sound,
        vibration: 'light'
    });

    const Container = onClick ? 'div' : Link;
    const props = onClick ? { onClick: (e: any) => { handleClick(); onClick(); }, className: "group relative block h-full w-full cursor-pointer" } : { href: `healthcare/chat?topic=${id}`, className: "group relative block h-full w-full", onMouseEnter: handleHover, onClick: handleClick };

    return (
        <Container
            {...props as any}
        >
            <div className="h-full bg-white rounded-tr-[3rem] rounded-bl-[3rem] p-8 border border-rose-100 shadow-sm hover:shadow-[0_20px_40px_-5px_rgba(255,182,193,0.3)] transition-all duration-500 overflow-hidden relative">
                {/* Petal Layer Effect */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-rose-100 to-transparent rounded-bl-[4rem] opacity-30 pointer-events-none group-hover:scale-110 transition-transform duration-700 ease-in-out"></div>

                <div className="relative z-10 flex flex-col h-full">
                    <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-400 mb-6 group-hover:bg-rose-100 transition-colors">
                        <Icon className="w-6 h-6" />
                    </div>

                    <h3 className="text-xl font-serif text-rose-900 mb-3 italic">
                        {title}
                    </h3>

                    <div className="w-8 h-[2px] bg-rose-200 mb-4 group-hover:w-16 transition-all duration-300"></div>

                    <p className="text-rose-800/60 text-sm font-light leading-relaxed flex-1">
                        {description}
                    </p>
                </div>
            </div>
        </Container>
    );
}
