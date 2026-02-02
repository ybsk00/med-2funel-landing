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
            title: "피부, 왜 나만 안 좋아질까?",
            subtitle: "딱 1분만 투자하세요. 당신의 피부가 무너지는 진짜 원인을 찾아드립니다.",
            checkList: ["자고 일어나면 개기름", "오후 3시만 되면 칙칙함", "화장이 자꾸 뜨고 밀림", "세안 후 당김이 심함", "붉은기가 안 가라앉음"],
            cta: "내 피부 원인 찾기"
        },
        sessionB: {
            title: "피부과 가기 전, 이것부터 하세요",
            cards: [
                { title: "클렌징 습관 점검", description: "당신의 세안법이 피부를 망치고 있을지도 모릅니다." },
                { title: "화장품 다이어트", description: "비싼 화장품이 오히려 독이 되는 경우를 확인하세요." },
                { title: "숨은 자극 찾기", description: "베개 커버부터 마스크까지, 일상 속 범인을 잡으세요." }
            ]
        },
        sessionC: {
            title: "회원 전용: 당신만을 위한 피부 구원 플랜",
            description: "수많은 후기로 검증된 피부과 전문 프로토콜과 AI 분석을 결합해, 당신에게 딱 맞는 해결책을 제시합니다.",
            cta: "로그인하고 구원 플랜 받기"
        },
        sessionD: {
            title: "궁금한 점, 속 시원히 알려드립니다",
            faqs: [
                { question: "정말 사진만으로 알 수 있나요?", answer: "AI가 수만 건의 데이터를 학습하여 육안보다 정밀하게 1차 분석을 돕습니다. 확진은 의료진이 합니다." },
                { question: "비싼 시술만 권하는 거 아닌가요?", answer: "아닙니다. 생활 습관 교정부터 시작해 꼭 필요한 시술만 제안합니다." }
            ]
        },
        simulation: {
            title: "내 피부가 가장 빛나는 순간",
            description: "물광 주사 맞은 듯, 투명하게 빛나는 내 얼굴을 미리 확인해보세요. 포토샵보다 리얼합니다.",
            buttonLabel: "물광 효과 미리보기",
            resultCta: "이 피부로 돌아가기 (로그인)"
        },
        chatMenu: {
            beforeLogin: ["내 피부 타입 3초 진단", "요즘 뜨는 시술 진실 혹은 거짓"],
            afterLogin: ["내 얼굴 분석 기반 맞춤 화장품 추천", "피부과 상담 시 호갱 탈출 질문 리스트"]
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
            title: "치과 가기 무서워서 미루고 계신가요?",
            subtitle: "더 미루면 견적만 10배 뜁니다. 지금 1분 체크로 호미로 막을 것을 가래로 막지 마세요.",
            checkList: ["찬물 마실 때 찌릿함", "양치할 때 피가 남", "입 냄새가 심해짐", "턱에서 딱딱 소리"],
            cta: "치아 위험도 체크"
        },
        sessionB: {
            title: "치과 가기 전 필독 가이드",
            cards: [
                { title: "통증별 응급도", description: "지금 바로 가야 할 통증 vs 지켜봐도 되는 통증" },
                { title: "과잉진료 피하는 법", description: "치과 의사가 알려주는 호갱 안 당하는 꿀팁" },
                { title: "치료 비용 미리보기", description: "대략적인 견적을 알고 가야 당황하지 않습니다." }
            ]
        },
        sessionC: {
            title: "회원 전용: 내 치아 지킴이 리포트",
            description: "체크 결과를 바탕으로 의사 선생님께 보여드리면 딱 좋은 '상담 요약본'을 만들어 드립니다.",
            cta: "로그인하고 리포트 받기"
        },
        sessionD: {
            title: "투명한 진료를 약속합니다",
            faqs: [
                { question: "과잉진료가 걱정돼요", answer: "꼭 필요한 치료만, 이유와 함께 설명해 드리는 병원만 연결해 드립니다." }
            ]
        },
        simulation: {
            title: "연예인처럼 하얀 치아, 나도 될까?",
            description: "누런 이 때문에 웃을 때 입 가리시나요? 3초 만에 자신감 넘치는 미소를 찾아드립니다.",
            buttonLabel: "미백 시뮬레이션 GO",
            resultCta: "자신감 되찾으러 가기"
        },
        chatMenu: {
            beforeLogin: ["치아 미백, 집에서 해도 될까?", "라미네이트 부작용, 진짜일까?"],
            afterLogin: ["내 예산으로 가능한 최적의 치료법", "치과 상담 시 필수 질문 리스트"]
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
            title: "참으면 병 됩니다, 통증의 원인을 찾으세요",
            subtitle: "파스만 붙이다가 수술대 오를 수 있습니다. 1분 기록으로 내 통증의 '진짜 원인'을 잡으세요.",
            checkList: ["허리가 끊어질 듯 아픔", "어깨가 돌덩이처럼 뭉침", "걸을 때마다 무릎 시큰", "손목이 찌릿찌릿"],
            cta: "통증 원인 추적하기"
        },
        sessionB: {
            title: "병원 가기 전, 집에서 10분 케어",
            cards: [
                { title: "자세가 문제다", description: "당신의 허리를 망치는 최악의 자세 교정법" },
                { title: "냉찜질? 온찜질?", description: "상황별 정답을 알려드립니다. (잘못하면 더 아파요)" },
                { title: "1분 스트레칭", description: "굳은 몸을 풀어주는 기적의 1분 투자" }
            ]
        },
        sessionC: {
            title: "회원 전용: 통증 정밀 분석 리포트",
            description: "로그인하면 14가지 정밀 질문으로 당신의 통증 패턴을 분석하고, 딱 맞는 병원을 추천해 드립니다.",
            cta: "로그인하고 통증 잡기"
        },
        sessionD: {
            title: "수술만이 답은 아닙니다",
            faqs: [
                { question: "꼭 수술해야 하나요?", answer: "90%는 비수술로 좋아질 수 있습니다. 정확한 진단이 먼저입니다." }
            ]
        },
        simulation: {
            title: "내 통증, 어디가 문제일까?",
            description: "아픈 곳을 콕 찍으면, 의사 선생님이 물어볼 질문을 미리 정리해 드립니다.",
            buttonLabel: "통증 지도 그리기",
            resultCta: "분석 결과 들고 병원 가기"
        },
        chatMenu: {
            beforeLogin: ["운동하다 다쳤을 때 응급처치", "디스크 vs 단순 근육통 구별법"],
            afterLogin: ["내 통증 기록 기반 초진 질문지", "도수치료 실비 보험 적용 가이드"]
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
            title: "남모를 고민 여유증, 이제 숨기지 말고 해결하세요.",
            subtitle: "운동으로도 해결 안 되는 가슴살, 정밀 AI 분석으로 원인부터 결과까지 미리 확인하세요.",
            checkList: ["티셔츠 입기가 두려울 때", "가슴에 몽우리가 잡힐 때", "다이어트에도 가슴만 그대로일 때", "유두 주변이 유독 튀어나올 때"],
            cta: "여유증 정밀 진단 시작"
        },
        sessionB: {
            title: "프라이버시는 기본, 결과는 프리미엄",
            cards: [
                { title: "압도적 기술력", description: "흉터를 최소화하는 정밀 절제술과 체계적인 사후 관리 시스템" },
                { title: "비밀 보장 상담", description: "모든 상담과 기록은 철저히 암호화되어 당신의 프라이버시를 지킵니다." },
                { title: "당당한 일상 복귀", description: "평균 1-3일 내 일상 복귀. 이제 넓은 어깨와 탄탄한 가슴으로 당당해지세요." }
            ]
        },
        sessionC: {
            title: "온케어봇: 비공개 맞춤 상담",
            description: "로그인 시, 당신의 상태에 최적화된 비뇨기과 전문 질문 리스트와 예상 수술 견적을 단독 공개합니다.",
            cta: "로그인하고 맞춤 상담 받기"
        },
        sessionD: {
            title: "품격 있는 남성을 위한 선택",
            faqs: [
                { question: "수술 후 운동은 언제 가능한가요?", answer: "가벼운 걷기는 당일부터, 고강도 운동은 3~4주 후부터 권장합니다." }
            ]
        },
        simulation: {
            title: "가장 완벽한 가슴 라인, 미리 확인하세요",
            description: "수술 후 변화될 당신의 컨투어를 3D 시뮬레이션으로 보여드립니다. 1분의 투자로 인생이 달라집니다.",
            buttonLabel: "3D 체형 시뮬레이션",
            resultCta: "상담 예약 및 결과 저장"
        },
        chatMenu: {
            beforeLogin: ["여유증 수술 비용/실비 보험", "유선 조직 제거 vs 지방흡입"],
            afterLogin: ["내 전/후 사진 기반 정밀 분석", "회복 기간 단축을 위한 전담 케어 문의"]
        },
        trust: {
            faqs: [
                { question: "정말 흉터가 거의 안 보이나요?", answer: "유륜 미세 절개를 통해 눈에 띄지 않는 결과를 만드는 것이 노하우입니다." },
                { question: "실비 보험 적용이 가능한가요?", answer: "유선 조직의 두께와 지방 정도에 따라 질병으로 분류될 경우 가능합니다. 챗봇 상담을 통해 확인해보세요." },
                { question: "수술 시간은 얼마나 걸리나요?", answer: "평균 40분에서 1시간 내외이며, 당일 퇴원이 가능합니다." }
            ],
            safetyNotices: [
                "모든 데이터는 프라이버시 정책에 따라 익명으로 처리됩니다.",
                "시뮬레이션은 이해를 돕기 위한 보조 도구이며 전문의 진단이 필수입니다."
            ]
        }
    },
    "internal-medicine": {
        sessionA: {
            title: "원인 모를 피로와 통증, 이제 데이터로 정리하세요.",
            subtitle: "단순한 컨디션 난조일까요? 1분 건강 리스크 점검으로 내 몸이 보내는 신호의 원인을 좁혀드립니다.",
            checkList: ["자도 자도 풀리지 않는 피로", "식후 반복되는 더부룩함/속쓰림", "일시적인 심계항진/어지럼", "갑작스러운 체중 변화"],
            cta: "내 리스크 스코어 확인"
        },
        sessionB: {
            title: "내과 진료 전, 3요소 체크가 핵심입니다",
            cards: [
                { title: "증상 히스토리", description: "언제, 어떻게 아픈지 기록하는 것만으로도 오진율은 현격히 낮아집니다." },
                { title: "생활 패턴 분석", description: "수면, 식습관, 스트레스 지수가 현재 증상에 미치는 영향력을 수치화합니다." },
                { title: "효율적 상담 준비", description: "의사에게 꼭 물어봐야 할 질문 리스트를 미리 준비하여 진료 효율을 극대화하세요." }
            ]
        },
        sessionC: {
            title: "맞춤형 정밀 문진 리포트",
            description: "로그인 시, 당신의 응답 결과를 바탕으로 전문의 상담 시 바로 보여줄 수 있는 '골든타임 문진표'를 생성해 드립니다.",
            cta: "로그인하고 문진표 받기"
        },
        sessionD: {
            title: "데이터가 증명하는 정확한 진료",
            faqs: [
                { question: "내과 검진은 얼마나 자주 해야 하나요?", answer: "연령과 기저질환에 따라 다르지만, 일반 성인은 연 1회 종합 검진을 권장합니다." }
            ]
        },
        simulation: {
            title: "2분 건강 리스크 점검",
            description: "생활습관과 증상을 정리하면, 상담 질문과 준비사항이 자동으로 생성됩니다. 진단이 아닌 '준비'입니다.",
            buttonLabel: "점검 시작하기",
            resultCta: "분석 결과 들고 병원 가기"
        },
        chatMenu: {
            beforeLogin: ["건강검진 수치 해석 가이드", "증상별 진료과목(내과/가정의학과) 추천"],
            afterLogin: ["내 리스크 기반 맞춤 영양제 상담", "주변 검진 잘하는 내과 매칭"]
        },
        trust: {
            faqs: [
                { question: "정말 약을 안 먹고 생활습관만으로 좋아지나요?", answer: "많은 만성질환 초기 단계에서는 생활습관 교정만으로도 유의미한 수치 개선을 기대할 수 있습니다." },
                { question: "검진 결과가 정상인데 계속 불편해요.", answer: "기능적인 문제일 수 있습니다. 정밀 문진 리포트를 통해 구체적인 상담을 받아보세요." },
                { question: "가족력이 있으면 무조건 유전되나요?", answer: "위험도는 높아지지만, 관리를 통해 발병을 늦추거나 예방할 수 있는 폭이 큽니다." }
            ],
            safetyNotices: [
                "본 기능은 일반 정보 제공을 위한 것이며 진단/처방이 아닙니다.",
                "증상이 지속되거나 심하면 반드시 전문 의료진의 진료를 받으시기 바랍니다."
            ]
        }
    },
    "korean-medicine": {
        sessionA: {
            title: "원인 모를 불편함, 몸의 소리를 들으세요",
            subtitle: "병원은 이상 없다는데 나는 아프다? 한의학적 관점으로 당신의 몸 밸런스를 체크해 드립니다.",
            checkList: ["자도 자도 피곤함", "소화가 늘 더부룩함", "손발이 차고 저림", "화가 자주 남"],
            cta: "내 몸 밸런스 체크"
        },
        sessionB: {
            title: "자연 치유력을 깨우는 습관",
            cards: [
                { title: "체질별 식단 가이드", description: "나에게 약이 되는 음식 vs 독이 되는 음식" },
                { title: "순환을 돕는 생활", description: "꽉 막힌 기혈을 뚫어주는 하루 루틴" },
                { title: "마음 챙김", description: "스트레스로 굳은 몸과 마음을 풀어주는 법" }
            ]
        },
        sessionC: {
            title: "회원 전용: 맞춤형 한방 치료 플랜",
            description: "침, 뜸, 한약... 나에게 지금 필요한 치료가 무엇인지 미리 가이드해 드립니다.",
            cta: "로그인하고 플랜 받기"
        },
        sessionD: {
            title: "전통과 과학의 만남",
            faqs: [
                { question: "침, 진짜 효과 있나요?", answer: "WHO도 인정한 침 치료 효과, 과학적으로 증명되었습니다." }
            ]
        },
        simulation: {
            title: "내 몸의 오행 밸런스 맵",
            description: "어디가 약하고 어디가 강한지 눈으로 확인하세요. 내 몸 사용 설명서가 됩니다.",
            buttonLabel: "밸런스 확인하기",
            resultCta: "로그인하고 체질별 처방 받기"
        },
        chatMenu: {
            beforeLogin: ["나는 태양인일까 태음인일까?", "한약, 간에 안 좋다던데?"],
            afterLogin: ["내 체질 기반 건강 관리 꿀팁", "야간 진료 한의원 찾기"]
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
            title: "예뻐지고 싶은데, 실패할까 봐 두려운가요?",
            subtitle: "성형은 '어디서' 하느냐보다 '무엇을' 아느냐가 중요합니다. 실패 없는 성형, 여기서 시작하세요.",
            checkList: ["자연스러운 라인을 원함", "화려하고 뚜렷한 변화를 원함", "부작용이 너무 걱정됨", "재수술이라 신중함"],
            cta: "실패 없는 상담 체크"
        },
        sessionB: {
            title: "성형외과 가기 전 필수 체크리스트",
            cards: [
                { title: "나만의 워너비 찾기", description: "막연한 '예쁘게'는 그만. 구체적인 스타일을 정하세요." },
                { title: "회복 기간 미리보기", description: "멍, 붓기 언제 빠질까? 현실적인 스케줄 짜기" },
                { title: "블랙리스트 거르는 법", description: "광고에 속지 않고 진짜 실력 있는 병원 찾는 법" }
            ]
        },
        sessionC: {
            title: "회원 전용: AI 가상 성형 상담",
            description: "사진 한 장으로 내 얼굴의 잠재력을 확인하고, 딱 맞는 수술 플랜을 제안받으세요.",
            cta: "로그인하고 AI 상담 받기"
        },
        sessionD: {
            title: "당신의 아름다움을 안전하게",
            faqs: [
                { question: "성형하면 다 똑같아지지 않나요?", answer: "개성을 살리면서 단점만 보완하는 것이 트렌드입니다." }
            ]
        },
        simulation: {
            title: "내 얼굴, 어디까지 예뻐질 수 있을까?",
            description: "수술 없이 미리 보는 나의 변화. 과장 없는 현실적인 결과를 보여드립니다.",
            buttonLabel: "변화된 모습 확인하기",
            resultCta: "로그인하고 견적 알아보기"
        },
        chatMenu: {
            beforeLogin: ["쌍수 매몰 vs 절개 차이점", "코 필러 vs 수술 뭐가 나을까?"],
            afterLogin: ["내 예산/회복기간 맞춤 시술 추천", "상담 시 기선 제압하는 질문 리스트"]
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
            title: "우리 아이 열나는데, 응급실 가야 할까요?",
            subtitle: "초보 엄마 아빠를 위한 24시간 육아 닥터. 당황하지 말고 증상부터 체크하세요.",
            checkList: ["열이 38.5도 이상임", "아이가 축 쳐지고 안 먹음", "기침 소리가 이상함", "갑자기 피부에 발진이 생김"],
            cta: "응급도 체크 시작"
        },
        sessionB: {
            title: "우리 집 상비약, 제대로 알고 있나요?",
            cards: [
                { title: "해열제 교차 복용", description: "챔프, 부루펜... 헷갈리는 해열제 사용법 총정리" },
                { title: "항생제 궁금증", description: "먹이다 말아도 될까? 내성 걱정 팩트 체크" },
                { title: "환절기 건강 관리", description: "감기 달고 사는 우리 아이, 면역력 키우는 법" }
            ]
        },
        sessionC: {
            title: "회원 전용: 1분 진료 요약 노트",
            description: "아픈 아이 안고 의사 선생님 앞에서 횡설수설하지 마세요. 증상을 깔끔하게 정리해 드립니다.",
            cta: "로그인하고 요약 노트 받기"
        },
        sessionD: {
            title: "엄마의 마음으로 진료합니다",
            faqs: [
                { question: "항생제 꼭 먹여야 하나요?", answer: "세균성 감염엔 필수입니다. 의사 지시에 따라 정확히 복용하세요." }
            ]
        },
        simulation: {
            title: "우리아이 성장/증상 타임라인",
            description: "열이 언제 올랐지? 약은 언제 먹였지? 헷갈리지 않게 기록하고 관리하세요.",
            buttonLabel: "육아 기록 시작하기",
            resultCta: "로그인하고 프로필 생성"
        },
        chatMenu: {
            beforeLogin: ["아기 열 내리는 법", "수족구 전염 기간"],
            afterLogin: ["아이 증상별 맞춤 케어 가이드", "야간/휴일 진료 소아과 찾기"]
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
            title: "두통, 어지럼증... 혹시 뇌졸중?",
            subtitle: "골든타임 놓치면 평생 후회합니다. 지금 바로 위험 신호를 확인하세요.",
            checkList: ["벼락치듯 심한 두통", "한쪽 팔다리에 힘이 빠짐", "말이 어눌해짐", "빙빙 도는 어지럼증"],
            cta: "뇌 건강 위험도 체크"
        },
        sessionB: {
            title: "뇌와 척추를 지키는 습관",
            cards: [
                { title: "거북목 탈출", description: "목 디스크 부르는 스마트폰 자세 교정" },
                { title: "두통 일기 쓰기", description: "내 두통의 패턴을 알면 치료법이 보입니다." },
                { title: "허리 강화 운동", description: "수술 없이 허리 통증 잡는 코어 운동" }
            ]
        },
        sessionC: {
            title: "회원 전용: 정밀 문진 리포트",
            description: "증상 발생 시점부터 변화 양상까지, 전문적인 문진표를 미리 작성해 드립니다.",
            cta: "로그인하고 문진표 작성"
        },
        sessionD: {
            title: "빠른 판단이 생명을 구합니다",
            faqs: [
                { question: "MRI 꼭 찍어야 하나요?", answer: "뇌 질환은 CT/MRI 없이는 정확한 진단이 어렵습니다." }
            ]
        },
        simulation: {
            title: "내 두통 패턴 분석기",
            description: "언제, 어떻게, 얼마나 아픈가요? 기록하면 병이 보입니다.",
            buttonLabel: "두통 기록하기",
            resultCta: "로그인하고 분석 결과 저장"
        },
        chatMenu: {
            beforeLogin: ["뇌졸중 전조증상 체크", "편두통 완화법"],
            afterLogin: ["내 증상 기반 진료 과목 추천(신경과/신경외과)", "MRI 건강보험 적용 기준"]
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
            title: "보이지 않는 곳도 아름답게, V-케어 시작하기",
            subtitle: "탄력, 미백, 건조함... 말 못 할 고민, 1분 체크로 나만의 관리 플랜을 찾아보세요.",
            checkList: ["출산 후 탄력이 고민됨", "거뭇해진 톤이 신경 쓰임", "자주 건조하고 민감함", "일상생활 중 불편감"],
            cta: "내 V-케어 타입 찾기"
        },
        sessionB: {
            title: "여성을 위한 프리미엄 웰니스 가이드",
            cards: [
                { title: "타이트닝 & 탄력", description: "수술 없이 레이저/고주파로 채우는 탄력 자신감" },
                { title: "브라이트닝 & 미백", description: "맑고 깨끗한 톤을 위한 저자극 미백 프로그램" },
                { title: "수분 & 진정 케어", description: "건조하고 예민한 부위를 위한 맞춤 보습 관리" }
            ]
        },
        sessionC: {
            title: "회원 전용: 프라이빗 시크릿 플랜",
            description: "로그인하시면 민감도와 고민에 맞춘 1:1 맞춤 관리 플랜과 질문 리스트를 제공합니다.",
            cta: "로그인하고 플랜 확인"
        },
        sessionD: {
            title: "편안하고 비밀스럽게 지켜드립니다",
            faqs: [
                { question: "시술 통증이 심한가요?", answer: "대부분의 웰니스 시술은 마취 없이 받을 정도로 통증이 적습니다." }
            ]
        },
        simulation: {
            title: "1분 V-케어 플랜 설계",
            description: "고민과 목표를 선택하면, 딱 맞는 시술 옵션과 상담 질문을 정리해드립니다.",
            buttonLabel: "플랜 만들기",
            resultCta: "로그인하고 전체 질문 보기"
        },
        chatMenu: {
            beforeLogin: ["질 타이트닝 레이저 종류/차이", "미백 시술 주기와 효과"],
            afterLogin: ["내 고민(탄력/건조) 맞춤 시술 추천", "여성 성형/시술 전후 주의사항"]
        },
        trust: {
            faqs: [
                { question: "당일 일상생활 가능한가요?", answer: "대부분의 케어 프로그램은 당일 바로 일상 복귀가 가능합니다." },
                { question: "누가 진료하나요?", answer: "숙련된 산부인과 전문의가 프라이빗하게 1:1 진료합니다." },
                { question: "비밀 보장 되나요?", answer: "모든 상담과 기록은 철저하게 비공개로 관리됩니다." }
            ],
            safetyNotices: [
                "본 기능은 일반 정보 제공 및 상담 준비를 위한 가이드이며 진단/처방이 아닙니다.",
                "적합한 시술/치료는 의료진 상담 후 결정됩니다."
            ]
        }
    },
    "oncology": {
        sessionA: {
            title: "암 치료 후, 진짜 관리는 지금부터",
            subtitle: "퇴원 후 막막하신가요? 1분 체크로 우리 가족에게 필요한 회복 로드맵을 그려보세요.",
            checkList: ["입맛이 없고 체중 감소", "잠을 못 자고 우울함", "통증 관리가 어려움", "일상 복귀가 두려움", "가족이 지쳐감"],
            cta: "회복 로드맵 만들기"
        },
        sessionB: {
            title: "체계적인 면역 & 회복 시스템",
            cards: [
                { title: "고주파 온열 암 치료", description: "암세포만 선택적으로 공격하는 보조 치료" },
                { title: "맞춤형 항암 식단", description: "소화 기능과 영양 상태를 고려한 1:1 식단" },
                { title: "통합 면역 관리", description: "면역 주사, 도수 치료, 심리 상담 통합 케어" }
            ]
        },
        sessionC: {
            title: "회원 전용: 회복 로드맵 & 상담 가이드",
            description: "로그인하시면 7일 회복 플랜과 의료진 상담을 위한 맞춤 질문 리스트를 제공합니다.",
            cta: "로그인하고 로드맵 확인"
        },
        sessionD: {
            title: "당신의 든든한 동반자가 되겠습니다",
            faqs: [
                { question: "요양병원은 언제 가나요?", answer: "수술 직후, 항암/방사선 치료 중 집중 관리가 필요할 때 추천합니다." }
            ]
        },
        simulation: {
            title: "1분 회복 로드맵 만들기",
            description: "현재 상태를 정리하면 7일 회복 플랜과 상담 질문이 자동 생성됩니다.",
            buttonLabel: "로드맵 생성하기",
            resultCta: "로그인하고 전체 질문 보기"
        },
        chatMenu: {
            beforeLogin: ["암 환자 식단 가이드", "항암 부작용 관리법"],
            afterLogin: ["내 병기/상태 맞춤 요양 병원 추천", "암 재활 프로그램 안내"]
        },
        trust: {
            faqs: [
                { question: "완치되나요?", answer: "치료 목표는 개인 상황에 따라 다르며, 의료진 상담이 필요합니다." },
                { question: "요양병원과 일반 병원의 차이는?", answer: "회복·관리에 특화된 프로그램과 환경을 제공합니다." },
                { question: "가족은 어떻게 도울 수 있나요?", answer: "보호자 가이드와 정서 지원 정보를 안내합니다." }
            ],
            safetyNotices: [
                "본 기능은 일반 정보 제공 및 상담 준비를 위한 가이드이며 진단/처방이 아닙니다.",
                "치료 및 관리 계획은 의료진 상담 후 개인 상태에 따라 결정됩니다.",
                "응급 증상(고열, 심한 호흡곤란, 의식저하 등)이 있으면 즉시 의료기관에 연락하세요."
            ]
        }
    }
};