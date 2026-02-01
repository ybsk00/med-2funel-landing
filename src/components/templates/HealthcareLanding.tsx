"use client";

import Link from "next/link";
import { useState } from "react";
import { Sparkles, Droplet, Shield, ArrowUpRight, Heart, CheckCircle, BarChart2, Calendar, ChevronRight, Camera, User, Smile, Zap, Ruler, Moon, Brain, Battery } from "lucide-react";
import { TrackF1View } from "@/components/marketing/MarketingTracker";
import Footer from "@/components/common/Footer";
import PhotoSlideOver from "@/components/landing/PhotoSlideOver";
import HowItWorksCards from "@/components/landing/HowItWorksCards";
import { useHospital } from "@/components/common/HospitalProvider";
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
    const config = useHospital();
    const [isPhotoSlideOverOpen, setIsPhotoSlideOverOpen] = useState(false);
    const [isLocked, setIsLocked] = useState(config.id === 'dermatology');

    // Unified Darkness Check (Re-refined)
    const isColorDark = (hex?: string) => {
        if (!hex) return false;
        let h = hex.replace('#', '');
        if (h.length === 3) {
            h = h.split('').map(c => c + c).join('');
        }
        if (h.length !== 6) return false;
        const r = parseInt(h.substring(0, 2), 16);
        const g = parseInt(h.substring(2, 4), 16);
        const b = parseInt(h.substring(4, 6), 16);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance < 0.5;
    };

    const isThemeDark = isColorDark(config.theme.background);
    const isPrimaryBright = config.theme.primary ? !isColorDark(config.theme.primary) : false;
    const buttonTextColor = (isPrimaryBright && !isThemeDark) ? "text-slate-900 font-extrabold" : "text-white";

    // Dynamic Icon for CTA
    const CtaIcon = ICON_MAP[config.marketing?.cta?.icon as string] || Sparkles;

    return (
        <TrackF1View>
            <div
                className={`min-h-screen font-sans selection:bg-skin-primary selection:text-white transition-colors duration-700 ${isLocked ? 'overflow-hidden h-screen' : ''}`}
                style={{
                    color: config.theme.text
                }}
            >
                {config.id === 'dermatology' && (
                    <PrivacyScreen
                        isLocked={isLocked}
                        onUnlock={() => setIsLocked(false)}
                        title={config.marketingName || "SECURE ACCESS"}
                        subtitle="VERIFYING VIP MEMBERSHIP..."
                    />
                )}

                <PremiumBackground colors={config.theme} intensity="subtle" />

                <HealthcareNavigation config={config} />

                {/* Navigation (Simplified to match departments) */}
                {/* HealthcareNavigation is now used instead of this manual nav */}

                <main className="relative">
                    {/* Centralized Hero */}
                    <HealthcareHero config={config} onOpenCamera={() => setIsPhotoSlideOverOpen(true)} />
                </main>

                <PhotoSlideOver
                    isOpen={isPhotoSlideOverOpen}
                    onClose={() => setIsPhotoSlideOverOpen(false)}
                />


                {/* Specialized Evidence Section */}
                {config.id === 'dentistry' && (
                    <section className="px-6 py-20 max-w-7xl mx-auto relative z-10">
                        <DentistryMorphing />
                    </section>
                )}

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

                {/* Modules Grid (HealthcareModules) */}
                <section className="relative py-32 overflow-hidden z-10">
                    <div className="max-w-7xl mx-auto px-6">
                        <HealthcareModules config={config} />
                    </div>
                </section>

                <Footer mode="healthcare" />

                <div className="fixed bottom-8 right-8 z-50">
                    <MagneticInteraction distance={50} strength={0.5}>
                        <Link
                            href={config.marketing?.cta?.link || "healthcare/chat"}
                            className={`w-16 h-16 rounded-full flex items-center justify-center ${buttonTextColor} shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border border-white/20 backdrop-blur-md`}
                            style={{
                                backgroundColor: isThemeDark ? 'rgba(255,255,255,0.1)' : config.theme.primary
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