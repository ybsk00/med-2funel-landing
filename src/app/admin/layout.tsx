import { AdminDashboardShell } from './AdminDashboardShell';
import AdminMantineWrapper from '@/components/AdminMantineWrapper';
import { HospitalProvider } from '@/components/common/HospitalProvider';
import { getDepartmentConfig } from '@/lib/config/factory';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Admin은 기본 config 사용 (hospital.ts의 HOSPITAL_CONFIG)
    const config = getDepartmentConfig("dermatology");
    return (
        <HospitalProvider initialConfig={config}>
            <AdminMantineWrapper>
                <AdminDashboardShell>{children}</AdminDashboardShell>
            </AdminMantineWrapper>
        </HospitalProvider>
    );
}
