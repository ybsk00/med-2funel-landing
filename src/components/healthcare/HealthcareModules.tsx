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

const DEPARTMENT_MODULE_HEADERS: Record<string, { title: string; subtitle: string }> = {
    "plastic-surgery": {
        title: "성형외과 AI 전문 상담",
        subtitle: "궁금한 시술부터 비용, 회복 기간까지. 24시간 실시간으로 답변해드립니다."
    },
    "dermatology": {
        title: "피부 고민 1:1 맞춤 케어",
        subtitle: "내 피부 타입에 딱 맞는 시술과 홈케어 루틴을 추천받아보세요."
    },
    "korean-medicine": {
        title: "체질별 맞춤 한방 상담",
        subtitle: "나의 체질을 분석하고, 근본적인 건강을 되찾는 한방 처방을 알아보세요."
    },
    "dentistry": {
        title: "치과 정밀 진단 시스템",
        subtitle: "임플란트, 교정, 미백. 복잡한 치과 치료 과정을 알기 쉽게 설명해드립니다."
    },
    "orthopedics": {
        title: "통증 원인 및 재활 상담",
        subtitle: "목, 허리, 관절 통증의 원인을 찾고 비수술 치료법을 안내해드립니다."
    },
    "internal-medicine": {
        title: "프리미엄 건강검진 가이드",
        subtitle: "내 몸의 신호를 해석하고, 꼭 필요한 검진 항목을 추천해드립니다."
    },
    "urology": {
        title: "남성 활력 프라이빗 상담",
        subtitle: "말하기 힘든 고민, 익명이 보장되는 AI 상담소에서 편안하게 해결하세요."
    },
    "pediatrics": {
        title: "우리아이 성장 & 건강 멘토",
        subtitle: "갑작스러운 발열부터 성장 관리까지, 부모님의 걱정을 덜어드립니다."
    },
    "obgyn": {
        title: "여성 생애주기 맞춤 케어",
        subtitle: "월경, 임신, 갱년기까지. 여성의 건강한 삶을 위한 전문 상담입니다."
    },
    "oncology": {
        title: "암 면역 & 재활 통합 프로그램",
        subtitle: "암 치료 후의 면역 관리와 식단, 재활 정보를 상세히 안내해드립니다."
    },
    "neurosurgery": {
        title: "뇌신경계 정밀 분석 상담",
        subtitle: "두통, 어지럼증의 원인부터 뇌 건강을 지키는 생활 수칙까지."
    }
};

export default function HealthcareModules({ config }: HealthcareModulesProps) {
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

    if (!config.landingModules || !config.theme) return null;

    const texture = config.theme.texture || 'glass';
    const sound = config.theme.sound;

    const CardComponent = CARD_COMPONENTS[texture] || GlassCard;
    const moduleHeader = DEPARTMENT_MODULE_HEADERS[config.id] || {
        title: "전문 의료진 AI 상담",
        subtitle: "평소 궁금했던 건강 정보를 실시간으로 확인해보세요."
    };

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
                    <div className="p-8 md:p-12 rounded-[2.5rem] bg-skin-surface/70 border border-skin-text/10 backdrop-blur-xl shadow-2xl relative overflow-hidden group hover:border-skin-primary/50 transition-colors duration-500">
                        {/* Decorative Background Glow */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-skin-primary/5 rounded-full blur-[80px] pointer-events-none transition-transform duration-700 group-hover:scale-110"></div>

                        <ClinicSearchModule department={config.id} theme="modern" />
                    </div>
                </div>



                {/* Module Header (Between Search and Grid) */}
                <div className="text-center mb-10 mt-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                    <h3 className="text-2xl md:text-3xl font-bold text-skin-text mb-3">
                        {moduleHeader.title}
                    </h3>
                    <p className="text-skin-text/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        {moduleHeader.subtitle}
                    </p>
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
        </section >
    );
}
