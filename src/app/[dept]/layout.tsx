
import { getDepartmentConfig } from "@/lib/config/factory";
import { HospitalProvider } from "@/components/common/HospitalProvider";
import { DEPARTMENTS } from "@/lib/constants/departments";

// Generate static params for all defined departments
export function generateStaticParams() {
    return DEPARTMENTS.map((dept) => ({
        dept: dept.id,
    }));
}

export default function DepartmentLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { dept: string };
}) {
    const config = getDepartmentConfig(params.dept);

    return (
        <HospitalProvider initialConfig={config}>
            {children}
        </HospitalProvider>
    );
}
