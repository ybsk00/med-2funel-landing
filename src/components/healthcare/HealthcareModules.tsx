"use client";

import { useState } from "react";
import { HospitalConfig } from "@/lib/config/hospital";
import { ArrowUpRight, BarChart2, Calendar, Droplet, Heart, Shield, Sparkles, Thermometer, User, Zap, Lock, Activity, Sun, Camera, Beaker, Moon, Leaf } from "lucide-react";
import VipCard from "@/components/ui/cards/VipCard";
import HanjiCard from "@/components/ui/cards/HanjiCard";
import GlassCard from "@/components/ui/cards/GlassCard";
import BlueprintCard from "@/components/ui/cards/BlueprintCard";
import CarbonCard from "@/components/ui/cards/CarbonCard";
import JellyCard from "@/components/ui/cards/JellyCard";
import FlowerCard from "@/components/ui/cards/FlowerCard";
import BotanicCard from "@/components/ui/cards/BotanicCard";
import LinenCard from "@/components/ui/cards/LinenCard";
import HologramCard from "@/components/ui/cards/HologramCard";
import ChatInterface from "@/components/chat/ChatInterface";
import Footer from "@/components/common/Footer";
import ClinicSearchModule from "@/components/healthcare/ClinicSearchModule";

interface HealthcareModulesProps {
    config: HospitalConfig;
}

const CARD_COMPONENTS: Record<string, any> = {
    silk: VipCard,
    hanji: HanjiCard,
    glass: GlassCard,
    blueprint: BlueprintCard,
    carbon: CarbonCard,
    jelly: JellyCard,
    flower: FlowerCard,
    botanic: BotanicCard,
    linen: LinenCard,
    hologram: HologramCard,
    circuit: HologramCard,
};

export default function HealthcareModules({ config }: HealthcareModulesProps) {
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

    if (!config.landingModules || !config.theme) return null;

    const texture = config.theme.texture || 'glass';
    const sound = config.theme.sound;
    const CardComponent = CARD_COMPONENTS[texture] || GlassCard;

    const handleModuleClick = (id: string) => {
        setSelectedTopic(id === selectedTopic ? null : id); // Toggle or select
        // Optional: Scroll to chat area
        setTimeout(() => {
            const chatElement = document.getElementById("healthcare-chat-area");
            if (chatElement) {
                chatElement.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 100);
    };

    return (
        <section className="relative z-20 min-h-screen flex flex-col">
            <div className="flex-1">
                {/* Famous Clinic Search Module - Unified at Top */}
                <div className="mb-16 mt-8">
                    <div className="text-center mb-10 px-4">
                        <span className="px-3 py-1 rounded-full bg-skin-primary/10 text-skin-primary text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase border border-skin-primary/20 mb-6 inline-block animate-fade-in text-white">
                            Healthcare Network
                        </span>
                        <h3 className="text-3xl md:text-5xl font-black text-skin-text mb-6 leading-tight">
                            유명한 <span className="text-skin-primary">{config.name}</span> 찾기
                        </h3>
                        <p className="text-skin-text/80 max-w-xl mx-auto text-base md:text-lg font-light leading-relaxed">
                            검증된 {config.name} 전문 병원을 찾아보세요. <br className="hidden md:block" />
                            전문 의료진과 최첨단 장비를 갖춘 최적의 진료 환경을 약속합니다.
                        </p>
                    </div>
                    <div className="max-w-4xl mx-auto px-4">
                        <div className="p-8 md:p-12 rounded-[2.5rem] bg-skin-surface/30 border border-skin-border/20 backdrop-blur-md shadow-lg relative overflow-hidden group hover:border-skin-primary/30 transition-colors duration-500">
                            {/* Decorative Background Glow */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-skin-primary/5 rounded-full blur-[80px] pointer-events-none transition-transform duration-700 group-hover:scale-110"></div>

                            <ClinicSearchModule department={config.id} />
                        </div>
                    </div>
                </div>



                {/* Module Grid: 2+2 Layout (2 cols on tablet/desktop, 4 cols on large screens if needed, but request was 2+2) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
                    {config.landingModules.map((module: any) => {
                        const ICON_MAP: any = {
                            'Sparkles': Sparkles,
                            'Droplet': Droplet,
                            'Shield': Shield,
                            'ArrowUpRight': ArrowUpRight,
                            'Heart': Heart,
                            'User': User,
                            'Activity': Activity,
                            'Sun': Sun,
                            'Camera': Camera,
                            'Thermometer': Thermometer,
                            'Zap': Zap,
                            'Lock': Lock,
                            'Calendar': Calendar,
                            'Beaker': Droplet,
                            'BarChart': BarChart2,
                            'Moon': Moon,
                            'Leaf': Leaf
                        };
                        const IconComponent = ICON_MAP[module.icon] || Sparkles;

                        return (
                            <div key={module.id} className="h-full">
                                <CardComponent
                                    id={module.id}
                                    title={module.title}
                                    description={module.description}
                                    icon={IconComponent}
                                    color={module.color}
                                    sound={sound}
                                    onClick={() => handleModuleClick(module.id)}
                                />
                            </div>
                        );
                    })}
                </div>



                {/* Inline Chat Area */}
                {selectedTopic && (
                    <div id="healthcare-chat-area" className="w-full mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-white/5 backdrop-blur-sm">
                            <ChatInterface
                                mode="healthcare"
                                isEmbedded={true}
                                topic={selectedTopic}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="mt-20">
                <Footer mode="healthcare" />
            </div>
        </section>
    );
}
