"use client";

import Link from "next/link";
import { useState } from "react";
import { Sparkles, Droplet, Shield, ArrowUpRight, Heart, CheckCircle, BarChart2, Calendar, ChevronRight, Camera, User, Smile, Zap, Ruler, Moon, Brain, Battery } from "lucide-react";
import { TrackF1View } from "@/components/marketing/MarketingTracker";
import Footer from "@/components/common/Footer";
import ClinicSearchModule from "@/components/healthcare/ClinicSearchModule";
import PhotoSlideOver from "@/components/landing/PhotoSlideOver";
import HowItWorksCards from "@/components/landing/HowItWorksCards";
import { useHospitalConfig, useHealthcareConfig, useHospitalInfo, useThemeConfig } from "@/modules/theme/ThemeProvider";
import { isColorDark } from "@/lib/utils/theme";
import dynamic from 'next/dynamic';

const MagneticInteraction = dynamic(() => import("@/components/ui/ThreeDInteraction").then(mod => mod.MagneticInteraction), { ssr: false });
const ParallaxLayer = dynamic(() => import("@/components/ui/ThreeDInteraction").then(mod => mod.ParallaxLayer), { ssr: false });
const DentistryMorphing = dynamic(() => import("@/components/healthcare/specialized/DentistryMorphing").then(mod => mod.DentistryMorphing), { ssr: false });
const NeuralAttentionFlow = dynamic(() => import("@/components/healthcare/specialized/NeuralAttentionFlow").then(mod => mod.NeuralAttentionFlow), { ssr: false });
const FluidBotanic = dynamic(() => import("@/components/healthcare/specialized/FluidBotanic").then(mod => mod.FluidBotanic), { ssr: false });
const PremiumBackground = dynamic(() => import("@/components/ui/backgrounds/PremiumBackground"), { ssr: false });
import HealthcareContent from "@/components/healthcare/HealthcareContent";
import PrivacyScreen from "@/components/ui/PrivacyScreen";
import HealthcareHero from "@/components/healthcare/HealthcareHero";
import HealthcareModules from "@/components/healthcare/HealthcareModules";
import HealthcareNavigation from "@/components/healthcare/HealthcareNavigation";

// Icon Map for Dynamic Loading
const ICON_MAP: Record<string, any> = {
    'Sparkles': Sparkles,
    'Droplet': Droplet,
    'Shield': Shield,
    'ArrowUpRight': ArrowUpRight,
    'Heart': Heart,
    'Activity': BarChart2,
    'Zap': Zap,
    'Lock': Shield,
    'Sun': Sparkles,
    'User': User,
    'Camera': Camera,
    'Thermometer': ArrowUpRight,
    'Calendar': Calendar,
    'Beaker': Droplet,
    'BarChart': BarChart2,
    'Smile': Smile,
    'Ruler': Ruler,
    'Moon': Moon,
    'Brain': Brain,
    'Battery': Battery
};

export default function HealthcareLanding() {
    const fullConfig = useHospitalConfig();
    const healthcare = useHealthcareConfig();
    const hospital = useHospitalInfo();
    const theme = useThemeConfig();
    
    const [isPhotoSlideOverOpen, setIsPhotoSlideOverOpen] = useState(false);
    const [isLocked, setIsLocked] = useState(hospital.department === 'dermatology');

    const isThemeDark = isColorDark(theme.healthcare.colors.background);
    const isPrimaryBright = theme.healthcare.colors.primary ? !isColorDark(theme.healthcare.colors.primary) : false;
    const buttonTextColor = (isPrimaryBright && !isThemeDark) ? "text-slate-900 font-extrabold" : "text-white";

    // Dynamic Icon for CTA
    // CTA info might be in a different place now or needs mapping
    // In v2.0, hero and modules are more structured. 
    // Let's use a default for now if CTA isn't explicitly in schema.
    const CtaIcon = Sparkles; 

    return (
        <TrackF1View>
            <div
                className={`min-h-screen font-sans selection:bg-skin-primary selection:text-white transition-colors duration-700 ${isLocked ? 'overflow-hidden h-screen' : ''}`}
                style={{
                    color: theme.healthcare.colors.text
                }}
            >
                {hospital.department === 'dermatology' && (
                    <PrivacyScreen
                        isLocked={isLocked}
                        onUnlock={() => setIsLocked(false)}
                        title={healthcare.branding.logoText || "SECURE ACCESS"}
                        subtitle="VERIFYING VIP MEMBERSHIP..."
                    />
                )}

                <PremiumBackground colors={theme.healthcare.colors} intensity="subtle" />

                <HealthcareNavigation config={fullConfig} />

                <main className="relative">
                    {/* Centralized Hero */}
                    <HealthcareHero config={fullConfig} onOpenCamera={() => setIsPhotoSlideOverOpen(true)} />
                </main>

                <PhotoSlideOver
                    isOpen={isPhotoSlideOverOpen}
                    onClose={() => setIsPhotoSlideOverOpen(false)}
                />

                {/* Session 2: Clinic Search (Moved from Legacy Location) */}
                <section id="clinic-search" className="relative py-24 z-20">
                    <div className="w-full max-w-4xl px-6 mx-auto">
                        <div className="text-center mb-12 px-4">
                            <span className={`px-5 py-2 rounded-full text-[10px] sm:text-xs font-black tracking-[0.25em] uppercase mb-8 inline-block shadow-lg backdrop-blur-md border ${isThemeDark ? 'bg-white/10 text-white border-white/20' : 'bg-skin-primary/10 text-skin-primary border-skin-primary/20'}`}>
                                Healthcare Network
                            </span>
                            <h3 className={`text-4xl md:text-6xl font-black mb-6 leading-tight ${isThemeDark ? 'text-white drop-shadow-2xl' : 'text-skin-text'}`}>
                                유명한 <span className="text-skin-primary">{hospital.name}</span> 찾기
                            </h3>
                            <p className={`max-w-xl mx-auto text-lg md:text-xl font-bold leading-relaxed ${isThemeDark ? 'text-white/70 drop-shadow-md' : 'text-skin-text/70'}`}>
                                검증된 {hospital.name} 전문 병원을 찾아보세요. <br className="hidden md:block" />
                                전문 의료진과 최첨단 장비를 갖춘 최적의 진료 환경을 약속합니다.
                            </p>
                        </div>

                        <div className="relative group">
                            {/* Deep Glass Background */}
                            <div className="absolute -inset-2 bg-gradient-to-r from-skin-primary/30 to-skin-accent/30 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                            <div className={`relative backdrop-blur-[60px] rounded-[3rem] p-10 md:p-16 overflow-hidden ${isThemeDark ? 'bg-white/[0.05] border border-white/20 shadow-[0_32px_80px_rgba(0,0,0,0.5)]' : 'bg-skin-primary/5 border border-skin-primary/10 shadow-xl'}`}>
                                {/* Decorative Glow */}
                                <div className="absolute -top-32 -right-32 w-96 h-96 bg-skin-primary/20 rounded-full blur-[100px] pointer-events-none"></div>

                                <ClinicSearchModule department={hospital.department} searchKeyword={hospital.searchKeywords[0]} />
                            </div>
                        </div>
                    </div>
                </section>


                {/* Specialized Evidence Section */}
                {hospital.department === 'dentistry' && (
                    <section className="px-6 py-20 max-w-7xl mx-auto relative z-10">
                        <DentistryMorphing />
                    </section>
                )}

                {/* Healthcare Content reinforcing Sessions A-D */}
                <section className="py-12 bg-skin-bg relative z-20">
                    <HealthcareContent />
                </section>

                {/* Modules Grid (HealthcareModules) */}
                <section className="relative py-32 overflow-hidden z-10">
                    <div className="max-w-7xl mx-auto px-6">
                        <HealthcareModules />
                    </div>
                </section>

                <Footer mode="healthcare" />

                <div className="fixed bottom-8 right-8 z-50">
                    <MagneticInteraction distance={50} strength={0.5}>
                        <Link
                            href="healthcare/chat"
                            className={`w-16 h-16 rounded-full flex items-center justify-center ${buttonTextColor} shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border border-white/20 backdrop-blur-md`}
                            style={{
                                backgroundColor: isThemeDark ? 'rgba(255,255,255,0.1)' : theme.healthcare.colors.primary
                            }}
                        >
                            <CtaIcon className="w-8 h-8" />
                        </Link>
                    </MagneticInteraction>
                </div>
            </div>
        </TrackF1View>
    );
}