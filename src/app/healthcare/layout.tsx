import { HospitalProvider } from '@/components/common/HospitalProvider';
import { getDepartmentConfig } from '@/lib/config/factory';

export default async function HealthcareLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // healthcare 라우트는 기본 config 사용
    const config = await getDepartmentConfig("dermatology");
    return (
        <HospitalProvider initialConfig={config}>
            {children}
        </HospitalProvider>
    );
}
