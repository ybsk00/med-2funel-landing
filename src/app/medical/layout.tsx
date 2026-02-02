import type { Metadata } from "next";
import { HOSPITAL_CONFIG } from "@/lib/config/hospital";
import { HospitalProvider } from '@/components/common/HospitalProvider';
import { getDepartmentConfig } from '@/lib/config/factory';

export const metadata: Metadata = {
    title: `${HOSPITAL_CONFIG.name} 진료 시스템`,
    description: "의료진 전용 대시보드",
};

export default async function MedicalLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const config = await getDepartmentConfig("dermatology");
    return (
        <HospitalProvider initialConfig={config}>
            <div className="min-h-screen bg-traditional-bg text-traditional-text font-sans selection:bg-traditional-accent selection:text-white">
                {children}
            </div>
        </HospitalProvider>
    );
}

