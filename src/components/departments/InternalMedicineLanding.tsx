"use client";

import { HospitalProvider } from "@/components/common/HospitalProvider";
import { motion } from 'framer-motion';
import HealthcareHero from "@/components/healthcare/HealthcareHero";
import HealthcareModules from '@/components/healthcare/HealthcareModules';
import ClinicSearchModule from '@/components/healthcare/ClinicSearchModule';
import { Activity, Droplet, Zap, Sparkles, HeartPulse, Stethoscope } from 'lucide-react';
import HealthcareNavigation from "@/components/healthcare/HealthcareNavigation";
import { getDepartmentConfig } from "@/lib/config/factory";
import PhotoSlideOver from "@/components/landing/PhotoSlideOver";
import { useDisclosure } from "@mantine/hooks";

export default function InternalMedicineLanding() {
    const config = getDepartmentConfig("internal-medicine");
    const [opened, { open, close }] = useDisclosure(false);

    if (!config) return <div>Department Not Found</div>;

    return (
        <HospitalProvider initialConfig={config}>
            <div
                className="min-h-screen font-sans transition-colors duration-700"
                style={{ backgroundColor: config.theme.background, color: config.theme.text }}
            >

                <style jsx global>{`
                    /* Leaf Pattern Background */
                    .bg-leaf-pattern {
                        background-image:
                            linear-gradient(rgba(30, 58, 47, 0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(30, 58, 47, 0.03) 1px, transparent 1px);
                        background-size: 40px 40px;
                    }
                `}</style>

                <PhotoSlideOver isOpen={opened} onClose={close} department="internal-medicine" />

                <HealthcareNavigation config={config} />

                <main className="relative bg-leaf-pattern pt-20">
                    {/* Hero Section - FULL WIDTH (Hard Coded Unwrap) */}
                    <div className="relative z-10 p-0">
                        {/* Removed p-4 md:p-8 constraints to fix box layout */}
                        <div className="w-full relative overflow-hidden shadow-2xl border-b border-white/20">
                            <HealthcareHero config={config} onOpenCamera={open} />
                        </div>
                    </div>

                    {/* Botanic Modules Section */}
                    <section className="pb-16 px-4 md:px-8 mt-12" style={{ backgroundColor: config.theme.background }}>
                        <div className="max-w-[1440px] mx-auto">
                            <div className="flex items-center gap-3 mb-8 mt-4">
                                <span className="material-symbols-outlined text-[#13eca4] text-3xl">spa</span>
                                <h2 className="text-3xl font-bold text-[#1e3a2f]">
                                    Holistic Care Pathways
                                </h2>
                            </div>

                            <HealthcareModules config={config} />
                        </div>
                    </section>
                </main>
            </div>
        </HospitalProvider>
    );
}
