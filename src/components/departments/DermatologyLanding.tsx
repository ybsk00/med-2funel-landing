// @ts-nocheck
// 레거시 파일 - /[dept]/page.tsx로 대체됨
"use client";

import { HospitalProvider } from "@/components/common/HospitalProvider";
import ClinicSearchModule from '@/components/healthcare/ClinicSearchModule';
import HealthcareHero from "@/components/healthcare/HealthcareHero";
import HealthcareModules from "@/components/healthcare/HealthcareModules";
import HealthcareNavigation from "@/components/healthcare/HealthcareNavigation";
import PhotoSlideOver from "@/components/landing/PhotoSlideOver";
import PrivacyScreen from "@/components/ui/PrivacyScreen";
import { getDepartmentConfig } from "@/lib/config/factory";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import dynamic from "next/dynamic";

const PremiumBackground = dynamic(() => import("@/components/ui/backgrounds/PremiumBackground"), { ssr: false });

export default function DermatologyLanding() {
    const config = getDepartmentConfig("dermatology");
    const [isLocked, setIsLocked] = useState(true);
    const [opened, { open, close }] = useDisclosure(false);

    if (!config) return <div>Department Not Found</div>;

    const isThemeDark = true; // Dermatology is Emerald Dark

    return (
        <HospitalProvider initialConfig={config}>
            <div
                className={`min-h-screen selection:bg-skin-primary/30 font-sans ${isLocked ? 'overflow-hidden h-screen' : ''}`}
                style={{ backgroundColor: config.theme.background, color: config.theme.text }}
            >
                <style jsx global>{`
                    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');
                `}</style>

                <PhotoSlideOver isOpen={opened} onClose={close} />

                <PrivacyScreen
                    isLocked={isLocked}
                    onUnlock={() => setIsLocked(false)}
                    title={config.virtualName}
                    subtitle="VERIFYING VIP MEMBERSHIP..."
                />

                <HealthcareNavigation config={config} />

                <PremiumBackground colors={config.theme} intensity="strong" />

                <main className="relative">
                    {/* Hero Section */}
                    <div className="relative z-10">
                        <HealthcareHero config={config} onOpenCamera={open} />
                    </div>

                    {/* Modules Section - Emerald Dark Branded Surfaces */}
                    <section className="py-24 px-4 relative overflow-hidden" style={{ backgroundColor: config.theme.background }}>
                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-skin-primary/5 to-transparent pointer-events-none"></div>
                        <div className="absolute -top-20 -right-20 w-96 h-96 bg-skin-primary/5 rounded-full blur-3xl pointer-events-none"></div>

                        <div className="max-w-7xl mx-auto relative z-10">
                            <div className="text-center mb-16">
                                <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight" style={{ color: config.theme.text }}>
                                    {config.hero?.title}
                                </h2>
                                <div className="w-24 h-1 bg-gradient-to-r from-skin-primary to-transparent mx-auto mb-8"></div>
                                <p className="opacity-70 text-lg font-light max-w-2xl mx-auto leading-relaxed" style={{ color: config.theme.text }}>
                                    {config.hero?.subtitle}
                                </p>
                            </div>

                            <HealthcareModules config={config} />
                        </div>
                    </section>
                </main>
            </div>
        </HospitalProvider>
    );
}
