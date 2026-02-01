"use client";

import { HospitalProvider } from "@/components/common/HospitalProvider";
import HealthcareHero from "@/components/healthcare/HealthcareHero";
import HealthcareModules from "@/components/healthcare/HealthcareModules";
import HealthcareNavigation from "@/components/healthcare/HealthcareNavigation";
import { getDepartmentConfig } from "@/lib/config/factory";
import PhotoSlideOver from "@/components/landing/PhotoSlideOver";
import { useDisclosure } from "@mantine/hooks";

export default function ObgynLanding() {
    const config = getDepartmentConfig("obgyn");
    const [opened, { open, close }] = useDisclosure(false);

    if (!config) return <div>Department Not Found</div>;

    // HARD-CODED CONFIGURATION FOR VISUAL OVERHAUL
    const obgynConfig = {
        ...config,
        theme: {
            ...config.theme,
            primary: "#FF9EAA", // Soft Coral
            secondary: "#FFF0F1",
            background: "#FFFBFB",
            text: "#4A4A4A", // Dark Grey (Hard Coded for Visibility)
            accent: "#d63384", // Deep Pink for contrast
            font: "serif",
            texture: "silk"
        }
    };

    return (
        <HospitalProvider initialConfig={obgynConfig}>
            <div className="min-h-screen bg-[#FFFBFB] text-[#4A4A4A] font-sans selection:bg-[#FF9EAA]/30">
                {/* Custom Theme Injection for ObGyn */}
                <style jsx global>{`
                    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');

                    .font-serif {
                        font-family: 'Playfair Display', serif;
                    }

                    /* Soft Curve Decorations */
                    .bg-organic-curve {
                        background-image: radial-gradient(circle at 100% 0%, #FFF0F1 20%, transparent 20%),
                                        radial-gradient(circle at 0% 100%, #FFF0F1 20%, transparent 20%);
                    }
                `}</style>

                <PhotoSlideOver isOpen={opened} onClose={close} department="obgyn" />

                <HealthcareNavigation config={obgynConfig} />

                <main className="relative bg-organic-curve pt-20">
                    {/* Hero Section - FULL WIDTH (Hard Coded Unwrap) */}
                    <div className="relative z-10">
                        {/* Removed p-4 constraints */}
                        <div className="w-full relative shadow-xl shadow-rose-100/50">
                            <HealthcareHero config={obgynConfig} onOpenCamera={open} />
                        </div>
                    </div>

                    {/* Modules Section */}
                    <section className="pb-16 px-4 md:px-8 mt-12">
                        <div className="max-w-[1440px] mx-auto">
                            <div className="flex flex-col items-center justify-center text-center mb-12 mt-8">
                                <span className="material-symbols-outlined text-[#FF9EAA] text-4xl mb-2">female</span>
                                <h2 className="text-4xl font-serif italic text-[#4A4A4A]">
                                    Women's Wellness
                                </h2>
                                <ClinicSearchModule
                                    department="obgyn"
                                    searchKeyword="산부인과"
                                    theme="modern"
                                />
                                <div className="w-16 h-1 bg-[#FF9EAA] mt-4 rounded-full"></div>
                            </div>

                            <HealthcareModules config={obgynConfig} />
                        </div>
                    </section>
                </main>
            </div>
        </HospitalProvider>
    );
}
