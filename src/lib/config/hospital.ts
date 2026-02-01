export interface PersonaConfig {
    name: string;
    title: string;
    purpose: string;
    tone: string;
    rules: string[];
}

export interface LandingModuleConfig {
    id: string;
    title: string;
    description: string;
    icon: string; // 'Sparkles' | 'Droplet' | 'Shield' | 'ArrowUpRight' | 'Heart'
    color: string; // 'pink' | 'rose' | 'teal' | 'purple' | 'fuchsia'
}

export interface HospitalConfig {
    name: string;
    representative: string;
    representativeTitle: string;
    address: string;
    tel: string;
    fax: string;
    businessNumber: string;
    naverSearchKeyword: string;
    id?: string; // Department ID
    dept?: string; // Department Name (Label)

    personas: {
        healthcare: PersonaConfig;
        medical: PersonaConfig;
    };

    theme: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
        concept: string;
        texture?: string; // NEW
        font?: string; // NEW
        sound?: string; // NEW
    };

    marketingName?: string;
    catchphrase?: string; // NEW
    landingModules?: LandingModuleConfig[];
    hero?: {
        title: string;
        subtitle: string;
    };
    marketing?: {
        searchKeyword: string;
        surveyHeadline?: string;
        cta: {
            title: string;
            buttonText: string;
            icon: string;
            link: string;
            defaultTopic: string;
        }
    };
    videoSource?: string;
    video?: string; // NEW
}

export const HOSPITAL_CONFIG: HospitalConfig = {
    name: "에버피부과",
    representative: "김지은",
    representativeTitle: "대표원장",
    address: "서울특별시 강남구 압구정로 222",
    tel: "1899-1150",
    fax: "02-516-0514",
    businessNumber: "317-14-00846",
    naverSearchKeyword: "에버피부과",
    personas: {
        healthcare: {
            name: "에밀리",
            title: "영업실장",
            purpose: "로그인 유도",
            tone: "능글맞음, 유머러스함, 약간의 과장 허용, 친근함",
            rules: ["병원 이름 노출 금지", "원장 이름 노출 금지", "진단/처방 금지"]
        },
        medical: {
            name: "에밀리",
            title: "수석 VIP 컨시어지",
            purpose: "예약 이끌어내기",
            tone: "전문적, 우아함, 신뢰감, 품격 있는 강남 실장 톤",
            rules: ["병원 및 원장 이름 노출 권장", "예약 모달 적극 활용"]
        }
    },
    theme: {
        primary: "#E91E8C",
        secondary: "#14B8A6",
        accent: "#C026D3",
        background: "#0A1A2A",
        text: "#F8F9FA",
        concept: "프리미엄"
    }
};

export function getHospitalConfig(): HospitalConfig {
    return HOSPITAL_CONFIG;
}
