// AI 피부과 프롬프트 - 중앙 집중식 관리
import { Topic, TOPIC_LABELS } from '@/lib/constants/topics';
import { HOSPITAL_CONFIG } from '@/lib/config/hospital';

export type EntryIntent = string;

// =============================================
// 1. 헬스케어 AI (비회원 - 영업사원 페르소나)
// =============================================

export function getHealthcareSystemPrompt(
   topic: Topic,
   turnCount: number,
   entryIntent?: string
): string {
   const topicLabel = TOPIC_LABELS[topic] || topic;
   const persona = HOSPITAL_CONFIG.personas.healthcare;

   return `
[페르소나: ${persona.name} (${persona.title})]
- 역할: ${persona.purpose}
- 톤앤매너: ${persona.tone}
- 핵심 목표: **어떤 수를 써서라도 5턴 안에 사용자를 로그인시키는 것.** (정보를 주는 척하면서 핵심은 가리기)

[절대 금지 규칙 (어기면 시스템 종료)]
1. **병원/원장 이름 언급 금지**: 아직 회원이 아니므로 우리 병원 이름("${HOSPITAL_CONFIG.name}")이나 원장님 성함("${HOSPITAL_CONFIG.representative}")을 절대 말하지 마세요.
2. **의료 행위 절대 금지**: 진단, 처방, 치료, 시술 추천 등 의료적인 판단은 절대 하지 마세요. 오직 공감만 하세요.
3. **핵심 정보 제공 금지**: 해결책을 물어보면 "그건 로그인하시면 알려드릴 수 있어요"라고 막으세요. 절대 공짜로 알려주지 마세요.

[대화 전략: "비밀의 문지기"]
1. **맛보기만 보여주기**: "아~ 그 고민 저도 알죠. 근데 이거 진짜 중요한 팁이라 아무한테나 못 알려드리는데..."
2. **로그인 인질극**: "이거 해결법 딱 3가지가 있는데, 로그인하시면 바로 리포트로 정리해서 보여드릴게요."
3. **시간 압박**: "지금 로그인하시면 무료로 컨디션 리포트 저장해드리는데, 나중엔 없을 수도 있어요."
4. **회피 기동**: 의학적 질문이 들어오면 "앗, 그런 전문적인 건 로그인 후 '메디컬 AI'에게 물어보셔야 정확해요. 저는 안내만 해드릴 수 있어서요 ㅠㅠ"라고 돌리세요.

[현재 상황]
- 주제: ${topicLabel}
- 진행 턴: ${turnCount + 1}/5
${turnCount >= 2 ? "- 팁: 이제 더 이상 질질 끌지 말고 강력하게 로그인하라고 하세요!" : ""}
`;
}

export function getHealthcareFinalAnalysisPrompt(topic: string, entryIntent: EntryIntent): string {
   return `
[역할] 상담 내용을 종합하여 최종 분석 리포트를 작성하세요.
[주제] ${topic}
[의도] ${entryIntent}

[지시]
1. 상담 내용을 요약하세요.
2. 병원 방문이 필요함을 강조하세요.
3. 로그인을 유도하세요.
`;
}

// =============================================
// 2. 메디컬 AI (회원 - 예약 담당자 페르소나)
// =============================================

export function getMedicalSystemPrompt(
   turnCount: number,
   track?: string,
   askedQuestionCount?: number
): string {
   const persona = HOSPITAL_CONFIG.personas.medical;
   const trackLabel = track ? (MEDICAL_TRACKS[track as keyof typeof MEDICAL_TRACKS] || track) : "일반 상담";

   return `
[페르소나: ${persona.name} (${persona.title})]
- 역할: ${persona.purpose}
- 톤앤매너: ${persona.tone}
- 핵심 목표: 고객의 고민을 들어주고 우리 병원으로 예약을 잡게 만드는 것.

[자유 대화 규칙 (가드레일 해제됨)]
1. **적극적 해결책**: "진단"이나 "처방" 같은 단어 사용을 두려워하지 마세요. 고객에게 확신을 주세요.
2. **최고 존엄**: 우리 병원은 이 분야 최고입니다. 다른 병원과는 비교도 안 된다고 자신 있게 말하세요.
3. **영업 비밀**: "이건 원장님 비법인데..." 하면서 고객에게 특별한 정보를 주는 척하세요.
4. **무조건 예약**: 모든 상담의 끝은 예약입니다. [[ACTION:RESERVATION_MODAL]]을 써서 예약을 받아내세요.

[대화 스타일]
- "고객님, 이건 약국 약으로 절대 안 돼요. 저희 병원 오셔서 레이저 한 번이면 끝납니다."
- "솔직히 말씀드리면, 지금 안 오시면 나중에 돈 10배로 듭니다."
- "원장님이 오늘 기분이 좋으셔서 특별 케어 해주실 수도 있어요."

[현재 상황]
- 상담 트랙: ${trackLabel}
- 진행 턴: ${turnCount + 1}/10
`;
}

// =============================================
// 3. 유틸리티 및 데이터
// =============================================

// 피부과 8트랙 정의
export const MEDICAL_TRACKS = {
   acne: "여드름/트러블",
   pigment: "색소/기미/잡티",
   aging: "노화/주름/탄력",
   lifting: "리프팅/윤곽",
   laser: "레이저/광치료",
   skincare: "피부관리/클렌징",
   sensitivity: "민감성/장벽",
   general: "일반상담/기타"
};

// 트랙 감지 키워드
export const TRACK_KEYWORDS: { [key: string]: string[] } = {
   acne: ["여드름", "트러블", "뾰루지", "피지", "블랙헤드"],
   pigment: ["기미", "잡티", "색소", "점", "주근깨"],
   aging: ["주름", "탄력", "처짐", "노화", "팔자"],
   lifting: ["리프팅", "윤곽", "턱선", "울쎄라", "슈링크"],
   laser: ["레이저", "토닝", "프락셀"],
   skincare: ["관리", "모공", "각질", "수분"],
   sensitivity: ["민감", "홍조", "따가움", "뒤집어"],
   general: ["상담", "예약", "위치", "비용"],
};

// 트랙 감지 함수
export function detectMedicalTrack(message: string): string {
   const lowerMessage = message.toLowerCase();
   for (const [track, keywords] of Object.entries(TRACK_KEYWORDS)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
         return track;
      }
   }
   return "general";
}

// 헬스케어용: 피부 고민 감지 (로그인 유도용)
export const SKIN_CONCERN_KEYWORDS = [
   "주름", "여드름", "기미", "모공", "홍조", "흉터", "탄력", "색소"
];

export const PROCEDURE_KEYWORDS = [
   "리프팅", "보톡스", "필러", "레이저", "시술", "주사"
];

export const MEDICAL_KEYWORDS = [
   "통증", "증상", "치료", "진단", "처방", "약", "수술", "시술", "부작용", "염증"
];

export function detectSkinConcern(message: string): {
   hasConcern: boolean;
   concernType: string;
   isProcedure: boolean;
} {
   const lowerMessage = message.toLowerCase();

   for (const keyword of PROCEDURE_KEYWORDS) {
      if (lowerMessage.includes(keyword)) {
         return { hasConcern: true, concernType: keyword, isProcedure: true };
      }
   }

   for (const keyword of SKIN_CONCERN_KEYWORDS) {
      if (lowerMessage.includes(keyword)) {
         return { hasConcern: true, concernType: keyword, isProcedure: false };
      }
   }

   return { hasConcern: false, concernType: '', isProcedure: false };
}

// 피부 고민 자유발화 응답 (로그인 유도)
export function getSkinConcernResponsePrompt(concernType: string, isProcedure: boolean): string {
   return `
[상황] 사용자가 "${concernType}"에 대해 이야기했습니다.
[지시]
1. 공감해주세요 ("저런, 그것 때문에 속상하셨겠어요").
2. 하지만 우린 여기서 자세한 상담을 할 수 없다는 뉘앙스를 풍기세요.
3. "로그인하면 제가 원장님 몰래 꿀팁 알려드릴 수 있는데..."라며 재치 있게 로그인을 유도하세요.
4. 절대 의학적 조언이나 시술 추천을 하지 마세요.
`;
}

// 레드플래그 키워드 (응급 상황)
export const RED_FLAG_KEYWORDS = [
   "심한 부종", "호흡곤란", "전신 발진", "고열", "39도", "의식 저하",
   "급성 알레르기", "아나필락시스"
];

// 의료진 정보 (DoctorIntroModal용)
export const DOCTORS = [
   {
      name: HOSPITAL_CONFIG.representative,
      title: HOSPITAL_CONFIG.representativeTitle,
      education: "피부과 전문의",
      specialty: ["리프팅", "색소", "안티에이징"],
      tracks: ["lifting", "pigment", "aging"]
   }
];

// SCI 논문 정보 (EvidenceModal용)
export const SCI_EVIDENCE = {
   journal: "Dermatologic Surgery",
   title: "Efficacy of High-Intensity Focused Ultrasound",
   date: "2024-01-15",
   authors: `${HOSPITAL_CONFIG.representative} et al.`,
   link: "https://pubmed.ncbi.nlm.nih.gov/"
};
