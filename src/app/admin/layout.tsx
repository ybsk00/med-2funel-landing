import { AdminDashboardShell } from './AdminDashboardShell';
import AdminMantineWrapper from '@/components/AdminMantineWrapper';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminMantineWrapper>
            <AdminDashboardShell>{children}</AdminDashboardShell>
        </AdminMantineWrapper>
    );
}
