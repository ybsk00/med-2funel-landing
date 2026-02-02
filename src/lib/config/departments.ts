import { HospitalConfig } from './hospital';

export const DEPARTMENT_IDS = ['dermatology', 'internal', 'urology', 'dentistry', 'plastic', 'orthopedics'] as const;
export type DepartmentId = typeof DEPARTMENT_IDS[number];

export const DEPARTMENT_CONFIGS: Record<DepartmentId, HospitalConfig> = {
    dermatology: {
        id: 'dermatology',
        dept: '피부과',
        name: "에버피부과",
        marketingName: "에버피부과",
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
                tone: "능글맞음, 유머러스함, 친근함",
                rules: ["병원 이름 노출 금지", "원장 이름 노출 금지"]
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
            concept: "프리미엄 미용"
        },
        officeHours: {
            start: "10:00",
            end: "20:00",
            lunchStart: "13:00",
            lunchEnd: "14:00",
            closedDays: [0]
        }
    },
    internal: {
        id: 'internal',
        dept: '내과',
        name: "서울내과",
        marketingName: "서울365내과",
        representative: "최현우",
        representativeTitle: "내과 전문의",
        address: "서울특별시 서초구 강남대로 100",
        tel: "02-123-4567",
        fax: "02-123-4568",
        businessNumber: "123-45-67890",
        naverSearchKeyword: "서울내과",
        personas: {
            healthcare: {
                name: "조은비",
                title: "건강매니저",
                purpose: "건강검진 유도",
                tone: "차분함, 꼼꼼함, 걱정해주는 톤",
                rules: ["무리한 시술 권유 금지", "건강이 최우선임을 강조"]
            },
            medical: {
                name: "김간호",
                title: "수석 간호팀장",
                purpose: "진료 예약 및 만성질환 관리",
                tone: "친절함, 전문적, 안심시키는 톤",
                rules: ["정확한 증상 파악", "수액/검진 예약 유도"]
            }
        },
        theme: {
            primary: "#3B82F6", // Blue
            secondary: "#10B981", // Emerald
            accent: "#60A5FA",
            background: "#F0F9FF", // Light Blue bg
            text: "#1E293B", // Dark Slate
            concept: "편안한 주치의"
        },
        officeHours: {
            start: "09:00",
            end: "18:30",
            lunchStart: "13:00",
            lunchEnd: "14:00",
            closedDays: [0]
        }
    },
    urology: {
        id: 'urology',
        dept: '비뇨기과',
        name: "강남비뇨기과",
        marketingName: "맨즈프라임 비뇨기과",
        representative: "박철수",
        representativeTitle: "비뇨의학과 전문의",
        address: "서울특별시 강남구 테헤란로 200",
        tel: "02-987-6543",
        fax: "02-987-6544",
        businessNumber: "987-65-43210",
        naverSearchKeyword: "강남비뇨기과",
        personas: {
            healthcare: {
                name: "제임스",
                title: "상담실장",
                purpose: "남성 활력 상담 유도",
                tone: "자신감 넘침, 프라이빗함, 남성적",
                rules: ["비밀 보장 강조", "남성 건강의 중요성 강조"]
            },
            medical: {
                name: "박실장",
                title: "VIP 전담 실장",
                purpose: "수술 및 시술 예약",
                tone: "진중함, 신뢰감, 직설적이지만 정중함",
                rules: ["프라이버시 절대 존중", "확실한 효과 강조"]
            }
        },
        theme: {
            primary: "#F59E0B", // Amber/Gold
            secondary: "#1E293B", // Slate
            accent: "#D97706",
            background: "#0F172A", // Dark Slate bg
            text: "#F8F9FA",
            concept: "프라이빗 남성 토탈 케어"
        },
        officeHours: {
            start: "09:30",
            end: "19:00",
            closedDays: [0]
        }
    },
    dentistry: {
        id: 'dentistry',
        dept: '치과',
        name: "서울미소치과",
        marketingName: "서울탑치과",
        representative: "이민수",
        representativeTitle: "치과 교정과 전문의",
        address: "서울특별시 송파구 올림픽로 300",
        tel: "02-555-5555",
        fax: "02-555-5556",
        businessNumber: "555-55-55555",
        naverSearchKeyword: "서울미소치과",
        personas: {
            healthcare: {
                name: "미소쌤",
                title: "치위생사",
                purpose: "스케일링/검진 유도",
                tone: "밝음, 상냥함, 또랑또랑함",
                rules: ["치아 관리의 중요성 강조", "안 아프다는 것 강조"]
            },
            medical: {
                name: "최실장",
                title: "총괄 실장",
                purpose: "교정/임플란트 상담",
                tone: "세심함, 전문적, 꼼꼼함",
                rules: ["비용 상담보다는 가치 강조", "심미성 강조"]
            }
        },
        theme: {
            primary: "#14B8A6", // Teal/Mint
            secondary: "#06B6D4", // Cyan
            accent: "#2DD4BF",
            background: "#F0FDFA", // Light Mint bg
            text: "#134E4A", // Dark Teal
            concept: "밝고 깨끗한 미소"
        }
    },
    plastic: { // 성형외과 (Placeholder)
        id: 'plastic',
        dept: '성형외과',
        name: "더라인성형외과",
        representative: "김성형",
        representativeTitle: "성형외과 전문의",
        address: "서울 강남구",
        tel: "02-000-0000",
        fax: "",
        businessNumber: "",
        naverSearchKeyword: "더라인성형외과",
        personas: {
            healthcare: { name: "뷰티매니저", title: "실장", purpose: "상담", tone: "세련됨", rules: [] },
            medical: { name: "성형실장", title: "실장", purpose: "예약", tone: "프로페셔널", rules: [] }
        },
        theme: { primary: "#EC4899", secondary: "#F472B6", accent: "#DB2777", background: "#FFF1F2", text: "#881337", concept: "드라마틱한 변화" }
    },
    orthopedics: { // 정형외과 (Placeholder)
        id: 'orthopedics',
        dept: '정형외과',
        name: "튼튼정형외과",
        representative: "정형우",
        representativeTitle: "정형외과 전문의",
        address: "서울 강동구",
        tel: "02-111-1111",
        fax: "",
        businessNumber: "",
        naverSearchKeyword: "튼튼정형외과",
        personas: {
            healthcare: { name: "체형매니저", title: "실장", purpose: "교정", tone: "건강함", rules: [] },
            medical: { name: "물리치료팀장", title: "팀장", purpose: "치료", tone: "신뢰감", rules: [] }
        },
        theme: { primary: "#16A34A", secondary: "#22C55E", accent: "#15803D", background: "#F0FDF4", text: "#14532D", concept: "통증 없는 자유" }
    }
};

export const DEFAULT_DEPARTMENT: DepartmentId = 'dermatology';
