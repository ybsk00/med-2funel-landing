"use client";

import { HospitalProvider } from "@/components/common/HospitalProvider";
import HealthcareHero from "@/components/healthcare/HealthcareHero";
import HealthcareModules from "@/components/healthcare/HealthcareModules";
import HealthcareNavigation from "@/components/healthcare/HealthcareNavigation";
import { getDepartmentConfig } from "@/lib/config/factory";
import PhotoSlideOver from "@/components/landing/PhotoSlideOver";
import { useDisclosure } from "@mantine/hooks";

export default function OncologyLanding() {
    const config = getDepartmentConfig("oncology"); // Assuming 'cancer_center' is key, or 'oncology' if mapped
    const [opened, { open, close }] = useDisclosure(false);

    if (!config) return <div>Department Not Found</div>;

    // Custom theme config for Oncology (Linen/Warm)
    const linenConfig = {
        ...config,
        theme: {
            ...config.theme,
            primary: "#13eca4", // Brand Primary
            secondary: "#EBE8E3", // Stone Grey
            background: "#F5F2ED", // Linen
            text: "#2D3633", // Stone Text
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
                    {/* Hero Section */}
                    <div className="relative z-10 p-4 md:p-8">
                        <div className="max-w-[1440px] mx-auto rounded-3xl overflow-hidden relative shadow-xl border border-white/50">
                            <HealthcareHero config={linenConfig} onOpenCamera={open} />
                            {/* Warm Overlay - REMOVED */}
                            {/* <div className="absolute inset-0 bg-[#F5F2ED]/20 pointer-events-none z-20 mix-blend-overlay"></div> */}
                        </div>
                    </div>

                    {/* Modules Section */}
                    <section className="pb-16 px-4 md:px-8">
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
