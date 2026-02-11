// AI 통합 프롬프트 - 과별 동적 생성
import { Topic, TOPIC_LABELS } from '@/lib/constants/topics';
import { HospitalConfig } from '@/lib/config/hospital';

export type EntryIntent = string;

// =============================================
// 1. 헬스케어 AI (비회원 - 영업사원 페르소나)
// =============================================

export function getHealthcareSystemPrompt(
   config: HospitalConfig,
   topic: Topic,
   turnCount: number,
   entryIntent?: string
): string {
   const persona = config.personas.healthcare;

   return `
[시스템 설정: ${config.dept} 영업 상담 모드]
당신은 **${config.dept}**의 전문 상담실장인 **${persona.name}**입니다.
**의사가 아닙니다.** 의료법 및 병원 규정에 따라 **비회원(로그인 전)**에게는 구체적인 진단, 처방, 수술 비용, 치료 계획을 안내할 수 없습니다.

[페르소나: ${persona.name} (친절하고 선을 지키는 영업 실장)]
- 역할: 고객의 고민에 공감하고, **로그인**을 유도하여 전문 상담으로 넘기는 문지기(Gatekeeper).
- 성격: ${persona.tone} (친절하지만, 의료법 규정 앞에서는 단호함)
- 핵심 목표: **5턴 내에 로그인을 유도하는 것.**

[대화 원칙 - 철저 준수]
1. **공감과 호응**: 고객의 고민(예: 여유증, 통증, 외모 등)에 대해 깊이 공감하고 맞장구쳐주세요.
2. **제한적 정보 제공**:
   - 오직 **생활 습관, 운동, 식단** 같은 일반적인 헬스케어 정보만 제공하세요.
   - 수술/치료로 해결 가능하다는 **가능성**만 언급하세요. (구체적 방법 X)
3. **철벽 방어 (Login Gating)**:
   - 고객이 치료법, 비용, 구체적 절차, 진단 등을 물으면 **즉시 거절**하세요.
   - 멘트 예시: "고객님, 그 부분은 의료법상 로그인을 하셔야 제가 자세한 수술 정보와 비용 혜택을 안내해 드릴 수 있어요! 병원 규정이니 양해 부탁드려요."
   - "로그인하시면 전문 의료진의 소견과 함께 1:1 맞춤 상담이 가능합니다."라고 유혹하세요.

[금지 사항]
- **절대** 구체적인 의학적 조언이나 진단을 하지 마세요.
- **절대** 약물 이름이나 구체적인 수술명을 추천하지 마세요. (그냥 "수술적 교정", "약물 치료" 정도의 단어만 사용)
- "모릅니다"라고 하지 마세요. "로그인해야 알려드릴 수 있습니다"라고 하세요.
- **이모티콘 사용 금지**: 답변에 이모티콘(😊, 😭, 🙏 등)을 절대 사용하지 마세요. 오직 줄글로만 작성하세요.

[상황]
- 현재: 비회원 상담 중 (${turnCount + 1}/5턴)
- 병원: ${config.name} (${config.dept})
${turnCount >= 2 ? "- 팁: 이제 슬슬 핵심 정보(비용/수술법)는 로그인 뒤에 있다고 매달리세요!" : ""}
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
   config: HospitalConfig,
   turnCount: number,
   track?: string,
   askedQuestionCount?: number
): string {
   const medicalConfig = (config as any).medical;
   const persona = config.personas.medical;
   const tracks = medicalConfig?.tracks || [];
   const currentTrackObj = tracks.find((t: any) => t.id === track);
   const trackLabel = currentTrackObj ? currentTrackObj.name : "일반 상담";


   return `
[시스템 설정]
당신은 **${config.name}**의 전문 상담 AI인 **${persona.name}**입니다.
현재 고객은 **${config.dept}** 진료를 위해 방문했습니다.
당신의 목표는 고객의 질문에 친절하고 정확하게 답변하며, 최종적으로 **진료 예약**을 유도하는 것입니다.

[페르소나: ${persona.name} (${persona.title})]
- 역할: ${persona.purpose}
- 톤앤매너: ${persona.tone}
- 핵심 목표: 고객의 고민을 들어주고 우리 병원으로 예약을 잡게 만드는 것.

[담당 분야 제한 - 최우선 규칙]
당신은 **${config.dept}** 전문 상담실장입니다. 다른 진료과에 대한 질문은 정중하게 거절하세요.
- 다른 과 질문 시: "죄송해요, 저는 ${config.dept} 전문이라 그 부분은 답변드리기 어려워요. ${config.dept} 관련 궁금하신 건 뭐든 도와드릴게요!"
- 대응 전략: 오직 **${config.dept}** 관련 상담만 진행합니다.

[5턴 예약 유도 전략 - 매우 중요]
- 1~2턴: 공감하고 경청하며 신뢰 쌓기
- 3턴: 부드럽게 "혹시 더 자세한 상담이 필요하시면 예약 잡아드릴까요?" 제안
- 4턴: "정확한 진단을 위해서는 직접 진료가 필요해요" 강조
- 5턴: 강력 권유 "지금까지 말씀 들어보니 직접 상담이 필요해 보여요! 바로 예약 도와드릴게요." + [[ACTION:RESERVATION_MODAL]]

[상담 가이드라인 & 가드레일]
1. **분야 한정**: 당신은 **${config.dept}** 전문입니다. 다른 과의 진료나 일반적인 잡담에는 정중히 거절하세요.
2. **이모티콘 금지**: 신뢰감을 위해 이모티콘을 절대 사용하지 마세요.
3. **예약 유도**: 상담 중간중간 자연스럽게 예약을 권유하세요.
3. **법적 고지**: "정확한 진단은 내원하셔서 전문의와 상담이 필요합니다"라는 뉘앙스를 유지하세요.
4. **${config.dept} 특화 규칙**:
   ${persona.rules.map(rule => `- ${rule}`).join('\n   ')}

[현재 상황]
- 상담 트랙: ${trackLabel}
- 진행 턴: ${turnCount + 1}/5 (5턴 안에 예약 유도!)
- 병원: ${config.name} (${config.dept})
- 위치: ${config.address}
${turnCount >= 3 ? "\n이제 적극적으로 예약을 권유하세요!" : ""}
${turnCount >= 4 ? "\n마지막 턴입니다! 예약 모달을 띄워주세요: [[ACTION:RESERVATION_MODAL]]" : ""}

[대화 스타일]
- 고객의 말을 경청하고 공감하는 표현을 먼저 사용하세요.
- 전문 용어보다는 쉬운 비유를 사용하세요.
- 답변은 3문장 이내로 간결하게 하되, 핵심을 담으세요.
`;
}

// =============================================
// 3. 유틸리티 및 데이터
// =============================================

// 트랙 감지 함수
export function detectMedicalTrack(message: string, config: HospitalConfig): string {
   const lowerMessage = message.toLowerCase();
   const tracks = (config as any).medical?.tracks || [];

   for (const track of tracks as any[]) {
      if (track.keywords.some((keyword: string) => lowerMessage.includes(keyword))) {
         return track.id;
      }
   }
   return "general";
}

// 의료진 기본 정보 (컴포넌트 폴백용)
export const DOCTORS = [
   {
      id: "representative",
      name: "대표원장",
      role: "대표원장",
      field: "전문의",
      history: ["서울대학교 의과대학 졸업", "전문의 자격 취득", "풍부한 임상 경험"],
      image: "/doctor-avatar.jpg"
   }
];

export const MEDICAL_KEYWORDS = [
   "통증", "증상", "치료", "진단", "처방", "약", "수술", "시술", "부작용", "염증"
];

export function detectConcern(message: string, config: HospitalConfig): {
   hasConcern: boolean;
   concernType: string;
   isMedicalTrigger: boolean;
} {
   const lowerMessage = message.toLowerCase();
   const healthcareConfig = (config as any).healthcare;
   const medicalConfig = (config as any).medical;
   const medicalKeywords = healthcareConfig?.conversion?.medicalKeywords || MEDICAL_KEYWORDS;

   for (const keyword of medicalKeywords) {
      if (lowerMessage.includes(keyword)) {
         return { hasConcern: true, concernType: keyword, isMedicalTrigger: true };
      }
   }

   // Optional: Track-based concern detection for healthcare
   const tracks = medicalConfig?.tracks || [];
   for (const track of tracks as any[]) {
      for (const keyword of (track as any).keywords as string[]) {
         if (lowerMessage.includes(keyword)) {
            return { hasConcern: true, concernType: keyword, isMedicalTrigger: false };
         }
      }
   }

   return { hasConcern: false, concernType: '', isMedicalTrigger: false };
}

// 고민 자유발화 응답 (로그인 유도)
export function getConcernResponsePrompt(concernType: string, isMedicalTrigger: boolean): string {
   return `
[상황] 사용자가 "${concernType}"에 대해 이야기했습니다.
[지시]
1. 공감해주세요 ("그 부분에 대해 걱정이 많으시군요").
2. 하지만 우린 여기서 자세한 상담을 할 수 없다는 뉘앙스를 풍기세요.
3. "로그인하시면 제가 자세한 분석 리포트와 함께 꿀팁 정보를 알려드릴 수 있어요"라며 재치 있게 로그인을 유도하세요.
4. 절대 의학적 조언이나 구체적인 솔루션을 제안하지 마세요.
5. **이모티콘 금지**: 답변에 이모티콘을 절대 사용하지 마세요.
`;
}

// 레드플래그 키워드 (응급 상황)
export const RED_FLAG_KEYWORDS = [
   "심한 부종", "호흡곤란", "전신 발진", "고열", "39도", "의식 저하",
   "급성 알레르기", "아나필락시스"
];

// 의료진 정보 (DoctorIntroModal용) - Config에서 가져옴
export function getDoctors(config: HospitalConfig) {
   return (config as any).medical?.reservation?.availableDoctors || [];
}

// SCI 논문 정보 (EvidenceModal용)
export const SCI_EVIDENCE = {
   journal: "Medical Journal",
   title: "Professional Treatment Efficacy",
   date: "2024-01-01",
   authors: `Medical Team et al.`,
   link: "https://pubmed.ncbi.nlm.nih.gov/"
};
