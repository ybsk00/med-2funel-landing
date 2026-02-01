"use client";

import { HospitalProvider } from "@/components/common/HospitalProvider";
import HealthcareHero from "@/components/healthcare/HealthcareHero";
import HealthcareModules from "@/components/healthcare/HealthcareModules";
import HealthcareNavigation from "@/components/healthcare/HealthcareNavigation";
import { getDepartmentConfig } from "@/lib/config/factory";

export default function NeurosurgeryLanding() {
    const config = getDepartmentConfig("neurosurgery");

    if (!config) return <div>Department Not Found</div>;

    // Custom theme config for Neurosurgery (Neuro/Holo)
    const neuroConfig = {
        ...config,
        theme: {
            ...config.theme,
            primary: "#13eca4",
            secondary: "#0f172a", // Deep Indigo
            background: "#0f172a", // Deep Indigo Background
            text: "#ffffff",
            font: "sans",
            texture: "grid"
        }
    };

    return (
        <HospitalProvider initialConfig={neuroConfig}>
            <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-[#6366f1] selection:text-white">
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

                <HealthcareNavigation config={neuroConfig} />

                <main className="relative bg-neural-grid pt-20">
                    {/* Hero Section */}
                    <div className="relative z-10">
                        <HealthcareHero config={neuroConfig} />
                        {/* Holographic Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent pointer-events-none z-20"></div>
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

                            <HealthcareModules config={neuroConfig} />
                        </div>
                    </section>
                </main>
            </div>
        </HospitalProvider>
    );
}
