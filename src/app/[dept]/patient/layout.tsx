
import PatientBottomNav from "@/components/patient/PatientBottomNav";

export default async function PatientLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ dept: string }>;
}) {
    const { dept } = await params;
    return (
        <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#0a0f1a" }}>
            <main className="flex-1 pb-20">
                {children}
            </main>

            {/* Bottom Navigation */}
            <PatientBottomNav dept={dept} />
        </div>
    );
}
