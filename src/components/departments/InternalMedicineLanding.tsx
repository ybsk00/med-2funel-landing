"use client";

import { HospitalProvider } from "@/components/common/HospitalProvider";
import HealthcareHero from "@/components/healthcare/HealthcareHero";
import HealthcareModules from "@/components/healthcare/HealthcareModules";
import HealthcareNavigation from "@/components/healthcare/HealthcareNavigation";
import { getDepartmentConfig } from "@/lib/config/factory";

import PhotoSlideOver from "@/components/landing/PhotoSlideOver";
import { useDisclosure } from "@mantine/hooks";

export default function InternalMedicineLanding() {
    const config = getDepartmentConfig("internal_medicine");
    const [opened, { open, close }] = useDisclosure(false);

    if (!config) return <div>Department Not Found</div>;

    // Custom theme config for Internal Medicine (Botanic/Green)
    const botanicConfig = {
        ...config,
        theme: {
            ...config.theme,
            primary: "#13eca4", // Keeping the brand primary, but mixing with leaf tones
            secondary: "#61897c", // Leaf Medium
            background: "#f6f8f7", // Light Background
            text: "#1e3a2f", // Leaf Dark
            font: "display", // Inter
            texture: "glass" // Clean glass feel
        }
    };

    return (
        <HospitalProvider initialConfig={botanicConfig}>
            <div className="min-h-screen bg-[#f6f8f7] text-[#1e3a2f] font-sans selection:bg-[#13eca4]/30">
                {/* Custom Theme Injection for Internal Medicine */}
                <style jsx global>{`
                    /* Custom Font Injection if needed, utilizing Inter from global */
                    
                    /* Leaf Pattern Background */
                    .bg-leaf-pattern {
                        background-image: 
                            linear-gradient(rgba(30, 58, 47, 0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(30, 58, 47, 0.03) 1px, transparent 1px);
                        background-size: 40px 40px;
                    }
                `}</style>

                <PhotoSlideOver isOpen={opened} onClose={close} department="internal_medicine" />

                <HealthcareNavigation config={botanicConfig} />

                <main className="relative pt-20">
                    {/* Hero Section with Natural Gradient */}
                    <div className="relative z-10 p-4 md:p-8">
                        <div className="max-w-[1440px] mx-auto rounded-3xl overflow-hidden relative shadow-2xl">
                            <HealthcareHero config={botanicConfig} onOpenCamera={open} />
                            {/* Green Overlay - REMOVED */}
                            {/* <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a2f]/80 to-transparent pointer-events-none z-20 mix-blend-multiply"></div> */}
                        </div>
                    </div>

                    {/* Botanic Modules Section */}
                    <section className="pb-16 px-4 md:px-8 bg-[#f6f8f7]">
                        <div className="max-w-[1440px] mx-auto">
                            <div className="flex items-center gap-3 mb-8 mt-4">
                                <span className="material-symbols-outlined text-[#13eca4] text-3xl">spa</span>
                                <h2 className="text-3xl font-bold text-[#1e3a2f]">
                                    Holistic Care Pathways
                                </h2>
                            </div>

                            <HealthcareModules config={botanicConfig} />
                        </div>
                    </section>
                </main>
            </div>
        </HospitalProvider>
    );
}
