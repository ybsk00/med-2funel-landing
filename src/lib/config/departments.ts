import { HospitalConfig } from './hospital';

export const DEPARTMENT_IDS = ['dermatology', 'internal-medicine', 'urology', 'dentistry', 'plastic-surgery', 'orthopedics', 'korean-medicine', 'neurosurgery', 'obgyn', 'oncology', 'pediatrics'] as const;
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
        defaultTopic: "glow-booster",
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
    'internal-medicine': {
        id: 'internal-medicine',
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
        defaultTopic: "fatigue-reset",
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
        defaultTopic: "vitality-check",
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
        defaultTopic: "smile-design",
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
        },
        officeHours: {
            start: "10:00",
            end: "19:00",
            closedDays: [0, 6]
        }
    },
    'plastic-surgery': {
        id: 'plastic-surgery',
        dept: '성형외과',
        name: "더라인성형외과",
        marketingName: "더라인성형외과",
        representative: "김성형",
        representativeTitle: "성형외과 전문의",
        address: "서울특별시 강남구 도산대로 101",
        tel: "02-543-2100",
        fax: "02-543-2101",
        businessNumber: "211-11-11111",
        naverSearchKeyword: "더라인성형외과",
        defaultTopic: "face-ratio",
        personas: {
            healthcare: {
                name: "제니",
                title: "뷰티 매니저",
                purpose: "로그인 및 내원 유도",
                tone: "트렌디, 세련됨, 언니 같은 조언",
                rules: ["비포/애프터 강조 가능하지만 구체적 수치는 피함"]
            },
            medical: {
                name: "이실장",
                title: "상담 실장",
                purpose: "수술 예약 확정",
                tone: "프로페셔널, 확신에 찬 어조, 고객의 니즈 파악",
                rules: ["드라마틱한 변화 강조", "안전성 강조"]
            }
        },
        theme: {
            primary: "#EC4899",
            secondary: "#F472B6",
            accent: "#DB2777",
            background: "#FFF1F2",
            text: "#881337",
            concept: "드라마틱한 변화"
        },
        officeHours: {
            start: "10:00",
            end: "19:00",
            closedDays: [0]
        }
    },
    orthopedics: {
        id: 'orthopedics',
        dept: '정형외과',
        name: "튼튼정형외과",
        marketingName: "바른마디 정형외과",
        representative: "정형우",
        representativeTitle: "정형외과 전문의",
        address: "서울특별시 강동구 천호대로 500",
        tel: "02-485-7575",
        fax: "02-485-7576",
        businessNumber: "485-75-75757",
        naverSearchKeyword: "튼튼정형외과",
        defaultTopic: "posture-check",
        personas: {
            healthcare: {
                name: "김운동",
                title: "재활 트레이너",
                purpose: "통증 원인 상담 및 방문 유도",
                tone: "에너지 넘침, 건강함, 격려하는 톤",
                rules: ["스트레칭 조언 가능", "정확한 진단은 내원 권유"]
            },
            medical: {
                name: "최팀장",
                title: "도수치료 팀장",
                purpose: "치료 일정 조율",
                tone: "전문적, 신뢰감, 체계적",
                rules: ["지속적인 치료의 중요성 강조", "비수술 치료 우선 언급"]
            }
        },
        theme: {
            primary: "#16A34A",
            secondary: "#22C55E",
            accent: "#15803D",
            background: "#F0FDF4",
            text: "#14532D",
            concept: "통증 없는 자유"
        },
        officeHours: {
            start: "09:00",
            end: "18:00",
            lunchStart: "13:00",
            lunchEnd: "14:00",
            closedDays: [0]
        }
    },
    'korean-medicine': {
        id: 'korean-medicine',
        dept: '한의원',
        name: "에버한의원",
        marketingName: "비움채움 한의원",
        representative: "한동일",
        representativeTitle: "한의사",
        address: "서울특별시 강남구 논현동 987",
        tel: "1899-1156",
        fax: "02-567-8901",
        businessNumber: "678-90-12345",
        naverSearchKeyword: "에버한의원",
        defaultTopic: "body-type",
        personas: {
            healthcare: {
                name: "한결",
                title: "한방 코디네이터",
                purpose: "체질 상담 및 내원 유도",
                tone: "정갈함, 편안함, 자연친화적, 차분함",
                rules: ["체질 이야기로 흥미 유발", "근본적인 치료 강조"]
            },
            medical: {
                name: "박원장",
                title: "진료 원장",
                purpose: "한약/침 치료 예약",
                tone: "지혜로움, 깊이 있음, 신뢰감",
                rules: ["환자의 전체적인 균형 강조", "1:1 맞춤 처방 강조"]
            }
        },
        theme: {
            primary: "#B45309",
            secondary: "#78350F",
            accent: "#D97706",
            background: "#FEF3C7",
            text: "#451a03",
            concept: "전통과 현대의 조화"
        },
        officeHours: {
            start: "09:30",
            end: "19:00",
            closedDays: [0]
        }
    },
    neurosurgery: {
        id: 'neurosurgery',
        dept: '신경외과',
        name: "강남신경외과",
        marketingName: "브레인 & 스파인 센터",
        representative: "신경수",
        representativeTitle: "신경외과 전문의",
        address: "서울특별시 강남구 삼성로 300",
        tel: "02-345-6789",
        fax: "02-345-6780",
        businessNumber: "345-67-89012",
        naverSearchKeyword: "강남신경외과",
        defaultTopic: "headache-check",
        personas: {
            healthcare: {
                name: "브레인",
                title: "건강상담사",
                purpose: "두통/척추 상담 및 검사 유도",
                tone: "명석함, 정확함, 분석적",
                rules: ["자가진단은 피하고 검사 권유", "조기 발견 중요성 강조"]
            },
            medical: {
                name: "정실장",
                title: "수술 상담 실장",
                purpose: "정밀 검사 및 수술 예약",
                tone: "진중함, 무거움 없애는 안심 톤, 전문적",
                rules: ["최신 장비/기술 강조", "완치 사례 언급"]
            }
        },
        theme: {
            primary: "#4F46E5", // Indigo
            secondary: "#4338CA",
            accent: "#6366F1",
            background: "#EEF2FF",
            text: "#312E81",
            concept: "뇌와 척추의 중심"
        },
        officeHours: {
            start: "09:00",
            end: "18:00",
            lunchStart: "13:00",
            lunchEnd: "14:00",
            closedDays: [0]
        }
    },
    obgyn: {
        id: 'obgyn',
        dept: '산부인과',
        name: "미즈사랑 산부인과",
        marketingName: "로즈 여성병원",
        representative: "여미소",
        representativeTitle: "산부인과 전문의",
        address: "서울특별시 송파구 가락로 150",
        tel: "02-400-5000",
        fax: "02-400-5001",
        businessNumber: "400-50-00500",
        naverSearchKeyword: "미즈사랑산부인과",
        defaultTopic: "cycle-check",
        personas: {
            healthcare: {
                name: "로즈",
                title: "여성 건강 매니저",
                purpose: "여성 질환 상담 및 검진 유도",
                tone: "따뜻함, 공감 능력 뛰어남, 언니 같은 편안함",
                rules: ["여성 프라이버시 최우선", "편안한 분위기 조성"]
            },
            medical: {
                name: "김간호과장",
                title: "간호과장",
                purpose: "산전/부인과 진료 예약",
                tone: "친정 엄마 같은 푸근함, 전문적 조언",
                rules: ["세심한 배려", "정기 검진 중요성 강조"]
            }
        },
        theme: {
            primary: "#DB2777", // Pink 600
            secondary: "#BE185D",
            accent: "#F472B6",
            background: "#FDF2F8",
            text: "#831843",
            concept: "여성을 위한 따뜻한 공간"
        },
        officeHours: {
            start: "09:30",
            end: "18:30",
            lunchStart: "13:00",
            lunchEnd: "14:00",
            closedDays: [0]
        }
    },
    oncology: {
        id: 'oncology',
        dept: '종양내과',
        name: "희망암센터",
        marketingName: "새희망 암 통합 케어 센터",
        representative: "김희망",
        representativeTitle: "혈액종양내과 전문의",
        address: "서울특별시 종로구 대학로 100",
        tel: "02-760-0114",
        fax: "02-760-0115",
        businessNumber: "760-01-14000",
        naverSearchKeyword: "희망암센터",
        defaultTopic: "immunity-up",
        personas: {
            healthcare: {
                name: "천사",
                title: "케어 코디네이터",
                purpose: "암 예방 상담 및 면역 요법 안내",
                tone: "희망적, 차분함, 따뜻함, 헌신적",
                rules: ["절대 긍정", "통합적인 케어 강조"]
            },
            medical: {
                name: "박팀장",
                title: "암 센터 코디네이터",
                purpose: "항암 치료 일정/입원 예약",
                tone: "진지함, 신중함, 깊은 공감",
                rules: ["환자 및 보호자 심리 지지", "최신 치료법 안내"]
            }
        },
        theme: {
            primary: "#059669", // Emerald 600
            secondary: "#047857",
            accent: "#10B981",
            background: "#ECFDF5",
            text: "#064E3B",
            concept: "치유와 회복"
        },
        officeHours: {
            start: "08:30",
            end: "17:30",
            lunchStart: "12:30",
            lunchEnd: "13:30",
            closedDays: [0, 6]
        }
    },
    pediatrics: {
        id: 'pediatrics',
        dept: '소아과',
        name: "아이튼튼 소아과",
        marketingName: "키즈웰 소아청소년과",
        representative: "박아이",
        representativeTitle: "소아청소년과 전문의",
        address: "서울특별시 노원구 노원로 200",
        tel: "02-930-7000",
        fax: "02-930-7001",
        businessNumber: "930-70-00700",
        naverSearchKeyword: "아이튼튼소아과",
        defaultTopic: "growth-check",
        personas: {
            healthcare: {
                name: "토끼쌤",
                title: "육아 상담사",
                purpose: "아이 건강 상담 및 접종 안내",
                tone: "명랑함, 아이 눈높이, 다정함",
                rules: ["육아 고충 공감", "쉬운 용어 사용"]
            },
            medical: {
                name: "나이팅게일",
                title: "수간호사",
                purpose: "진료 예약 및 예방접종 관리",
                tone: "베테랑의 여유, 안심시키는 톤",
                rules: ["아이를 안심시키는 화법", "부모님께 명확한 지침 전달"]
            }
        },
        theme: {
            primary: "#FBBF24", // Amber 400 (Yellowish)
            secondary: "#F59E0B",
            accent: "#FCD34D",
            background: "#FFFBEB",
            text: "#92400E",
            concept: "꿈과 희망이 자라는 곳"
        },
        officeHours: {
            start: "09:00",
            end: "20:00", // 야간 진료
            lunchStart: "12:30",
            lunchEnd: "14:00",
            closedDays: [0]
        }
    }
};

export const DEFAULT_DEPARTMENT: DepartmentId = 'dermatology';
