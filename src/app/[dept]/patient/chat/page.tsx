
import { getDepartmentConfig } from '@/lib/config/factory';
import DepartmentChatPage from '@/components/patient/DepartmentChatPage';

export default async function Page({ params }: { params: Promise<{ dept: string }> }) {
    const { dept } = await params;
    const config = await getDepartmentConfig(dept);

    return (
        <DepartmentChatPage
            dept={dept}
            config={config}
        />
    );
}
