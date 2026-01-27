import Footer from "@/components/common/Footer";

export default function PatientDashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-grow">
                {children}
            </div>
            <Footer brandName="에버피부과" />
        </div>
    );
}
