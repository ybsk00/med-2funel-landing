"use client";

import Link from "next/link";
import { useState } from "react";
import { Sparkles, Camera, MessageCircle, Search, ShieldCheck, ChevronDown, ArrowRight, Lock } from "lucide-react";
import { TrackF1View } from "@/components/marketing/MarketingTracker";
import Footer from "@/components/common/Footer";
import ClinicSearchModule from "@/components/healthcare/ClinicSearchModule";
import PhotoSlideOver from "@/components/landing/PhotoSlideOver";
import { useHospitalConfig, useHealthcareConfig, useHospitalInfo, useThemeConfig } from "@/modules/theme/ThemeProvider";
import { isColorDark } from "@/lib/utils/theme";
import { HEALTHCARE_CONTENT } from "@/lib/constants/healthcare_content";
import { useHospital } from "@/components/common/HospitalProvider";
import dynamic from 'next/dynamic';
import { motion } from "framer-motion";

const MagneticInteraction = dynamic(() => import("@/components/ui/ThreeDInteraction").then(mod => mod.MagneticInteraction), { ssr: false });
const PremiumBackground = dynamic(() => import("@/components/ui/backgrounds/PremiumBackground"), { ssr: false });
import HealthcareHero from "@/components/healthcare/HealthcareHero";
import HealthcareNavigation from "@/components/healthcare/HealthcareNavigation";
import ChatInterface from "@/components/chat/ChatInterface";

const PlasticSurgerySimulation = dynamic(() => import("@/components/departments/plastic-surgery/PlasticSurgerySimulation"), { ssr: false });
const ContourRing3D = dynamic(() => import("@/components/departments/plastic-surgery/ContourRing3D"), { ssr: false });
const UrologyBackground3D = dynamic(() => import("@/components/departments/urology/UrologyBackground3D"), { ssr: false });
const GynecomastiaSimulation = dynamic(() => import("@/components/departments/urology/GynecomastiaSimulation"), { ssr: false });
const ObgynBackground3D = dynamic(() => import("@/components/departments/obgyn/ObgynBackground3D"), { ssr: false });
const VCareSimulation = dynamic(() => import("@/components/departments/obgyn/VCareSimulation"), { ssr: false });
const InternalMedicineBackground3D = dynamic(() => import("@/components/departments/internal-medicine/InternalMedicineBackground3D"), { ssr: false });
const HealthRiskSimulation = dynamic(() => import("@/components/departments/internal-medicine/HealthRiskSimulation"), { ssr: false });
const OncologyBackground3D = dynamic(() => import("@/components/departments/oncology/OncologyBackground3D"), { ssr: false });
const RecoveryRoadmapSimulation = dynamic(() => import("@/components/departments/oncology/RecoveryRoadmapSimulation"), { ssr: false });
const NeurosurgeryBackground3D = dynamic(() => import("@/components/departments/neurosurgery/NeurosurgeryBackground3D"), { ssr: false });
const NeuroTriageSimulation = dynamic(() => import("@/components/departments/neurosurgery/NeuroTriageSimulation"), { ssr: false });
const PainPatternSimulation = dynamic(() => import("@/components/healthcare/specialized/PainPatternSimulation"), { ssr: false });
const SymptomTimelineSimulation = dynamic(() => import("@/components/departments/pediatrics/SymptomTimelineSimulation"), { ssr: false });
const FourAxisBalanceSimulation = dynamic(() => import("@/components/departments/korean-medicine/FourAxisBalanceSimulation"), { ssr: false });


// 과별 배경 패턴 CSS (미세 노이즈/그리드/한지/회로 등)
const DEPARTMENT_BG_PATTERNS: Record<string, string> = {
    // 피부과: 펄 핑크 + 라벤더 글로우 (글로우 스킨)
    "dermatology": "radial-gradient(ellipse at 20% 50%, rgba(240,160,200,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(216,160,224,0.06) 0%, transparent 50%)",
    // 치과: 클린 블루 소프트 그라데이션 (클린 화이트)
    "dentistry": "radial-gradient(ellipse at 30% 70%, rgba(96,165,250,0.06) 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, rgba(56,189,248,0.05) 0%, transparent 50%)",
    // 성형외과: 로즈골드 + 실버 메탈릭 (프리미엄 메탈)
    "plastic-surgery": "radial-gradient(ellipse at 50% 0%, rgba(192,160,128,0.08) 0%, transparent 40%), radial-gradient(ellipse at 20% 80%, rgba(212,160,192,0.06) 0%, transparent 50%)",
    // 정형외과: 카본 그리드 패턴 (퍼포먼스)
    "orthopedics": "repeating-linear-gradient(90deg, rgba(100,116,139,0.04) 0px, transparent 1px, transparent 60px), repeating-linear-gradient(0deg, rgba(16,185,129,0.03) 0px, transparent 1px, transparent 60px)",
    // 비뇨기과: 인디고 다크 글로우
    "urology": "radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.05) 0%, transparent 60%)",
    // 내과: 보태닉 그린 소프트
    "internal-medicine": "radial-gradient(ellipse at 40% 60%, rgba(14,165,233,0.06) 0%, transparent 50%), radial-gradient(ellipse at 70% 20%, rgba(16,185,129,0.04) 0%, transparent 50%)",
    // 한의원: 한지 텍스처 사선
    "korean-medicine": "repeating-linear-gradient(45deg, rgba(180,83,9,0.04) 0px, transparent 2px, transparent 12px)",
    // 소아과: 파스텔 버블
    "pediatrics": "radial-gradient(circle at 20% 30%, rgba(245,158,11,0.06) 0%, transparent 30%), radial-gradient(circle at 80% 70%, rgba(59,130,246,0.05) 0%, transparent 30%), radial-gradient(circle at 50% 50%, rgba(16,185,129,0.04) 0%, transparent 40%)",
    // 신경외과: 회로 그리드 (정밀 테크)
    "neurosurgery": "repeating-linear-gradient(0deg, rgba(129,140,248,0.03) 0px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, rgba(6,182,212,0.02) 0px, transparent 1px, transparent 40px)",
    // 산부인과: 핑크 + 바이올렛 소프트
    "obgyn": "radial-gradient(ellipse at 30% 40%, rgba(236,72,153,0.06) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(139,92,246,0.05) 0%, transparent 50%)",
    // 암요양: 그린 + 앰버 희망 (희망·회복)
    "oncology": "radial-gradient(ellipse at 50% 30%, rgba(16,185,129,0.06) 0%, transparent 50%), radial-gradient(ellipse at 50% 70%, rgba(245,158,11,0.04) 0%, transparent 50%)",
};

// 과별 CTA 라벨
const DEPARTMENT_CTA: Record<string, { cta1: string; cta2: string }> = {
    "dermatology": { cta1: "유명한 피부과 찾기", cta2: "시뮬레이션 해보기" },
    "dentistry": { cta1: "유명한 치과 찾기", cta2: "시뮬레이션 해보기" },
    "plastic-surgery": { cta1: "유명한 성형외과 찾기", cta2: "시뮬레이션 해보기" },
    "orthopedics": { cta1: "유명한 정형외과 찾기", cta2: "시뮬레이션 해보기" },
    "urology": { cta1: "유명한 비뇨기과 찾기", cta2: "시뮬레이션 해보기" },
    "internal-medicine": { cta1: "유명한 내과 찾기", cta2: "시뮬레이션 해보기" },
    "korean-medicine": { cta1: "유명한 한의원 찾기", cta2: "시뮬레이션 해보기" },
    "pediatrics": { cta1: "유명한 소아과 찾기", cta2: "시뮬레이션 해보기" },
    "neurosurgery": { cta1: "유명한 신경외과 찾기", cta2: "시뮬레이션 해보기" },
    "obgyn": { cta1: "유명한 산부인과 찾기", cta2: "시뮬레이션 해보기" },
    "oncology": { cta1: "유명한 암요양병원 찾기", cta2: "시뮬레이션 해보기" },
};
const TeethShadeSimulation = dynamic(() => import('@/components/departments/dentistry/TeethShadeSimulation'), { ssr: false });

export default function HealthcareLanding() {
    const fullConfig = useHospitalConfig();
    const healthcare = useHealthcareConfig();
    const hospital = useHospitalInfo();
    const theme = useThemeConfig();
    const v1Config = useHospital();

    const [isPhotoSlideOverOpen, setIsPhotoSlideOverOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);

    const isThemeDark = isColorDark(theme.healthcare.colors.background);
    const isPrimaryBright = theme.healthcare.colors.primary ? !isColorDark(theme.healthcare.colors.primary) : false;
    const buttonTextColor = (isPrimaryBright && !isThemeDark) ? "text-slate-900 font-extrabold" : "text-white";

    const content = v1Config.id ? HEALTHCARE_CONTENT[v1Config.id as keyof typeof HEALTHCARE_CONTENT] : null;
    const dept = hospital.department || "dermatology";
    const bgPattern = DEPARTMENT_BG_PATTERNS[dept] || "";
    const ctaLabels = DEPARTMENT_CTA[dept] || { cta1: "병원 찾기", cta2: "시뮬레이션" };

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <TrackF1View>
            <div
                className="min-h-screen font-sans selection:bg-skin-primary selection:text-white"
                style={{ color: theme.healthcare.colors.text }}
            >
                {/* 과별 미세 배경 패턴 */}
                <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: bgPattern }} />

                {hospital.department === 'plastic-surgery' && <ContourRing3D />}
                {hospital.department === 'urology' && <UrologyBackground3D />}
                {hospital.department === 'obgyn' && <ObgynBackground3D />}
                {hospital.department === 'internal-medicine' && <InternalMedicineBackground3D />}
                {hospital.department === 'oncology' && <OncologyBackground3D />}
                {hospital.department === 'neurosurgery' && <NeurosurgeryBackground3D />}

                <PremiumBackground colors={theme.healthcare.colors} intensity="subtle" />


                <HealthcareNavigation config={fullConfig} />

                {/* ═══════════ SESSION 1: HERO ═══════════ */}
                <main className="relative">
                    <HealthcareHero
                        config={fullConfig}
                        onOpenCamera={() => setIsPhotoSlideOverOpen(true)}
                        ctaLabels={ctaLabels}
                        onScrollToClinic={() => scrollToSection("session-clinic-search")}
                        onScrollToSimulation={() => scrollToSection("session-simulation")}
                        onScrollToChat={() => { setIsChatOpen(true); setTimeout(() => scrollToSection("chat-interface"), 100); }}
                    />
                </main>

                <PhotoSlideOver
                    isOpen={isPhotoSlideOverOpen}
                    onClose={() => setIsPhotoSlideOverOpen(false)}
                />

                {/* ═══════════ SESSION 2: 유명한 병원 찾기 (고정/필수) ═══════════ */}
                <motion.section
                    id="session-clinic-search"
                    className="relative py-28 z-20"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="w-full max-w-4xl px-6 mx-auto">
                        <div className="text-center mb-14 px-4">
                            <span className={`px-5 py-2 rounded-full text-[10px] sm:text-xs font-black tracking-[0.25em] uppercase mb-8 inline-block shadow-lg backdrop-blur-md border ${isThemeDark ? 'bg-white/10 text-white border-white/20' : 'bg-skin-primary/10 text-skin-primary border-skin-primary/20'}`}>
                                Healthcare Network
                            </span>
                            <h3 className={`text-4xl md:text-6xl font-black mb-6 leading-tight ${isThemeDark ? 'text-white drop-shadow-2xl' : 'text-skin-text'}`}>
                                유명한 <span className="text-skin-primary">{hospital.name}</span> 찾기
                            </h3>
                            <p className={`max-w-xl mx-auto text-lg md:text-xl font-medium leading-relaxed ${isThemeDark ? 'text-white/70 drop-shadow-md' : 'text-skin-text/70'}`}>
                                검증된 의료진·장비·후기를 기준으로 조건에 맞는 병원을 찾아보세요.
                            </p>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-2 bg-gradient-to-r from-skin-primary/30 to-skin-accent/30 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                            <div className={`relative backdrop-blur-[60px] rounded-[3rem] p-10 md:p-16 overflow-hidden ${isThemeDark ? 'bg-white/[0.05] border border-white/20 shadow-[0_32px_80px_rgba(0,0,0,0.5)]' : 'bg-skin-primary/5 border border-skin-primary/10 shadow-xl'}`}>
                                <div className="absolute -top-32 -right-32 w-96 h-96 bg-skin-primary/20 rounded-full blur-[100px] pointer-events-none" />
                                <ClinicSearchModule department={hospital.department} searchKeyword={hospital.searchKeywords[0]} />
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* ═══════════ SESSION 2.5: 과별 필독 가이드 (카드 세션) ═══════════ */}
                {content?.sessionB && (
                    <section className="relative py-20 z-20">
                        <div className="max-w-6xl mx-auto px-6">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-center mb-16"
                            >
                                <h3 className={`text-2xl md:text-4xl font-black mb-4 ${isThemeDark ? 'text-white' : 'text-skin-text'}`}>
                                    {content.sessionB.title}
                                </h3>
                                <div className="w-12 h-1 bg-skin-primary mx-auto rounded-full" />
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                                {content.sessionB.cards.map((card, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 40 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1, duration: 0.6 }}
                                        whileHover={{ y: -10, transition: { duration: 0.3 } }}
                                        className={`group relative p-10 rounded-[2.5rem] overflow-hidden transition-all duration-500 ${isThemeDark
                                            ? 'bg-white/[0.05] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 shadow-2xl'
                                            : 'bg-white/60 border border-skin-primary/10 hover:bg-white/80 shadow-lg hover:shadow-xl'
                                            } backdrop-blur-xl`}
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-skin-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${isThemeDark ? 'bg-white/10' : 'bg-skin-primary/10'} group-hover:scale-110 transition-transform`}>
                                            <Sparkles className={`w-7 h-7 ${isThemeDark ? 'text-white/60' : 'text-skin-primary'}`} />
                                        </div>

                                        <h4 className={`text-xl font-black mb-4 ${isThemeDark ? 'text-white' : 'text-slate-900'}`}>
                                            {card.title}
                                        </h4>
                                        <p className={`leading-relaxed text-base font-medium ${isThemeDark ? 'text-white/50' : 'text-slate-500'}`}>
                                            {card.description}
                                        </p>

                                        <div className="mt-8 pt-8 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-xs font-black uppercase tracking-widest text-skin-primary flex items-center gap-2">
                                                View Detail <ArrowRight className="w-4 h-4" />
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* ═══════════ SESSION 3: 시뮬레이션 (필수) ═══════════ */}
                <section id="session-simulation" className="relative py-28 z-20 overflow-hidden">
                    {hospital.department === 'plastic-surgery' ? (
                        <PlasticSurgerySimulation />
                    ) : hospital.department === 'urology' ? (
                        <GynecomastiaSimulation />
                    ) : hospital.department === 'obgyn' ? (
                        <VCareSimulation />
                    ) : hospital.department === 'internal-medicine' ? (
                        <HealthRiskSimulation />
                    ) : hospital.department === 'oncology' ? (
                        <RecoveryRoadmapSimulation />
                    ) : hospital.department === 'neurosurgery' ? (
                        <NeuroTriageSimulation />
                    ) : hospital.department === 'orthopedics' ? (
                        <PainPatternSimulation />
                    ) : hospital.department === 'pediatrics' ? (
                        <SymptomTimelineSimulation />
                    ) : hospital.department === 'korean-medicine' ? (
                        <FourAxisBalanceSimulation />
                    ) : hospital.department === 'dentistry' ? (
                        <TeethShadeSimulation />
                    ) : (
                        <div className="max-w-5xl mx-auto px-6">                            <div className="text-center mb-14">
                            <span className={`px-5 py-2 rounded-full text-[10px] sm:text-xs font-black tracking-[0.25em] uppercase mb-8 inline-block backdrop-blur-md border ${isThemeDark ? 'bg-white/10 text-white border-white/20' : 'bg-skin-primary/10 text-skin-primary border-skin-primary/20'}`}>
                                AI Simulation
                            </span>
                            <h3 className={`text-3xl md:text-5xl font-black mb-6 leading-tight ${isThemeDark ? 'text-white' : 'text-skin-text'}`}>
                                {content?.simulation?.title || "AI 시뮬레이션"}
                            </h3>
                            <p className={`max-w-xl mx-auto text-lg leading-relaxed ${isThemeDark ? 'text-white/70' : 'text-skin-text/60'}`}>
                                {content?.simulation?.description || "사진 기반으로 변화를 미리 확인하세요."}
                            </p>
                        </div>

                            {/* Simulation Card */}
                            <div className={`relative rounded-[2.5rem] overflow-hidden p-10 md:p-16 text-center group ${isThemeDark ? 'bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/15 shadow-2xl' : 'bg-gradient-to-br from-skin-primary/5 to-skin-accent/5 border border-skin-primary/10 shadow-xl'}`}>
                                {/* Glow Effect */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                    <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-skin-primary/10 rounded-full blur-[120px]" />
                                    <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-skin-accent/10 rounded-full blur-[120px]" />
                                </div>

                                <div className="relative z-10 space-y-8">
                                    {/* Camera Icon */}
                                    <div className={`w-24 h-24 mx-auto rounded-3xl flex items-center justify-center ${isThemeDark ? 'bg-white/10 border border-white/20' : 'bg-skin-primary/10 border border-skin-primary/20'} group-hover:scale-110 transition-transform duration-500`}>
                                        <Camera className={`w-12 h-12 ${isThemeDark ? 'text-white/80' : 'text-skin-primary'}`} />
                                    </div>

                                    <p className={`text-lg max-w-md mx-auto ${isThemeDark ? 'text-white/60' : 'text-skin-text/60'}`}>
                                        사진을 업로드하면 AI가 분석하여 결과를 보여드립니다.
                                        <br />
                                        <span className="text-xs opacity-60">* 예시 이미지이며 실제 결과는 개인차가 있습니다.</span>
                                    </p>

                                    <button
                                        onClick={() => setIsPhotoSlideOverOpen(true)}
                                        className={`inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 ${buttonTextColor} border border-white/20 overflow-hidden group/btn`}
                                        style={{ backgroundColor: theme.healthcare.colors.primary }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                                        <Camera className="w-6 h-6" />
                                        <span className="relative z-10">{content?.simulation?.buttonLabel || "시뮬레이션 시작"}</span>
                                    </button>

                                    <p className={`text-sm ${isThemeDark ? 'text-white/40' : 'text-skin-text/40'}`}>
                                        결과 확인 후 → <span className="text-skin-primary font-bold">{content?.simulation?.resultCta || "상담 예약"}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}                </section>

                {/* ═══════════ SESSION 4: 챗 메뉴 (로그인 유도) ═══════════ */}
                <motion.section
                    id="session-chat"
                    className="relative py-28 z-20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="max-w-5xl mx-auto px-6">
                        <div className="text-center mb-14">
                            <span className={`px-5 py-2 rounded-full text-[10px] sm:text-xs font-black tracking-[0.25em] uppercase mb-8 inline-block backdrop-blur-md border ${isThemeDark ? 'bg-white/10 text-white border-white/20' : 'bg-skin-primary/10 text-skin-primary border-skin-primary/20'}`}>
                                AI Consultation
                            </span>
                            <h3 className={`text-3xl md:text-5xl font-black mb-6 leading-tight ${isThemeDark ? 'text-white' : 'text-skin-text'}`}>
                                {content?.sessionC?.title || "맞춤 상담"}
                            </h3>
                            <p className={`max-w-xl mx-auto text-lg leading-relaxed ${isThemeDark ? 'text-white/70' : 'text-skin-text/60'}`}>
                                {content?.sessionC?.description || "AI 기반 상담으로 맞춤형 안내를 받으세요."}
                            </p>
                        </div>

                        {/* 로그인 전/후 분리 카드 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                            {/* 로그인 전 */}
                            <div className={`rounded-[2rem] p-8 space-y-5 ${isThemeDark ? 'bg-white/[0.05] border border-white/10' : 'bg-white/40 border border-skin-primary/10 backdrop-blur-sm shadow-lg'}`}>
                                <div className="flex items-center gap-3">
                                    <MessageCircle className={`w-6 h-6 ${isThemeDark ? 'text-white/60' : 'text-skin-primary'}`} />
                                    <h4 className={`text-lg font-bold ${isThemeDark ? 'text-white/90' : 'text-skin-text'}`}>무료 상담 (로그인 전)</h4>
                                </div>
                                <ul className="space-y-3">
                                    {(content?.chatMenu?.beforeLogin || ["일반 상식 Q&A"]).map((item, idx) => (
                                        <li key={idx} className={`flex items-start gap-3 text-sm ${isThemeDark ? 'text-white/60' : 'text-skin-text/70'}`}>
                                            <ChevronDown className="w-4 h-4 mt-0.5 text-skin-primary rotate-[-90deg]" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => { setIsChatOpen(true); setTimeout(() => scrollToSection("chat-interface"), 100); }}
                                    className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all ${isThemeDark ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20' : 'bg-skin-primary/10 text-skin-primary border border-skin-primary/20 hover:bg-skin-primary/20'}`}
                                >
                                    무료 상담 시작하기
                                </button>
                            </div>

                            {/* 로그인 후 */}
                            <div className={`rounded-[2rem] p-8 space-y-5 relative overflow-hidden ${isThemeDark ? 'bg-gradient-to-br from-skin-primary/20 to-skin-accent/10 border border-skin-primary/30' : 'bg-gradient-to-br from-skin-primary/5 to-skin-accent/5 border border-skin-primary/20 shadow-lg'}`}>
                                <div className="flex items-center gap-3">
                                    <Lock className={`w-6 h-6 text-skin-primary`} />
                                    <h4 className={`text-lg font-bold ${isThemeDark ? 'text-white/90' : 'text-skin-text'}`}>맞춤 상담 (로그인 후)</h4>
                                </div>
                                <ul className="space-y-3">
                                    {(content?.chatMenu?.afterLogin || ["개인화 상담"]).map((item, idx) => (
                                        <li key={idx} className={`flex items-start gap-3 text-sm ${isThemeDark ? 'text-white/60' : 'text-skin-text/70'}`}>
                                            <ChevronDown className="w-4 h-4 mt-0.5 text-skin-primary rotate-[-90deg]" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href="/login"
                                    className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${buttonTextColor} hover:shadow-lg active:scale-95`}
                                    style={{ backgroundColor: theme.healthcare.colors.primary }}
                                >
                                    {content?.sessionC?.cta || "로그인 후 이용하기"}
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                {content?.chatMenu?.privacyCopy && (
                                    <p className={`text-xs text-center ${isThemeDark ? 'text-white/40' : 'text-skin-text/40'}`}>
                                        {content.chatMenu.privacyCopy}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Inline Chat */}
                        <div id="chat-interface" className={`transition-all duration-700 ease-in-out ${isChatOpen ? 'opacity-100 max-h-[800px]' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                            {isChatOpen && (
                                <div className={`rounded-[2rem] overflow-hidden shadow-2xl border ${isThemeDark ? 'border-white/10 bg-white/5' : 'border-skin-text/10 bg-white/80'} h-[600px] md:h-[700px]`}>
                                    <ChatInterface
                                        mode="healthcare"
                                        isEmbedded={true}
                                        topic={v1Config.id}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </motion.section>

                {/* ═══════════ SESSION 5: TRUST (FAQ + 안전고지 + CTA) ═══════════ */}
                <motion.section
                    id="session-trust"
                    className="relative py-28 z-20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="text-center mb-14">
                            <span className={`px-5 py-2 rounded-full text-[10px] sm:text-xs font-black tracking-[0.25em] uppercase mb-8 inline-block backdrop-blur-md border ${isThemeDark ? 'bg-white/10 text-white border-white/20' : 'bg-skin-primary/10 text-skin-primary border-skin-primary/20'}`}>
                                Trust & Safety
                            </span>
                            <h3 className={`text-3xl md:text-5xl font-black mb-6 leading-tight ${isThemeDark ? 'text-white' : 'text-skin-text'}`}>
                                자주 묻는 질문
                            </h3>
                        </div>

                        {/* FAQ Items — 클릭 시 챗봇(로그인 전)으로 이동 */}
                        <div className="space-y-4 mb-16">
                            {(content?.trust?.faqs || content?.sessionD?.faqs || []).map((faq, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => { setIsChatOpen(true); setTimeout(() => scrollToSection("chat-interface"), 100); }}
                                    className={`w-full text-left p-6 md:p-8 rounded-2xl transition-all duration-300 cursor-pointer group ${isThemeDark ? 'bg-white/[0.05] border border-white/10 hover:bg-white/[0.08] hover:border-white/20' : 'bg-white/40 border border-skin-primary/10 hover:bg-white/60 hover:shadow-md backdrop-blur-sm'}`}
                                >
                                    <h5 className="font-bold text-lg mb-3 flex items-start gap-3">
                                        <span className="text-skin-primary text-xl font-black">Q.</span>
                                        <span className={isThemeDark ? 'text-white/90' : 'text-skin-text'}>{faq.question}</span>
                                    </h5>
                                    <p className={`pl-9 leading-relaxed ${isThemeDark ? 'text-white/60' : 'text-skin-text/60'}`}>
                                        {faq.answer}
                                    </p>
                                    <p className={`pl-9 mt-3 text-sm font-bold flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity ${isThemeDark ? 'text-skin-primary' : 'text-skin-primary'}`}>
                                        <MessageCircle className="w-4 h-4" />
                                        이 질문으로 상담하기
                                    </p>
                                </button>
                            ))}
                        </div>

                        {/* Safety Notices */}
                        <div className={`rounded-2xl p-6 md:p-8 space-y-3 ${isThemeDark ? 'bg-white/[0.03] border border-white/5' : 'bg-skin-primary/[0.03] border border-skin-primary/5'}`}>
                            <div className="flex items-center gap-2 mb-4">
                                <ShieldCheck className={`w-5 h-5 ${isThemeDark ? 'text-white/50' : 'text-skin-primary/50'}`} />
                                <span className={`text-sm font-bold ${isThemeDark ? 'text-white/50' : 'text-skin-text/50'}`}>안전 고지</span>
                            </div>
                            {(content?.trust?.safetyNotices || [
                                "시뮬레이션은 이해를 돕기 위한 예시이며 실제 결과는 개인차가 있습니다.",
                                "의학적 진단·처방은 의료진 상담을 통해 진행됩니다."
                            ]).map((notice, idx) => (
                                <p key={idx} className={`text-sm leading-relaxed ${isThemeDark ? 'text-white/40' : 'text-skin-text/40'}`}>
                                    · {notice}
                                </p>
                            ))}
                        </div>

                        {/* Final CTA — 상담하기 → 챗 세션(로그인 전) */}
                        <div className="text-center mt-16 space-y-4">
                            <h4 className={`text-2xl font-bold mb-6 ${isThemeDark ? 'text-white' : 'text-skin-text'}`}>
                                지금 헬스케어 챗봇과 바로 상담해보세요
                            </h4>
                            <button
                                onClick={() => { setIsChatOpen(true); setTimeout(() => scrollToSection("chat-interface"), 100); }}
                                className={`inline-flex items-center gap-3 px-12 py-6 rounded-2xl font-black text-xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 ${buttonTextColor}`}
                                style={{ backgroundColor: theme.healthcare.colors.primary }}
                            >
                                <MessageCircle className="w-6 h-6" />
                                헬스케어 챗봇 시작
                            </button>
                            <p className={`text-sm font-medium ${isThemeDark ? 'text-white/50' : 'text-skin-text/50'}`}>
                                * 상담 질문 저장/병원 매칭은 로그인 후 제공됩니다.
                            </p>
                            <p className={`text-sm mt-4 ${isThemeDark ? 'text-white/30' : 'text-skin-text/30'}`}>
                                또는 <button onClick={() => scrollToSection("session-clinic-search")} className="text-skin-primary underline font-bold">{ctaLabels.cta1}</button>
                            </p>
                        </div>
                    </div>
                </motion.section>

                <Footer mode="healthcare" />

                {/* Floating Chat CTA */}
                <div className="fixed bottom-8 right-8 z-50">
                    <MagneticInteraction distance={50} strength={0.5}>
                        <Link
                            href="healthcare/chat"
                            className={`w-16 h-16 rounded-full flex items-center justify-center ${buttonTextColor} shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border border-white/20 backdrop-blur-md`}
                            style={{
                                backgroundColor: isThemeDark ? 'rgba(255,255,255,0.1)' : theme.healthcare.colors.primary
                            }}
                        >
                            <MessageCircle className="w-8 h-8" />
                        </Link>
                    </MagneticInteraction>
                </div>
            </div>
        </TrackF1View>
    );
}