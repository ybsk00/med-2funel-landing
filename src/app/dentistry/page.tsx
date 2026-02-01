import HealthcareLanding from "@/components/templates/HealthcareLanding";
import { HospitalProvider } from "@/components/common/HospitalProvider";
import { getDepartmentConfig } from "@/lib/config/factory";

export default function Page() {
    const config = getDepartmentConfig("dentistry");
    return (
        <HospitalProvider initialConfig={config}>
            <HealthcareLanding />
        </HospitalProvider>
    );
}
