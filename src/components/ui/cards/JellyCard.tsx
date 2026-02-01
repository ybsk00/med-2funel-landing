"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useSensoryInteraction } from "@/hooks/useSensoryInteraction";

interface CardProps {
    id: string;
    title: string;
    description: string;
    icon: any;
    color: string;
    sound?: string;
}

export default function JellyCard({ id, title, description, icon: Icon, color, sound }: CardProps) {
    const { handleHover, handleClick } = useSensoryInteraction({
        soundUrl: sound,
        vibration: 'medium'
    });

    return (
        <Link href={`healthcare/chat?topic=${id}`} onMouseEnter={handleHover} onClick={handleClick}>
            <motion.div
                whileHover={{ scale: 1.05, rotate: 1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                className="h-full bg-white rounded-[2rem] p-6 border-4 border-yellow-200 hover:border-yellow-400 transition-colors shadow-[0_10px_20px_rgba(250,204,21,0.2)] cursor-pointer relative overflow-hidden"
            >
                {/* Blob Background */}
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-yellow-100 rounded-full opacity-50 pointer-events-none"></div>
                <div className="absolute -left-10 -bottom-10 w-24 h-24 bg-sky-100 rounded-full opacity-50 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4 text-orange-500 shadow-sm transform group-hover:-translate-y-2 transition-transform">
                        <Icon className="w-8 h-8" strokeWidth={2.5} />
                    </div>

                    <h3 className="text-xl font-bold text-indigo-900 mb-2 font-round">
                        {title}
                    </h3>
                    <p className="text-sky-700/80 text-sm font-medium leading-relaxed">
                        {description}
                    </p>
                </div>
            </motion.div>
        </Link>
    );
}
