"use client";

import Link from "next/link";
import { useState } from "react";
import { Sparkles, Droplet, Shield, ArrowUpRight, Heart, CheckCircle, BarChart2, Calendar, ChevronRight, Camera, User, Smile, Zap, Ruler, Moon, Brain, Battery } from "lucide-react";
import { TrackF1View } from "@/components/marketing/MarketingTracker";
import Footer from "@/components/common/Footer";
import ClinicSearchModule from "@/components/healthcare/ClinicSearchModule";
import PhotoSlideOver from "@/components/landing/PhotoSlideOver";
import HowItWorksCards from "@/components/landing/HowItWorksCards";
import { useHospital } from "@/components/common/HospitalProvider";
import { MagneticInteraction, ParallaxLayer } from "@/components/ui/ThreeDInteraction";
import { DentistryMorphing } from "@/components/healthcare/specialized/DentistryMorphing";
import { NeuralAttentionFlow } from "@/components/healthcare/specialized/NeuralAttentionFlow";
import { FluidBotanic } from "@/components/healthcare/specialized/FluidBotanic";
import HealthcareContent from "@/components/healthcare/HealthcareContent";

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

import PremiumBackground from "@/components/ui/backgrounds/PremiumBackground";

export default function HealthcareLanding() {
    const config = useHospital();
    const [isPhotoSlideOverOpen, setIsPhotoSlideOverOpen] = useState(false);

    // Dynamic Icon for CTA
    const CtaIcon = ICON_MAP[config.marketing?.cta?.icon as string] || Sparkles;

    return (
        <TrackF1View>
            <div
                className={`min-h-screen font-sans selection:bg-skin-primary selection:text-white transition-colors duration-700`}
                style={{
                    // Background handled by PremiumBackground
                    color: config.theme.text
                }}
            >
                <PremiumBackground colors={config.theme} intensity="subtle" />

                {/* Navigation */}
                <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/10" style={{ backgroundColor: `${config.theme.background}cc` }}>
                    <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
                        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
                            <span className="text-2xl">✨</span>
                            <span
                                className="text-xl font-bold tracking-wide"
                                style={{ color: config.theme.text }}
                            >
                                {config.marketingName || config.name}
                            </span>
                        </Link>
                        <Link
                            href="/login"
                            className="px-6 py-2.5 text-white text-sm font-medium rounded-full hover:shadow-lg transition-all duration-300"
                            style={{ backgroundColor: config.theme.primary }}
                        >
                            로그인
                        </Link>
                    </div>
                </nav>

                {/* Hero Section */}
                <header className="relative px-6 pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden min-h-[85vh] flex flex-col justify-center">
                    {/* Hero Background (Video or Image) */}
                    <div className="absolute inset-0 z-0">
                        {(() => {
                            const source = config.videoSource || "/2.mp4";
                            const isImage = source.match(/\.(jpg|jpeg|png|gif|webp)$/i);

                            if (isImage) {
                                return (
                                    <img
                                        src={source}
                                        alt="Background"
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                );
                            }

                            return (
                                <video
                                    key={source}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    preload="metadata"
                                    className="absolute inset-0 w-full h-full object-cover"
                                >
                                    <source src={source} type="video/mp4" />
                                </video>
                            );
                        })()}
                        {/* Overlays */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background: `linear-gradient(to right, ${config.theme.background}E6, ${config.theme.background}B3, ${config.theme.background}66)`
                            }}
                        />
                        <div
                            className="absolute inset-0"
                            style={{
                                background: `linear-gradient(to bottom, ${config.theme.background}4D, transparent, ${config.theme.background}CC)`
                            }}
                        />

                        {/* Specialized 3D Layers */}
                        {config.id === 'neurosurgery' && <NeuralAttentionFlow />}
                        {config.id && ['internal-medicine', 'pediatrics', 'obgyn'].includes(config.id) && <FluidBotanic />}
                    </div>

                    {/* Hero Content */}
                    <div className="relative z-10 max-w-3xl mx-auto w-full text-center">
                        <div className="space-y-6 animate-fade-in">
                            {/* Eyebrow */}
                            <p
                                className="font-semibold tracking-[0.15em] uppercase text-xs"
                                style={{ color: config.theme.secondary }}
                            >
                                {config.catchphrase || "PREMIUM AI HEALTHCARE"}
                            </p>

                            {/* H1 */}
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
                                <span
                                    className="bg-clip-text text-transparent drop-shadow-none"
                                    style={{
                                        backgroundImage: `linear-gradient(to right, ${config.theme.primary}, ${config.theme.accent})`,
                                        WebkitBackgroundClip: 'text'
                                    }}
                                >
                                    {config.hero?.title || config.marketingName}
                                </span>
                            </h1>

                            {/* Body */}
                            <p
                                className="text-base md:text-lg leading-relaxed max-w-lg mx-auto font-medium"
                                style={{ color: config.theme.text, opacity: 0.9 }}
                            >
                                {config.hero?.subtitle || "지금 내 상태를 빠르게 체크하고, 맞춤형 솔루션을 확인해보세요."}
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                                <MagneticInteraction distance={80} strength={0.3}>
                                    <Link
                                        href={config.marketing?.cta?.link || "healthcare/chat"}
                                        className="px-8 py-4 text-white text-base font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
                                        style={{ backgroundColor: config.theme.primary, opacity: 0.95 }}
                                    >
                                        <CtaIcon className="w-5 h-5" />
                                        {config.marketing?.cta?.buttonText || "AI 진단 시작"}
                                    </Link>
                                </MagneticInteraction>

                                <MagneticInteraction distance={60} strength={0.2}>
                                    <button
                                        onClick={() => setIsPhotoSlideOverOpen(true)}
                                        className="px-6 py-3 border-2 backdrop-blur-sm text-sm font-semibold rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
                                        style={{
                                            borderColor: config.theme.primary,
                                            color: config.theme.primary
                                        }}
                                    >
                                        <Camera className="w-4 h-4" />
                                        사진으로 스타일 보기
                                    </button>
                                </MagneticInteraction>
                            </div>

                            {/* Clinic Search Link */}
                            <div className="pt-2">
                                <a
                                    href="#clinic-search"
                                    className="hover:opacity-80 text-sm font-medium inline-flex items-center gap-1 transition-opacity"
                                    style={{ color: config.theme.text }}
                                >
                                    {config.marketing?.searchKeyword || "유명한 의원 찾기"}
                                    <ChevronRight className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </header>

                <PhotoSlideOver
                    isOpen={isPhotoSlideOverOpen}
                    onClose={() => setIsPhotoSlideOverOpen(false)}
                />

                <HowItWorksCards className="bg-skin-bg" />

                {/* Clinic Search Section */}
                <section id="clinic-search" className="relative py-16">
                    <div className="w-full max-w-4xl px-6 md:px-0 md:pl-[clamp(48px,10vw,160px)] md:pr-[clamp(16px,8vw,180px)] mx-auto">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: config.theme.text }}>
                                {config.marketing?.searchKeyword || "유명한 의원 찾기"}
                            </h2>
                            <p className="text-sm opacity-70" style={{ color: config.theme.text }}>
                                {config.address} {config.name}
                            </p>
                        </div>
                        <div className="bg-skin-surface rounded-3xl p-6 md:p-8 border border-white/10 shadow-xl">
                            <ClinicSearchModule department={config.id} searchKeyword={config.marketing?.searchKeyword} />
                        </div>
                    </div>
                </section>

                {/* Specialized Evidence Section */}
                {config.id === 'dentistry' && (
                    <section className="px-6 py-20 max-w-7xl mx-auto relative z-10">
                        <DentistryMorphing />
                    </section>
                )}

                {/* Healthcare Content reinforcing Sessions A-D */}
                <section className="py-12 bg-skin-bg relative z-20">
                    <HealthcareContent />
                </section>

                {/* Modules Grid */}
                <section className="relative py-32 overflow-hidden z-10">
                    <div className="absolute inset-0 z-0">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover object-[75%_35%] md:object-center scale-[0.8] md:scale-100 origin-center"
                        >
                            <source src="/1.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-black/45" />
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <span className="text-skin-primary font-bold tracking-widest uppercase text-sm mb-2 block">My Health Check</span>
                            <h2 className="text-4xl md:text-5xl font-bold" style={{ color: config.theme.text }}>
                                {config.marketing?.surveyHeadline || "맞춤형 헬스케어 체크"}
                            </h2>
                            <p className="mt-4 max-w-2xl mx-auto font-medium opacity-70" style={{ color: config.theme.text }}>
                                아래 모듈을 선택해 정밀한 자가 진단을 시작하고 나만의 요약 리포트를 받아보세요.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
                            {(config.landingModules || []).map((module: any) => {
                                const IconComponent = ICON_MAP[module.icon] || Sparkles;
                                const colorMap: Record<string, { border: string; shadow: string; text: string; gradient: string }> = {
                                    pink: { border: 'border-pink-500/30', shadow: 'group-hover:shadow-pink-500/30', text: 'text-pink-400', gradient: 'from-pink-500/20 to-pink-600/20' },
                                    rose: { border: 'border-rose-500/30', shadow: 'group-hover:shadow-rose-500/30', text: 'text-rose-400', gradient: 'from-rose-500/20 to-rose-600/20' },
                                    teal: { border: 'border-teal-500/30', shadow: 'group-hover:shadow-teal-500/30', text: 'text-teal-400', gradient: 'from-teal-500/20 to-teal-600/20' },
                                    purple: { border: 'border-purple-500/30', shadow: 'group-hover:shadow-purple-500/30', text: 'text-purple-400', gradient: 'from-purple-500/20 to-purple-600/20' },
                                    fuchsia: { border: 'border-fuchsia-500/30', shadow: 'group-hover:shadow-fuchsia-500/30', text: 'text-fuchsia-400', gradient: 'from-fuchsia-500/20 to-fuchsia-600/20' },
                                    cyan: { border: 'border-cyan-500/30', shadow: 'group-hover:shadow-cyan-500/30', text: 'text-cyan-400', gradient: 'from-cyan-500/20 to-cyan-600/20' },
                                    blue: { border: 'border-blue-500/30', shadow: 'group-hover:shadow-blue-500/30', text: 'text-blue-400', gradient: 'from-blue-500/20 to-blue-600/20' },
                                    orange: { border: 'border-orange-500/30', shadow: 'group-hover:shadow-orange-500/30', text: 'text-orange-400', gradient: 'from-orange-500/20 to-orange-600/20' },
                                    yellow: { border: 'border-yellow-500/30', shadow: 'group-hover:shadow-yellow-500/30', text: 'text-yellow-400', gradient: 'from-yellow-500/20 to-yellow-600/20' },
                                    red: { border: 'border-red-500/30', shadow: 'group-hover:shadow-red-500/30', text: 'text-red-400', gradient: 'from-red-500/20 to-red-600/20' },
                                    indigo: { border: 'border-indigo-500/30', shadow: 'group-hover:shadow-indigo-500/30', text: 'text-indigo-400', gradient: 'from-indigo-500/20 to-indigo-600/20' },
                                    gold: { border: 'border-yellow-600/30', shadow: 'group-hover:shadow-yellow-600/30', text: 'text-yellow-500', gradient: 'from-yellow-500/20 to-yellow-600/20' },
                                    amber: { border: 'border-amber-500/30', shadow: 'group-hover:shadow-amber-500/30', text: 'text-amber-400', gradient: 'from-amber-500/20 to-amber-600/20' },
                                    green: { border: 'border-green-500/30', shadow: 'group-hover:shadow-green-500/30', text: 'text-green-400', gradient: 'from-green-500/20 to-green-600/20' },
                                    stone: { border: 'border-stone-500/30', shadow: 'group-hover:shadow-stone-500/30', text: 'text-stone-400', gradient: 'from-stone-500/20 to-stone-600/20' },
                                    violet: { border: 'border-violet-500/30', shadow: 'group-hover:shadow-violet-500/30', text: 'text-violet-400', gradient: 'from-violet-500/20 to-violet-600/20' },
                                };
                                const colors = colorMap[module.color] || colorMap['pink'];

                                return (
                                    <Link key={module.id} href={`healthcare/chat?topic=${module.id}`} className="group">
                                        <div className="h-full bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-skin-primary/30 transition-all duration-300 hover:scale-105 flex flex-col items-center text-center">
                                            <div className={`w-14 h-14 bg-gradient-to-br ${colors.gradient} rounded-full flex items-center justify-center mb-6 ${colors.border}`}>
                                                <IconComponent className={`w-7 h-7 ${colors.text} group-hover:scale-110 transition-transform`} />
                                            </div>
                                            <h3 className="text-lg font-bold text-skin-text mb-2 tracking-wide">{module.title}</h3>
                                            <p className="text-xs text-skin-subtext leading-relaxed font-light">
                                                {module.description}
                                            </p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <Footer mode="healthcare" />

                <div className="fixed bottom-8 right-8 z-50">
                    <MagneticInteraction distance={50} strength={0.5}>
                        <Link href={config.marketing?.cta?.link || "healthcare/chat"} className="w-16 h-16 bg-skin-primary rounded-full flex items-center justify-center text-white shadow-xl shadow-skin-primary/40 hover:bg-skin-accent transition-all duration-300 hover:scale-110 border-2 border-white/20">
                            <CtaIcon className="w-8 h-8" />
                        </Link>
                    </MagneticInteraction>
                </div>
            </div>
        </TrackF1View>
    );
}