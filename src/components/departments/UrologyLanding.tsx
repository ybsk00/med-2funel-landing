"use client";

import { HospitalProvider } from "@/components/common/HospitalProvider";
import HealthcareHero from "@/components/healthcare/HealthcareHero";
import HealthcareModules from "@/components/healthcare/HealthcareModules";
import HealthcareNavigation from "@/components/healthcare/HealthcareNavigation";
import { getDepartmentConfig } from "@/lib/config/factory";
import PhotoSlideOver from "@/components/landing/PhotoSlideOver";
import { useDisclosure } from "@mantine/hooks";

export default function UrologyLanding() {
    const config = getDepartmentConfig("urology");
    const [opened, { open, close }] = useDisclosure(false);

    if (!config) return <div>Department Not Found</div>;

    return (
        <HospitalProvider initialConfig={config}>
            <div
                className="min-h-screen font-sans transition-colors duration-700"
                style={{ backgroundColor: config.theme.background, color: config.theme.text }}
            >
                {/* Custom Theme Injection for Urology */}
                <style jsx global>{`
                    /* Carbon Pattern */
                    .bg-carbon-pattern {
                        background-image: 
                            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
                        background-size: 40px 40px;
                    }
                    
                    /* Skew Utilities */
                    .skew-box { transform: skewX(-12deg); }
                    .unskew-content { transform: skewX(12deg); }
                    
                    /* Tachometer Gradient */
                    .tachometer-gradient {
                        background: conic-gradient(from 180deg, #ef4444 0deg, #eab308 90deg, #13eca4 180deg, #13eca4 220deg, transparent 220deg);
                    }
                `}</style>

                <PhotoSlideOver isOpen={opened} onClose={close} department="urology" />

                <HealthcareNavigation config={config} />

                <main className="relative bg-carbon-pattern pt-20">
                    {/* Hero Section */}
                    <div className="relative z-10 w-full overflow-hidden">
                        <HealthcareHero config={config} onOpenCamera={open} />
                        {/* Dark Overlay/Scanliens - REMOVED */}
                        {/* <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-[length:100%_2px,3px_100%] pointer-events-none"></div> */}
                    </div>

                    {/* Stats / Modules Section */}
                    <section className="py-20 relative px-4 md:px-8">
                        <div className="max-w-[1280px] mx-auto">
                            <div className="flex items-center justify-between mb-12">
                                <div>
                                    <h2 className="text-4xl font-black uppercase italic tracking-tighter">
                                        Performance <span className="text-[#13eca4]">Metrics</span>
                                    </h2>
                                    <div className="h-1 w-20 bg-[#13eca4] mt-2 transform skew-x-[-12deg]"></div>
                                </div>
                                <div className="hidden md:flex items-center gap-2 font-bold text-[#13eca4]">
                                    <span className="w-2 h-2 rounded-full bg-[#13eca4] animate-pulse"></span>
                                    SYSTEM OPTIMAL
                                </div>
                            </div>

                            <HealthcareModules config={config} />
                        </div>
                    </section>
                </main>
            </div>
        </HospitalProvider>
    );
}
