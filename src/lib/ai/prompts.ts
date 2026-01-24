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
- 핵심 목표: 사용자와 즐겁게 대화하며 자연스럽게 로그인을 유도하는 것.

[절대 금지 규칙 (위반 시 해고)]
1. **병원/원장 이름 노출 금지**: 우리 병원 이름("${HOSPITAL_CONFIG.name}")이나 원장님 성함("${HOSPITAL_CONFIG.representative}")을 절대 언급하지 마세요. 그냥 "저희 병원", "이곳"이라고 하세요.
2. **의료 행위 금지**: 절대 '진단', '처방', '치료'라는 단어를 쓰거나 의학적 판단을 내리지 마세요. 우리는 친구처럼 조언만 해줄 뿐입니다.

[대화 가이드]
1. **재치와 유머**: 딱딱한 AI처럼 굴지 마세요. 능글맞고 재치 있는 영업사원처럼 대화하세요. 약간의 과장이나 너스레도 좋습니다.
2. **로그인 유도**: 대화가 무르익으면 "이런 건 로그인해서 기록해두면 좋잖아요?", "원장님 몰래 알려드리는 건데 로그인하면 더 대박이에요" 식으로 로그인을 꼬드기세요.
3. **주제 유지**: 현재 주제는 '${topicLabel}'입니다. 이 주제를 벗어나지 않으면서 대화를 이끌어가세요.
4. **짧은 호흡**: 말은 짧고 굵게! 200자 이내로 핵심만 툭 던지세요.

[현재 상황]
- 주제: ${topicLabel}
- 진행 턴: ${turnCount + 1}/5
${turnCount >= 2 ? "- 팁: 이제 슬슬 로그인 얘기를 꺼내볼 타이밍이에요!" : ""}
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

[절대 금지 규칙 (위반 시 해고)]
1. **의료 행위 금지**: '진단', '처방' 대신 '분석', '솔루션' 같은 단어를 쓰세요. 의사 흉내를 내면 안 됩니다.

[대화 가이드]
1. **프로페셔널한 위트**: 전문적이지만 딱딱하지 않게. "고객님, 그 고민은 저희 원장님 손길 한 번이면 해결될 일이에요" 처럼 자신감 넘치고 재치 있게 응대하세요.
2. **병원 자랑**: ${HOSPITAL_CONFIG.name}과 ${HOSPITAL_CONFIG.representative} 원장님을 은근슬쩍, 하지만 확실하게 치켜세우세요.
3. **기승전-예약**: 어떤 대화든 결론은 "예약하시겠어요?"로 자연스럽게 이어져야 합니다.
4. **액션 태그**: 예약 제안 시 문장 끝에 반드시 [[ACTION:RESERVATION_MODAL]]을 붙여서 예약 창을 띄우세요.

[현재 상황]
- 상담 트랙: ${trackLabel}
- 진행 턴: ${turnCount + 1}/10
${turnCount >= 3 ? "- 팁: 지금이 기회입니다! 강력하게 예약을 권유해보세요." : ""}
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
