"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useSensoryInteraction } from "@/hooks/useSensoryInteraction";
import { TiltInteraction } from "@/components/ui/ThreeDInteraction";

interface CardProps {
    id: string;
    title: string;
    description: string;
    icon: any;
    color: string;
    onClick?: () => void;
}

export default function VipCard({ id, title, description, icon: Icon, color, onClick }: CardProps) {
    const { handleHover, handleClick } = useSensoryInteraction({
        soundUrl: '/sounds/tick.mp3', // Example sound
        vibration: 'light'
    });

    const Container = 'div';
    const props = {
        onClick: (e: any) => { handleClick(); onClick?.(); },
        className: "group relative block cursor-pointer"
    };

    return (
        <Container
            {...props as any}
        >
            <TiltInteraction intensity={12} damping={30} className="h-full">
                <div className="h-full bg-black/80 backdrop-blur-md rounded-xl p-8 border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-500 shadow-2xl hover:shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                    {/* Gold Frame Effect */}
                    <div className="absolute inset-0 rounded-xl border border-[#D4AF37]/20 pointer-events-none group-hover:border-[#D4AF37]/60 transition-colors duration-500"></div>
                    <div className="absolute inset-[2px] rounded-[10px] border border-[#D4AF37]/10 pointer-events-none"></div>

                    <div className="flex items-start justify-between mb-6">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B76E79] p-[1px] group-hover:scale-110 transition-transform duration-500">
                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                                <Icon className="w-5 h-5 text-[#D4AF37]" />
                            </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-[#D4AF37] opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300" />
                    </div>

                    <h3 className="text-xl font-serif text-[#D4AF37] mb-3">{title}</h3>
                    <p className="text-gray-400 font-light text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                        {description}
                    </p>

                    {/* Shine Effect */}
                    <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-tr from-transparent via-[#D4AF37]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                    </div>
                </div>
            </TiltInteraction>
        </Container>
    );
}
