
import { getDepartmentConfig } from '@/lib/config/factory';
import DepartmentProfilePage from '@/components/patient/DepartmentProfilePage';

export default async function Page({ params }: { params: Promise<{ dept: string }> }) {
    const { dept } = await params;
    const config = await getDepartmentConfig(dept);

    return (
        <DepartmentProfilePage
            dept={dept}
            config={config}
        />
    );
}
