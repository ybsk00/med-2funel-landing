/**
 * 헬스케어 모듈 스크립트 데이터
 * 각 모듈은 7문항으로 구성되며, 2문항마다 피드백/팁을 제공
 * 4문항 후 게이팅(로그인 유도) 트리거
 */

export type ModuleQuestion = {
    id: string;
    question: string;
    options: string[];
    feedback?: string; // 2문항마다 표시되는 팁
    isGatingPoint?: boolean; // 4문항 후 게이팅 포인트
};

export type ModuleSummary = {
    signal: string;
    tips: string[];
    loginPrompt: string;
};

export type ModuleScript = {
    id: string;
    name: string;
    startMessage: string;
    questions: ModuleQuestion[];
    summary: ModuleSummary;
};

// 모듈 1: 소화 리듬 퀘스트
export const digestionModule: ModuleScript = {
    id: "digestion",
    name: "소화 리듬 퀘스트",
    startMessage: "오늘의 미션: '소화 리듬' 확인하기. 7문항만 답하면 끝이에요!",
    questions: [
        {
            id: "d1",
            question: "식후 느낌은 어떤 쪽에 가까우신가요?",
            options: ["가볍다", "더부룩하다", "트림/가스가 잦다", "속쓰림이 있다"]
        },
        {
            id: "d2",
            question: "배변 리듬은 어떠신가요?",
            options: ["규칙적", "변비 경향", "설사 경향", "왔다 갔다"],
            feedback: "2/7 완료. 💡 팁: 식후 10분 가벼운 보행은 소화 리듬에 도움이 될 수 있어요(일반 정보)."
        },
        {
            id: "d3",
            question: "야식 빈도는 어느 정도인가요?",
            options: ["거의 없음", "주 1~2회", "주 3회+", "불규칙"]
        },
        {
            id: "d4",
            question: "카페인(커피/에너지드링크)은 얼마나 드시나요?",
            options: ["거의 없음", "하루 1잔", "하루 2잔+", "시간대 불규칙"],
            isGatingPoint: true
        },
        {
            id: "d5",
            question: "스트레스 받으면 소화가 더 흔들리나요?",
            options: ["그렇다", "가끔", "아니다"]
        },
        {
            id: "d6",
            question: "식사 속도는 어떠신가요?",
            options: ["천천히", "보통", "빨리 먹는 편"],
            feedback: "6/7 완료. 거의 다 왔어요! 💪"
        },
        {
            id: "d7",
            question: "불편감이 가장 심한 시간대는 언제인가요?",
            options: ["아침", "점심 후", "저녁 후", "밤"]
        }
    ],
    summary: {
        signal: "식후 정체 신호: ↑",
        tips: ["식사 속도 20% 느리게", "야식 시간을 앞당기기"],
        loginPrompt: "상세 리포트(유발 요인/7일 루틴/체크리스트 저장)는 로그인 후 제공됩니다."
    }
};

// 모듈 2: 인지 건강 미니게임
export const cognitiveModule: ModuleScript = {
    id: "cognitive",
    name: "인지 건강 미니게임",
    startMessage: "오늘의 미션: '인지 리듬' 2분 테스트. 게임처럼 진행돼요! 🧠",
    questions: [
        {
            id: "c1",
            question: "지금 3개 단어를 보여드릴게요: **사과 · 우산 · 기차**\n\n5초 후 질문이 나옵니다. 방금 단어 중 '사과'와 함께 나온 단어는?",
            options: ["우산", "나무", "연필", "바다"]
        },
        {
            id: "c2",
            question: "아래 중 'ㅅ'으로 시작하는 단어만 골라주세요.",
            options: ["사과", "기차", "수박", "바나나"],
            feedback: "2/7 완료. 💡 팁: 일정한 수면/산책 루틴은 뇌 건강에 도움이 될 수 있어요(일반 정보)."
        },
        {
            id: "c3",
            question: "'지금'이라는 단어가 나왔어요! 버튼을 눌러주세요.",
            options: ["지금", "대기"]
        },
        {
            id: "c4",
            question: "최근 1주간 수면은 어떠셨나요?",
            options: ["충분", "보통", "부족", "매우 불규칙"],
            isGatingPoint: true
        },
        {
            id: "c5",
            question: "낮에 졸림이 잦나요?",
            options: ["그렇다", "가끔", "아니다"]
        },
        {
            id: "c6",
            question: "보호자/가족으로서 체크하시는 건가요?",
            options: ["본인", "보호자/가족"],
            feedback: "6/7 완료. 마지막 문항이에요! 🎯"
        },
        {
            id: "c7",
            question: "불편이 시작된 시점은 언제부터인가요?",
            options: ["최근", "1~3개월", "6개월+", "잘 모르겠다"]
        }
    ],
    summary: {
        signal: "인지 리듬 신호: 주의력/수면 요인이 핵심",
        tips: ["규칙적인 수면 시간 유지", "하루 20분 걷기 습관"],
        loginPrompt: "상세 리포트: 주간 추세/보호자 체크리스트/훈련 루틴은 로그인 후 제공됩니다."
    }
};

// 모듈 3: 스트레스-수면 밸런스 체크
export const stressSleepModule: ModuleScript = {
    id: "stress-sleep",
    name: "스트레스-수면 밸런스 체크",
    startMessage: "오늘의 미션: '회복 리듬' 점검. 답변은 2분이면 끝나요! 😴",
    questions: [
        {
            id: "ss1",
            question: "잠드는 데 걸리는 시간은 어느 정도인가요?",
            options: ["10분 이내", "30분 내외", "1시간+", "불규칙"]
        },
        {
            id: "ss2",
            question: "새벽에 깨는 편인가요?",
            options: ["거의 없음", "가끔", "자주", "매일"],
            feedback: "2/7 완료. 💡 팁: 취침 2~3시간 전 과식/알코올은 수면의 질에 영향을 줄 수 있어요(일반 정보)."
        },
        {
            id: "ss3",
            question: "아침 컨디션은 어떠신가요?",
            options: ["개운", "보통", "피곤", "매우 피곤"]
        },
        {
            id: "ss4",
            question: "스트레스 체감은 어느 정도인가요?",
            options: ["낮음", "보통", "높음", "매우 높음"],
            isGatingPoint: true
        },
        {
            id: "ss5",
            question: "카페인은 주로 언제 드시나요?",
            options: ["오전", "오후", "저녁", "불규칙"]
        },
        {
            id: "ss6",
            question: "주당 운동/걷기 빈도는 어떠신가요?",
            options: ["0회", "1~2회", "3~4회", "5회+"],
            feedback: "6/7 완료. 마지막 문항이에요! 💪"
        },
        {
            id: "ss7",
            question: "피로가 가장 심한 시간대는 언제인가요?",
            options: ["오전", "오후", "저녁", "밤"]
        }
    ],
    summary: {
        signal: "회복 리듬 신호: 수면/스트레스 요인 점검 필요",
        tips: ["취침 전 카페인 피하기", "규칙적인 기상 시간 유지"],
        loginPrompt: "상세: 7일 수면 루틴/추세 저장/개인화 체크리스트는 로그인 후 제공됩니다."
    }
};

// 모듈 4: 혈관·생활습관 리스크 체크
export const vascularModule: ModuleScript = {
    id: "vascular",
    name: "혈관·생활습관 리스크 체크",
    startMessage: "오늘의 미션: '생활습관 리스크' 점검. 진단이 아니라 생활 패턴 체크예요(참고용). 🩺",
    questions: [
        {
            id: "v1",
            question: "주당 운동은 얼마나 하시나요?",
            options: ["0회", "1~2회", "3~4회", "5회+"]
        },
        {
            id: "v2",
            question: "식사에서 짠맛은 어느 정도인가요?",
            options: ["싱겁게", "보통", "짜게", "잘 모르겠음"],
            feedback: "2/7 완료. 💡 팁: 규칙적인 걷기 습관은 건강 관리에 도움이 될 수 있어요(일반 정보)."
        },
        {
            id: "v3",
            question: "야식/간식 빈도는 어떠신가요?",
            options: ["거의 없음", "가끔", "자주", "불규칙"]
        },
        {
            id: "v4",
            question: "수면 시간은 어느 정도인가요?",
            options: ["7시간+", "6~7시간", "5~6시간", "5시간 미만"],
            isGatingPoint: true
        },
        {
            id: "v5",
            question: "스트레스는 어느 정도인가요?",
            options: ["낮음", "보통", "높음", "매우 높음"]
        },
        {
            id: "v6",
            question: "흡연은 어떠신가요?",
            options: ["비흡연", "과거", "현재(가끔)", "현재(매일)"],
            feedback: "6/7 완료. 마지막 문항이에요! 🎯"
        },
        {
            id: "v7",
            question: "생활 개선 의지는 어느 정도인가요?",
            options: ["가볍게 시작", "1달 루틴 도전", "상담도 고려", "모르겠다"]
        }
    ],
    summary: {
        signal: "생활 신호: 운동/수면이 핵심",
        tips: ["하루 30분 걷기 시작", "짠 음식 줄이기"],
        loginPrompt: "상세: 30일 체크리스트/루틴 저장/추세는 로그인 후 제공됩니다."
    }
};

// 모듈 5: 여성 컨디션 리듬 체크
export const womenModule: ModuleScript = {
    id: "women",
    name: "여성 컨디션 리듬 체크",
    startMessage: "오늘의 미션: '컨디션 리듬' 점검. 민감한 내용은 최소로만 묻고, 참고용으로만 정리해요. 🌸",
    questions: [
        {
            id: "w1",
            question: "주기 규칙성은 어떠신가요?",
            options: ["규칙적", "가끔 흔들림", "자주 불규칙", "모르겠음"]
        },
        {
            id: "w2",
            question: "불편감(통증/불편)은 어느 정도인가요?",
            options: ["낮음", "중간", "높음", "상황에 따라 다름"],
            feedback: "2/7 완료. 💡 팁: 수면·운동·식사 리듬은 컨디션 관리에 영향을 줄 수 있어요(일반 정보)."
        },
        {
            id: "w3",
            question: "PMS(기분/부종/피로)는 어떠신가요?",
            options: ["거의 없음", "가끔", "자주", "매번 심함"]
        },
        {
            id: "w4",
            question: "스트레스 체감은 어느 정도인가요?",
            options: ["낮음", "보통", "높음", "매우 높음"],
            isGatingPoint: true
        },
        {
            id: "w5",
            question: "수면은 어떠신가요?",
            options: ["충분", "보통", "부족", "매우 불규칙"]
        },
        {
            id: "w6",
            question: "소화/배변 불편이 함께 있나요?",
            options: ["없음", "가끔", "자주"],
            feedback: "6/7 완료. 마지막 문항이에요! 💪"
        },
        {
            id: "w7",
            question: "원하는 도움은 무엇인가요?",
            options: ["생활관리", "상담 문의", "예약 희망", "기타"]
        }
    ],
    summary: {
        signal: "컨디션 리듬 신호: 변동폭 점검 필요",
        tips: ["규칙적인 수면 시간 유지", "가벼운 스트레칭 습관화"],
        loginPrompt: "상세: 리듬 캘린더/상담 준비 요약은 로그인 후 제공됩니다."
    }
};

// 모든 모듈 내보내기
export const moduleScripts: Record<string, ModuleScript> = {
    digestion: digestionModule,
    cognitive: cognitiveModule,
    "stress-sleep": stressSleepModule,
    vascular: vascularModule,
    women: womenModule,
    // 기존 topic 매핑
    recovery: stressSleepModule, // 회복력·면역 → 스트레스-수면
    pain: vascularModule, // 통증 패턴 → 혈관·생활습관
    pregnancy: womenModule, // 임신 준비 → 여성 컨디션
};

// 게이팅 메시지
export const gatingMessages = {
    trigger: "여기까지 답변으로 **패턴이 거의 잡혔어요.**\n\n결과를 저장하고 **상세 리포트(맞춤 루틴/체크리스트 포함)** 를 보려면 로그인/간편가입이 필요해요.",
    buttons: ["간편가입하고 상세 보기", "일단 요약만 보기"],
    loginPrompts: [
        "결과를 저장하고 **상세 리포트(맞춤 루틴/체크리스트)** 를 보려면 간편가입이 필요해요.",
        "지금까지 답변으로 **패턴 분석이 거의 완료**됐어요. 로그인하면 '내 리듬 리포트'를 바로 드릴게요.",
        "다음부터는 **이어하기/추세 보기**가 가능해요. 간편가입 후 기록을 저장해 둘까요?"
    ]
};
