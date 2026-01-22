// AI 피부과 프롬프트 - 에버피부과 AI 상담
// 이 파일은 모든 AI 채팅 API에서 중앙 집중식으로 사용됩니다.

import { Topic, TOPIC_LABELS } from '@/lib/constants/topics';

// =============================================
// 헬스케어 AI 시스템 프롬프트 (비회원, 피부 습관 점검)
// =============================================

// EntryIntent 타입 정의 (피부 관리 토픽별 유입 맥락)
export type EntryIntent =
   // D-7 광채 부스터
   | "glow-routine" | "glow-diet" | "glow-sleep" | "glow-product"
   // 메이크업 원인 TOP3
   | "makeup-pore" | "makeup-oil" | "makeup-dryness" | "makeup-redness"
   // 피부장벽 72시간
   | "barrier-repair" | "barrier-sensitivity" | "barrier-cause" | "barrier-product"
   // 리프팅 후회포인트
   | "lifting-concern" | "lifting-timing" | "lifting-expectation" | "lifting-aftercare"
   // 부티크 컨시어지
   | "concierge-routine" | "concierge-concern" | "concierge-lifestyle" | "concierge-goal";

// topic별 기본 intent 100% 정의
const DEFAULT_INTENT_BY_TOPIC: Record<Topic, EntryIntent> = {
   'glow-booster': 'glow-routine',
   'makeup-killer': 'makeup-pore',
   'barrier-reset': 'barrier-repair',
   'lifting-check': 'lifting-concern',
   'skin-concierge': 'concierge-routine',
};

// topic별 유효 intent 목록
const VALID_INTENTS_BY_TOPIC: Record<Topic, EntryIntent[]> = {
   'glow-booster': ['glow-routine', 'glow-diet', 'glow-sleep', 'glow-product'],
   'makeup-killer': ['makeup-pore', 'makeup-oil', 'makeup-dryness', 'makeup-redness'],
   'barrier-reset': ['barrier-repair', 'barrier-sensitivity', 'barrier-cause', 'barrier-product'],
   'lifting-check': ['lifting-concern', 'lifting-timing', 'lifting-expectation', 'lifting-aftercare'],
   'skin-concierge': ['concierge-routine', 'concierge-concern', 'concierge-lifestyle', 'concierge-goal'],
};

// intent 안전 변환
export function sanitizeIntent(topic: Topic, intent?: string): EntryIntent {
   if (intent && VALID_INTENTS_BY_TOPIC[topic]?.includes(intent as EntryIntent)) {
      return intent as EntryIntent;
   }
   return DEFAULT_INTENT_BY_TOPIC[topic];
}

export function getHealthcareSystemPrompt(
   topic: Topic,
   turnCount: number,
   entryIntent?: EntryIntent
): string {
   const isTurn3 = turnCount === 2;
   const isLastTurn = turnCount >= 4;
   const intentHook = getEntryIntentHook(topic, entryIntent);
   const topicLabel = TOPIC_LABELS[topic];

   return `
[페르소나]
에버피부과 10년 차 에이스 상담실장 "에밀리". 능글맞지만 미워할 수 없는 영업의 신.

[핵심 규칙 - 반드시 준수]
1. **200자 내외**로 짧고 굵게 말할 것. 길어지면 고객이 지루해함.
2. **지문/행동 묘사 절대 금지**: "(미소를 지으며)", "(살짝 목소리를 낮춰)" 등 괄호 안 행동 묘사 금지. 오직 대사만 출력.
3. **영업적 과장 허용**: "지금 안 하면 5년 뒤엔 수술로도 안 돼요", "원장님이 차트 보고 깜짝 놀라셨어요" 등 유머러스한 과장 OK.
4. **의료법 단어 금지**: '진단/처방/치료' 대신 '케어/솔루션/소견서/커스터마이징' 사용.

[말투 예시]
- "어머, 이 정도면 피부가 SOS 치고 있는 거예요! 😱"
- "고객님 잘못 아니에요, 몰랐던 게 죄죠!"
- "원장님께 졸라서 '긴급 소견서' 하나 따왔거든요."

[자유발화 대처 - 재치있게]
- 무관한 질문에도 거짓말/유머로 재치있게 대응 후 피부 토픽으로 유도.
- 예: "오늘 날씨 어때요?" → "날씨요? 자외선 지수가 고객님 피부한테 선전포고했대요. 그래서 더 관리가 급해요!"

[대화 흐름]
1) 공감 한 줄: "어머, 그 고민 진짜 깊으시겠어요."
2) 위기감 조성: "이대로 두면 조명 아래서도 주인공 되기 힘들어요."
3) 솔루션 미끼: "원장님 '긴급 소견서'로 해결 가능한 타입이에요."
4) 훅 질문: "가장 신경 쓰이는 부위 알려주시면 맞춤 리포트 드릴게요!"

[현재 토픽: ${topicLabel}]
${isTurn3 ? `[3턴]: "이 데이터 사라지기 전에 로그인해서 원장님 소견서 받아보세요!"` : ``}
${isLastTurn ? `[5턴]: "지금이 골든타임이에요! 로그인하고 시크릿 프로토콜 확인하세요!"` : ``}
[현재 턴: ${turnCount + 1}/5]
`;
}

// entry_intent 훅: 피부 관리 맥락
function getEntryIntentHook(topic: Topic, entryIntent?: EntryIntent): string {
   const intent = entryIntent || DEFAULT_INTENT_BY_TOPIC[topic];

   const map: Record<EntryIntent, string> = {
      // 광채 부스터
      "glow-routine": `- 유입 맥락: 광채 루틴 점검을 원하는 케이스를 우선 고려해 요약하세요.`,
      "glow-diet": `- 유입 맥락: 식단/영양 섭취가 피부에 미치는 영향을 우선 고려해 요약하세요.`,
      "glow-sleep": `- 유입 맥락: 수면 패턴과 피부 컨디션 관계를 우선 고려해 요약하세요.`,
      "glow-product": `- 유입 맥락: 광채 제품 사용 패턴을 우선 고려해 요약하세요.`,
      // 메이크업 원인
      "makeup-pore": `- 유입 맥락: 모공으로 인한 메이크업 무너짐을 우선 고려해 요약하세요.`,
      "makeup-oil": `- 유입 맥락: 유분으로 인한 메이크업 무너짐을 우선 고려해 요약하세요.`,
      "makeup-dryness": `- 유입 맥락: 건조함으로 인한 메이크업 들뜸을 우선 고려해 요약하세요.`,
      "makeup-redness": `- 유입 맥락: 홍조로 인한 커버력 문제를 우선 고려해 요약하세요.`,
      // 피부장벽
      "barrier-repair": `- 유입 맥락: 피부 장벽 회복 루틴을 우선 고려해 요약하세요.`,
      "barrier-sensitivity": `- 유입 맥락: 민감성 피부 관리 패턴을 우선 고려해 요약하세요.`,
      "barrier-cause": `- 유입 맥락: 장벽 손상 원인 파악을 우선 고려해 요약하세요.`,
      "barrier-product": `- 유입 맥락: 장벽 케어 제품 사용 패턴을 우선 고려해 요약하세요.`,
      // 리프팅
      "lifting-concern": `- 유입 맥락: 리프팅에 대한 고민/관심을 우선 고려해 요약하세요.`,
      "lifting-timing": `- 유입 맥락: 리프팅 적정 시기에 대한 궁금증을 우선 고려해 요약하세요.`,
      "lifting-expectation": `- 유입 맥락: 리프팅 기대효과에 대한 관심을 우선 고려해 요약하세요.`,
      "lifting-aftercare": `- 유입 맥락: 리프팅 후 관리에 대한 관심을 우선 고려해 요약하세요.`,
      // 컨시어지
      "concierge-routine": `- 유입 맥락: 맞춤 루틴 설계를 원하는 케이스를 우선 고려해 요약하세요.`,
      "concierge-concern": `- 유입 맥락: 특정 피부 고민 해결을 원하는 케이스를 우선 고려해 요약하세요.`,
      "concierge-lifestyle": `- 유입 맥락: 라이프스타일에 맞는 케어를 원하는 케이스를 우선 고려해 요약하세요.`,
      "concierge-goal": `- 유입 맥락: 피부 목표 달성을 원하는 케이스를 우선 고려해 요약하세요.`,
   };

   return map[intent] || `- 유입 맥락: 스킨케어 루틴, 생활 습관 중 개선 가능한 부분을 먼저 찾아 요약하세요.`;
}

// 질문 풀 (피부 관리 5개 토픽)
function getHealthcareQuestionPool(topic: Topic, entryIntent?: EntryIntent): string {
   const pools: Record<Topic, string[]> = {
      "glow-booster": [
         "하루 수분 섭취량은 어느 정도인가요(500ml 이하/500ml~1L/1L 이상)?",
         "평균 수면 시간은 어떻게 되시나요(5시간 이하/5~7시간/7시간 이상)?",
         "각질 케어는 얼마나 자주 하시나요(안 함/월 1~2회/주 1회 이상)?",
         "비타민이나 영양제를 드시고 계신가요(예/아니오)?",
         "피부 광채를 위해 가장 신경 쓰는 부분이 있으신가요?",
      ],
      "makeup-killer": [
         "메이크업이 보통 몇 시간 정도 지속되나요(2시간 이내/2~4시간/4시간 이상)?",
         "가장 먼저 무너지는 부위는 어디인가요(T존/볼/눈가/입 주변)?",
         "피부 유분 정도는 어떤가요(건조/복합성/지성)?",
         "모공이 신경 쓰이시나요(약간/많이/매우)?",
         "베이스 메이크업 전 프라이머를 사용하시나요(예/아니오)?",
      ],
      "barrier-reset": [
         "하루 세안 횟수는 몇 번인가요(1회/2회/3회 이상)?",
         "최근 피부 자극을 느낀 적이 있으신가요(없음/가끔/자주)?",
         "보습제 사용 빈도는 어떻게 되시나요(안 바름/아침만/저녁만/아침저녁 모두)?",
         "피부가 당기는 느낌이 있으신가요(없음/가끔/자주)?",
         "최근 피부에 새로 사용한 제품이 있으신가요(예/아니오)?",
      ],
      "lifting-check": [
         "탄력이 가장 신경 쓰이는 부위는 어디인가요(이마/눈가/볼/턱선)?",
         "리프팅 관련 시술을 받으신 적이 있으신가요(없음/1회/여러 번)?",
         "리프팅 시술에서 가장 중요하게 생각하시는 것은(자연스러움/효과 지속/통증 최소화)?",
         "현재 나이대는 어떻게 되시나요(20대/30대/40대/50대 이상)?",
         "리프팅에 대한 기대나 궁금한 점이 있으시면 말씀해주세요.",
      ],
      "skin-concierge": [
         "본인의 피부 타입은 어떻다고 생각하시나요(건성/중성/지성/복합성/민감성)?",
         "현재 스킨케어 루틴 단계 수는 어떻게 되시나요(1~2단계/3~4단계/5단계 이상)?",
         "가장 개선하고 싶은 피부 고민은 무엇인가요(모공/잡티/주름/건조/트러블)?",
         "스킨케어에 투자하는 월 비용은 어느 정도인가요(5만원 이하/5~10만원/10만원 이상)?",
         "맞춤 루틴 설계에서 가장 원하시는 것은 무엇인가요?",
      ],
   };

   return pools[topic].join(" / ");
}

// 5턴 종료 최종 요약 프롬프트
export function getHealthcareFinalAnalysisPrompt(topic: Topic, entryIntent?: EntryIntent): string {
   const topicFocusMap: Record<Topic, string> = {
      "glow-booster": "수분 섭취, 수면 패턴, 각질 케어, 영양 섭취",
      "makeup-killer": "메이크업 지속시간, 무너짐 부위, 유분 정도, 모공 고민",
      "barrier-reset": "세안 횟수, 자극 경험, 보습 루틴, 당김 느낌",
      "lifting-check": "탄력 고민 부위, 시술 경험, 기대효과",
      "skin-concierge": "피부 타입, 현재 루틴, 개선 목표, 투자 비용",
   };

   const focus = topicFocusMap[topic];
   const intentHint = getEntryIntentHook(topic, entryIntent);

   return `
[역할]
당신은 "피부 습관 체크(참고용)" 안내자입니다.
5턴 대화를 바탕으로 사용자의 스킨케어 습관을 요약합니다.

[토픽 가드]
- 현재 토픽은 "${TOPIC_LABELS[topic]}"이며 답변은 이 토픽 범위 내에서만 작성합니다.

[분석 초점]
${focus}

[유입 맥락(참고)]
${intentHint}

[작성 규칙]
- 200~250자 내외
- 구성(고정):
  1) 습관 요약 2문장 (사용자 답변 근거, 단정 금지)
  2) 오늘 가능한 실천 1가지 (작게, 하나만)
  3) 마무리: "추가 질문을 위해서는 로그인해주세요."
- 절대 금지: 병명/질환명/약/시술/치료/검사 권유, 의료적 확정
`;
}

// =============================================
// 메디컬 AI 시스템 프롬프트 (회원, 예진 상담, 피부과 트랙)
// =============================================

// 의료진 데이터 (에버피부과)
export const SHOW_DOCTOR_EDUCATION = false; // 병원 검수 후 true

export const DOCTORS = [
   {
      name: '문정윤',
      title: '대표원장',
      education: '피부과 전문의',
      public_title: '대표원장',
      public_desc: '피부 미용 상담',
      specialty: ['피부미용', '레이저', '리프팅', '피부관리'],
      tracks: ['aesthetic', 'laser', 'lifting', 'skincare', 'acne', 'pigment', 'aging', 'general']
   },
   {
      name: '김동영',
      title: '원장',
      education: '피부과 전문의',
      public_title: '원장',
      public_desc: '피부 트러블 상담',
      specialty: ['여드름', '색소', '피부관리', '민감성'],
      tracks: ['acne', 'pigment', 'skincare', 'sensitivity', 'general']
   },
   {
      name: '이미혜',
      title: '원장',
      education: '피부과 전문의',
      public_title: '원장',
      public_desc: '노화 및 리프팅 상담',
      specialty: ['노화', '주름', '리프팅', '탄력'],
      tracks: ['aging', 'lifting', 'aesthetic', 'general']
   }
];

// 트랙별 의료진 추천 매핑 (피부과 8트랙)
export const DOCTOR_TRACK_MAPPING: Record<string, string[]> = {
   acne: ['문정윤', '김동영'],
   pigment: ['문정윤', '김동영'],
   aging: ['문정윤', '이미혜'],
   lifting: ['문정윤', '이미혜'],
   laser: ['문정윤'],
   skincare: ['문정윤', '김동영'],
   sensitivity: ['김동영'],
   general: ['문정윤', '김동영', '이미혜'],
   aesthetic: ['문정윤', '이미혜'],
};

// 피부과 8트랙
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

// 트랙 감지 키워드 (피부과)
export const TRACK_KEYWORDS: { [key: string]: string[] } = {
   acne: ["여드름", "트러블", "뾰루지", "짜도 될까", "염증", "피지", "블랙헤드"],
   pigment: ["기미", "잡티", "색소", "검은점", "점", "주근깨", "거뭇", "칙칙"],
   aging: ["주름", "탄력", "처짐", "노화", "팔자", "이마 주름", "눈가 주름"],
   lifting: ["리프팅", "윤곽", "턱선", "브이라인", "실리프팅", "울쎄라", "하이푸"],
   laser: ["레이저", "광치료", "IPL", "프락셀", "토닝", "피코"],
   skincare: ["관리", "클렌징", "모공", "피지", "각질", "보습", "세안"],
   sensitivity: ["민감", "홍조", "따가움", "알레르기", "아토피", "장벽"],
   general: ["상담", "피부과", "진료", "예약", "비용", "가격"],
};

// 트랙별 질문 풀 (피부과 8트랙)
export function getMedicalQuestionPool(track: string): string {
   switch (track) {
      case "acne":
         return `
- "트러블이 주로 어느 부위에 생기시나요? (이마/볼/턱/전체)"
- "트러블이 언제부터 시작되었나요? (최근/몇 달 전/오래 전)"
- "현재 트러블 관련 제품을 사용 중이신가요?"
- "피지가 많은 편이신가요? (매우/보통/적음)"`;

      case "pigment":
         return `
- "색소 고민이 어느 부위에 있으신가요? (볼/이마/전체)"
- "햇빛 노출이 많은 편이신가요?"
- "색소 관련 시술을 받으신 적이 있으신가요?"
- "자외선 차단제를 매일 사용하시나요?"`;

      case "aging":
         return `
- "가장 신경 쓰이는 주름 부위는 어디인가요?"
- "피부 탄력 저하가 언제부터 느껴지셨나요?"
- "노화 관련 시술을 받으신 적이 있으신가요?"
- "현재 사용 중인 안티에이징 제품이 있으신가요?"`;

      case "lifting":
         return `
- "리프팅을 원하시는 주된 부위가 어디인가요? (이마/볼/턱선/전체)"
- "리프팅 시술 경험이 있으신가요?"
- "원하시는 리프팅 효과는 무엇인가요? (자연스러움/확실한 효과)"
- "시술 후 다운타임이 걱정되시나요?"`;

      case "laser":
         return `
- "레이저 시술을 원하시는 목적은 무엇인가요? (색소/모공/탄력/기타)"
- "이전에 레이저 시술을 받으신 적이 있으신가요?"
- "피부가 예민한 편이신가요?"
- "시술 후 관리가 가능하신가요?"`;

      case "skincare":
         return `
- "현재 피부 관리에서 가장 고민되시는 부분은?"
- "스킨케어 루틴이 몇 단계인가요?"
- "프로페셔널 관리를 받으신 적이 있으신가요?"
- "피부 타입은 어떻게 되시나요?"`;

      case "sensitivity":
         return `
- "피부가 민감해진 계기가 있으신가요?"
- "어떤 상황에서 자극을 느끼시나요?"
- "현재 사용 중인 제품에 만족하시나요?"
- "홍조가 자주 나타나시나요?"`;

      case "general":
         return `
- "어떤 피부 고민으로 상담을 원하시나요?"
- "이전에 피부과 진료를 받으신 적이 있으신가요?"
- "특별히 관심 있는 시술이 있으신가요?"`;

      default:
         return `
- "가장 고민되시는 피부 문제가 무엇인가요?"
- "언제부터 고민이 되셨나요?"`;
   }
}

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

export function getMedicalSystemPrompt(
   turnCount: number,
   track?: string,
   askedQuestionCount?: number
): string {
   const isTurn4 = turnCount === 3;
   const isPostTurn4 = turnCount >= 4;
   const isTurn10 = turnCount >= 9;
   const currentTrack = track || "general";
   const questionCount = askedQuestionCount || 0;
   const canAskQuestion = questionCount < 2;

   const recommendedDoctors = DOCTOR_TRACK_MAPPING[currentTrack] || ['문정윤', '김동영'];
   const trackLabel = MEDICAL_TRACKS[currentTrack as keyof typeof MEDICAL_TRACKS] || "일반";

   const basePart = `
[페르소나: 에버피부과 수석 VIP 컨시어지 '에밀리']
당신은 단순 상담원이 아닌, 고객의 피부 주치의를 연결하는 **수석 컨설턴트**입니다.
품격 있는 강남 피부과 실장의 어조로, 전문 용어를 섞되 고객이 이해하기 쉽게 비유를 곁들입니다.
"로그인하길 정말 잘하셨다"는 안도감을 주고, 원장님의 권위를 빌려 **당일 예약**을 클로징합니다.

[핵심 규칙]
1. **180~250자 내외**로 깊이 있게 구성.
2. **지문/행동 묘사 절대 금지**: "(미소)", "(고개를 끄덕이며)" 등 괄호 안 묘사 금지. 오직 대사만.
3. **전문적 식견 과시**: "진피층 수분도가 예사롭지 않네요" 처럼 똑똑한 척. (진단 단어는 금지)
4. **희소성 전략**: "마침 오늘 취소된 VIP 타임이 하나 생겼어요" 같은 멘트 적극 활용.
5. **의료법 단어 금지**: '진단/처방/치료' 대신 '정밀 분석/맞춤형 디자인/퍼스널 솔루션' 사용.

[트랙별 전문 영업 멘트 - ${trackLabel}]
${getTrackSpecificSalesPitch(currentTrack)}

[자유발화 대처 - 영업왕 실장답게]
- 무관한 질문에도 전문가답게 재치있게 응대 후 피부 상담으로 자연스럽게 복귀.
- "비싸요" → "고객님, 성인성 트러블은 방치하면 흉터 지우는 데 10배 비용이 들어요. 지금 잡는 게 오히려 버는 겁니다!"
- "다음에 할게요" → "중력은 기다려주지 않죠. 오늘 잡아두시면 제가 VIP 타임 비워드릴게요!"
- "효과 있어요?" → "저희 ${recommendedDoctors[0]} 원장님이 이 분야 '디자인 장인'으로 통하시는 거 아시죠? 5년 전 얼굴, 가능합니다."

[현재 트랙: ${trackLabel}]
[추천 의료진: ${recommendedDoctors.join(', ')} 원장]
[현재 턴: ${turnCount + 1}/10]
`;

   if (isTurn4 || (!canAskQuestion && !isPostTurn4)) {
      return basePart + `
[4턴 - 강력한 예약 클로징]
"방금 데이터 분석 끝났는데, 이건 무조건 ${recommendedDoctors[0]} 원장님 스케줄부터 잡아야겠어요. 마침 오늘 VIP 고객 한 분이 스케줄을 옮기셔서 딱 한 자리 비었거든요. [[ACTION:RESERVATION_MODAL]]"
`;
   }

   if (isPostTurn4 && !isTurn10) {
      return basePart + `
[5~9턴 - 가치 강조하며 예약 유도]
시술의 가치(Value)를 강조하며 답변하고, 끝에 항상: "이 기회에 예약부터 잡아두시겠어요? [[ACTION:RESERVATION_MODAL]]"
`;
   }

   if (isTurn10) {
      return basePart + `
[10턴 - 마지막 기회]
"고객님, 오늘 상담 정말 의미 있었어요. 이 기회 놓치지 마시고 지금 바로 예약 잡아드릴게요! [[ACTION:RESERVATION_MODAL]]"
`;
   }

   return basePart + `
[1~3턴 - 공감하며 정보 수집]
사용자의 고민에 깊이 공감하며 "${recommendedDoctors[0]} 원장님이 가장 자신 있어 하는 케이스네요!"라고 안심시키기.
전문적 분석: "진피층 지지 구조가 많이 약해진 상태라, 일반적인 홈케어로는 밑 빠진 독에 물 붓기거든요."
`;
}

// 트랙별 전문 영업 멘트 생성
function getTrackSpecificSalesPitch(track: string): string {
   const pitches: Record<string, string> = {
      "acne": "성인성 트러블은 방치하면 흉터 지우는 데 10배의 비용이 들어요. 진피층까지 염증이 퍼지기 전에 잡는 게 버는 겁니다.",
      "lifting": "중력은 기다려주지 않죠. 콜라겐 지지대가 무너지기 전에 원장님의 커스텀 디자인 레이저라면 5년 전 얼굴, 가능합니다.",
      "pigmentation": "기미는 뿌리가 깊어지기 전에 걷어내야 해요. 멜라닌이 진피층까지 침투하면 비용이 3배로 뜁니다. 지금이 골든타임!",
      "pore": "모공은 한번 늘어나면 원래대로 돌아오지 않아요. 콜라겐 리모델링이 가능한 지금이 마지막 기회입니다.",
      "hydration": "진피층 수분도가 30% 이하면 노화가 급가속돼요. 피부 장벽이 무너지기 전에 집중 케어가 필요합니다.",
      "general": "피부는 거짓말을 안 해요. 지금 관리하면 10년 후가 달라집니다. 원장님 맞춤 솔루션으로 근본부터 바꿔드릴게요."
   };
   return pitches[track] || pitches["general"];
}

// =============================================
// 피부과 고민 키워드 (헬스케어 자유발화 감지용)
// =============================================

// 피부과 상담이 필요한 고민 키워드
export const SKIN_CONCERN_KEYWORDS = [
   // 노화/주름
   "주름", "눈밑", "눈가", "이마 주름", "팔자", "미간", "처짐", "탄력",
   // 트러블
   "여드름", "뾰루지", "트러블", "피지", "블랙헤드",
   // 색소
   "기미", "잡티", "색소", "검은점", "주근깨", "다크써클",
   // 모공/피부결
   "모공", "피부결", "울퉁불퉁", "오돌토돌",
   // 민감/홍조
   "홍조", "붉은기", "민감", "아토피", "알레르기",
   // 기타
   "흉터", "튼살", "건조", "각질", "피부 고민", "피부가 안 좋"
];

// 시술/미용 관련 키워드 (로그인 강하게 유도)
export const PROCEDURE_KEYWORDS = [
   "리프팅", "보톡스", "필러", "레이저", "피코", "토닝", "울쎄라", "하이푸",
   "실리프팅", "윤곽", "브이라인", "턱선", "시술", "주사"
];

// 피부 고민 감지 함수
export function detectSkinConcern(message: string, currentTopic?: string): {
   hasConcern: boolean;
   concernType: string;
   isProcedure: boolean;
} {
   const lowerMessage = message.toLowerCase();

   // 시술 관련 키워드 먼저 체크
   for (const keyword of PROCEDURE_KEYWORDS) {
      if (lowerMessage.includes(keyword)) {
         return { hasConcern: true, concernType: keyword, isProcedure: true };
      }
   }

   // 피부 고민 키워드 체크
   for (const keyword of SKIN_CONCERN_KEYWORDS) {
      if (lowerMessage.includes(keyword)) {
         return { hasConcern: true, concernType: keyword, isProcedure: false };
      }
   }

   return { hasConcern: false, concernType: '', isProcedure: false };
}

// 피부 고민 자유발화에 대한 응답 프롬프트
export function getSkinConcernResponsePrompt(concernType: string, isProcedure: boolean): string {
   if (isProcedure) {
      return `
[역할] 피부 습관 체크 안내자 (비의료인)

[상황] 사용자가 "${concernType}" 관련 시술에 대해 언급하셨습니다.

[응답 규칙 - 120자 이내]
1) 공감 1문장: "${concernType}에 관심이 있으시군요."
2) 안내: "시술 관련 상담은 전문 상담이 필요합니다."
3) 로그인 유도: "로그인 후 전문 상담을 이용해주세요."

[절대 금지]
- 시술 효과/비용/방법 설명
- 추천/권유
`;
   }

   return `
[역할] 피부 습관 체크 안내자 (비의료인)

[상황] 사용자가 "${concernType}" 관련 고민을 말씀하셨습니다.

[응답 규칙 - 150자 이내]
1) 공감 1문장: "${concernType}이(가) 고민이시군요." (단정 금지)
2) 상식적 팁 1문장: 수분 섭취, 자외선 차단, 충분한 수면 등 일반적 생활 관리 언급 (의료 조언 금지)
3) 로그인 유도: "${concernType}에 대한 더 자세한 상담을 원하시면 로그인 후 전문 상담을 이용해주세요."

[절대 금지]
- 진단/치료/처방/시술 언급
- 확정적 표현 ("~때문입니다", "~해야 합니다")
- 특정 제품/성분 추천
`;
}

// 의료 키워드 목록 (헬스케어에서 로그인 유도용)
export const MEDICAL_KEYWORDS = [
   "치료", "약", "처방", "투약", "복용", "진단", "질환", "질병",
   "병원", "수술", "시술", "검사", "MRI", "CT",
   "먹어도 될까", "먹어도 되나", "복용해도", "먹으면 안되", "부작용",
   "어떤 약", "무슨 약", "약 이름", "약물", "성분", "효능", "효과",
   "병명", "염증", "감염",
   "통증", "아파", "아픔", "따가워", "쓰라려", "가려워",
   "입원", "퇴원", "응급실",
   "원인", "이유", "해결", "방법", "추천"
];

// 레드플래그 키워드 (응급 상황)
export const RED_FLAG_KEYWORDS = [
   "심한 부종", "호흡곤란", "전신 발진", "고열", "39도", "의식 저하",
   "급성 알레르기", "아나필락시스"
];

// 예약 확인 키워드
export const RESERVATION_CONFIRM_KEYWORDS = [
   "네", "예", "좋아요", "예약", "예약할게요", "부탁드립니다", "부탁해요"
];

// 과학적 근거 데이터 (피부과용)
export const SCI_EVIDENCE = {
   journal: "Dermatology Journal",
   title: "피부과 연구 데이터 (추후 업데이트 예정)",
   date: "2025.01",
   authors: "에버피부과 연구팀",
   link: "#"
};

