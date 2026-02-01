"use client";

import { HospitalProvider } from "@/components/common/HospitalProvider";
import HealthcareHero from "@/components/healthcare/HealthcareHero";
import HealthcareModules from "@/components/healthcare/HealthcareModules";
import HealthcareNavigation from "@/components/healthcare/HealthcareNavigation";
import { getDepartmentConfig } from "@/lib/config/factory";

export default function OrthopedicsLanding() {
    const config = getDepartmentConfig("orthopedics");

    if (!config) return <div>Department Not Found</div>;

    // Custom theme config for Orthopedics (Blueprint/Grid)
    const blueprintConfig = {
        ...config,
        theme: {
            ...config.theme,
            primary: "#13eca4",
            secondary: "#e2e8f0",
            background: "#f6f8f7",
            text: "#0f172a", // Navy
            font: "mono", // Using mono for technical feel
            texture: "grid"
        }
    };

    return (
        <HospitalProvider initialConfig={blueprintConfig}>
            <div className="min-h-screen bg-[#f6f8f7] text-[#0f172a] font-sans selection:bg-[#13eca4]/30">
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

                <HealthcareNavigation config={blueprintConfig} />

                <main className="relative bg-grid-pattern pt-20">
                    {/* Hero Section */}
                    <div className="relative z-10 p-4 md:p-8">
                        <div className="max-w-[1440px] mx-auto rounded-2xl overflow-hidden relative">
                            <HealthcareHero config={blueprintConfig} />
                            {/* Grid Overlay on Hero */}
                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBoNDBWMEgwdi41aDM5LjV2MzlIMHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] pointer-events-none z-20"></div>
                        </div>
                    </div>

                    {/* Schematics / Modules Section */}
                    <section className="pb-16 px-4 md:px-8">
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

                            <HealthcareModules config={blueprintConfig} />
                        </div>
                    </section>
                </main>
            </div>
        </HospitalProvider>
    );
}
