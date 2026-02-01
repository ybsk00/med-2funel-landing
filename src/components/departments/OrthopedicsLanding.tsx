"use client";

import { HospitalProvider } from "@/components/common/HospitalProvider";
import HealthcareHero from "@/components/healthcare/HealthcareHero";
import HealthcareModules from "@/components/healthcare/HealthcareModules";
import ClinicSearchModule from "@/components/healthcare/ClinicSearchModule"; // Added this import
import HealthcareNavigation from "@/components/healthcare/HealthcareNavigation";
import { getDepartmentConfig } from "@/lib/config/factory";
import PhotoSlideOver from "@/components/landing/PhotoSlideOver";
import { useDisclosure } from "@mantine/hooks";

export default function OrthopedicsLanding() {
    const config = getDepartmentConfig("orthopedics");
    const [opened, { open, close }] = useDisclosure(false);

    if (!config) return <div>Department Not Found</div>;

    return (
        <HospitalProvider initialConfig={config}>
            <div
                className="min-h-screen font-sans selection:bg-skin-primary/30"
                style={{ backgroundColor: config.theme.background, color: config.theme.text }}
            >
                {/* Custom Theme Injection for Orthopedics */}
                <style jsx global>{`
                    /* Grid Pattern Background */
                    .bg-grid-pattern {
                        background-image: linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px);
                        background-size: 40px 40px;
                    }

                    /* Technical Border Utility */
                    .technical-border {
                        position: relative;
                    }
                    .technical-border::after {
                        content: '';
                        position: absolute;
                        top: -1px;
                        left: -1px;
                        width: 10px;
                        height: 10px;
                        border-top: 2px solid #13eca4;
                        border-left: 2px solid #13eca4;
                    }
                    .technical-border::before {
                        content: '';
                        position: absolute;
                        bottom: -1px;
                        right: -1px;
                        width: 10px;
                        height: 10px;
                        border-bottom: 2px solid #13eca4;
                        border-right: 2px solid #13eca4;
                    }

                    .font-mono {
                        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
                    }
                `}</style>

                <PhotoSlideOver isOpen={opened} onClose={close} department="orthopedics" />

                <HealthcareNavigation config={config} />

                <main className="relative bg-grid-pattern pt-20">
                    {/* Hero Section - FULL WIDTH (Hard Coded Unwrap) */}
                    <div className="relative z-10">
                        {/* Removed p-4 md:p-8 and max-w constraints */}
                        <div className="w-full relative overflow-hidden shadow-xl border-b border-slate-200">
                            {/* Hard-coded Glassmorphism Logic Injection via Config is tricky, so we rely on the clean wrapper + config overrides */}
                            <HealthcareHero config={config} onOpenCamera={open} />
                        </div>
                    </div>

                    {/* Schematics / Modules Section */}
                    <section className="pb-16 px-4 md:px-8 mt-12">
                        <div className="max-w-[1440px] mx-auto">
                            <div className="flex items-center justify-between mb-8 mt-4">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    Departmental Schematics
                                </h2>
                                <div className="hidden sm:block text-xs font-mono text-slate-500">
                                    SYSTEM ONLINE // V.4.0.2
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
