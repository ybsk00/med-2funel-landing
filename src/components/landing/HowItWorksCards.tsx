"use client";

import Link from "next/link";
import { Timer, Camera, MapPin, ChevronRight } from "lucide-react";

const STEPS = [
    {
        icon: Timer,
        title: "30초 체크",
        description: "현재 루틴/고민을 빠르게 정리",
        label: "비로그인 가능",
        gradient: "from-blue-500/20 to-purple-500/20",
        border: "group-hover:border-blue-500/50",
        iconColor: "text-blue-400",
        labelBg: "bg-blue-500/20 text-blue-300",
        href: "/healthcare/chat?topic=glow-booster",
    },
    {
        icon: Camera,
        title: "사진으로 스타일 보기",
        description: "로그인/동의 후 내 사진으로 예시 확인",
        label: "로그인 필요",
        gradient: "from-pink-500/20 to-rose-500/20",
        border: "group-hover:border-pink-500/50",
        iconColor: "text-pink-400",
        labelBg: "bg-pink-500/20 text-pink-300",
        href: "/login?redirect=/healthcare/face-style",
    },
    {
        icon: MapPin,
        title: "가까운 피부과 찾기",
        description: "지역·시간 기준으로 바로 탐색",
        label: "바로 검색",
        gradient: "from-emerald-500/20 to-teal-500/20",
        border: "group-hover:border-emerald-500/50",
        iconColor: "text-emerald-400",
        labelBg: "bg-emerald-500/20 text-emerald-300",
        href: "#clinic-search",
    },
] as const;

interface HowItWorksCardsProps {
    className?: string;
}

export default function HowItWorksCards({ className = "" }: HowItWorksCardsProps) {
    return (
        <section className={`py-16 px-6 ${className}`}>
            <div className="max-w-5xl mx-auto">
                {/* 섹션 타이틀 */}
                <div className="text-center mb-12">
                    <span className="text-skin-primary font-bold tracking-widest uppercase text-sm mb-2 block">
                        How It Works
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-skin-text font-sans tracking-tight">
                        간단한 3단계
                    </h2>
                    <p className="text-skin-subtext mt-3 max-w-lg mx-auto text-sm">
                        루틴 체크부터 피부과 찾기까지, 빠르게 시작하세요.
                    </p>
                </div>

                {/* 3단 카드 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {STEPS.map((step, idx) => {
                        const IconComponent = step.icon;
                        const isAnchor = step.href.startsWith("#");

                        const cardContent = (
                            <div className={`group h-full relative overflow-hidden rounded-3xl p-1 transition-all duration-300 hover:-translate-y-2`}>
                                {/* Gradient Border Effect */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`} />

                                <div className={`relative h-full bg-white/5 backdrop-blur-xl rounded-[22px] p-6 border border-white/10 ${step.border} transition-colors duration-300`}>
                                    {/* Background Glow */}
                                    <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${step.gradient} blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />

                                    {/* 스텝 번호 + 아이콘 */}
                                    <div className="flex items-center gap-4 mb-6 relative z-10">
                                        <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white/50 font-bold text-lg border border-white/10">
                                            {idx + 1}
                                        </div>
                                        <div className={`w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                            <IconComponent className={`w-7 h-7 ${step.iconColor}`} />
                                        </div>
                                    </div>

                                    {/* 타이틀 & 설명 */}
                                    <div className="relative z-10 mb-8">
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all">
                                            {step.title}
                                        </h3>
                                        <p className="text-skin-subtext text-sm leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>

                                    {/* 라벨 + 화살표 */}
                                    <div className="flex items-center justify-between relative z-10 mt-auto">
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-lg text-[11px] font-bold ${step.labelBg} border border-white/5`}
                                        >
                                            {step.label}
                                        </span>
                                        <div className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/20 transition-colors`}>
                                            <ChevronRight className="w-4 h-4 text-skin-subtext group-hover:text-white transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );

                        if (isAnchor) {
                            return (
                                <a key={step.title} href={step.href}>
                                    {cardContent}
                                </a>
                            );
                        }

                        return (
                            <Link key={step.title} href={step.href}>
                                {cardContent}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
