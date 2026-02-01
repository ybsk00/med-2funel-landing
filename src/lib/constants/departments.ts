export interface Department {
    id: string;
    name: string; // Internal/URL name
    label: string; // Display name
    virtualName: string; // Virtual Healthcare Brand Name
    catchphrase: string; // NEW: Branding catchphrase
    video: string;
    hero: {
        title: string;
        subtitle: string;
    };
    marketing: {
        searchKeyword: string;
        surveyHeadline?: string; // NEW: Customizable headline for chat section
        cta: {
            title: string;
            buttonText: string;
            icon: string; // Lucide Icon Name
            link: string;
            defaultTopic: string;
        }
    };
    theme: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
        concept: string;
        texture: string; // Visual texture key
        font?: string; // Font style preference
        sound?: string; // Interaction sound file path
    };
    keywords: string[];
    modules?: any[]; // Specific modules for this department
}

export const DEPARTMENTS: Department[] = [
    {
        id: "plastic-surgery",
        name: "성형외과",
        label: "성형외과",
        virtualName: "The Line",
        catchphrase: "당신만의 선을 재정의하다",
        video: "/히어로세션/성형외과.mp4",
        hero: {
            title: "숨겨진 1mm의 미학",
            subtitle: "당신만이 가질 수 있는 완벽한 '선'을 재정의하세요."
        },
        marketing: {
            searchKeyword: "강남 성형외과 추천",
            surveyHeadline: "나에게 최적화된 비율이 궁금하다면?",
            cta: {
                title: "나의 숨겨진 1mm 찾기",
                buttonText: "황금비율 페이스 분석",
                icon: "Camera",
                link: "healthcare/chat?topic=face-ratio",
                defaultTopic: "face-ratio"
            }
        },
        theme: {
            primary: "#000000",
            secondary: "#B76E79",
            accent: "#D4AF37",
            background: "#F9F9F9", // Off-white for better contrast
            text: "#1F2937", // Dark Gray
            concept: "High-End Luxury",
            texture: "silk",
            font: "serif",
            sound: "/sounds/tick.mp3"
        },
        keywords: ["눈/코", "리프팅", "가슴", "지방흡입"],
        modules: [
            { id: 'virtual-plastic', title: 'AI 미러', description: '사진으로 미리 보는 나의 변화', icon: 'Camera', color: 'rose' },
            { id: 'trend-check', title: '트렌드 분석', description: '요즘 유행하는 스타일과 내 얼굴의 조화', icon: 'Sparkles', color: 'gold' },
            { id: 'ratio-doctor', title: '비율 닥터', description: '나만 모르는 얼굴 황금비율 찾기', icon: 'Ruler', color: 'stone' },
            { id: 'recovery-tip', title: '애프터 케어', description: '빠른 회복을 위한 1:1 루틴 가이드', icon: 'Heart', color: 'pink' }
        ]
    },
    {
        id: "dermatology",
        name: "피부과",
        label: "피부과",
        virtualName: "Blanc de Skin",
        catchphrase: "홀로그램처럼 빛나는 피부 본연의 광채",
        video: "/히어로세션/피부과.mp4",
        hero: {
            title: "빛이 머무는 피부",
            subtitle: "홀로그램처럼 빛나는 피부 본연의 광채를 찾아드립니다."
        },
        marketing: {
            searchKeyword: "피부과 전문의 추천",
            surveyHeadline: "오늘 내 피부의 광채 지수가 궁금하다면?",
            cta: {
                title: "내 피부 나이 확인하기",
                buttonText: "AI 피부 진단 시작",
                icon: 'Sparkles',
                link: "healthcare/chat?topic=glow-booster",
                defaultTopic: "glow-booster"
            }
        },
        theme: {
            primary: "#FFC0CB",
            secondary: "#E0E0E0",
            accent: "#FF69B4",
            background: "#FAFAFA", // Slight grey tint
            text: "#333333", // Dark Gray
            concept: "Holographic Gloss",
            texture: "hologram",
            font: "sans",
            sound: "/sounds/sparkle.mp3"
        },
        keywords: ["여드름", "기미", "리프팅", "모공"],
        modules: [
            { id: 'glow-booster', title: '글로우 부스터', description: '즉각적인 톤업 솔루션', icon: 'Sparkles', color: 'pink' },
            { id: 'barrier-reset', title: '장벽 리셋', description: '무너진 피부 장벽 세우기', icon: 'Shield', color: 'teal' },
            { id: 'sun-protector', title: '선 레이더', description: '오늘 자외선 대비 내 피부 맞춤 처방', icon: 'Sun', color: 'orange' },
            { id: 'acne-clear', title: '트러블 제로', description: '갑자기 올라온 피부 고민 해결사', icon: 'Zap', color: 'purple' }
        ]
    },
    {
        id: "korean-medicine",
        name: "한의원",
        label: "한의원",
        virtualName: "Bon Cho",
        catchphrase: "자연의 기운으로 근본을 다스리다",
        video: "/히어로세션/한방병원.mp4",
        hero: {
            title: "몸의 조화, 자연에서 찾다",
            subtitle: "몸의 조화가 무너졌을 때, 자연에서 찾은 근본적인 치유를 경험하세요."
        },
        marketing: {
            searchKeyword: "유명한 한의원",
            surveyHeadline: "내 체질에 맞는 기운의 조화가 궁금하다면?",
            cta: {
                title: "내 체질에 맞는 보약은?",
                buttonText: "사상체질 자가 진단",
                icon: "User",
                link: "healthcare/chat?topic=body-type",
                defaultTopic: "body-type"
            }
        },
        theme: {
            primary: "#4A5D23",
            secondary: "#8D8D8D",
            accent: "#8B4513",
            background: "#F5F5F4", // Warm Stone Gray (Hanji)
            text: "#1C1917", // Very Dark Warm Gray
            concept: "Modern Tradition",
            texture: "hanji",
            font: "serif",
            sound: "/sounds/gong.mp3"
        },
        keywords: ["침", "보약", "체질", "추나"],
        modules: [
            { id: 'body-type', title: '내 몸의 원소', description: '나는 불? 물? 타고난 기질 알아보기', icon: 'User', color: 'stone' },
            { id: 'detox', title: '비움의 미학', description: '몸속 깊은 독소 배출 프로그램', icon: 'Droplet', color: 'amber' },
            { id: 'seasonal-health', title: '절기 보약', description: '환절기 면역력을 높이는 한방 비책', icon: 'Sun', color: 'green' },
            { id: 'qi-flow', title: '기혈 순환', description: '막힌 기운을 뚫어주는 스트레칭 가이드', icon: 'Activity', color: 'orange' }
        ]
    },
    {
        id: "dentistry",
        name: "치과",
        label: "치과",
        virtualName: "Denti Crew",
        catchphrase: "0.1mm 오차 없는 정밀한 미소 설계",
        video: "/히어로세션/dentistry_hero.jpg",
        hero: {
            title: "완벽한 미소의 설계",
            subtitle: "미소는 당신이 내미는 가장 아름다운 명함입니다. 0.1mm의 오차 없는 정밀함."
        },
        marketing: {
            searchKeyword: "임플란트 잘하는 치과",
            surveyHeadline: "교정 후 내 미소의 변화가 궁금하다면?",
            cta: {
                title: "활짝 웃을 때 내 모습",
                buttonText: "미소 시뮬레이션",
                icon: "Smile",
                link: "healthcare/chat?topic=smile-design",
                defaultTopic: "smile-design"
            }
        },
        theme: {
            primary: "#0EA5E9", // Slightly darker Sky Blue
            secondary: "#38BDF8",
            accent: "#0284C7",
            background: "#F0F9FF", // Very Light Sky Blue
            text: "#0C4A6E", // Dark Sky Blue
            concept: "Super Clean Lab",
            texture: "glass",
            font: "sans",
            sound: "/sounds/crystal.mp3"
        },
        keywords: ["임플란트", "교정", "미백", "충치"],
        modules: [
            { id: 'whitening-check', title: '스노우 화이트', description: '필터 낀 듯 하얀 미소 만들기', icon: 'Sparkles', color: 'cyan' },
            { id: 'smile-design', title: '스마일 아키텍트', description: '교정 후 모습 미리 시뮬레이션', icon: 'Heart', color: 'purple' },
            { id: 'plaque-radar', title: '플라그 레이더', description: '놓치기 쉬운 어금니 뒤쪽 관리법', icon: 'Shield', color: 'blue' },
            { id: 'gum-care', title: '잇몸 탄력', description: '건강한 선분홍빛 잇몸 루틴', icon: 'Activity', color: 'pink' }
        ]
    },
    {
        id: "orthopedics",
        name: "정형외과",
        label: "정형외과",
        virtualName: "Bone Balance",
        catchphrase: "무너진 중심을 바로 세우는 공학적 리셋",
        video: "/히어로세션/정형외과.mp4",
        hero: {
            title: "일상의 균형을 되찾다",
            subtitle: "무너진 중심을 바로 세우는 정밀 설계, 통증 없는 일상의 균형을 되찾아 드립니다."
        },
        marketing: {
            searchKeyword: "도수치료 정형외과",
            surveyHeadline: "비뚤어진 내 자세의 균형이 궁금하다면?",
            cta: {
                title: "혹시 나도 거북목일까?",
                buttonText: "자세 밸런스 측정",
                icon: "Activity",
                link: "healthcare/chat?topic=posture-check",
                defaultTopic: "posture-check"
            }
        },
        theme: {
            primary: "#1E40AF", // Darker Navy
            secondary: "#FF4500",
            accent: "#1E90FF",
            background: "#F8FAFC", // Very Light Slate
            text: "#1E3A8A", // Dark Blue
            concept: "Engineering Blueprint",
            texture: "blueprint",
            font: "mono",
            sound: "/sounds/ruler.mp3"
        },
        keywords: ["관절", "척추", "물리치료", "도수치료"],
        modules: [
            { id: 'posture-check', title: '거북목 브레이커', description: 'C자 커브 되찾기 프로젝트', icon: 'ArrowUpRight', color: 'blue' },
            { id: 'spine-reset', title: '척추 리셋', description: '무너진 코어 바로잡기', icon: 'Activity', color: 'orange' },
            { id: 'joint-shield', title: '관절 세이이퍼', description: '비 오는 날 마다 쑤신 관절 관리비법', icon: 'Shield', color: 'cyan' },
            { id: 'stretch-doctor', title: '모닝 스트레치', description: '자고 일어나면 뻣뻣한 몸을 위한 5분 가이드', icon: 'Zap', color: 'yellow' }
        ]
    },
    {
        id: "urology",
        name: "비뇨기과",
        label: "비뇨기과",
        virtualName: "Men's Private",
        catchphrase: "완벽한 익명 속에서 되찾는 강력한 활력",
        video: "/히어로세션/비뇨기과.mp4",
        hero: {
            title: "강력한 활력의 재충전",
            subtitle: "누구에게도 말하지 못한 고민, 완벽한 프라이버시 속에서 강력한 활력을 재충전하세요."
        },
        marketing: {
            searchKeyword: "남성 비뇨기과 추천",
            surveyHeadline: "누구에게도 말 못할 자신감 고민이 있다면?",
            cta: {
                title: "남자의 자신감 점수는?",
                buttonText: "활력 지수 체크",
                icon: "Zap",
                link: "healthcare/chat?topic=vitality-check",
                defaultTopic: "vitality-check"
            }
        },
        theme: {
            primary: "#4B0082",
            secondary: "#ADFF2F",
            accent: "#9400D3",
            background: "#000000",
            text: "#FFFFFF",
            concept: "Cyber Night",
            texture: "carbon",
            font: "sans",
            sound: "/sounds/engine.mp3"
        },
        keywords: ["전립선", "요로결석", "남성수술"],
        modules: [
            { id: 'vitality-check', title: '파워 엔진', description: '남자의 자신감 재충전', icon: 'Zap', color: 'yellow' },
            { id: 'private-counsel', title: '시크릿 요원', description: '흔적 없는 익명 상담', icon: 'Lock', color: 'indigo' },
            { id: 'prostate-check', title: '이너 파워', description: '보이지 않는 전립선 건강 미리 체크', icon: 'Shield', color: 'violet' },
            { id: 'stamina-up', title: '스태미나 가이드', description: '지치지 않는 에너지를 위한 생활 습관', icon: 'Activity', color: 'orange' }
        ]
    },
    {
        id: "pediatrics",
        name: "소아과",
        label: "소아과",
        virtualName: "Kids Doctor",
        catchphrase: "우리 아이 성장의 모든 순간을 기록하다",
        video: "/히어로세션/소아과.mp4",
        hero: {
            title: "성장의 모든 순간",
            subtitle: "우리 아이의 모든 성장은 기록입니다. 한밤중의 불안까지 함께하는 든든한 가이드."
        },
        marketing: {
            searchKeyword: "야간진료 소아과",
            surveyHeadline: "우리 아이의 성장 곡선이 궁금하다면?",
            cta: {
                title: "우리 아이 얼마나 클까?",
                buttonText: "예상 키 계산기",
                icon: "Ruler",
                link: "healthcare/chat?topic=growth-check",
                defaultTopic: "growth-check"
            }
        },
        theme: {
            primary: "#FBBF24", // Amber
            secondary: "#87CEEB",
            accent: "#F59E0B",
            background: "#FFFBEB", // Very Light Amber
            text: "#78350F", // Dark Amber
            concept: "Soft Playroom",
            texture: "jelly",
            font: "round",
            sound: "/sounds/jelly.mp3"
        },
        keywords: ["예방접종", "영유아검진", "호흡기", "알레르기"],
        modules: [
            { id: 'growth-check', title: '슈퍼 성장차트', description: '우리 아이 나중에 얼마나 클까?', icon: 'BarChart', color: 'yellow' },
            { id: 'fever-guide', title: '열나요 SOS', description: '한밤중 열날 때 대처 가이드', icon: 'Thermometer', color: 'red' },
            { id: 'immunity-doctor', title: '면역력 수비대', description: '단체생활 시작 전 필수 면역 관리', icon: 'Shield', color: 'green' },
            { id: 'baby-food', title: '영양 솔루션', description: '편식하는 아이를 위한 맞춤 제언', icon: 'Heart', color: 'orange' }
        ]
    },
    {
        id: "obgyn",
        name: "산부인과",
        label: "산부인과",
        virtualName: "Maman Care",
        catchphrase: "따뜻한 물결처럼 흐르는 당신만의 리듬",
        video: "/히어로세션/산부인과.mp4",
        hero: {
            title: "당신만의 리듬을 지키다",
            subtitle: "당신의 가장 소중한 순간, 따뜻하고 섬세한 케어로 내 몸의 리듬을 지킵니다."
        },
        marketing: {
            searchKeyword: "여의사 산부인과",
            surveyHeadline: "내 몸이 보내는 작은 신호들이 궁금하다면?",
            cta: {
                title: "나의 가임기/배란일은?",
                buttonText: "핑크 다이어리",
                icon: "Calendar",
                link: "healthcare/chat?topic=cycle-check",
                defaultTopic: "cycle-check"
            }
        },
        theme: {
            primary: "#BE123C", // Darker Pink/Rose
            secondary: "#FFDAB9",
            accent: "#9F1239",
            background: "#FFF1F2", // Very Light Rose
            text: "#881337", // Dark Rose
            concept: "Organic Flow",
            texture: "flower",
            font: "serif",
            sound: "/sounds/water.mp3"
        },
        keywords: ["산전검사", "출산", "여성질환", "검진"],
        modules: [
            { id: 'cycle-check', title: '문 사이클', description: '단순 달력이 아닌 내 몸의 리듬', icon: 'Moon', color: 'pink' },
            { id: 'pregnancy-guide', title: '베이비 시그널', description: '아기가 보내는 신호 해석하기', icon: 'Heart', color: 'rose' },
            { id: 'hormone-doctor', title: '밸런스 케어', description: '생리 전 증후군 완화 가이드', icon: 'Sparkles', color: 'violet' },
            { id: 'inner-beauty', title: 'Y-클린 데일리', description: '가장 소중한 곳을 위한 건강 제언', icon: 'Shield', color: 'amber' }
        ]
    },
    {
        id: "internal-medicine",
        name: "내과",
        label: "내과",
        virtualName: "Inner Wellness",
        catchphrase: "몸속 정원을 가꾸는 내면의 활력 케어",
        video: "/히어로세션/내과.mp4",
        hero: {
            title: "내면의 활력을 깨우다",
            subtitle: "몸속 정원, 오늘 당신의 컨디션은 어떤가요? 보이지 않는 곳의 활력까지 케어합니다."
        },
        marketing: {
            searchKeyword: "건강검진 내과",
            surveyHeadline: "보이지 않는 내 장기들의 컨디션이 궁금하다면?",
            cta: {
                title: "만성 피로, 이유가 뭘까?",
                buttonText: "활력 에너지 측정",
                icon: "Battery",
                link: "healthcare/chat?topic=fatigue-reset",
                defaultTopic: "fatigue-reset"
            }
        },
        theme: {
            primary: "#047857", // Darker Emerald
            secondary: "#D2B48C",
            accent: "#065F46",
            background: "#F0FDF4", // Very Light Green
            text: "#064E3B", // Dark Emerald
            concept: "Botanic Garden",
            texture: "botanic",
            font: "sans",
            sound: "/sounds/nature.mp3"
        },
        keywords: ["검진", "내시경", "수액", "만성질환"],
        modules: [
            { id: 'digestive-check', title: '속편한 라이트', description: '가벼워지는 식습관', icon: 'Activity', color: 'green' },
            { id: 'fatigue-reset', title: '에너지 충전소', description: '만성 피로 수액 솔루션', icon: 'Droplet', color: 'blue' },
            { id: 'sugar-radar', title: '혈당 레이더', description: '숨어있는 고혈당 위험군 체크', icon: 'Zap', color: 'orange' },
            { id: 'vitamin-guide', title: '영양소 맵', description: '내게 부족한 결핍 비타민 찾기', icon: 'Sparkles', color: 'amber' }
        ]
    },
    {
        id: "oncology",
        name: "암요양병원",
        label: "암요양병원",
        virtualName: "Care For You",
        catchphrase: "면역의 요새를 쌓는 희망의 아침 햇살",
        video: "/히어로세션/암요양병원.mp4",
        hero: {
            title: "희망의 아침을 맞이하다",
            subtitle: "다시 시작하는 삶, 면역의 요새를 쌓아 어제보다 더 건강한 오늘을 약속합니다."
        },
        marketing: {
            searchKeyword: "암요양병원 추천",
            surveyHeadline: "어제보다 나은 나의 면역력이 궁금하다면?",
            cta: {
                title: "지금 내 면역 상태는?",
                buttonText: "면역 점수 체크",
                icon: "Shield",
                link: "healthcare/chat?topic=immunity-up",
                defaultTopic: "immunity-up"
            }
        },
        theme: {
            primary: "#B45309", // Darker Amber
            secondary: "#FAF0E6",
            accent: "#92400E",
            background: "#FFFCF5", // Very Light Warm
            text: "#451A03", // Dark Brown
            concept: "Morning Sun",
            texture: "linen",
            font: "serif",
            sound: "/sounds/morning.mp3"
        },
        keywords: ["요양", "면역", "재활", "통합의학"],
        modules: [
            { id: 'immunity-up', title: '이뮤니티 쉴드', description: '면역 요새 쌓기', icon: 'Shield', color: 'amber' },
            { id: 'nutrition-plan', title: '힐링 레시피', description: '암세포와 싸우는 식단', icon: 'Heart', color: 'orange' },
            { id: 'rehab-guide', title: '리버티 재활', description: '기능 회복을 위한 부드러운 모션', icon: 'Activity', color: 'green' },
            { id: 'mind-peace', title: '마음의 숲', description: '불안을 잠재우는 명상 가이드', icon: 'Moon', color: 'violet' }
        ]
    },
    {
        id: "neurosurgery",
        name: "신경외과",
        label: "신경외과",
        virtualName: "Neuro Scan",
        catchphrase: "뇌 신경망의 안개를 걷어내는 정밀 디코딩",
        video: "/히어로세션/신경외과.mp4",
        hero: {
            title: "신경망의 안개를 걷다",
            subtitle: "안개 속 통증, 빛으로 찾아냅니다. 당신의 뇌 신경망을 위한 정밀한 디코딩."
        },
        marketing: {
            searchKeyword: "두통 어지럼증 신경외과",
            surveyHeadline: "복잡하게 얽힌 내 통증 시스템의 원인이 궁금하다면?",
            cta: {
                title: "지긋지긋한 편두통 원인은?",
                buttonText: "통증 원인 디코딩",
                icon: "Brain",
                link: "healthcare/chat?topic=headache-check",
                defaultTopic: "headache-check"
            }
        },
        theme: {
            primary: "#4B0082",
            secondary: "#7B68EE",
            accent: "#8A2BE2",
            background: "#0F172A",
            text: "#E0FFFF",
            concept: "Neuro Scan",
            texture: "hologram",
            font: "mono",
            sound: "/sounds/scan.mp3"
        },
        keywords: ["뇌혈관", "디스크", "척추", "두통"],
        modules: [
            { id: 'headache-check', title: '두통 디코더', description: '지긋지긋한 편두통, 원인을 해독해드립니다', icon: 'Zap', color: 'indigo' },
            { id: 'spine-balance', title: '신경 신호등', description: '찌릿한 손발 저림, 신경계 막힘 확인', icon: 'Activity', color: 'violet' },
            { id: 'focus-booster', title: '뇌파 밸런스', description: '집중력이 떨어진 뇌를 위한 휴식법', icon: 'Brain', color: 'cyan' },
            { id: 'sleep-decoder', title: '딥 슬립 가이드', description: '잠 못 드는 뇌를 재우는 신경 안정 루틴', icon: 'Moon', color: 'purple' }
        ]
    }
];

export function getDepartment(id: string) {
    return DEPARTMENTS.find((d) => d.id === id);
}
