
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
    /** Session 3 시뮬레이션 설명 */
    simulation: {
        title: string;
        description: string;
        buttonLabel: string;
        resultCta: string;
    };
    /** Session 4 챗 메뉴 (로그인 전/후 분리) */
    chatMenu: {
        beforeLogin: string[];
        afterLogin: string[];
        privacyCopy?: string;
    };
    /** Session 5 Trust: 안전고지 + FAQ */
    trust: {
        faqs: {
            question: string;
            answer: string;
        }[];
        safetyNotices: string[];
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
        },
        simulation: {
            title: "물광/톤업 시뮬레이션",
            description: "내 사진으로 물광·톤업(미백) 효과를 미리 확인해보세요.",
            buttonLabel: "효과 미리보기",
            resultCta: "로그인하고 내 피부 타입 반영"
        },
        chatMenu: {
            beforeLogin: ["피부 타입 자가 체크(3문항)", "시술/관리 상식"],
            afterLogin: ["내 사진/고민 기반 루틴 추천", "병원 상담 질문 리스트 자동 생성"]
        },
        trust: {
            faqs: [
                { question: "사진만으로 진단하나요?", answer: "진단은 내원 후 의료진 판단, 앱은 상담 준비를 돕는 도구입니다." },
                { question: "시술 추천을 바로 하나요?", answer: "생활/피부관리 우선, 필요 시 상담 후 결정합니다." },
                { question: "민감 피부도 가능한가요?", answer: "자극 최소화 기준으로 가이드를 제공합니다." }
            ],
            safetyNotices: [
                "시뮬레이션은 이해를 돕기 위한 예시이며 실제 결과는 개인차가 있습니다.",
                "의학적 진단·처방은 의료진 상담을 통해 진행됩니다."
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
        },
        simulation: {
            title: "미백 시뮬레이션",
            description: "내 치아 사진으로 쉐이드를 측정하고 미백 효과를 미리 확인하세요.",
            buttonLabel: "쉐이드 측정하기",
            resultCta: "미백 상담 예약"
        },
        chatMenu: {
            beforeLogin: ["미백 방식 차이(오피스/홈/라미네이트) Q&A"],
            afterLogin: ["내 예산/기간 기반 옵션 추천", "상담 시 질문 체크리스트"]
        },
        trust: {
            faqs: [
                { question: "진료 과정은 어떻게 진행되나요?", answer: "진료 과정, 비용 항목, 치료 선택지를 투명하게 설명하는 것을 원칙으로 합니다." },
                { question: "치료 결정은 누가 하나요?", answer: "결정은 환자-의료진의 공동 의사결정으로 진행됩니다." },
                { question: "미백 시뮬레이션은 정확한가요?", answer: "시뮬레이션은 참고용이며, 실제 결과는 치아 상태에 따라 달라집니다." }
            ],
            safetyNotices: [
                "시뮬레이션은 이해를 돕기 위한 예시이며 실제 결과는 개인차가 있습니다.",
                "의학적 진단·처방은 의료진 상담을 통해 진행됩니다."
            ]
        }
    },
    "orthopedics": {
        sessionA: {
            title: "통증 패턴으로 원인 후보 좁히기",
            subtitle: "허리/목/어깨/무릎 통증, '언제·어떻게' 아픈지가 핵심입니다.",
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
        },
        simulation: {
            title: "통증 패턴 맵",
            description: "클릭/터치로 일상 동작별 통증 위치와 강도를 기록하세요.",
            buttonLabel: "통증 위치 기록",
            resultCta: "로그인하고 기록 저장 + 병원 매칭"
        },
        chatMenu: {
            beforeLogin: ["증상 정리 가이드(운동/자세/부하 질문)"],
            afterLogin: ["내 기록 기반 초진 질문 리스트 + 진료 준비물"]
        },
        trust: {
            faqs: [
                { question: "운동해도 되나요?", answer: "통증 양상에 따라 다릅니다. 안전한 범위를 안내해 드립니다." },
                { question: "수술이 꼭 필요한가요?", answer: "비수술 치료부터 단계적으로 접근하며, 의료진과 함께 결정합니다." },
                { question: "물리치료와 도수치료 차이는?", answer: "증상과 부위에 따라 적합한 방식이 다르며, 상담을 통해 안내합니다." }
            ],
            safetyNotices: [
                "시뮬레이션은 이해를 돕기 위한 예시이며 실제 결과는 개인차가 있습니다.",
                "의학적 진단·처방은 의료진 상담을 통해 진행됩니다."
            ]
        }
    },
    "urology": {
        sessionA: {
            title: "여유증 자가 체크",
            subtitle: "가슴 라인 고민, 유형과 방향을 먼저 정리합니다.",
            checkList: ["가슴 볼록감 정도", "통증/민감도", "체중 변화 여부", "운동 시 불편감"],
            cta: "여유증 체크 시작"
        },
        sessionB: {
            title: "여유증 수술 가이드",
            cards: [
                { title: "유형별 차이(지방형/유선형)", description: "수술 방식이 달라지는 기준" },
                { title: "수술 방식(지방흡입/절제)", description: "방식별 장단점 비교" },
                { title: "회복 타임라인", description: "압박복/운동 재개 시점 안내" }
            ]
        },
        sessionC: {
            title: "회원 전용: 상담 요약 + 예약 연결",
            description: "내 우선순위(흉터/회복/비용) 기반 질문 리스트를 자동 생성합니다.",
            cta: "로그인 후 여유증 상담 연결"
        },
        sessionD: {
            title: "안내 문구",
            faqs: [
                { question: "서비스 안내", answer: "개인 상태에 따라 원인이 다양하며, 앱은 진료 전 준비를 돕습니다." }
            ]
        },
        simulation: {
            title: "가슴 라인 변화 시뮬레이션",
            description: "상반신 정면/사선 사진에서 라인 변화 방향을 미리 확인하세요.",
            buttonLabel: "라인 변화 보기",
            resultCta: "여유증 상담 예약"
        },
        chatMenu: {
            beforeLogin: ["여유증 유형(지방형/유선형) 차이", "수술 방식(지방흡입/절제) 개념", "회복/압박복/운동 재개 시점"],
            afterLogin: ["내 우선순위(흉터/회복/비용) 기반 질문 리스트 생성", "상담 전 체크리스트(사진, 병력, 약물, 목표)", "병원 매칭(야간/당일 상담 가능)"],
            privacyCopy: "개인 정보는 로그인 후 안전하게 관리됩니다."
        },
        trust: {
            faqs: [
                { question: "수술 vs 비수술, 어떤 경우에 효과가 다른가요?", answer: "지방형은 지방흡입만으로 개선 가능하나, 유선형은 절제가 필요할 수 있습니다. 의료진 상담이 필요합니다." },
                { question: "흉터는 어디에 남고, 얼마나 눈에 띄나요?", answer: "유륜 주변 절개가 일반적이며, 시간이 지나면 거의 보이지 않습니다." },
                { question: "운동/샤워/일상 복귀는 언제부터 가능한가요?", answer: "샤워 3~5일, 가벼운 운동 2~3주, 본격적 운동 4~6주부터 가능합니다." }
            ],
            safetyNotices: [
                "시뮬레이션은 이해를 돕기 위한 예시이며 실제 결과는 개인차가 있습니다.",
                "의학적 진단·처방은 의료진 상담을 통해 진행됩니다."
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
        },
        simulation: {
            title: "생활습관 리스크 스코어",
            description: "간단 설문으로 수면/스트레스/활동 리스크를 측정하세요.",
            buttonLabel: "리스크 측정하기",
            resultCta: "로그인하고 기록 저장 + 병원 추천"
        },
        chatMenu: {
            beforeLogin: ["증상별 내원 기준(상식)"],
            afterLogin: ["내 기록 기반 상담 질문/검사 준비"]
        },
        trust: {
            faqs: [
                { question: "약을 끊어도 되나요?", answer: "중단/변경은 의료진과 상의해야 하며, 앱은 정보만 제공합니다." },
                { question: "검진 결과가 나쁘면 바로 치료하나요?", answer: "추가 검사와 경과 관찰이 필요할 수 있으며, 의료진이 판단합니다." },
                { question: "만성질환은 완치되나요?", answer: "관리 목표 설정이 중요하며, 꾸준한 추적이 핵심입니다." }
            ],
            safetyNotices: [
                "시뮬레이션은 이해를 돕기 위한 예시이며 실제 결과는 개인차가 있습니다.",
                "의학적 진단·처방은 의료진 상담을 통해 진행됩니다."
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
        },
        simulation: {
            title: "컨디션 밸런스 맵",
            description: "수면·피로·소화·스트레스 4축으로 내 밸런스를 확인하세요.",
            buttonLabel: "밸런스 측정하기",
            resultCta: "로그인하고 내 패턴 저장"
        },
        chatMenu: {
            beforeLogin: ["한방 치료 접근 Q&A"],
            afterLogin: ["내 패턴 기반 상담 질문/관리 루틴"]
        },
        trust: {
            faqs: [
                { question: "한방 치료는 과학적인가요?", answer: "근거 기반 한의학 연구가 활발히 진행되고 있으며, 개인 체질에 맞는 접근을 합니다." },
                { question: "침 치료가 아프나요?", answer: "미세한 통증이 있을 수 있으나, 대부분 편안하게 받으실 수 있습니다." },
                { question: "양·한방 병행이 가능한가요?", answer: "가능합니다. 복용 중인 약물을 알려주시면 안전하게 병행합니다." }
            ],
            safetyNotices: [
                "시뮬레이션은 이해를 돕기 위한 예시이며 실제 결과는 개인차가 있습니다.",
                "의학적 진단·처방은 의료진 상담을 통해 진행됩니다."
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
        },
        simulation: {
            title: "페이스 라인 변화 시뮬레이션",
            description: "윤곽 변화의 방향을 미리 확인하세요. (과장 없이 현실적 범위)",
            buttonLabel: "변화 방향 확인",
            resultCta: "로그인하고 내 조건으로 상담 질문 받기"
        },
        chatMenu: {
            beforeLogin: ["수술 vs 시술 차이", "회복 기간/흉터 상식"],
            afterLogin: ["내 우선순위(비용/회복/리스크) 기반 시나리오 비교"]
        },
        trust: {
            faqs: [
                { question: "시뮬레이션 결과대로 되나요?", answer: "시뮬레이션은 방향 참고용이며, 실제 결과는 개인 조건에 따라 달라집니다." },
                { question: "재수술 가능 여부는?", answer: "기존 수술 이력과 조직 상태에 따라 의료진이 판단합니다." },
                { question: "비용은 어떻게 결정되나요?", answer: "상담 후 시술 범위에 따라 개별 안내드립니다." }
            ],
            safetyNotices: [
                "시뮬레이션은 이해를 돕기 위한 예시이며 실제 결과는 개인차가 있습니다.",
                "의학적 진단·처방은 의료진 상담을 통해 진행됩니다."
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
        },
        simulation: {
            title: "증상 타임라인 카드",
            description: "아이의 증상을 사진/체온/메모로 시간순 기록하세요.",
            buttonLabel: "타임라인 만들기",
            resultCta: "로그인하고 아이 프로필로 저장"
        },
        chatMenu: {
            beforeLogin: ["응급/내원 기준 Q&A"],
            afterLogin: ["아이별 기록 관리 + 병원 예약 질문 자동 생성"]
        },
        trust: {
            faqs: [
                { question: "항생제 필요할까요?", answer: "의료진 판단이 필요하며, 앱은 질문 준비를 돕습니다." },
                { question: "열이 38도 넘으면 바로 가야 하나요?", answer: "체온과 동반 증상에 따라 다르며, 앱에서 응급 기준을 안내합니다." },
                { question: "아이가 약을 안 먹으면 어떡하나요?", answer: "투약 방법 팁과 대안을 의료진과 상의하실 수 있습니다." }
            ],
            safetyNotices: [
                "시뮬레이션은 이해를 돕기 위한 예시이며 실제 결과는 개인차가 있습니다.",
                "의학적 진단·처방은 의료진 상담을 통해 진행됩니다."
            ]
        }
    },
    "neurosurgery": {
        sessionA: {
            title: "신경 증상 체크 (경고 신호)",
            subtitle: "두통/저림/어지럼, '위험 신호'부터 확인합니다.",
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
        },
        simulation: {
            title: "증상 패턴 트래커",
            description: "발생 시간/유발요인/강도를 기록하고 시각화하세요.",
            buttonLabel: "패턴 기록 시작",
            resultCta: "로그인하고 기록 저장"
        },
        chatMenu: {
            beforeLogin: ["응급 신호 체크(상식)"],
            afterLogin: ["내 기록 기반 상담 질문/검사 준비"]
        },
        trust: {
            faqs: [
                { question: "두통이 심하면 바로 MRI를 찍어야 하나요?", answer: "증상 패턴에 따라 검사 우선순위가 다르며, 의료진이 판단합니다." },
                { question: "디스크와 협착증 차이는?", answer: "원인과 증상이 다르며, 영상검사를 통해 정확히 감별합니다." },
                { question: "수술 없이도 나을 수 있나요?", answer: "많은 경우 비수술 치료로 호전됩니다. 의료진과 상의하세요." }
            ],
            safetyNotices: [
                "시뮬레이션은 이해를 돕기 위한 예시이며 실제 결과는 개인차가 있습니다.",
                "의학적 진단·처방은 의료진 상담을 통해 진행됩니다.",
                "심각한 증상이 의심되면 즉시 의료기관 방문이 필요할 수 있습니다."
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
        },
        simulation: {
            title: "주기/증상 패턴 리포트",
            description: "내 주기와 증상을 캘린더로 시각화하세요.",
            buttonLabel: "패턴 확인하기",
            resultCta: "로그인하고 내 주기 기록 이어가기"
        },
        chatMenu: {
            beforeLogin: ["검사 종류/준비 상식"],
            afterLogin: ["개인화 상담 질문 + 병원 찾기"]
        },
        trust: {
            faqs: [
                { question: "검사/진료가 무섭습니다", answer: "절차를 단계별로 안내하고 준비물과 주의사항을 알려드립니다." },
                { question: "생리통이 심한데 병원에 가야 하나요?", answer: "일상에 지장이 있다면 검사를 권합니다. 원인 파악이 중요합니다." },
                { question: "임신 준비 시 뭘 먼저 해야 하나요?", answer: "기본 검사와 영양 상태 확인이 필요하며, 의료진 상담을 권합니다." }
            ],
            safetyNotices: [
                "시뮬레이션은 이해를 돕기 위한 예시이며 실제 결과는 개인차가 있습니다.",
                "의학적 진단·처방은 의료진 상담을 통해 진행됩니다."
            ]
        }
    },
    "oncology": {
        sessionA: {
            title: "회복 목표 설정",
            subtitle: "치료 이후의 삶은 '회복 계획'에서 시작됩니다.",
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
        },
        simulation: {
            title: "회복 루틴 플래너",
            description: "수면/영양/운동/정서 루틴을 체크카드로 구성하세요.",
            buttonLabel: "루틴 만들기",
            resultCta: "로그인하고 내 루틴 저장"
        },
        chatMenu: {
            beforeLogin: ["요양/회복 프로그램 개요(상식)"],
            afterLogin: ["개인화 질문 리스트 + 상담 준비 체크리스트"]
        },
        trust: {
            faqs: [
                { question: "완치되나요?", answer: "치료 목표는 개인 상황에 따라 다르며, 의료진 상담이 필요합니다." },
                { question: "요양병원과 일반 병원의 차이는?", answer: "회복·관리에 특화된 프로그램과 환경을 제공합니다." },
                { question: "가족은 어떻게 도울 수 있나요?", answer: "보호자 가이드와 정서 지원 정보를 안내합니다." }
            ],
            safetyNotices: [
                "시뮬레이션은 이해를 돕기 위한 예시이며 실제 결과는 개인차가 있습니다.",
                "의학적 진단·처방은 의료진 상담을 통해 진행됩니다."
            ]
        }
    }
};
