
export interface Department {
    id: string;
    name: string; // Internal/URL name
    label: string; // Display name
    video: string;
    theme: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
        concept: string;
    };
    keywords: string[];
}

export const DEPARTMENTS: Department[] = [
    {
        id: "dermatology",
        name: "피부과",
        label: "피부과",
        video: "/피부과.mp4",
        theme: {
            primary: "#E91E8C", // Pink
            secondary: "#F472B6",
            accent: "#BE185D",
            background: "#0F172A", // Dark Navy
            text: "#FFFFFF", // Pure White (High Contrast)
            concept: "화려하고 생기있는",
        },
        keywords: ["여드름", "기미", "리프팅", "모공"],
    },
    {
        id: "dentistry",
        name: "치과",
        label: "치과",
        video: "/치과.mp4",
        theme: {
            primary: "#0EA5E9", // Sky Blue
            secondary: "#38BDF8",
            accent: "#0284C7",
            background: "#FFFFFF", // Pure White
            text: "#0F172A", // Dark Slate (High Contrast against White)
            concept: "깨끗하고 신뢰가는",
        },
        keywords: ["임플란트", "교정", "미백", "충치"],
    },
    {
        id: "orthopedics",
        name: "정형외과",
        label: "정형외과",
        video: "/정형외과.mp4",
        theme: {
            primary: "#2563EB", // Blue
            secondary: "#60A5FA",
            accent: "#1D4ED8",
            background: "#F8FAFC", // Very Light Slate
            text: "#172554", // Deep Blue Black (High Contrast)
            concept: "튼튼하고 곧은",
        },
        keywords: ["관절", "척추", "물리치료", "도수치료"],
    },
    {
        id: "urology",
        name: "비뇨기과",
        label: "비뇨기과",
        video: "/비뇨기과.mp4",
        theme: {
            primary: "#7C3AED", // Violet
            secondary: "#A78BFA",
            accent: "#5B21B6",
            background: "#1E1B4B", // Very Dark Indigo
            text: "#F3F4F6", // Light Gray (High Contrast)
            concept: "프라이빗하고 전문적인",
        },
        keywords: ["전립선", "요로결석", "남성수술"],
    },
    {
        id: "internal-medicine",
        name: "내과",
        label: "내과",
        video: "/내과.mp4",
        theme: {
            primary: "#10B981", // Emerald
            secondary: "#34D399",
            accent: "#059669",
            background: "#F0FDF4", // Very Light Green
            text: "#064E3B", // Dark Green Black (High Contrast)
            concept: "편안하고 건강한",
        },
        keywords: ["검진", "내시경", "수액", "만성질환"],
    },
    {
        id: "oncology",
        name: "암요양병원",
        label: "암요양병원",
        video: "/암요양병원.mp4",
        theme: {
            primary: "#F59E0B", // Amber
            secondary: "#FCD34D",
            accent: "#D97706",
            background: "#FFFBEB", // Very Light Amber
            text: "#451A03", // Dark Brown (High Contrast)
            concept: "따뜻하고 치유되는",
        },
        keywords: ["요양", "면역", "재활", "통합의학"],
    },
    {
        id: "korean-medicine",
        name: "한의원",
        label: "한의원",
        video: "/한방병원.mp4",
        theme: {
            primary: "#B45309", // Earthy/Brown
            secondary: "#D97706",
            accent: "#78350F",
            background: "#F5F5F4", // Warm Gray (Hanji)
            text: "#1C1917", // Very Dark Warm Gray (High Contrast)
            concept: "전통적이고 짙은 한지 느낌",
        },
        keywords: ["침", "보약", "체질", "추나"],
    },
    {
        id: "plastic-surgery",
        name: "성형외과",
        label: "성형외과",
        video: "/성형외과.mp4",
        theme: {
            primary: "#F43F5E", // Rose
            secondary: "#FB7185",
            accent: "#E11D48",
            background: "#FFF1F2", // Very Light Rose
            text: "#881337", // Dark Red (High Contrast)
            concept: "아름답고 세련된",
        },
        keywords: ["눈/코", "리프팅", "가슴", "지방흡입"],
    },
    {
        id: "pediatrics",
        name: "소아과",
        label: "소아과",
        video: "/소아과.mp4",
        theme: {
            primary: "#FBBF24", // Yellow/Kids
            secondary: "#FDE047",
            accent: "#F59E0B",
            background: "#FFFCF0", // Ivory
            text: "#292524", // Dark Warm Gray (High Contrast - Yellow background can be tricky with white, using dark)
            concept: "귀엽고 아기자기한",
        },
        keywords: ["예방접종", "영유아검진", "호흡기", "알레르기"],
    },
    {
        id: "neurosurgery",
        name: "신경외과",
        label: "신경외과",
        video: "/신경외과.mp4",
        theme: {
            primary: "#6366F1", // Indigo
            secondary: "#818CF8",
            accent: "#4F46E5",
            background: "#312E81", // Dark Indigo
            text: "#EEF2FF", // Very Light Indigo (High Contrast)
            concept: "정밀하고 고도화된",
        },
        keywords: ["뇌혈관", "디스크", "척추", "두통"],
    },
    {
        id: "obgyn",
        name: "산부인과",
        label: "산부인과",
        video: "/산부인과.mp4",
        theme: {
            primary: "#EC4899", // Pink
            secondary: "#F472B6",
            accent: "#DB2777",
            background: "#FDF2F8", // Very Light Pink
            text: "#831843", // Dark Pink (High Contrast)
            concept: "따뜻하고 포근한",
        },
        keywords: ["산전검사", "출산", "여성질환", "검진"],
    },
];

export function getDepartment(id: string) {
    return DEPARTMENTS.find((d) => d.id === id);
}
