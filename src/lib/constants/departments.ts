
export interface Department {
    id: string;
    name: string; // Internal/URL name
    label: string; // Display name
    virtualName: string; // Virtual Healthcare Brand Name
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
    };
    keywords: string[];
    modules?: any[]; // Specific modules for this department
}

export const DEPARTMENTS: Department[] = [
    {
        id: "dermatology",
        name: "피부과",
        label: "피부과",
        virtualName: "블랑 드 스킨",
        video: "/피부과.mp4",
        hero: {
            title: "베이스가 달라지는 광채 루틴 리셋",
            subtitle: "지금 내 상태를 빠르게 체크하고, 오늘부터 적용할 루틴 포인트를 정리해보세요."
        },
        theme: {
            primary: "#E91E8C",
            secondary: "#F472B6",
            accent: "#BE185D",
            background: "#0F172A",
            text: "#FFFFFF",
            concept: "화려하고 생기있는",
        },
        keywords: ["여드름", "기미", "리프팅", "모공"],
        // Existing Dermatology Modules Preserved
        modules: [
            { id: 'glow-booster', title: '광채 부스터', description: '칙칙한 피부톤이 고민이라면? 즉각적인 톤업 솔루션', icon: 'Sparkles', color: 'pink' },
            { id: 'makeup-killer', title: '메이크업 킬러', description: '화장이 잘 먹지 않는다면? 각질과 결 정돈부터', icon: 'Droplet', color: 'rose' },
            { id: 'barrier-reset', title: '장벽 리셋', description: '예민하고 붉어지는 피부? 무너진 장벽부터 튼튼하게', icon: 'Shield', color: 'teal' },
            { id: 'lifting-check', title: '탄력 / 리프팅', description: '처지는 라인이 걱정된다면? 탄력 집중 케어', icon: 'ArrowUpRight', color: 'purple' },
            { id: 'skin-concierge', title: '스킨 컨시어지', description: '내 피부에 딱 맞는 화장품과 시술 조합 추천', icon: 'Heart', color: 'fuchsia' }
        ]
    },
    {
        id: "dentistry",
        name: "치과",
        label: "치과",
        virtualName: "덴티 크루",
        video: "/치과.mp4",
        hero: {
            title: "자신감 있는 미소, 숨기지 마세요",
            subtitle: "치아 상태부터 입냄새 고민까지, 30초 체크로 시작하는 덴탈 케어."
        },
        theme: {
            primary: "#0EA5E9",
            secondary: "#38BDF8",
            accent: "#0284C7",
            background: "#FFFFFF",
            text: "#0F172A",
            concept: "깨끗하고 신뢰가는",
        },
        keywords: ["임플란트", "교정", "미백", "충치"],
        modules: [
            { id: 'whitening-check', title: '화이트닝 진단', description: '누런 치아가 고민이신가요? 미백 가능성 체크', icon: 'Sparkles', color: 'teal' },
            { id: 'pain-check', title: '통증 / 충치', description: '시리거나 아픈 치아, 방치하면 위험해요', icon: 'Shield', color: 'rose' },
            { id: 'smile-design', title: '스마일 디자인', description: '라미네이트/교정으로 완성하는 미소 라인', icon: 'Heart', color: 'purple' }
        ]
    },
    {
        id: "orthopedics",
        name: "정형외과",
        label: "정형외과",
        virtualName: "본 밸런스",
        video: "/정형외과.mp4",
        hero: {
            title: "무너진 균형, 다시 바로잡을 시간",
            subtitle: "통증의 원인은 잘못된 자세에 있습니다. 내 몸의 기울기를 확인해보세요."
        },
        theme: {
            primary: "#2563EB",
            secondary: "#60A5FA",
            accent: "#1D4ED8",
            background: "#F8FAFC",
            text: "#172554",
            concept: "튼튼하고 곧은",
        },
        keywords: ["관절", "척추", "물리치료", "도수치료"],
        modules: [
            { id: 'posture-check', title: '거북목/자세', description: '스마트폰 때문에 굽은 목과 등, 자가 진단', icon: 'ArrowUpRight', color: 'blue' },
            { id: 'pain-map', title: '통증 지도', description: '아픈 부위를 선택하면 원인을 분석해드립니다', icon: 'Beaker', color: 'rose' },
            { id: 'joint-care', title: '관절 나이', description: '내 무릎과 허리는 몇 살일까요?', icon: 'Activity', color: 'emerald' }
        ]
    },
    {
        id: "urology",
        name: "비뇨기과",
        label: "비뇨기과",
        virtualName: "맨즈 프라이빗",
        video: "/비뇨기과.mp4",
        hero: {
            title: "남자의 활력을 되찾는 프라이빗 케어",
            subtitle: "누구에게도 말 못한 고민, AI가 비밀스럽고 정확하게 들어드립니다."
        },
        theme: {
            primary: "#7C3AED",
            secondary: "#A78BFA",
            accent: "#5B21B6",
            background: "#1E1B4B",
            text: "#F3F4F6",
            concept: "프라이빗하고 전문적인",
        },
        keywords: ["전립선", "요로결석", "남성수술"],
        modules: [
            { id: 'vitality-check', title: '활력 지수', description: '최근 떨어지는 컨디션, 원인을 찾아보세요', icon: 'Zap', color: 'yellow' },
            { id: 'private-counsel', title: '시크릿 상담', description: '익명으로 진행되는 1:1 증상 체크', icon: 'Lock', color: 'indigo' }
        ]
    },
    {
        id: "internal-medicine",
        name: "내과",
        label: "내과",
        virtualName: "이너 웰니스",
        video: "/내과.mp4",
        hero: {
            title: "속부터 편안해야 진짜 건강입니다",
            subtitle: "소화불량부터 만성피로까지, 내 몸이 보내는 신호에 귀 기울여보세요."
        },
        theme: {
            primary: "#10B981",
            secondary: "#34D399",
            accent: "#059669",
            background: "#F0FDF4",
            text: "#064E3B",
            concept: "편안하고 건강한",
        },
        keywords: ["검진", "내시경", "수액", "만성질환"],
        modules: [
            { id: 'digestive-check', title: '소화기 체크', description: '속쓰림, 더부룩함의 원인 분석', icon: 'Activity', color: 'green' },
            { id: 'fatigue-reset', title: '피로/수액', description: '만성 피로를 해결하는 맞춤 영양 솔루션', icon: 'Droplet', color: 'blue' }
        ]
    },
    {
        id: "oncology",
        name: "암요양병원",
        label: "암요양병원",
        virtualName: "케어 포 유",
        video: "/암요양병원.mp4",
        hero: {
            title: "당신의 회복을 위한 따뜻한 동행",
            subtitle: "면역 증진부터 심리 케어까지, 통합적인 요양 솔루션을 제공합니다."
        },
        theme: {
            primary: "#F59E0B",
            secondary: "#FCD34D",
            accent: "#D97706",
            background: "#FFFBEB",
            text: "#451A03",
            concept: "따뜻하고 치유되는",
        },
        keywords: ["요양", "면역", "재활", "통합의학"],
        modules: [
            { id: 'immunity-up', title: '면역 증진', description: '항암 치료 후 면역력을 높이는 방법', icon: 'Sun', color: 'amber' },
            { id: 'nutrition-plan', title: '식단 가이드', description: '암 환자를 위한 맞춤형 영양 식단', icon: 'Heart', color: 'orange' }
        ]
    },
    {
        id: "korean-medicine",
        name: "한의원",
        label: "한의원",
        virtualName: "본 초",
        video: "/한방병원.mp4",
        hero: {
            title: "전통의 지혜로 균형을 찾다",
            subtitle: "체질에 맞는 처방으로 흐트러진 기와 혈을 바로잡으세요."
        },
        theme: {
            primary: "#B45309",
            secondary: "#D97706",
            accent: "#78350F",
            background: "#F5F5F4",
            text: "#1C1917",
            concept: "전통적이고 짙은 한지 느낌",
        },
        keywords: ["침", "보약", "체질", "추나"],
        modules: [
            { id: 'body-type', title: '체질 진단', description: '태양인? 소음인? 나의 사상체질 알아보기', icon: 'User', color: 'stone' },
            { id: 'detox', title: '순환/디톡스', description: '몸 안의 독소를 배출하는 한방 솔루션', icon: 'Droplet', color: 'amber' }
        ]
    },
    {
        id: "plastic-surgery",
        name: "성형외과",
        label: "성형외과",
        virtualName: "더 라인",
        video: "/성형외과.mp4",
        hero: {
            title: "당신이 꿈꾸던 라인의 완성",
            subtitle: "가상 성형 시뮬레이션으로 변화된 모습을 미리 확인해보세요."
        },
        theme: {
            primary: "#F43F5E",
            secondary: "#FB7185",
            accent: "#E11D48",
            background: "#FFF1F2",
            text: "#881337",
            concept: "아름답고 세련된",
        },
        keywords: ["눈/코", "리프팅", "가슴", "지방흡입"],
        modules: [
            { id: 'virtual-plastic', title: '가상 성형', description: '사진으로 미리 보는 나의 변화', icon: 'Camera', color: 'rose' },
            { id: 'trend-check', title: '트렌드 분석', description: '요즘 유행하는 스타일과 내 얼굴의 조화', icon: 'Sparkles', color: 'pink' }
        ]
    },
    {
        id: "pediatrics",
        name: "소아과",
        label: "소아과",
        virtualName: "키즈 닥터",
        video: "/소아과.mp4",
        hero: {
            title: "우리 아이 건강 지킴이",
            subtitle: "성장 발달부터 예방 접종까지, 부모님의 걱정을 덜어드립니다."
        },
        theme: {
            primary: "#FBBF24",
            secondary: "#FDE047",
            accent: "#F59E0B",
            background: "#FFFCF0",
            text: "#451A03",
            concept: "귀엽고 아기자기한",
        },
        keywords: ["예방접종", "영유아검진", "호흡기", "알레르기"],
        modules: [
            { id: 'growth-check', title: '성장 발달', description: '우리 아이 키와 몸무게, 상위 몇 %일까?', icon: 'BarChart', color: 'yellow' },
            { id: 'fever-guide', title: '열나요 SOS', description: '갑작스러운 발열, 대처 방법 가이드', icon: 'Thermometer', color: 'red' }
        ]
    },
    {
        id: "neurosurgery",
        name: "신경외과",
        label: "신경외과",
        virtualName: "뉴로 스캔",
        video: "/신경외과.mp4",
        hero: {
            title: "복잡한 신경계, 정밀하게 들여다보다",
            subtitle: "두통, 어지럼증부터 척추 질환까지 원인을 정확히 분석합니다."
        },
        theme: {
            primary: "#6366F1",
            secondary: "#818CF8",
            accent: "#4F46E5",
            background: "#312E81",
            text: "#EEF2FF",
            concept: "정밀하고 고도화된",
        },
        keywords: ["뇌혈관", "디스크", "척추", "두통"],
        modules: [
            { id: 'headache-check', title: '두통 체크', description: '지긋지긋한 두통, 위험한 신호일까요?', icon: 'Activity', color: 'indigo' },
            { id: 'spine-balance', title: '척추 건강', description: '디스크 위험도 자가 진단', icon: 'Shield', color: 'violet' }
        ]
    },
    {
        id: "obgyn",
        name: "산부인과",
        label: "산부인과",
        virtualName: "마망 케어",
        video: "/산부인과.mp4",
        hero: {
            title: "여성의 생애 주기를 함께합니다",
            subtitle: "월경, 임신, 출산, 갱년기까지 여성의 건강을 세심하게 살핍니다."
        },
        theme: {
            primary: "#EC4899",
            secondary: "#F472B6",
            accent: "#DB2777",
            background: "#FDF2F8",
            text: "#831843",
            concept: "따뜻하고 포근한",
        },
        keywords: ["산전검사", "출산", "여성질환", "검진"],
        modules: [
            { id: 'cycle-check', title: '주기 관리', description: '불규칙한 주기, 호르몬 균형 체크', icon: 'Calendar', color: 'pink' },
            { id: 'pregnancy-guide', title: '임신 가이드', description: '주차별 태아 성장과 엄마의 변화', icon: 'Heart', color: 'rose' }
        ]
    },
];

export function getDepartment(id: string) {
    return DEPARTMENTS.find((d) => d.id === id);
}
