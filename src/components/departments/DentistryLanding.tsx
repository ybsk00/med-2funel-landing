"use client";

import { HospitalProvider } from "@/components/common/HospitalProvider";
import HealthcareHero from "@/components/healthcare/HealthcareHero";
import HealthcareModules from "@/components/healthcare/HealthcareModules";
import HealthcareNavigation from "@/components/healthcare/HealthcareNavigation";
import { getDepartmentConfig } from "@/lib/config/factory";
import PhotoSlideOver from "@/components/landing/PhotoSlideOver";
import { useDisclosure } from "@mantine/hooks";

export default function DentistryLanding() {
    const config = getDepartmentConfig("dentistry");
    const [opened, { open, close }] = useDisclosure(false);

    if (!config) return <div>Department Not Found</div>;

    // Custom theme config for Dentistry (Ice/Clean)
    const iceConfig = {
        ...config,
        theme: {
            ...config.theme,
            primary: "#00CED1", // Dark Turquoise/Cyan
            secondary: "#E0F2FE", // Ice Blue
            background: "#F0F9FF", // Very light blue
            text: "#0F172A", // Slate 900
            font: "sans",
            texture: "glass"
        }
    };

    return (
        <HospitalProvider initialConfig={iceConfig}>
            <div className="min-h-screen bg-[#F0F9FF] text-[#0F172A] font-sans">
                {/* Custom Theme Injection for Dentistry */}
                <style jsx global>{`
                    /* Ice/Gloss Effects */
                    .glass-panel {
                        background: rgba(255, 255, 255, 0.65);
                        backdrop-filter: blur(16px);
                        border: 1px solid rgba(255, 255, 255, 0.8);
                        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.05);
                    }
                    
                    .gloss-shine {
                        position: relative;
                        overflow: hidden;
                    }
                    .gloss-shine::after {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: -100%;
                        width: 50%;
                        height: 100%;
                        background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%);
                        transform: skewX(-25deg);
                        animation: shine 6s infinite;
                    }
                    @keyframes shine {
                        0% { left: -100%; }
                        20% { left: 200%; }
                        100% { left: 200%; }
                    }

                    /* Background Pattern */
                    .bg-ice-pattern {
                        background-image: 
                            radial-gradient(at 0% 0%, rgba(19, 236, 164, 0.15) 0px, transparent 50%),
                            radial-gradient(at 100% 0%, rgba(14, 165, 233, 0.1) 0px, transparent 50%),
                            radial-gradient(at 100% 100%, rgba(19, 236, 164, 0.1) 0px, transparent 50%);
                        background-attachment: fixed;
                    }
                `}</style>

                <PhotoSlideOver isOpen={opened} onClose={close} department="dentistry" />

                <HealthcareNavigation config={iceConfig} />

                <main className="relative bg-ice-pattern pt-20">
                    {/* Hero Section */}
                    <div className="relative z-10">
                        <HealthcareHero config={iceConfig} onOpenCamera={open} />
                        {/* Ice Overlay - REMOVED */}
                        {/* <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/80 pointer-events-none"></div> */}
                    </div>

                    {/* Modules Section */}
                    <section className="relative w-full py-24 px-4 md:px-10 lg:px-40">
                        <div className="max-w-[1200px] mx-auto flex flex-col gap-16">
                            <div className="text-center flex flex-col gap-4 items-center">
                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50/50 border border-blue-100 w-fit">
                                    <span className="w-2 h-2 rounded-full bg-[#00CED1] animate-pulse"></span>
                                    <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Crystal Clear Care</span>
                                </span>
                                <h2 className="text-slate-900 text-4xl md:text-5xl font-bold tracking-tight">
                                    Radiance <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00CED1] to-teal-400">Revealed</span>
                                </h2>
                                <p className="text-slate-500 text-lg max-w-[600px]">
                                    Advanced treatments utilizing gloss-finish technology for the perfect smile.
                                </p>
                            </div>

                            <HealthcareModules config={iceConfig} />
                        </div>
                    </section>
                </main>
            </div>
        </HospitalProvider>
    );
}
