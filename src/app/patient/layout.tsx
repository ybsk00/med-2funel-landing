import PatientBottomNav from "@/components/patient/PatientBottomNav";
import { HospitalProvider } from '@/components/common/HospitalProvider';
import { getDepartmentConfig } from '@/lib/config/factory';

export default function PatientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const config = getDepartmentConfig("dermatology");
    return (
        <HospitalProvider initialConfig={config}>
            <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#0a0f1a" }}>
                <main className="flex-1 pb-20">
                    {children}
                </main>

                {/* Bottom Navigation with Face Simulation Modal */}
                <PatientBottomNav />
            </div>
        </HospitalProvider>
    );
}

