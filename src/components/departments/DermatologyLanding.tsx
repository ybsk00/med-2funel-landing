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

export default function DermatologyLanding() {
    const config = getDepartmentConfig("dermatology");
    const [isLocked, setIsLocked] = useState(true);
    const [opened, { open, close }] = useDisclosure(false);

    if (!config) return <div>Department Not Found</div>;

    // Define custom high-end theme config for this specific page override (Gold/Luxury)
    const luxuryConfig = {
        ...config,
        theme: {
            ...config.theme,
            primary: "#d4af37", // Gold
            secondary: "#b88a7d", // Rose Copper
            background: "#1a1614", // Luxury Dark
            text: "#ffffff"
        }
    };

    return (
        <HospitalProvider initialConfig={luxuryConfig}>
            <div className={`min-h-screen bg-[#1a1614] text-white selection:bg-[#b88a7d]/30 font-sans ${isLocked ? 'overflow-hidden h-screen' : ''}`}>
                {/* Custom Theme Injection from Reference Design */}
                <style jsx global>{`
                    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');

                    :root {
                        --font-serif: "Playfair Display", serif;
                        --font-sans: "Inter", sans-serif;
                        --texture-silk: url('/textures/silk.png');
                        --color-gold: #d4af37;
                        --color-rose-copper: #b88a7d;
                        --color-luxury-dark: #1a1614;
                    }

                    .font-serif { font-family: var(--font-serif); }
                    .font-sans { font-family: var(--font-sans); }
                    
                    /* Gold Text Gradient Animation */
                    .text-gradient-gold {
                        background: linear-gradient(to right, #aa8c2c, #d4af37, #aa8c2c);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        background-size: 200% auto;
                        animation: shine 5s linear infinite;
                    }
                    @keyframes shine {
                        to { background-position: 200% center; }
                    }
                `}</style>

                <PhotoSlideOver isOpen={opened} onClose={close} />

                <PrivacyScreen
                    isLocked={isLocked}
                    onUnlock={() => setIsLocked(false)}
                    title="LUMIÈRE DERMA"
                    subtitle="VERIFYING VIP MEMBERSHIP..."
                />

                <HealthcareNavigation config={luxuryConfig} />

                <main className="relative">
                    {/* Hero Section with Custom Branding */}
                    <div className="relative z-10">
                        <HealthcareHero
                            config={luxuryConfig}
                            onOpenCamera={open}
                        />

                    </div>

                    {/* Modules Section - VIP Card Style */}
                    <section className="py-24 px-4 relative overflow-hidden bg-[#1a1614]">
                        {/* Decorative Background Elements from Reference */}
                        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#b88a7d]/10 to-transparent pointer-events-none"></div>
                        <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none"></div>

                        <div className="max-w-7xl mx-auto relative z-10">
                            <div className="text-center mb-16">
                                <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-white leading-tight">
                                    The Golden Ratio of <span className="text-gradient-gold italic">Skin</span>
                                </h2>
                                <div className="w-24 h-1 bg-gradient-to-r from-[#d4af37] to-transparent mx-auto mb-8"></div>
                                <p className="text-[#e8dcd9] text-lg font-light max-w-2xl mx-auto leading-relaxed">
                                    {config.catchphrase || "Redefining confidence with mathematical precision and absolute privacy."}
                                </p>
                            </div>

                            <HealthcareModules config={luxuryConfig} />
                        </div>
                    </section>
                </main>
            </div>
        </HospitalProvider>
    );
}
