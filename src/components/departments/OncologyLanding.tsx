"use client";

import { HospitalProvider } from "@/components/common/HospitalProvider";
import ClinicSearchModule from '@/components/healthcare/ClinicSearchModule';
import HealthcareHero from "@/components/healthcare/HealthcareHero";
import HealthcareModules from "@/components/healthcare/HealthcareModules";
import HealthcareNavigation from "@/components/healthcare/HealthcareNavigation";
import { getDepartmentConfig } from "@/lib/config/factory";
import PhotoSlideOver from "@/components/landing/PhotoSlideOver";
import { useDisclosure } from "@mantine/hooks";

export default function OncologyLanding() {
    const config = getDepartmentConfig("oncology");
    const [opened, { open, close }] = useDisclosure(false);

    if (!config) return <div>Department Not Found</div>;

    // HARD-CODED CONFIGURATION FOR VISUAL OVERHAUL
    const linenConfig = {
        ...config,
        theme: {
            ...config.theme,
            primary: "#13eca4", // Brand
            secondary: "#EBE8E3", // Stone
            background: "#F5F2ED",
            text: "#2D3633", // Dark Stone (Hard Coded for Visibility)
            accent: "#1c2522", // Dark Charcoal for accents
            font: "display",
            texture: "paper"
        }
    };

    return (
        <HospitalProvider initialConfig={linenConfig}>
            <div className="min-h-screen bg-[#F5F2ED] text-[#2D3633] font-sans selection:bg-[#13eca4]/30">
                {/* Custom Theme Injection for Oncology */}
                <style jsx global>{`
                    /* Linen Texture */
                    .bg-linen-texture {
                         background-color: #F5F2ED;
                         background-image: 
                             linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px);
                         background-size: 40px 40px;
                    }
                    
                    /* Ripple Animation */
                    @keyframes ripple {
                        0% { transform: scale(0.8); opacity: 0.6; }
                        100% { transform: scale(1.5); opacity: 0; }
                    }
                    .animate-ripple {
                        animation: ripple 4s infinite linear;
                    }
                `}</style>

                <PhotoSlideOver isOpen={opened} onClose={close} department="oncology" />

                <HealthcareNavigation config={linenConfig} />

                <main className="relative bg-linen-texture pt-20">
                    {/* Hero Section - FULL WIDTH (Hard Coded Unwrap) */}
                    <div className="relative z-10">
                        {/* Removed p-4/rounded constraints for edge-to-edge look */}
                        <div className="w-full relative overflow-hidden shadow-sm border-b border-[#EBE8E3]">
                            <HealthcareHero config={linenConfig} onOpenCamera={open} />
                        </div>
                    </div>

                    {/* Modules Section */}
                    <section className="pb-16 px-4 md:px-8 mt-12">
                        <div className="max-w-[1440px] mx-auto">
                            <div className="text-center mb-12">
                                <span className="material-symbols-outlined text-[#13eca4] text-4xl mb-4">healing</span>
                                <h2 className="text-3xl md:text-4xl font-bold text-[#2D3633]">
                                    Dignity in Every Step
                                </h2>
                                <p className="text-[#636E69] mt-2 max-w-2xl mx-auto">
                                    Comprehensive care centered around healing the whole person.
                                </p>

                            </div>

                            <HealthcareModules config={linenConfig} />
                        </div>
                    </section>
                </main>
            </div>
        </HospitalProvider>
    );
}
