"use client";

import { HospitalProvider } from "@/components/common/HospitalProvider";
import HealthcareHero from "@/components/healthcare/HealthcareHero";
import HealthcareModules from "@/components/healthcare/HealthcareModules";
import HealthcareNavigation from "@/components/healthcare/HealthcareNavigation";
import { getDepartmentConfig } from "@/lib/config/factory";
import PhotoSlideOver from "@/components/landing/PhotoSlideOver";
import { useDisclosure } from "@mantine/hooks";

export default function KoreanMedicineLanding() {
    const config = getDepartmentConfig("korean-medicine");
    const [opened, { open, close }] = useDisclosure(false);

    if (!config) return <div>Department Not Found</div>;

    // Custom theme config for Korean Medicine (Hanji/Earth)
    const hanjiConfig = {
        ...config,
        theme: {
            ...config.theme,
            primary: "#4A5D23", // Olive Green
            secondary: "#8D8D8D", // Stone Gray
            accent: "#8B4513", // Saddle Brown
            background: "#FBF7F2", // Paper/Hanji Color
            text: "#2F4F4F", // Dark Slate Gray
            font: "serif",
            texture: "hanji"
        }
    };

    return (
        <HospitalProvider initialConfig={hanjiConfig}>
            <div className="min-h-screen bg-[#FBF7F2] text-[#2F4F4F] font-serif">
                {/* Custom Theme Injection for Korean Medicine */}
                <style jsx global>{`
                     @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;600;900&display=swap');

                    :root {
                        --font-serif: "Noto Serif KR", serif;
                        --color-paper: #FBF7F2;
                        --color-ink: #111816;
                    }

                    .font-serif { font-family: var(--font-serif); }
                    
                    /* Hanji Texture Background */
                    .bg-hanji {
                        background-color: #FBF7F2;
                        background-image: linear-gradient(to bottom right, rgba(255, 255, 255, 0.8), rgba(251, 247, 242, 0.8));
                    }

                    /* Vertical Writing Mode */
                    .writing-vertical {
                        writing-mode: vertical-rl;
                        text-orientation: mixed;
                    }
                `}</style>

                <PhotoSlideOver isOpen={opened} onClose={close} department="korean-medicine" />

                <HealthcareNavigation config={hanjiConfig} />

                <main className="relative bg-hanji pt-20">
                    {/* Hero Section */}
                    <div className="relative z-10">
                        {/* Ink Diffusion Overlay - REMOVED */}
                        {/* <div className="absolute inset-0 bg-gradient-to-r from-[#FBF7F2]/90 via-[#FBF7F2]/40 to-transparent pointer-events-none z-20"></div> */}
                        <HealthcareHero config={hanjiConfig} onOpenCamera={open} />
                    </div>

                    {/* Philosophy / Modules Section */}
                    <section className="relative w-full py-24 px-4 md:px-10 lg:px-20 bg-[#FBF7F2]">
                        {/* Vertical Text Decoration */}
                        <div className="absolute top-20 left-10 hidden md:block opacity-10 pointer-events-none">
                            <div className="writing-vertical text-6xl font-black text-[#111816] tracking-widest uppercase">
                                Harmony Qi Spirit
                            </div>
                        </div>

                        <div className="max-w-[1200px] mx-auto z-10 relative">
                            <div className="flex flex-col md:flex-row gap-12 items-end mb-16 border-b border-[#8D8D8D]/30 pb-8">
                                <div className="flex-1">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#4A5D23]/30 bg-white/50 backdrop-blur-sm w-fit mb-4">
                                        <span className="w-2 h-2 rounded-full bg-[#4A5D23]"></span>
                                        <span className="text-xs font-semibold uppercase tracking-widest text-[#4A5D23]">Restorative Medicine</span>
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-light text-[#111816] leading-tight">
                                        The Art of <br />
                                        <span className="font-bold italic">Slow Healing</span>
                                    </h2>
                                </div>
                                <p className="text-lg text-[#8D8D8D] max-w-md leading-relaxed">
                                    Like ink diffusing in water, true healing requires patience and balance. We treat the root cause, not just the symptoms.
                                </p>
                            </div>

                            <HealthcareModules config={hanjiConfig} />
                        </div>
                    </section>
                </main>
            </div>
        </HospitalProvider>
    );
}
