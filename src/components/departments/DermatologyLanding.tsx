"use client";

import { HospitalProvider } from "@/components/common/HospitalProvider";
import HealthcareHero from "@/components/healthcare/HealthcareHero";
import HealthcareModules from "@/components/healthcare/HealthcareModules";
import HealthcareNavigation from "@/components/healthcare/HealthcareNavigation";
import { getDepartmentConfig } from "@/lib/config/factory";

export default function DermatologyLanding() {
    const config = getDepartmentConfig("dermatology");

    if (!config) return <div>Department Not Found</div>;

    // Custom theme config for Dermatology (Hologram/Glass)
    const glassConfig = {
        ...config,
        theme: {
            ...config.theme,
            primary: "#13eca4",
            primaryDark: "#0eb57d",
            background: "#f0fdf9", // Very pale mint/white
            text: "#111816",
            font: "sans",
            texture: "glass"
        }
    };

    return (
        <HospitalProvider initialConfig={glassConfig}>
            <div className="min-h-screen bg-[#f0fdf9] text-[#111816] font-sans selection:bg-[#13eca4]/30">
                {/* Custom Theme Injection for Dermatology */}
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

                <HealthcareNavigation config={glassConfig} />

                <main className="relative overflow-hidden pt-20">
                    {/* Hero Section */}
                    <div className="relative z-10">
                        <HealthcareHero config={glassConfig} />

                        {/* Prismatic Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#13eca4]/10 via-transparent to-blue-200/10 pointer-events-none mix-blend-overlay"></div>
                    </div>

                    {/* Modules Section - Glass Cards */}
                    <section className="py-24 px-4 relative">
                        {/* Decorative Blobs */}
                        <div className="absolute top-0 left-0 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#13eca4]/5 blur-[100px]"></div>
                        <div className="absolute bottom-0 right-0 -z-10 h-[500px] w-[500px] translate-x-1/3 translate-y-1/3 rounded-full bg-purple-200/20 blur-[100px]"></div>

                        <div className="max-w-7xl mx-auto relative z-10">
                            <div className="mb-16 text-center">
                                <div className="inline-flex items-center rounded-full border border-[#13eca4]/30 bg-white/40 px-3 py-1 text-sm font-medium text-[#0eb57d] backdrop-blur-md mb-4">
                                    <span className="mr-2 h-2 w-2 rounded-full bg-[#13eca4] animate-pulse"></span>
                                    Premium Dermatology
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">
                                    LUMIÈRE <span className="text-[#13eca4] font-light">DERMA</span>
                                </h2>
                                <p className="text-slate-600 max-w-2xl mx-auto text-lg font-light">
                                    Experience the clarity of glass-like skin with our advanced prism technology.
                                </p>
                            </div>

                            {/* Override HealthcareModules container styles via props if possible, or wrap it */}
                            <div className="[&>div]:gap-8"> {/* Tailwind arbitrary selector to target grid gap if needed */}
                                <HealthcareModules config={glassConfig} />
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </HospitalProvider>
    );
}
