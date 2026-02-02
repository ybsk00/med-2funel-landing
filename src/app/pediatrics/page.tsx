import HealthcareLanding from "@/components/templates/HealthcareLanding";
import { HospitalProvider } from "@/components/common/HospitalProvider";
import { getDepartmentConfig } from "@/lib/config/factory";
import { ThemeProvider } from "@/modules/theme/ThemeProvider";
import { getDepartmentV2Config } from "@/modules/config";

export default function Page() {
    const config = getDepartmentConfig("pediatrics");
    const v2Config = getDepartmentV2Config("pediatrics");
    return (
        <ThemeProvider initialConfig={v2Config}>
            <HospitalProvider initialConfig={config}>
                <HealthcareLanding />
            </HospitalProvider>
        </ThemeProvider>
    );
}
