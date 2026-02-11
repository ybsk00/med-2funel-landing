
import { DEPARTMENT_CONFIGS } from "@/lib/config/departments";
import { HospitalProvider } from "@/components/common/HospitalProvider";
import { DEPARTMENTS } from "@/lib/constants/departments";

// Generate static params for all defined departments
export function generateStaticParams() {
    return Object.values(DEPARTMENTS).map((dept) => ({
        dept: dept.id,
    }));
}

export default async function DepartmentLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ dept: string }>;
}) {
    const { dept } = await params;
    const config = DEPARTMENT_CONFIGS[dept as keyof typeof DEPARTMENT_CONFIGS];

    return (
        <HospitalProvider initialConfig={config}>
            {children}
        </HospitalProvider>
    );
}
