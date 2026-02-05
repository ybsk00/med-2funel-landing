
import { getDepartmentConfig } from '@/lib/config/factory';
import DepartmentAppointmentNewPage from '@/components/patient/DepartmentAppointmentNewPage';

export default async function Page({ params }: { params: Promise<{ dept: string }> }) {
    const { dept } = await params;
    const config = await getDepartmentConfig(dept);

    return (
        <DepartmentAppointmentNewPage
            dept={dept}
            config={config}
        />
    );
}
