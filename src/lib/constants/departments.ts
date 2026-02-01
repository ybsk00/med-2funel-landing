
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
    theme: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
        concept: string;
        texture: string; // NEW: Visual texture key
        font?: string; // NEW: Font style preference
        sound?: string; // NEW: Interaction sound file path
    };
    keywords: string[];
    modules?: any[]; // Specific modules for this department
}

export const DEPARTMENTS: Department[] = [
    {
        id: "plastic-surgery",
        name: "성형외과",
        label: "성형외과",
        virtualName: "The Line", // 더 라인
        catchphrase: "당신만의 선을 재정의하다",
        video: "/히어로세션/성형외과.mp4",
        hero: {
            title: "숨겨진 1mm의 미학",
            subtitle: "당신만이 가질 수 있는 완벽한 '선'을 재정의하세요."
        },
        theme: {
            primary: "#000000", // Black
            secondary: "#B76E79", // Rose Gold
            accent: "#D4AF37", // Gold
            background: "#121212", // Dark Gray/Black
            text: "#FFFFFF",
            concept: "High-End Luxury",
            texture: "silk",
            font: "serif",
            sound: "/sounds/tick.mp3"
        },
        keywords: ["눈/코", "리프팅", "가슴", "지방흡입"],
        modules: [
            { id: 'virtual-plastic', title: 'AI 미러', description: '사진으로 미리 보는 나의 변화', icon: 'Camera', color: 'rose' },
            { id: 'trend-check', title: '트렌드 분석', description: '요즘 유행하는 스타일과 내 얼굴의 조화', icon: 'Sparkles', color: 'gold' }
        ]
    },
    {
        id: "dermatology",
        name: "피부과",
        label: "피부과",
        virtualName: "Blanc de Skin", // 블랑 드 스킨
        catchphrase: "홀로그램처럼 빛나는 피부 본연의 광채",
        video: "/히어로세션/피부과.mp4",
        hero: {
            title: "빛이 머무는 피부",
            subtitle: "홀로그램처럼 빛나는 피부 본연의 광채를 찾아드립니다."
        },
        theme: {
            primary: "#FFC0CB", // Pink
            secondary: "#E0E0E0", // Silver
            accent: "#FF69B4", // Hot Pink
            background: "#F5F5F5", // Light Silver/White
            text: "#333333",
            concept: "Holographic Gloss",
            texture: "hologram",
            font: "sans",
            sound: "/sounds/sparkle.mp3"
        },
        keywords: ["여드름", "기미", "리프팅", "모공"],
        modules: [
            { id: 'glow-booster', title: '글로우 부스터', description: '즉각적인 톤업 솔루션', icon: 'Sparkles', color: 'pink' },
            { id: 'barrier-reset', title: '장벽 리셋', description: '무너진 피부 장벽 세우기', icon: 'Shield', color: 'teal' }
        ]
    },
    {
        id: "korean-medicine",
        name: "한의원",
        label: "한의원",
        virtualName: "Bon Cho", // 본 초
        catchphrase: "자연의 기운으로 근본을 다스리다",
        video: "/히어로세션/한방병원.mp4",
        hero: {
            title: "몸의 조화, 자연에서 찾다",
            subtitle: "몸의 조화가 무너졌을 때, 자연에서 찾은 근본적인 치유를 경험하세요."
        },
        theme: {
            primary: "#4A5D23", // Deep Green
            secondary: "#8D8D8D", // Stone Gray
            accent: "#8B4513", // Saddle Brown
            background: "#F0F0F0", // Off White (Hanji)
            text: "#2F4F4F", // Dark Slate Gray
            concept: "Modern Tradition",
            texture: "hanji",
            font: "serif",
            sound: "/sounds/gong.mp3"
        },
        keywords: ["침", "보약", "체질", "추나"],
        modules: [
            { id: 'body-type', title: '내 몸의 원소', description: '나는 불? 물? 타고난 기질 알아보기', icon: 'User', color: 'stone' },
            { id: 'detox', title: '비움의 미학', description: '몸속 깊은 독소 배출 프로그램', icon: 'Droplet', color: 'amber' }
        ]
    },
    {
        id: "dentistry",
        name: "치과",
        label: "치과",
        virtualName: "Denti Crew", // 덴티 크루
        catchphrase: "0.1mm 오차 없는 정밀한 미소 설계",
        video: "/히어로세션/치과.mp4",
        hero: {
            title: "완벽한 미소의 설계",
            subtitle: "미소는 당신이 내미는 가장 아름다운 명함입니다. 0.1mm의 오차 없는 정밀함."
        },
        theme: {
            primary: "#00FFFF", // Neon Mint (Cyan)
            secondary: "#FFFFFF", // White
            accent: "#00CED1", // Dark Turquoise
            background: "#FFFFFF", // Pure White
            text: "#000000",
            concept: "Super Clean Lab",
            texture: "glass",
            font: "sans",
            sound: "/sounds/crystal.mp3"
        },
        keywords: ["임플란트", "교정", "미백", "충치"],
        modules: [
            { id: 'whitening-check', title: '스노우 화이트', description: '필터 낀 듯 하얀 미소 만들기', icon: 'Sparkles', color: 'cyan' },
            { id: 'smile-design', title: '스마일 아키텍트', description: '교정 후 모습 미리 시뮬레이션', icon: 'Heart', color: 'purple' }
        ]
    },
    {
        id: "orthopedics",
        name: "정형외과",
        label: "정형외과",
        virtualName: "Bone Balance", // 본 밸런스
        catchphrase: "무너진 중심을 바로 세우는 공학적 리셋",
        video: "/히어로세션/정형외과.mp4",
        hero: {
            title: "일상의 균형을 되찾다",
            subtitle: "무너진 중심을 바로 세우는 정밀 설계, 통증 없는 일상의 균형을 되찾아 드립니다."
        },
        theme: {
            primary: "#000080", // Navy
            secondary: "#FF4500", // Orange Red (Signal)
            accent: "#1E90FF", // Dodger Blue
            background: "#E6E6FA", // Lavender (Grid background base)
            text: "#000080",
            concept: "Engineering Blueprint",
            texture: "blueprint",
            font: "mono",
            sound: "/sounds/ruler.mp3"
        },
        keywords: ["관절", "척추", "물리치료", "도수치료"],
        modules: [
            { id: 'posture-check', title: '거북목 브레이커', description: 'C자 커브 되찾기 프로젝트', icon: 'ArrowUpRight', color: 'blue' },
            { id: 'spine-reset', title: '척추 리셋', description: '무너진 코어 바로잡기', icon: 'Activity', color: 'orange' }
        ]
    },
    {
        id: "urology",
        name: "비뇨기과",
        label: "비뇨기과",
        virtualName: "Men's Private", // 맨즈 프라이빗
        catchphrase: "완벽한 익명 속에서 되찾는 강력한 활력",
        video: "/히어로세션/비뇨기과.mp4",
        hero: {
            title: "강력한 활력의 재충전",
            subtitle: "누구에게도 말하지 못한 고민, 완벽한 프라이버시 속에서 강력한 활력을 재충전하세요."
        },
        theme: {
            primary: "#4B0082", // Indigo/Deep Purple
            secondary: "#ADFF2F", // Green Yellow (Volt)
            accent: "#9400D3", // Dark Violet
            background: "#000000", // Black
            text: "#FFFFFF",
            concept: "Cyber Night",
            texture: "carbon",
            font: "sans",
            sound: "/sounds/engine.mp3"
        },
        keywords: ["전립선", "요로결석", "남성수술"],
        modules: [
            { id: 'vitality-check', title: '파워 엔진', description: '남자의 자신감 재충전', icon: 'Zap', color: 'yellow' },
            { id: 'private-counsel', title: '시크릿 요원', description: '흔적 없는 익명 상담', icon: 'Lock', color: 'indigo' }
        ]
    },
    {
        id: "pediatrics",
        name: "소아과",
        label: "소아과",
        virtualName: "Kids Doctor", // 키즈 닥터
        catchphrase: "우리 아이 성장의 모든 순간을 기록하다",
        video: "/히어로세션/소아과.mp4",
        hero: {
            title: "성장의 모든 순간",
            subtitle: "우리 아이의 모든 성장은 기록입니다. 한밤중의 불안까지 함께하는 든든한 가이드."
        },
        theme: {
            primary: "#FFD700", // Gold/Yellow
            secondary: "#87CEEB", // Sky Blue
            accent: "#FFA500", // Orange
            background: "#FFFFE0", // Light Yellow
            text: "#4B0082",
            concept: "Soft Playroom",
            texture: "jelly",
            font: "round", // Rounded font
            sound: "/sounds/jelly.mp3"
        },
        keywords: ["예방접종", "영유아검진", "호흡기", "알레르기"],
        modules: [
            { id: 'growth-check', title: '슈퍼 성장차트', description: '우리 아이 나중에 얼마나 클까?', icon: 'BarChart', color: 'yellow' },
            { id: 'fever-guide', title: '열나요 SOS', description: '한밤중 열날 때 대처 가이드', icon: 'Thermometer', color: 'red' }
        ]
    },
    {
        id: "obgyn",
        name: "산부인과",
        label: "산부인과",
        virtualName: "Maman Care", // 마망 케어
        catchphrase: "따뜻한 물결처럼 흐르는 당신만의 리듬",
        video: "/히어로세션/산부인과.mp4",
        hero: {
            title: "당신만의 리듬을 지키다",
            subtitle: "당신의 가장 소중한 순간, 따뜻하고 섬세한 케어로 내 몸의 리듬을 지킵니다."
        },
        theme: {
            primary: "#FF7F50", // Coral
            secondary: "#FFDAB9", // Peach Puff
            accent: "#FA8072", // Salmon
            background: "#FFF5EE", // Seashell
            text: "#8B4513", // Saddle Brown
            concept: "Organic Flow",
            texture: "flower",
            font: "serif",
            sound: "/sounds/water.mp3"
        },
        keywords: ["산전검사", "출산", "여성질환", "검진"],
        modules: [
            { id: 'cycle-check', title: '문 사이클', description: '단순 달력이 아닌 내 몸의 리듬', icon: 'Moon', color: 'pink' },
            { id: 'pregnancy-guide', title: '베이비 시그널', description: '아기가 보내는 신호 해석하기', icon: 'Heart', color: 'rose' }
        ]
    },
    {
        id: "internal-medicine",
        name: "내과",
        label: "내과",
        virtualName: "Inner Wellness", // 이너 웰니스
        catchphrase: "몸속 정원을 가꾸는 내면의 활력 케어",
        video: "/히어로세션/내과.mp4",
        hero: {
            title: "내면의 활력을 깨우다",
            subtitle: "몸속 정원, 오늘 당신의 컨디션은 어떤가요? 보이지 않는 곳의 활력까지 케어합니다."
        },
        theme: {
            primary: "#8FBC8F", // Dark Sea Green
            secondary: "#D2B48C", // Tan (Earth)
            accent: "#556B2F", // Dark Olive Green
            background: "#F0FFF0", // Honey Dew
            text: "#2F4F4F",
            concept: "Botanic Garden",
            texture: "botanic",
            font: "sans",
            sound: "/sounds/nature.mp3"
        },
        keywords: ["검진", "내시경", "수액", "만성질환"],
        modules: [
            { id: 'digestive-check', title: '속편한 라이트', description: '가벼워지는 식습관', icon: 'Activity', color: 'green' },
            { id: 'fatigue-reset', title: '에너지 충전소', description: '만성 피로 수액 솔루션', icon: 'Droplet', color: 'blue' }
        ]
    },
    {
        id: "oncology",
        name: "암요양병원",
        label: "암요양병원",
        virtualName: "Care For You", // 케어 포 유
        catchphrase: "면역의 요새를 쌓는 희망의 아침 햇살",
        video: "/히어로세션/암요양병원.mp4",
        hero: {
            title: "희망의 아침을 맞이하다",
            subtitle: "다시 시작하는 삶, 면역의 요새를 쌓아 어제보다 더 건강한 오늘을 약속합니다."
        },
        theme: {
            primary: "#FFBF00", // Amber
            secondary: "#FAF0E6", // Linen
            accent: "#DAA520", // Golden Rod
            background: "#FDF5E6", // Old Lace
            text: "#8B4513",
            concept: "Morning Sun",
            texture: "linen",
            font: "serif",
            sound: "/sounds/morning.mp3"
        },
        keywords: ["요양", "면역", "재활", "통합의학"],
        modules: [
            { id: 'immunity-up', title: '이뮤니티 쉴드', description: '면역 요새 쌓기', icon: 'Shield', color: 'amber' },
            { id: 'nutrition-plan', title: '힐링 레시피', description: '암세포와 싸우는 식단', icon: 'Heart', color: 'orange' }
        ]
    },
    {
        id: "neurosurgery",
        name: "신경외과",
        label: "신경외과",
        virtualName: "Neuro Scan", // 뉴로 스캔
        catchphrase: "뇌 신경망의 안개를 걷어내는 정밀 디코딩",
        video: "/히어로세션/신경외과.mp4",
        hero: {
            title: "신경망의 안개를 걷다",
            subtitle: "안개 속 통증, 빛으로 찾아냅니다. 당신의 뇌 신경망을 위한 정밀한 디코딩."
        },
        theme: {
            primary: "#4B0082", // Indigo
            secondary: "#7B68EE", // Medium Slate Blue
            accent: "#8A2BE2", // Blue Violet
            background: "#0F172A", // Dark Slate (Circuit bg)
            text: "#E0FFFF", // Light Cyan
            concept: "Neuro Scan",
            texture: "hologram",
            font: "mono",
            sound: "/sounds/scan.mp3"
        },
        keywords: ["뇌혈관", "디스크", "척추", "두통"],
        modules: [
            { id: 'headache-check', title: '두통 디코더', description: '지긋지긋한 편두통, 원인을 해독해드립니다', icon: 'Zap', color: 'indigo' },
            { id: 'spine-balance', title: '신경 신호등', description: '찌릿한 손발 저림, 신경계 막힘 확인', icon: 'Activity', color: 'violet' }
        ]
    }
];

export function getDepartment(id: string) {
    return DEPARTMENTS.find((d) => d.id === id);
}
