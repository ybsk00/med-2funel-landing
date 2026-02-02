// @ts-nocheck
// 레거시 파일 - /[dept]/page.tsx로 대체됨
"use client";

import { HospitalProvider } from "@/components/common/HospitalProvider";
import HealthcareHero from "@/components/healthcare/HealthcareHero";
import HealthcareModules from "@/components/healthcare/HealthcareModules";
import ClinicSearchModule from '@/components/healthcare/ClinicSearchModule';
import HealthcareNavigation from "@/components/healthcare/HealthcareNavigation";
import PhotoSlideOver from "@/components/landing/PhotoSlideOver";
import { useDisclosure } from "@mantine/hooks";
import { getDepartmentConfig } from "@/lib/config/factory";
import PremiumBackground from "@/components/ui/backgrounds/PremiumBackground";

export default function PlasticSurgeryLanding() {
    const config = getDepartmentConfig("plastic-surgery");
    const [opened, { open, close }] = useDisclosure(false);

    if (!config) return <div>Department Not Found</div>;

    // Custom theme config for Plastic Surgery (Mint/Glass Style now)
    return (
        <HospitalProvider initialConfig={config}>
            <div
                className="min-h-screen font-sans selection:bg-skin-primary/30"
                style={{ backgroundColor: config.theme.background, color: config.theme.text }}
            >
                {/* Custom Theme Injection for Plastic Surgery */}
                <style jsx global>{`
                    :root {
                        --color-primary: #13eca4;
                        --glass-border: rgba(255, 255, 255, 0.5);
                    }
                    
                    /* Shimmer Effect */
                    @keyframes shimmer {
                        0% { background-position: -200% 0; }
                        100% { background-position: 200% 0; }
                    }
                    .animate-shimmer {
                        background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%);
                        background-size: 200% 100%;
                        animation: shimmer 3s infinite linear;
                    }

                    /* Hologram Gradient */
                    .bg-hologram {
                        background-image: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%);
                    }
                    
                    /* Glass Card */
                    .glass-card {
                        background: rgba(255, 255, 255, 0.4);
                        backdrop-filter: blur(12px);
                        border: 1px solid rgba(255, 255, 255, 0.6);
                        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.05);
                        transition: all 0.5s ease;
                    }
                    .glass-card:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 15px 40px 0 rgba(19, 236, 164, 0.15);
                        background: linear-gradient(45deg, rgba(19, 236, 164, 0.05) 0%, rgba(160, 210, 255, 0.05) 50%, rgba(220, 180, 255, 0.05) 100%);
                    }
                `}</style>

                <PhotoSlideOver isOpen={opened} onClose={close} department="plastic-surgery" />

                <HealthcareNavigation config={config} />

                <PremiumBackground colors={config.theme} intensity="strong" />

                <main className="relative overflow-hidden pt-20">
                    {/* Hero Section */}
                    <div className="relative z-10">
                        <HealthcareHero config={config} onOpenCamera={open} />
                    </div>

                    {/* Modules Section - Glass Cards */}
                    <section className="py-24 px-4 relative">
                        {/* Decorative Blobs Removed - Replaced by PremiumBackground */}

                        <div className="max-w-7xl mx-auto relative z-10">
                            <div className="mb-16 text-center">
                                <div className="inline-flex items-center rounded-full border border-[#13eca4]/30 bg-white/40 px-3 py-1 text-sm font-medium text-[#0eb57d] backdrop-blur-md mb-4">
                                    <span className="mr-2 h-2 w-2 rounded-full bg-[#13eca4] animate-pulse"></span>
                                    Plastic Surgery
                                </div>

                                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">
                                    AESTHETICA <span className="text-[#13eca4] font-light">PLASTIC</span>
                                </h2>
                                <p className="text-slate-600 max-w-2xl mx-auto text-lg font-light">
                                    Experience the clarity of natural beauty with our advanced aesthetic technology.
                                </p>
                            </div>

                            <div className="[&>div]:gap-8">
                                <HealthcareModules config={config} />
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </HospitalProvider>
    );
}
