"use client";

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
    circuit: HologramCard, // Neurosurgery uses Hologram style or Circuit (if defined)
};

export default function HealthcareModules({ config }: HealthcareModulesProps) {
    if (!config.landingModules || !config.theme) return null;

    const texture = config.theme.texture || 'glass';
    const sound = config.theme.sound; // Get sound from theme
    const CardComponent = CARD_COMPONENTS[texture] || GlassCard;

    return (
        <section className="relative z-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {config.landingModules.map((module: any) => {
                    // 아이콘 매핑
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
                            />
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
