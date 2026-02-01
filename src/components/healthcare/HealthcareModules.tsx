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
import HealthcareContent from "@/components/healthcare/HealthcareContent";

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

const DEPARTMENT_MODULE_HEADERS: Record<string, { title: string; subtitle1: string; subtitle2: string }> = {
    "plastic-surgery": {
        title: "퍼스널 뷰티 밸런스 체크",
        subtitle1: "나에게 가장 잘 어울리는 스타일과 비율을 분석해드립니다.",
        subtitle2: "부담 없이 간편하게, 나만의 아름다움을 찾아보세요."
    },
    "dermatology": {
        title: "데일리 피부 컨디션 체크",
        subtitle1: "현재 내 피부 상태에 딱 맞는 홈케어 루틴을 제안합니다.",
        subtitle2: "계절과 환경에 흔들리지 않는 건강한 피부를 만들어보세요."
    },
    "korean-medicine": {
        title: "내 몸의 기운 & 체질 분석",
        subtitle1: "타고난 체질을 알아보고 나에게 맞는 생활 습관을 확인하세요.",
        subtitle2: "자연의 흐름에 맞춘 건강한 밸런스를 찾아드립니다."
    },
    "dentistry": {
        title: "치아 청결도 & 미소 라인 점검",
        subtitle1: "치아 청결도부터 잇몸 건강까지 꼼꼼하게 점검해드립니다.",
        subtitle2: "자신 있는 미소를 위한 맞춤형 관리 팁을 받아보세요."
    },
    "orthopedics": {
        title: "바른 자세 & 관절 유연성 점검",
        subtitle1: "불편한 움직임은 없는지 내 몸의 균형 상태를 확인해보세요.",
        subtitle2: "일상에서 실천할 수 있는 가벼운 스트레칭 정보를 드립니다."
    },
    "internal-medicine": {
        title: "이너 뷰티 & 신체 리듬 관리",
        subtitle1: "내 몸의 에너지가 보내는 신호를 놓치지 말고 체크하세요.",
        subtitle2: "활력 넘치는 매일을 위한 건강한 습관을 제안합니다."
    },
    "urology": {
        title: "맨즈 헬스 & 활력 컨디션 가이드",
        subtitle1: "말하기 어려운 고민도 프라이빗하게 상태를 확인해보세요.",
        subtitle2: "자신감을 되찾고 에너지를 충전하는 방법을 안내해드립니다."
    },
    "pediatrics": {
        title: "우리 아이 성장 발달 & 육아 멘토",
        subtitle1: "아이의 성장 속도와 컨디션을 기록하고 변화를 살펴보세요.",
        subtitle2: "초보 엄마아빠를 위한 월령별 맞춤 육아 팁을 제공합니다."
    },
    "obgyn": {
        title: "우먼 웰니스 라이프 케어",
        subtitle1: "여성의 생애 주기에 맞춘 건강한 리듬을 찾아드립니다.",
        subtitle2: "소중한 내 몸을 위한 맞춤형 관리 가이드를 확인해보세요."
    },
    "oncology": {
        title: "면역 밸런스 & 영양 관리 가이드",
        subtitle1: "건강한 일상으로 복귀하기 위한 면역 관리법을 안내합니다.",
        subtitle2: "활력을 높여주는 식단과 생활 수칙을 지금 바로 확인하세요."
    },
    "neurosurgery": {
        title: "두뇌 컨디션 & 집중력 밸런스",
        subtitle1: "머리가 맑아지는 생활 습관과 컨디션 관리법을 알아보세요.",
        subtitle2: "복잡한 머릿속을 비우고 집중력을 높이는 팁을 드립니다."
    }
};

export default function HealthcareModules({ config }: HealthcareModulesProps) {
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

    if (!config.landingModules || !config.theme) return null;

    const texture = config.theme.texture || 'glass';
    const sound = config.theme.sound;

    const CardComponent = CARD_COMPONENTS[texture] || GlassCard;
    const moduleHeader = (config.id && DEPARTMENT_MODULE_HEADERS[config.id]) || {
        title: "스마트 헬스케어 체크",
        subtitle1: "나의 건강 상태를 간편하게 확인해보세요.",
        subtitle2: "맞춤형 정보를 통해 더 건강한 내일을 제안합니다."
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

                        <ClinicSearchModule department={config.id} />
                    </div>
                </div>

                {/* NEW: Healthcare Content Reinforcement (Sessions A-D) */}
                <HealthcareContent config={config} />

                {/* Module Header (Bottom Menu Section) */}
                <div className="text-center mb-12 mt-24 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 pt-24 border-t border-skin-text/5">
                    <span className="px-3 py-1 rounded-full bg-skin-primary/5 text-skin-primary text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase border border-skin-primary/10 mb-4 inline-block">
                        Smart Check
                    </span>
                    <h3 className="text-2xl md:text-4xl font-black text-skin-text mb-4 leading-tight">
                        {moduleHeader.title}
                    </h3>
                    <p className="text-skin-text/70 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                        {moduleHeader.subtitle1} <br className="hidden md:block" />
                        {moduleHeader.subtitle2}
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
