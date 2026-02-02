export type DepartmentKey =
    | 'dermatology'
    | 'plastic-surgery'
    | 'internal-medicine'
    | 'orthopedics'
    | 'dentistry'
    | 'pediatrics'
    | 'urology'
    | 'obgyn'
    | 'korean-medicine'
    | 'oncology'
    | 'neurosurgery';

export interface Department {
    id: string;
    label: string; // 한글 표기 (예: 피부과)
    name: string; // 영문 표기 (예: Dermatology)
    virtualName?: string; // 가상의 병원 이름 (예: 에버성형외과)
    branding?: { // NEW: 동적 브랜딩 설정
        name: string; // 상호명 (예: 김내과)
        representative: string; // 원장명
        slogan?: string;
        logoParams: {
            icon: 'Sparkles' | 'Droplet' | 'Shield' | 'ArrowUpRight' | 'Heart' | 'Activity' | 'Brain' | 'Bone' | 'Stethoscope' | 'Cross' | 'Sun' | 'Zap' | 'Lock' | 'BarChart' | 'Thermometer' | 'Calendar' | 'Moon' | 'Battery' | 'Ruler' | 'Camera' | 'Smile' | 'Search' | 'Baby' | 'ShieldCheck' | 'HeartHandshake' | 'Scroll' | 'ShieldPlus' | 'BrainCircuit' | 'ScanFace' | 'User';
            color: 'pink' | 'rose' | 'teal' | 'purple' | 'fuchsia' | 'cyan' | 'emerald' | 'amber' | 'blue' | 'indigo' | 'sky' | 'orange' | 'yellow' | 'green' | 'red' | 'violet' | 'stone' | 'gold';
        };
    };
    keywords: string[];
    theme: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
        concept?: string;
        texture?: string;
        font?: string;
        sound?: string;
    };
    hero?: {
        title: string;
        subtitle: string;
    };
    modules?: {
        id: string;
        title: string;
        description: string;
        icon: string;
        color: string;
    }[];
    marketing?: {
        searchKeyword: string;
        surveyHeadline?: string;
        cta: {
            title: string;
            buttonText: string;
            icon: string; // Lucide icon name
            link: string;
            defaultTopic: string;
        }
    };
    video?: string;
    catchphrase?: string;
}

export const DEPARTMENTS: Record<string, Department> = {
    "dermatology": {
        id: "dermatology",
        label: "피부과",
        name: "Dermatology",
        virtualName: "에버피부과",
        catchphrase: "홀로그램처럼 빛나는 피부 본연의 광채",
        branding: {
            name: "에버피부과",
            representative: "김지은",
            slogan: "당신의 피부를 위한 1:1 맞춤 솔루션",
            logoParams: { icon: 'Sparkles', color: 'pink' }
        },
        keywords: ["여드름", "기미/잡티", "리프팅", "안티에이징", "모공"],
        theme: {
            primary: "#F0A0C8",
            secondary: "#B8D8E8",
            accent: "#D8A0E0",
            background: "#0A1220",
            text: "#F8F0FA",
            concept: "Glow Skin",
            texture: 'hologram',
            font: "sans",
            sound: "/sounds/sparkle.mp3"
        },
        hero: {
            title: "빛이 머무는 피부",
            subtitle: "홀로그램처럼 빛나는 피부 본연의 광채를 찾아드립니다."
        },
        marketing: {
            searchKeyword: "강남 피부과 추천",
            surveyHeadline: "오늘 내 피부의 광채 지수가 궁금하다면?",
            cta: {
                title: "내 피부 나이 확인하기",
                buttonText: "AI 피부 진단 시작",
                icon: "ScanFace",
                link: "healthcare/chat?topic=glow-booster",
                defaultTopic: "glow-booster"
            }
        },
        video: "/히어로세션/피부과.mp4",
        modules: [
            { id: 'glow-booster', title: '글로우 부스터', description: '즉각적인 톤업 솔루션', icon: 'Sparkles', color: 'pink' },
            { id: 'barrier-reset', title: '장벽 리셋', description: '무너진 피부 장벽 세우기', icon: 'Shield', color: 'teal' },
            { id: 'sun-protector', title: '선 레이더', description: '오늘 자외선 대비 내 피부 맞춤 처방', icon: 'Sun', color: 'orange' },
            { id: 'acne-clear', title: '트러블 제로', description: '갑자기 올라온 피부 고민 해결사', icon: 'Zap', color: 'purple' }
        ]
    },
    "plastic-surgery": {
        id: "plastic-surgery",
        label: "성형외과",
        name: "Plastic Surgery",
        virtualName: "이미지 성형외과",
        catchphrase: "당신만의 선을 재정의하다",
        branding: {
            name: "이미지 성형외과",
            representative: "박성훈",
            slogan: "자연스러운 아름다움, 당신만의 이미지를 완성합니다",
            logoParams: { icon: 'Heart', color: 'rose' }
        },
        keywords: ["눈성형", "코성형", "지방이식", "가슴성형", "안면윤곽"],
        theme: {
            primary: "#C0A080",
            secondary: "#A0A8B8",
            accent: "#D4A0C0",
            background: "#0C0A12",
            text: "#F0ECF4",
            concept: "Premium Metal",
            texture: 'silk',
            font: "serif",
            sound: "/sounds/tick.mp3"
        },
        hero: {
            title: "숨겨진 1mm의 미학",
            subtitle: "당신만이 가질 수 있는 완벽한 '선'을 재정의하세요."
        },
        marketing: {
            searchKeyword: "자연스러운 성형 잘하는 곳",
            surveyHeadline: "나에게 최적화된 비율이 궁금하다면?",
            cta: {
                title: "나의 숨겨진 1mm 찾기",
                buttonText: "황금비율 페이스 분석",
                icon: "Camera",
                link: "healthcare/chat?topic=face-ratio",
                defaultTopic: "face-ratio"
            }
        },
        video: "/히어로세션/성형외과.mp4",
        modules: [
            { id: 'virtual-plastic', title: 'AI 미러', description: '사진으로 미리 보는 나의 아름다운 변화', icon: 'Camera', color: 'rose' },
            { id: 'trend-check', title: '트렌드 분석', description: '최신 트렌드와 내 얼굴의 완벽한 조화', icon: 'Sparkles', color: 'gold' },
            { id: 'ratio-doctor', title: '비율 닥터', description: '나만 모르는 얼굴 황금비율 정밀 분석', icon: 'Ruler', color: 'stone' },
            { id: 'recovery-tip', title: '애프터 케어', description: '빠른 회복을 위한 1:1 루틴 가이드', icon: 'Heart', color: 'pink' }
        ]
    },
    "internal-medicine": {
        id: "internal-medicine",
        label: "내과",
        name: "Internal Medicine",
        virtualName: "김내과 의원",
        catchphrase: "몸속 정원을 가꾸는 내면의 활력 케어",
        branding: {
            name: "김내과",
            representative: "김철수",
            slogan: "지역 주민과 함께하는 든든한 주치의",
            logoParams: { icon: 'Stethoscope', color: 'emerald' }
        },
        keywords: ["건강검진", "만성질환", "소화기", "내분비", "호흡기"],
        theme: {
            primary: "#0EA5E9",
            secondary: "#10B981",
            accent: "#F59E0B",
            background: "#0F172A",
            text: "#F8FAFC",
            concept: "Data Wellness",
            texture: 'botanic',
            font: "sans",
            sound: "/sounds/nature.mp3"
        },
        hero: {
            title: "내면의 활력을 깨우다",
            subtitle: "몸속 정원, 오늘 당신의 컨디션은 어떤가요? 보이지 않는 곳의 활력까지 케어합니다."
        },
        marketing: {
            searchKeyword: "야간 진료 내과",
            surveyHeadline: "보이지 않는 내 장기들의 컨디션이 궁금하다면?",
            cta: {
                title: "만성 피로, 이유가 뭘까?",
                buttonText: "활력 에너지 측정",
                icon: "Battery",
                link: "healthcare/chat?topic=fatigue-reset",
                defaultTopic: "fatigue-reset"
            }
        },
        video: "/히어로세션/내과.mp4",
        modules: [
            { id: 'digestive-check', title: '속편한 라이트', description: '가벼워지는 식습관', icon: 'Activity', color: 'green' },
            { id: 'fatigue-reset', title: '에너지 충전소', description: '만성 피로 수액 솔루션', icon: 'Droplet', color: 'blue' },
            { id: 'sugar-radar', title: '혈당 레이더', description: '숨어있는 고혈당 위험군 체크', icon: 'Zap', color: 'orange' },
            { id: 'vitamin-guide', title: '영양소 맵', description: '내게 부족한 결핍 비타민 찾기', icon: 'Sparkles', color: 'amber' }
        ]
    },
    "orthopedics": {
        id: "orthopedics",
        label: "정형외과",
        name: "Orthopedics",
        virtualName: "바른마디 정형외과",
        catchphrase: "무너진 중심을 바로 세우는 공학적 리셋",
        branding: {
            name: "바른마디 정형외과",
            representative: "최정형",
            slogan: "통증 없는 편안한 일상으로의 복귀",
            logoParams: { icon: 'Bone', color: 'blue' }
        },
        keywords: ["척추", "관절", "재활", "통증", "물리치료"],
        theme: {
            primary: "#64748B",
            secondary: "#10B981",
            accent: "#F59E0B",
            background: "#0A0E14",
            text: "#E2E8F0",
            concept: "Performance Carbon",
            texture: 'carbon',
            font: "sans",
            sound: "/sounds/ruler.mp3"
        },
        hero: {
            title: "일상의 균형을 되찾다",
            subtitle: "무너진 중심을 바로 세우는 정밀 설계, 통증 없는 일상의 균형을 되찾아 드립니다."
        },
        marketing: {
            searchKeyword: "도수치료 잘하는 곳",
            surveyHeadline: "비뚤어진 내 자세의 균형이 궁금하다면?",
            cta: {
                title: "혹시 나도 거북목일까?",
                buttonText: "자세 밸런스 측정",
                icon: "Activity",
                link: "healthcare/chat?topic=posture-check",
                defaultTopic: "posture-check"
            }
        },
        video: "/히어로세션/정형외과.mp4",
        modules: [
            { id: 'posture-check', title: '거북목 브레이커', description: 'C자 커브 되찾기 프로젝트', icon: 'ArrowUpRight', color: 'blue' },
            { id: 'spine-reset', title: '척추 리셋', description: '무너진 코어 바로잡기', icon: 'Activity', color: 'orange' },
            { id: 'joint-shield', title: '관절 세이이퍼', description: '비 오는 날 마다 쑤신 관절 관리비법', icon: 'Shield', color: 'cyan' },
            { id: 'stretch-doctor', title: '모닝 스트레치', description: '자고 일어나면 뻣뻣한 몸을 위한 5분 가이드', icon: 'Zap', color: 'yellow' }
        ]
    },
    "dentistry": {
        id: "dentistry",
        label: "치과",
        name: "Dentistry",
        virtualName: "미소플란트 치과",
        catchphrase: "0.1mm 오차 없는 정밀한 미소 설계",
        branding: {
            name: "미소플란트 치과",
            representative: "이건치",
            slogan: "밝은 미소를 선물합니다",
            logoParams: { icon: 'Heart', color: 'cyan' }
        },
        keywords: ["임플란트", "교정", "미백", "충치", "스케일링"],
        theme: {
            primary: "#60A5FA",
            secondary: "#93C5FD",
            accent: "#38BDF8",
            background: "#0A1220",
            text: "#F0F6FF",
            concept: "Clean White",
            texture: 'glass',
            font: "sans",
            sound: "/sounds/crystal.mp3"
        },
        hero: {
            title: "완벽한 미소의 설계",
            subtitle: "미소는 당신이 내미는 가장 아름다운 명함입니다. 0.1mm의 오차 없는 정밀함."
        },
        marketing: {
            searchKeyword: "안 아픈 치과",
            surveyHeadline: "교정 후 내 미소의 변화가 궁금하다면?",
            cta: {
                title: "활짝 웃을 때 내 모습",
                buttonText: "미소 시뮬레이션",
                icon: "Smile",
                link: "healthcare/chat?topic=smile-design",
                defaultTopic: "smile-design"
            }
        },
        video: "/히어로세션/치과.mp4",
        modules: [
            { id: 'whitening-check', title: '스노우 화이트', description: '필터 낀 듯 하얀 미소 만들기', icon: 'Sparkles', color: 'cyan' },
            { id: 'smile-design', title: '스마일 아키텍트', description: '교정 후 모습 미리 시뮬레이션', icon: 'Heart', color: 'purple' },
            { id: 'plaque-radar', title: '플라그 레이더', description: '놓치기 쉬운 어금니 뒤쪽 관리법', icon: 'Shield', color: 'blue' },
            { id: 'gum-care', title: '잇몸 탄력', description: '건강한 선분홍빛 잇몸 루틴', icon: 'Activity', color: 'pink' }
        ]
    },
    "pediatrics": {
        id: "pediatrics",
        label: "소아청소년과",
        name: "Pediatrics",
        virtualName: "아이사랑 소아과",
        catchphrase: "우리 아이 성장의 모든 순간을 기록하다",
        branding: {
            name: "아이사랑 소아과",
            representative: "소아맘",
            slogan: "우리 아이 첫 번째 건강 지킴이",
            logoParams: { icon: 'Heart', color: 'amber' }
        },
        keywords: ["성장클리닉", "예방접종", "영유아검진", "알레르기", "아토피"],
        theme: {
            primary: "#F59E0B",
            secondary: "#10B981",
            accent: "#3B82F6",
            background: "#1E293B",
            text: "#F8FAFC",
            concept: "Soft Care",
            texture: 'jelly',
            font: "round",
            sound: "/sounds/jelly.mp3"
        },
        hero: {
            title: "성장의 모든 순간",
            subtitle: "우리 아이의 모든 성장은 기록입니다. 한밤중의 불안까지 함께하는 든든한 가이드."
        },
        marketing: {
            searchKeyword: "일요일 진료 소아과",
            surveyHeadline: "우리 아이의 성장 곡선이 궁금하다면?",
            cta: {
                title: "우리 아이 얼마나 클까?",
                buttonText: "예상 키 계산기",
                icon: "Ruler",
                link: "healthcare/chat?topic=growth-check",
                defaultTopic: "growth-check"
            }
        },
        video: "/히어로세션/소아과.mp4",
        modules: [
            { id: 'growth-check', title: '슈퍼 성장차트', description: '우리 아이 나중에 얼마나 클까?', icon: 'BarChart', color: 'yellow' },
            { id: 'fever-guide', title: '열나요 SOS', description: '한밤중 열날 때 대처 가이드', icon: 'Thermometer', color: 'red' },
            { id: 'immunity-doctor', title: '면역력 수비대', description: '단체생활 시작 전 필수 면역 관리', icon: 'Shield', color: 'green' },
            { id: 'baby-food', title: '영양 솔루션', description: '편식하는 아이를 위한 맞춤 제언', icon: 'Heart', color: 'orange' }
        ]
    },
    "urology": {
        id: "urology",
        label: "비뇨의학과",
        name: "Urology",
        virtualName: "맨즈 파워 비뇨기과",
        catchphrase: "완벽한 익명 속에서 되찾는 강력한 활력",
        branding: {
            name: "맨즈 파워 비뇨기과",
            representative: "강비뇨",
            slogan: "남자의 자신감을 되찾아드립니다",
            logoParams: { icon: 'Shield', color: 'blue' }
        },
        keywords: ["전립선", "요로결석", "남성수술", "갱년기", "성기능"],
        theme: {
            primary: "#6366F1",
            secondary: "#14B8A6",
            accent: "#8B5CF6",
            background: "#0F172A",
            text: "#F8FAFC",
            concept: "Men's Privacy",
            texture: 'carbon',
            font: "sans",
            sound: "/sounds/engine.mp3"
        },
        hero: {
            title: "강력한 활력의 재충전",
            subtitle: "누구에게도 말하지 못한 고민, 완벽한 프라이버시 속에서 강력한 활력을 재충전하세요."
        },
        marketing: {
            searchKeyword: "비뇨기과 전문의",
            surveyHeadline: "누구에게도 말 못할 자신감 고민이 있다면?",
            cta: {
                title: "남자의 자신감 점수는?",
                buttonText: "활력 지수 체크",
                icon: "Zap",
                link: "healthcare/chat?topic=vitality-check",
                defaultTopic: "vitality-check"
            }
        },
        video: "/히어로세션/비뇨기과.mp4",
        modules: [
            { id: 'vitality-check', title: '파워 엔진', description: '남자의 자신감 재충전', icon: 'Zap', color: 'yellow' },
            { id: 'private-counsel', title: '시크릿 요원', description: '흔적 없는 익명 상담', icon: 'Lock', color: 'indigo' },
            { id: 'prostate-check', title: '이너 파워', description: '보이지 않는 전립선 건강 미리 체크', icon: 'Shield', color: 'violet' },
            { id: 'stamina-up', title: '스태미나 가이드', description: '지치지 않는 에너지를 위한 생활 습관', icon: 'Activity', color: 'orange' }
        ]
    },
    "obgyn": {
        id: "obgyn",
        label: "산부인과",
        name: "Obstetrics & Gynecology",
        virtualName: "이브 우먼 의원",
        catchphrase: "따뜻한 물결처럼 흐르는 당신만의 리듬",
        branding: {
            name: "이브 우먼 의원",
            representative: "김이브",
            slogan: "여성을 가장 잘 아는 병원",
            logoParams: { icon: 'Heart', color: 'rose' }
        },
        keywords: ["여성검진", "산전관리", "갱년기", "피임상담", "질염"],
        theme: {
            primary: "#EC4899",
            secondary: "#8B5CF6",
            accent: "#F43F5E",
            background: "#2E1065",
            text: "#FDF2F8",
            concept: "Warm Care",
            texture: 'flower',
            font: "serif",
            sound: "/sounds/water.mp3"
        },
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
        video: "/히어로세션/산부인과.mp4",
        modules: [
            { id: 'cycle-check', title: '문 사이클', description: '단순 달력이 아닌 내 몸의 리듬', icon: 'Moon', color: 'pink' },
            { id: 'pregnancy-guide', title: '베이비 시그널', description: '아기가 보내는 신호 해석하기', icon: 'Heart', color: 'rose' },
            { id: 'hormone-doctor', title: '밸런스 케어', description: '생리 전 증후군 완화 가이드', icon: 'Sparkles', color: 'violet' },
            { id: 'inner-beauty', title: 'Y-클린 데일리', description: '가장 소중한 곳을 위한 건강 제언', icon: 'Shield', color: 'amber' }
        ]
    },
    "korean-medicine": {
        id: "korean-medicine",
        label: "한의원",
        name: "Korean Medicine",
        virtualName: "백년 한의원",
        catchphrase: "자연의 기운으로 근본을 다스리다",
        branding: {
            name: "백년 한의원",
            representative: "허준",
            slogan: "전통의 지혜로 다스리는 근본 치료",
            logoParams: { icon: 'Activity', color: 'amber' }
        },
        keywords: ["보약", "침치료", "추나", "다이어트", "교통사고"],
        theme: {
            primary: "#B45309",
            secondary: "#166534",
            accent: "#DC2626",
            background: "#292524",
            text: "#FAF7F5",
            concept: "Natural Balance",
            texture: 'hanji',
            font: "serif",
            sound: "/sounds/gong.mp3"
        },
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
        video: "/히어로세션/한방병원.mp4",
        modules: [
            { id: 'body-type', title: '내 몸의 원소', description: '나는 불? 물? 타고난 기질 알아보기', icon: 'User', color: 'stone' },
            { id: 'detox', title: '비움의 미학', description: '몸속 깊은 독소 배출 프로그램', icon: 'Droplet', color: 'amber' },
            { id: 'seasonal-health', title: '절기 보약', description: '환절기 면역력을 높이는 한방 비책', icon: 'Sun', color: 'green' },
            { id: 'qi-flow', title: '기혈 순환', description: '막힌 기운을 뚫어주는 스트레칭 가이드', icon: 'Activity', color: 'orange' }
        ]
    },
    "oncology": {
        id: "oncology",
        label: "암 요양병원",
        name: "Oncology & Care",
        virtualName: "새희망 암요양병원",
        catchphrase: "면역의 요새를 쌓는 희망의 아침 햇살",
        branding: {
            name: "새희망 암요양병원",
            representative: "이희망",
            slogan: "암 치료 후, 편안한 회복을 돕습니다",
            logoParams: { icon: 'Cross', color: 'emerald' }
        },
        keywords: ["면역치료", "고주파", "암식단", "도수치료", "심리상담"],
        theme: {
            primary: "#10B981",
            secondary: "#6EE7B7",
            accent: "#F59E0B",
            background: "#0A1A14",
            text: "#F0FDF4",
            concept: "Hope & Recovery",
            texture: 'linen',
            font: "serif",
            sound: "/sounds/morning.mp3"
        },
        hero: {
            title: "희망의 아침을 맞이하다",
            subtitle: "다시 시작하는 삶, 면역의 요새를 쌓아 어제보다 더 건강한 오늘을 약속합니다."
        },
        marketing: {
            searchKeyword: "암 요양 병원 가격",
            surveyHeadline: "어제보다 나은 나의 면역력이 궁금하다면?",
            cta: {
                title: "지금 내 면역 상태는?",
                buttonText: "면역 점수 체크",
                icon: "Shield",
                link: "healthcare/chat?topic=immunity-up",
                defaultTopic: "immunity-up"
            }
        },
        video: "/히어로세션/암요양병원.mp4",
        modules: [
            { id: 'immunity-up', title: '이뮤니티 쉴드', description: '면역 요새 쌓기', icon: 'Shield', color: 'amber' },
            { id: 'nutrition-plan', title: '힐링 레시피', description: '암세포와 싸우는 식단', icon: 'Heart', color: 'orange' },
            { id: 'rehab-guide', title: '리버티 재활', description: '기능 회복을 위한 부드러운 모션', icon: 'Activity', color: 'green' },
            { id: 'mind-peace', title: '마음의 숲', description: '불안을 잠재우는 명상 가이드', icon: 'Moon', color: 'violet' }
        ]
    },
    "neurosurgery": {
        id: "neurosurgery",
        label: "신경외과",
        name: "Neurosurgery",
        virtualName: "브레인 의원",
        catchphrase: "뇌 신경망의 안개를 걷어내는 정밀 디코딩",
        branding: {
            name: "브레인 의원",
            representative: "김뇌혈",
            slogan: "뇌와 척추 건강의 든든한 파트너",
            logoParams: { icon: 'Brain', color: 'blue' }
        },
        keywords: ["두통", "디스크", "뇌검진", "어지럼증", "손발저림"],
        theme: {
            primary: "#818CF8",
            secondary: "#06B6D4",
            accent: "#6366F1",
            background: "#080C18",
            text: "#E0E7FF",
            concept: "Precision Tech",
            texture: 'circuit',
            font: "mono",
            sound: "/sounds/scan.mp3"
        },
        hero: {
            title: "신경망의 안개를 걷다",
            subtitle: "안개 속 통증, 빛으로 찾아냅니다. 당신의 뇌 신경망을 위한 정밀한 디코딩."
        },
        marketing: {
            searchKeyword: "두통 어지러움 병원",
            surveyHeadline: "복잡하게 얽힌 내 통증 시스템의 원인이 궁금하다면?",
            cta: {
                title: "지긋지긋한 편두통 원인은?",
                buttonText: "통증 원인 디코딩",
                icon: "Brain",
                link: "healthcare/chat?topic=headache-check",
                defaultTopic: "headache-check"
            }
        },
        video: "/히어로세션/신경외과.mp4",
        modules: [
            { id: 'headache-check', title: '두통 디코더', description: '지긋지긋한 편두통, 원인을 해독해드립니다', icon: 'Zap', color: 'indigo' },
            { id: 'spine-balance', title: '신경 신호등', description: '찌릿한 손발 저림, 신경계 막힘 확인', icon: 'Activity', color: 'violet' },
            { id: 'focus-booster', title: '뇌파 밸런스', description: '집중력이 떨어진 뇌를 위한 휴식법', icon: 'Brain', color: 'cyan' },
            { id: 'sleep-decoder', title: '딥 슬립 가이드', description: '잠 못 드는 뇌를 재우는 신경 안정 루틴', icon: 'Moon', color: 'purple' }
        ]
    }
};

export const DEPARTMENT_IDS = Object.keys(DEPARTMENTS) as DepartmentKey[];

export function getDepartment(id: string): Department | undefined {
    return DEPARTMENTS[id];
}
