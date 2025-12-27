import PatientBottomNav from "@/components/patient/PatientBottomNav";

export default function PatientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#0a0f1a" }}>
            <main className="flex-1 pb-20">
                {children}
            </main>

            {/* Bottom Navigation with Face Simulation Modal */}
            <PatientBottomNav />
        </div>
    );
}

