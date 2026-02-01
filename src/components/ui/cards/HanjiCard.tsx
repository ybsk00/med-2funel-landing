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

export default function HanjiCard({ id, title, description, icon: Icon, color, sound, onClick }: CardProps) {
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
            <div className="h-full bg-[#FAFAF9] rounded-lg p-8 relative overflow-hidden transition-all duration-500 hover:shadow-lg border border-stone-200 hover:border-stone-400">
                {/* Paper Texture Overlay */}
                <div className="absolute inset-0 opacity-50 bg-[url('/textures/hanji.png')] mix-blend-multiply pointer-events-none"></div>

                {/* Ink Splash Effect on Hover (Simulated with simple div scale for now, can be upgraded to SVG) */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-stone-200 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-700"></div>

                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="mb-6 p-4 rounded-full border-2 border-stone-800/10 group-hover:border-stone-800/30 transition-colors duration-500">
                        <Icon className="w-8 h-8 text-[#4A5D23]" strokeWidth={1.5} />
                    </div>

                    <h3 className="text-xl font-serif text-[#292524] mb-4 group-hover:text-[#4A5D23] transition-colors">
                        {title}
                    </h3>

                    {/* Vertical Divider */}
                    <div className="w-[1px] h-8 bg-stone-300 mb-4"></div>

                    <p className="text-stone-500 text-sm font-serif leading-loose break-keep">
                        {description}
                    </p>
                </div>
            </div>
        </Container>
    );
}
