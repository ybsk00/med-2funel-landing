import { AdminDashboardShell } from './AdminDashboardShell';
import AdminMantineWrapper from '@/components/AdminMantineWrapper';
import { HospitalProvider } from '@/components/common/HospitalProvider';
import { getDepartmentConfig } from '@/lib/config/factory';

export default async function AdminLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ dept: string }>;
}) {
    const { dept } = await params;
    // Admin은 해당 과의 config 사용
    const config = await getDepartmentConfig(dept as any);
    return (
        <HospitalProvider initialConfig={config}>
            <AdminMantineWrapper>
                <AdminDashboardShell dept={dept}>{children}</AdminDashboardShell>
            </AdminMantineWrapper>
        </HospitalProvider>
    );
}
