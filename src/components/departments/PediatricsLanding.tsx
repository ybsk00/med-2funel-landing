"use client";

import { HospitalProvider } from "@/components/common/HospitalProvider";
import HealthcareHero from "@/components/healthcare/HealthcareHero";
import HealthcareModules from "@/components/healthcare/HealthcareModules";
import HealthcareNavigation from "@/components/healthcare/HealthcareNavigation";
import { getDepartmentConfig } from "@/lib/config/factory";
import { useState } from "react";
import PhotoSlideOver from "@/components/landing/PhotoSlideOver";
import { useDisclosure } from "@mantine/hooks";

export default function PediatricsLanding() {
    const config = getDepartmentConfig("pediatrics");
    const [opened, { open, close }] = useDisclosure(false);

    if (!config) return <div>Department Not Found</div>;

    return (
        <HospitalProvider initialConfig={config}>
            <div
                className="min-h-screen font-round transition-colors duration-700"
                style={{ backgroundColor: config.theme.background, color: config.theme.text }}
            >
                {/* Custom Theme Injection for Pediatrics */}
                <style jsx global>{`
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&family=Noto+Sans:wght@400;500;700&display=swap');
                    
                    :root {
                        --font-round: "Inter", sans-serif; /* Using Inter as round-ish proxy or system round */
                        --color-mint: #13eca4;
                        --color-bubble-yellow: #FFFDE7;
                        --color-bubble-blue: #E1F5FE;
                        --color-bubble-pink: #FCE4EC;
                    }

                    .font-round { font-family: var(--font-round); }
                    
                    /* Floating Animation */
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-15px); }
                    }
                    .animate-float {
                        animation: float 6s ease-in-out infinite;
                    }
                    
                    /* Squishy Card Effect */
                    .squishy-card {
                        transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                    }
                    .squishy-card:hover {
                        transform: scale(1.03) rotate(1deg);
                    }
                    .squishy-card:active {
                        transform: scale(0.95);
                    }
                `}</style>

                <PhotoSlideOver isOpen={opened} onClose={close} department="pediatrics" />

                <HealthcareNavigation config={config} />

                <main className="relative overflow-hidden">
                    {/* Hero Section with Bubbles */}
                    <div className="relative z-10">
                        {/* Decorative Floating Bubbles */}
                        <div className="absolute top-20 left-10 w-24 h-24 bg-blue-100/50 rounded-full animate-float blur-sm z-20 pointer-events-none"></div>
                        <div className="absolute bottom-40 right-10 w-32 h-32 bg-pink-100/50 rounded-full animate-float blur-sm z-20 pointer-events-none" style={{ animationDelay: '1s' }}></div>
                        <div className="absolute top-40 right-20 w-16 h-16 bg-yellow-100/50 rounded-full animate-float blur-sm z-20 pointer-events-none" style={{ animationDelay: '2s' }}></div>

                        <HealthcareHero config={config} onOpenCamera={open} />
                    </div>

                    {/* Modules Section - Jelly Card Style */}
                    <section className="py-24 px-4 relative" style={{ backgroundColor: config.theme.background }}>
                        <div className="max-w-7xl mx-auto">
                            <div className="text-center mb-16 flex flex-col items-center gap-3">
                                <span className="px-4 py-1.5 rounded-full bg-[#E1F5FE] text-blue-800 font-bold text-sm border border-blue-100 uppercase tracking-wider">
                                    Pediatric Care Reimagined
                                </span>
                                <h2 className="text-4xl md:text-5xl font-black text-[#111816] tracking-tight">
                                    Compassionate Care for <span className="text-[#13eca4]">Little Heroes</span>
                                </h2>
                                <p className="text-lg text-gray-600 font-medium max-w-lg">
                                    A safe, playful, and boo-boo-free space for your child's health journey.
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
