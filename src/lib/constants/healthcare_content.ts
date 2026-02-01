
export interface HealthcareSession {
    sessionA: {
        title: string;
        subtitle: string;
        checkList: string[];
        cta: string;
    };
    sessionB: {
        title: string;
        cards: {
            title: string;
            description: string;
        }[];
    };
    sessionC: {
        title: string;
        description: string;
        cta: string;
    };
    sessionD: {
        title: string;
        faqs: {
            question: string;
            answer: string;
        }[];
    };
}

export const HEALTHCARE_CONTENT: Record<string, HealthcareSession> = {
    "dermatology": {
        sessionA: {
            title: "피부 고민 60초 정리",
            subtitle: "오늘 피부가 무너지는 원인을 3가지로 압축해드립니다.",
            checkList: ["여드름", "기미/잡티", "안면홍조", "모공/흉터", "탄력/주름", "민감성"],
            cta: "AI 시뮬레이션 시작"
        },
        sessionB: {
            title: "생활 루틴 처방전",
            cards: [
                { title: "세안·보습 루틴 리셋", description: "자극 최소화 체크리스트 확인하기" },
                { title: "자외선/색소 관리", description: "계절·실내외 상황별 가이드" },
                { title: "트러블 악화 요인 점검", description: "수면, 식습관, 마스크 마찰 체크" }
            ]
        },
        sessionC: {
            title: "회원 전용: 피부 상태 기반 맞춤 플랜",
            description: "피부과 전문 프로토콜 + AI 요약으로 상담 시간을 줄입니다.",
            cta: "로그인 후 개인 플랜 받기"
        },
        sessionD: {
            title: "자주 묻는 질문",
            faqs: [
                { question: "사진만으로 진단하나요?", answer: "진단은 내원 후 의료진 판단, 앱은 상담 준비를 돕는 도구입니다." },
                { question: "시술 추천을 바로 하나요?", answer: "생활/피부관리 우선, 필요 시 상담 후 결정합니다." },
                { question: "민감 피부도 가능한가요?", answer: "자극 최소화 기준으로 가이드를 제공합니다." }
            ]
        }
    },
    "dentistry": {
        sessionA: {
            title: "치아 고민 분기점 체크",
            subtitle: "통증/시림/잇몸/교정, 지금 우선순위를 잡아드립니다.",
            checkList: ["통증 강도", "시림 지속시간", "잇몸출혈 빈도", "씹을 때 불편감"],
            cta: "증상 체크 시작"
        },
        sessionB: {
            title: "치과 내원 전 준비 가이드",
            cards: [
                { title: "통증 시 응급 신호", description: "내원 권장 기준 확인하기" },
                { title: "기본 치료 흐름", description: "스케일링·충치·잇몸치료 과정" },
                { title: "교정/보철 상담 준비", description: "질문 리스트 미리보기" }
            ]
        },
        sessionC: {
            title: "회원 전용: 진료 시나리오 요약 + 예약",
            description: "체크 결과 기반으로 진료 시 확인할 항목을 정리해드립니다.",
            cta: "로그인 후 상담 요약 받기"
        },
        sessionD: {
            title: "신뢰 원칙",
            faqs: [
                { question: "진료 원칙", answer: "진료 과정, 비용 항목, 치료 선택지를 투명하게 설명하는 것을 원칙으로 합니다." },
                { question: "의사 결정", answer: "결정은 환자-의료진의 공동 의사결정으로 진행됩니다." }
            ]
        }
    },
    "orthopedics": {
        sessionA: {
            title: "통증 패턴으로 원인 후보 좁히기",
            subtitle: "허리/목/어깨/무릎 통증, ‘언제·어떻게’ 아픈지가 핵심입니다.",
            checkList: ["통증 발생 자세", "야간통 여부", "손발 저림 동반", "운동/휴식 반응"],
            cta: "통증 패턴 체크"
        },
        sessionB: {
            title: "오늘 할 수 있는 10분 관리",
            cards: [
                { title: "통증 악화 자세 피하기", description: "업무/운전/수면 자세 교정" },
                { title: "온찜질 vs 냉찜질", description: "상황별 찜질 선택 기준" },
                { title: "무리 없는 스트레칭", description: "부위별 안전한 3가지 동작" }
            ]
        },
        sessionC: {
            title: "회원 전용: 내원 시 검사·진료 포인트 정리",
            description: "체크 결과에 따라 영상검사/물리치료/재활 상담 필요성을 정리해드립니다.",
            cta: "로그인 후 진료 준비 요약 받기"
        },
        sessionD: {
            title: "자주 묻는 질문",
            faqs: [
                { question: "운동해도 되나요?", answer: "통증 양상에 따라 다릅니다. 안전한 범위를 안내해 드립니다." }
            ]
        }
    },
    "urology": {
        sessionA: {
            title: "민감 고민, 익명으로 먼저 정리",
            subtitle: "말하기 어려운 증상일수록, 구조화하면 빨라집니다.",
            checkList: ["빈뇨/야뇨", "배뇨통", "잔뇨감", "불편감(기간·빈도)"],
            cta: "익명 증상 체크"
        },
        sessionB: {
            title: "생활 요인 점검",
            cards: [
                { title: "수분 섭취 습관", description: "적정 수분 섭취량 가이드" },
                { title: "카페인/알코올 영향", description: "증상과 생활 습관의 연관성" },
                { title: "수면/스트레스 관리", description: "컨디션 회복을 위한 팁" }
            ]
        },
        sessionC: {
            title: "회원 전용: 상담 요약 + 예약 연결",
            description: "민감 정보는 최소 입력, 의료진 상담을 위한 문진 요약을 생성합니다.",
            cta: "로그인 후 의료진 상담 연결"
        },
        sessionD: {
            title: "안내 문구",
            faqs: [
                { question: "서비스 안내", answer: "개인 상태에 따라 원인이 다양하며, 앱은 진료 전 준비를 돕습니다." }
            ]
        }
    },
    "internal-medicine": {
        sessionA: {
            title: "건강검진 수치, 의미를 번역",
            subtitle: "수치가 불안을 만들 때, 해석의 기준을 제공합니다.",
            checkList: ["혈압", "혈당", "콜레스테롤", "간수치"],
            cta: "검진 수치 해석 시작"
        },
        sessionB: {
            title: "만성관리 루틴 7일 플랜",
            cards: [
                { title: "식단 점검", description: "건강한 식습관 체크" },
                { title: "운동 루틴", description: "무리 없는 운동 계획" },
                { title: "수면/스트레스", description: "생활 리듬 회복 가이드" }
            ]
        },
        sessionC: {
            title: "회원 전용: 의료진 상담 질문 자동 생성",
            description: "내원 시 꼭 물어봐야 할 질문 5개와 추적 관리 리스트를 제공합니다.",
            cta: "로그인 후 맞춤 질문 받기"
        },
        sessionD: {
            title: "자주 묻는 질문",
            faqs: [
                { question: "약을 끊어도 되나요?", answer: "중단/변경은 의료진과 상의해야 하며, 앱은 정보만 제공합니다." }
            ]
        }
    },
    "korean-medicine": {
        sessionA: {
            title: "컨디션 패턴 기록",
            subtitle: "몸의 리듬을 기록하면 상담이 정확해집니다.",
            checkList: ["수면의 질", "소화 상태", "피로도", "두통/냉증", "스트레스"],
            cta: "컨디션 패턴 체크"
        },
        sessionB: {
            title: "일상 관리 가이드",
            cards: [
                { title: "식이 조절 팁", description: "체질에 맞는 식습관" },
                { title: "수면 패턴 개선", description: "숙면을 위한 생활 수칙" },
                { title: "활동량 조절", description: "무리 없는 활동 가이드" }
            ]
        },
        sessionC: {
            title: "회원 전용: 상담 요약 + 내원 목표 설정",
            description: "피로개선, 통증관리 등 목표를 설정하고 상담 우선순위를 정리합니다.",
            cta: "로그인 후 목표 플랜 받기"
        },
        sessionD: {
            title: "안내 문구",
            faqs: [
                { question: "안내", answer: "개인 체질·상태에 따라 접근이 달라질 수 있습니다." }
            ]
        }
    },
    "plastic-surgery": {
        sessionA: {
            title: "원하는 변화, 현실적 범위부터",
            subtitle: "기대치 정렬이 상담 만족도를 결정합니다.",
            checkList: ["눈 성형", "코 성형", "윤곽/양악", "피부/쁘띠", "체형/지방", "재수술"],
            cta: "상담 준비 체크"
        },
        sessionB: {
            title: "상담 전 체크리스트",
            cards: [
                { title: "이미지/우선순위", description: "원하는 스타일 구체화" },
                { title: "회복기간 체크", description: "일상 복귀 기준 확인" },
                { title: "리스크 점검", description: "부작용/주의사항 리스트" }
            ]
        },
        sessionC: {
            title: "회원 전용: 개인화 상담 요약 + 예약",
            description: "질문 리스트를 자동으로 정리하여 상담 시간을 효율적으로 만듭니다.",
            cta: "로그인 후 상담 요약 받기"
        },
        sessionD: {
            title: "신뢰 원칙",
            faqs: [
                { question: "광고 리스크 최소화", answer: "결과는 개인차가 있으며, 안전과 적합성 평가를 우선합니다." }
            ]
        }
    },
    "pediatrics": {
        sessionA: {
            title: "아이 증상, 보호자용 체크",
            subtitle: "열/기침/복통/발진, 관찰 포인트를 정리해드립니다.",
            checkList: ["체온 변화", "활동성 체크", "수분 섭취량", "호흡 양상", "증상 지속"],
            cta: "증상 체크 시작"
        },
        sessionB: {
            title: "집에서의 안전 관리 가이드",
            cards: [
                { title: "응급 신호 확인", description: "바로 내원이 필요한 경우" },
                { title: "기본 관리 원칙", description: "해열, 수분, 휴식 가이드" },
                { title: "등원/등교 판단", description: "단체 생활 가능 여부" }
            ]
        },
        sessionC: {
            title: "회원 전용: 진료용 요약 텍스트 생성",
            description: "보호자가 말로 설명하기 어려운 정보를 5줄 요약으로 자동 생성합니다.",
            cta: "로그인 후 진료 요약 만들기"
        },
        sessionD: {
            title: "자주 묻는 질문",
            faqs: [
                { question: "항생제 필요할까요?", answer: "의료진 판단이 필요하며, 앱은 질문 준비를 돕습니다." }
            ]
        }
    },
    "neurosurgery": {
        sessionA: {
            title: "신경 증상 체크 (경고 신호)",
            subtitle: "두통/저림/어지럼, ‘위험 신호’부터 확인합니다.",
            checkList: ["심한 두통", "마비/언어장애", "시야 이상", "보행 문제"],
            cta: "증상 체크"
        },
        sessionB: {
            title: "경과 기록 도구",
            cards: [
                { title: "증상 시작 시점", description: "언제부터 아팠나요?" },
                { title: "빈도와 강도", description: "얼마나 자주 아픈가요?" },
                { title: "악화/완화 요인", description: "어떨 때 더 아픈가요?" }
            ]
        },
        sessionC: {
            title: "회원 전용: 내원 시 확인 항목 정리",
            description: "검사/상담에서 놓치기 쉬운 질문 리스트와 기록을 정리해드립니다.",
            cta: "로그인 후 상담 준비"
        },
        sessionD: {
            title: "안내 문구",
            faqs: [
                { question: "주의사항", answer: "심각한 증상이 의심되면 즉시 의료기관 방문이 필요할 수 있습니다." }
            ]
        }
    },
    "obgyn": {
        sessionA: {
            title: "주기·증상 기반 체크",
            subtitle: "생리통/불규칙/분비물/통증, 패턴이 힌트입니다.",
            checkList: ["주기 길이", "통증 강도", "동반 증상", "임신 가능성"],
            cta: "증상 체크 시작"
        },
        sessionB: {
            title: "일상 관리 및 내원 기준",
            cards: [
                { title: "생활 요인 분석", description: "수면, 스트레스, 체중" },
                { title: "내원 권장 기준", description: "진료가 필요한 증상 알기" },
                { title: "건강 리듬 찾기", description: "규칙적인 생활 가이드" }
            ]
        },
        sessionC: {
            title: "회원 전용: 상담 요약 + 예약",
            description: "민감 정보는 최소화하고, 문진 요약을 자동으로 생성해드립니다.",
            cta: "로그인 후 상담 연결"
        },
        sessionD: {
            title: "자주 묻는 질문",
            faqs: [
                { question: "검사/진료가 무섭습니다", answer: "절차를 단계별로 안내하고 준비물과 주의사항을 알려드립니다." }
            ]
        }
    },
    "oncology": {
        sessionA: {
            title: "회복 목표 설정",
            subtitle: "치료 이후의 삶은 ‘회복 계획’에서 시작됩니다.",
            checkList: ["식사 관리", "수면 관리", "통증 관리", "활동/운동", "정서 안정"],
            cta: "회복 계획 시작"
        },
        sessionB: {
            title: "일상 루틴 가이드",
            cards: [
                { title: "식사 원칙", description: "소화/식욕 저하 대응" },
                { title: "수면 관리", description: "불면/낮밤 바뀜 대응" },
                { title: "활동 가이드", description: "무리 없는 산책/스트레칭" }
            ]
        },
        sessionC: {
            title: "회원 전용: 의료진 상담 준비",
            description: "현재 상태와 목표, 불편 증상을 구조화하여 상담을 돕습니다.",
            cta: "로그인 후 상담 요약 및 예약"
        },
        sessionD: {
            title: "자주 묻는 질문",
            faqs: [
                { question: "완치되나요?", answer: "치료 목표는 개인 상황에 따라 다르며, 의료진 상담이 필요합니다." },
                { question: "치료 프로그램", answer: "프로그램 구성 요소와 생활관리 중심으로 안내해 드립니다." }
            ]
        }
    }
};
