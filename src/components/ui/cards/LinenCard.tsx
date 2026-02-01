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

export default function LinenCard({ id, title, description, icon: Icon, color, sound, onClick }: CardProps) {
    const { handleHover, handleClick } = useSensoryInteraction({
        soundUrl: sound,
        vibration: 'light'
    });

    const Container = onClick ? 'div' : Link;
    const props = onClick ? { onClick: (e: any) => { handleClick(); onClick(); }, className: "group relative block h-full cursor-pointer" } : { href: `healthcare/chat?topic=${id}`, className: "group relative block h-full", onMouseEnter: handleHover, onClick: handleClick };

    return (
        <Container
            {...props as any}
        >
            <div className="h-full bg-[#FAF0E6] p-8 shadow-sm hover:shadow-[0_10px_30px_-10px_rgba(218,165,32,0.2)] transition-shadow duration-500 relative">
                {/* Linen Texture */}
                <div className="absolute inset-0 bg-[url('/textures/linen.png')] opacity-20 bg-repeat mix-blend-multiply pointer-events-none"></div>

                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="mb-6 text-amber-600 transition-transform duration-500 group-hover:scale-110">
                        <Icon className="w-10 h-10" strokeWidth={1.5} />
                    </div>

                    <h3 className="text-xl font-serif text-[#8B4513] mb-4">
                        {title}
                    </h3>

                    <div className="w-full h-[1px] bg-amber-200 mb-4 scale-x-50 group-hover:scale-x-100 transition-transform duration-500"></div>

                    <p className="text-[#8B4513]/70 text-sm font-serif leading-loose">
                        {description}
                    </p>
                </div>
            </div>
        </Container>
    );
}
