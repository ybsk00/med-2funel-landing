"use client";

import { useState } from "react";
import { HospitalProvider } from "@/components/common/HospitalProvider";
import { getDepartmentConfig } from "@/lib/config/factory";
import { getDepartment } from "@/lib/constants/departments";
import HealthcareNavigation from "@/components/healthcare/HealthcareNavigation";
import HealthcareHero from "@/components/healthcare/HealthcareHero";
import HealthcareModules from "@/components/healthcare/HealthcareModules";
import Footer from "@/components/common/Footer";
import PhotoSlideOver from "@/components/landing/PhotoSlideOver";
import { TrackF1View } from "@/components/marketing/MarketingTracker";

interface GenericDepartmentPageProps {
    id: string;
}

export default function GenericDepartmentPage({ id }: GenericDepartmentPageProps) {
    const config = getDepartmentConfig(id);
    const [isPhotoSlideOverOpen, setIsPhotoSlideOverOpen] = useState(false);

    if (!config) return <div>Department Not Found</div>;

    return (
        <HospitalProvider initialConfig={config}>
            <TrackF1View>
                <div
                    className="min-h-screen font-sans selection:bg-skin-primary selection:text-white transition-colors duration-700"
                    style={{
                        backgroundColor: config.theme.background,
                        color: config.theme.text
                    }}
                >
                    <HealthcareNavigation config={config} />
                    <HealthcareHero config={config} onOpenCamera={() => setIsPhotoSlideOverOpen(true)} />
                    <HealthcareModules config={config} />
                    <Footer mode="healthcare" />

                    <PhotoSlideOver
                        isOpen={isPhotoSlideOverOpen}
                        onClose={() => setIsPhotoSlideOverOpen(false)}
                    />
                </div>
            </TrackF1View>
        </HospitalProvider>
    );
}
