
import { HospitalConfig, LandingModuleConfig } from './hospital';
import { getDepartment } from '@/lib/constants/departments';

// Helper to generate generic modules based on department keywords
function generateModules(dept: any): LandingModuleConfig[] {
    const icons = ['Sparkles', 'Shield', 'Heart', 'ArrowUpRight', 'Droplet'];
    const colors = ['pink', 'teal', 'purple', 'rose', 'fuchsia'];

    return dept.keywords.map((keyword: string, index: number) => ({
        id: `track-${index + 1}`,
        title: `${keyword} 케어`,
        description: `${keyword} 관리를 위한 맞춤형 AI 솔루션입니다.`,
        icon: icons[index % icons.length],
        color: colors[index % colors.length],
    }));
}

export function getDepartmentConfig(deptId: string): HospitalConfig {
    const dept = getDepartment(deptId);

    // Default Fallback
    if (!dept) {
        return {
            name: "에버헬스케어",
            representative: "김지은",
            representativeTitle: "대표원장",
            address: "서울특별시 강남구",
            tel: "1899-0000",
            fax: "02-000-0000",
            businessNumber: "000-00-00000",
            naverSearchKeyword: "병원",
            personas: {
                healthcare: {
                    name: "에밀리",
                    title: "영업실장",
                    purpose: "종합 안내",
                    tone: "친절함",
                    rules: []
                },
                medical: {
                    name: "에밀리",
                    title: "상담실장",
                    purpose: "예약 안내",
                    tone: "전문적임",
                    rules: []
                }
            },
            theme: {
                primary: "#E91E8C",
                secondary: "#14B8A6",
                accent: "#C026D3",
                background: "#0A1A2A",
                text: "#F8F9FA",
                concept: "기본"
            },
            landingModules: []
        };
    }

    // Construct Config
    return {
        name: `${dept.name} 클리닉`, // "Medical Area uses XX Clinic"
        marketingName: `${dept.label} 헬스케어`, // "Healthcare Area uses XX Healthcare"
        representative: "김닥터", // Placeholder
        representativeTitle: "대표원장",
        address: "서울특별시 강남구 테헤란로 123",
        tel: "02-1234-5678",
        fax: "02-1234-5679",
        businessNumber: "123-45-67890",
        naverSearchKeyword: `${dept.label} 추천`,

        personas: {
            healthcare: {
                name: "조이", // Cute/Witty name
                title: "헬스케어 가이드",
                purpose: "로그인 유도 및 흥미 유발",
                tone: "재치있고 귀여운, 애교많은, 영업 잘하는",
                rules: ["병원 이름 노출 금지", `헬스케어 이름(${dept.label} 헬스케어) 노출`, "로그인 유도"]
            },
            medical: {
                name: "그레이스", // Professional name
                title: "VIP 카운슬러",
                purpose: "예약 및 내원 유도",
                tone: "전문적이고 우아한, 신뢰감 주는, 재치있는",
                rules: ["병원 이름(OO의원) 노출 권장", "예약 적극 유도"]
            }
        },

        theme: dept.theme,

        // Generate distinct modules for this department
        landingModules: generateModules(dept)
    };
}
