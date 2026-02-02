// @ts-nocheck
// 레거시 파일 - /[dept]/page.tsx로 대체됨
"use client";

import { HospitalProvider } from "@/components/common/HospitalProvider";
import HealthcareHero from "@/components/healthcare/HealthcareHero";
import HealthcareModules from "@/components/healthcare/HealthcareModules";
import HealthcareNavigation from "@/components/healthcare/HealthcareNavigation";
import { getDepartmentConfig } from "@/lib/config/factory";
import PhotoSlideOver from "@/components/landing/PhotoSlideOver";
import { useDisclosure } from "@mantine/hooks";

export default function NeurosurgeryLanding() {
    const config = getDepartmentConfig("neurosurgery");
    const [opened, { open, close }] = useDisclosure(false);

    if (!config) return <div>Department Not Found</div>;

    return (
        <HospitalProvider initialConfig={config}>
            <div
                className="min-h-screen font-sans transition-colors duration-700"
                style={{ backgroundColor: config.theme.background, color: config.theme.text }}
            >
                {/* Custom Theme Injection for Neurosurgery */}
                <style jsx global>{`
                    /* Neural Grid Background */
                    .bg-neural-grid {
                        background-image: radial-gradient(circle at center, rgba(19, 236, 164, 0.05) 1px, transparent 1px);
                        background-size: 32px 32px;
                    }

                    /* Scanning Line Animation */
                    @keyframes scan {
                        0% { top: 0%; opacity: 0; }
                        10% { opacity: 1; }
                        90% { opacity: 1; }
                        100% { top: 100%; opacity: 0; }
                    }
                    .animate-scan {
                        animation: scan 3s ease-in-out infinite;
                    }

                    /* Holographic Glow */
                     .shadow-glow {
                        box-shadow: 0 0 20px rgba(19, 236, 164, 0.15);
                    }
                `}</style>

                <PhotoSlideOver isOpen={opened} onClose={close} department="neurosurgery" />

                <HealthcareNavigation config={config} />

                <main className="relative bg-neural-grid pt-20">
                    {/* Hero Section */}
                    <div className="relative z-10">
                        <HealthcareHero config={config} onOpenCamera={open} />
                        {/* Holographic Overlay - REMOVED */}
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none z-10"></div>
                    </div>

                    {/* Modules / Diagnostics Section */}
                    <section className="py-24 px-4 md:px-8 relative">
                        {/* Spinning Rings Decoration */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] border border-white/5 rounded-full animate-[spin_20s_linear_infinite] pointer-events-none opacity-30"></div>

                        <div className="max-w-7xl mx-auto relative z-10">
                            <div className="mb-16">
                                <span className="text-[#13eca4] font-bold tracking-widest uppercase text-sm mb-2 block">Diagnostic Services</span>
                                <h2 className="text-4xl md:text-5xl font-black text-white">
                                    Holographic <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#6366f1]">Analysis</span>
                                </h2>
                            </div>

                            <HealthcareModules config={config} />
                        </div>
                    </section>
                </main>
            </div>
        </HospitalProvider>
    );
}
