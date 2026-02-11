import HealthcareLanding from "@/components/templates/HealthcareLanding";
import { HospitalProvider } from "@/components/common/HospitalProvider";
import { DEPARTMENT_CONFIGS } from "@/lib/config/departments";
import { ThemeProvider } from "@/modules/theme/ThemeProvider";
import { getDepartmentV2Config } from "@/modules/config";

export default async function Page() {
    const config = DEPARTMENT_CONFIGS["urology"];
    const v2Config = getDepartmentV2Config("urology");
    return (
        <ThemeProvider initialConfig={v2Config}>
            <HospitalProvider initialConfig={config}>
                <HealthcareLanding />
            </HospitalProvider>
        </ThemeProvider>
    );
}
