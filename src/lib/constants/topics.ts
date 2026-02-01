// 에버피부과 헬스케어 토픽 상수 (단일 소스)
// 모든 topic 관련 검증은 이 파일을 참조

export const VALID_TOPICS = [
    // 피부과 (Dermatology)
    'glow-booster',
    'makeup-killer',
    'barrier-reset',
    'lifting-check',
    'skin-concierge',
    
    // 성형외과 (Plastic Surgery)
    'face-ratio',
    'trend-check',
    'virtual-plastic',

    // 한의원 (Korean Medicine)
    'body-type',
    'detox',

    // 치과 (Dentistry)
    'smile-design',
    'whitening-check',

    // 정형외과 (Orthopedics)
    'posture-check',
    'spine-reset',

    // 비뇨기과 (Urology)
    'vitality-check',
    'private-counsel',

    // 소아과 (Pediatrics)
    'growth-check',
    'fever-guide',

    // 산부인과 (OBGYN)
    'cycle-check',
    'pregnancy-guide',

    // 내과 (Internal Medicine)
    'fatigue-reset',
    'digestive-check',

    // 암요양 (Oncology)
    'immunity-up',
    'nutrition-plan',

    // 신경외과 (Neurosurgery)
    'headache-check',
    'spine-balance'
] as const;

export type Topic = typeof VALID_TOPICS[number];

export const DEFAULT_TOPIC: Topic = 'glow-booster';

// topic별 라벨
export const TOPIC_LABELS: Record<Topic, string> = {
    // 피부과
    'glow-booster': 'D-7 광채 부스터',
    'makeup-killer': '메이크업 원인 TOP3',
    'barrier-reset': '피부장벽 72시간',
    'lifting-check': '리프팅 후회포인트',
    'skin-concierge': '부티크 컨시어지',

    // 성형외과
    'face-ratio': '황금비율 분석',
    'trend-check': '트렌드 스타일',
    'virtual-plastic': '가상 성형 미러',

    // 한의원
    'body-type': '사상체질 진단',
    'detox': '해독 프로그램',

    // 치과
    'smile-design': '미소 시뮬레이션',
    'whitening-check': '미백 체크',

    // 정형외과
    'posture-check': '자세 밸런스',
    'spine-reset': '척추 리셋',

    // 비뇨기과
    'vitality-check': '활력 지수',
    'private-counsel': '시크릿 상담',

    // 소아과
    'growth-check': '예상 키 측정',
    'fever-guide': '열나요 SOS',

    // 산부인과
    'cycle-check': '핑크 다이어리',
    'pregnancy-guide': '베이비 시그널',

    // 내과
    'fatigue-reset': '활력 에너지',
    'digestive-check': '속편한 라이트',

    // 암요양
    'immunity-up': '면역 점수',
    'nutrition-plan': '힐링 레시피',

    // 신경외과
    'headache-check': '두통 디코더',
    'spine-balance': '신경 신호등'
};

// topic별 설명
export const TOPIC_DESCRIPTIONS: Record<Topic, string> = {
    // 피부과
    'glow-booster': '7일 광채 플랜 점검',
    'makeup-killer': '메이크업 무너짐 원인 분석',
    'barrier-reset': '장벽 회복 72시간 루틴',
    'lifting-check': '리프팅 전 체크리스트',
    'skin-concierge': '1:1 맞춤 루틴 설계',

    // 성형외과
    'face-ratio': '내 얼굴의 숨겨진 황금비율 찾기',
    'trend-check': '최신 트렌드와 내 얼굴의 조화 분석',
    'virtual-plastic': 'AI로 미리 보는 시술 후 모습',

    // 한의원
    'body-type': '나는 어떤 체질일까? 맞춤 처방',
    'detox': '몸속 독소를 비우는 해독 솔루션',

    // 치과
    'smile-design': '가장 아름다운 미소 라인 찾기',
    'whitening-check': '치아 밝기 단계 측정 및 미백 가이드',

    // 정형외과
    'posture-check': '거북목, 굽은 등 자가 진단',
    'spine-reset': '무너진 척추 밸런스 바로잡기',

    // 비뇨기과
    'vitality-check': '남성 활력 지수 자가 체크',
    'private-counsel': '기록이 남지 않는 1:1 익명 상담',

    // 소아과
    'growth-check': '유전과 환경으로 보는 예상 키',
    'fever-guide': '한밤중 갑작스런 고열 대처법',

    // 산부인과
    'cycle-check': '가임기, 배란일 정밀 예측',
    'pregnancy-guide': '임신 초기 증상과 건강 관리',

    // 내과
    'fatigue-reset': '만성 피로 원인 분석 및 수액 추천',
    'digestive-check': '위장 장애 원인과 식습관 코칭',

    // 암요양
    'immunity-up': '현재 나의 면역 상태 점검',
    'nutrition-plan': '암을 이기는 항암 식단 가이드',

    // 신경외과
    'headache-check': '편두통, 긴장성 두통 원인 찾기',
    'spine-balance': '신경 눌림과 통증 부위 확인'
};

// topic 유효성 검사
export function isValidTopic(topic: string): topic is Topic {
    return VALID_TOPICS.includes(topic as Topic);
}

// topic 안전 변환 (잘못된 값 → 디폴트)
export function sanitizeTopic(topic: string | null | undefined): Topic {
    if (topic && isValidTopic(topic)) {
        return topic;
    }
    return DEFAULT_TOPIC;
}

