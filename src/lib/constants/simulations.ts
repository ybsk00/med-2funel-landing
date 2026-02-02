
export type SimulationVariant = {
    key: string;
    label: string;
    description: string;

    // 1. 기본 톤 보정 (Base Correction)
    filter: string;          // CSS filter string (e.g. "brightness(1.1)")
    opacity: number;         // 필터 적용 강도 (0~1)

    // 2. 광/질감 오버레이 (Environment/Texture Overlay)
    overlayColor?: string;   // e.g. "rgba(255,255,255,0.25)"
    mixBlendMode?: "normal" | "multiply" | "screen" | "overlay" | "darken" | "lighten" | "color-dodge" | "color-burn" | "hard-light" | "soft-light" | "difference" | "exclusion" | "hue" | "saturation" | "color" | "luminosity";
    overlayOpacity?: number; // 오버레이 불투명도 (0~1)

    // 3. 피부결 정돈 (Smoothing)
    blurPx?: number;         // e.g. 0.5 (smoothing)

    // 4. (Advanced) 스페큘러/반사광 (Specular Highlight)
    specular?: {
        enabled: boolean;
        intensity: number;     // 강도 (brightness multiplier)
        threshold?: number;    // contrast enhancement
        blurPx: number;        // 확산 정도
        blendMode: "screen" | "lighter" | "overlay";
    };
};

export type DepartmentSimulationConfig = {
    id: string;
    label: string;
    baseImage?: string; // Optional override
    variants: SimulationVariant[];
    brushColor?: string;
    brushGlow?: string;
    uiTheme: {
        primary: string;
        text: string;
    };
    titles: {
        main: string;
        sub: string;
    };
};

export const DEPARTMENT_SIMULATIONS: Record<string, DepartmentSimulationConfig> = {
    "plastic-surgery": {
        id: "plastic-surgery",
        label: "성형외과",
        uiTheme: { primary: "#b88a7d", text: "#ffffff" },
        titles: { main: "THE LINE", sub: "윤곽/리프팅 시뮬레이션" },
        brushColor: "#b88a7d",
        brushGlow: "rgba(184, 138, 125, 0.6)",
        variants: [
            {
                key: "contour",
                label: "윤곽 보정",
                description: "팔자주름/턱선 쉐도우 & 하이라이트",
                filter: "brightness(1.1) contrast(1.1) saturate(1.1)",
                opacity: 0.8
            },
            {
                key: "rose-glow",
                label: "로즈 글로우",
                description: "로즈 골드 톤의 입체적 광채",
                filter: "sepia(0.3) hue-rotate(-10deg) saturate(1.1) brightness(1.05)",
                overlayColor: "rgba(184, 138, 125, 0.1)",
                mixBlendMode: "overlay",
                overlayOpacity: 0.6,
                opacity: 1
            }
        ]
    },
    "dermatology": {
        id: "dermatology",
        label: "피부과",
        uiTheme: { primary: "#d4af37", text: "#ffffff" },
        titles: { main: "LUMIÈRE SKIN", sub: "물광/토닝 시뮬레이션" },
        brushColor: "#d4af37",
        brushGlow: "rgba(212, 175, 55, 0.6)",
        variants: [
            {
                key: "water-glow",
                label: "물광 효과",
                description: "이마/광대 스펙큘러 하이라이트",
                // 1. Base: 약간의 블러로 피부결 정돈 + 밝기 증가
                filter: "brightness(1.05) contrast(0.98) saturate(1.05) blur(0.5px)",
                opacity: 0.9,
                // 2. Overlay: 흰색 글로우 오버레이
                overlayColor: "rgba(255, 255, 255, 0.3)",
                mixBlendMode: "overlay",
                overlayOpacity: 0.7,
                // 3. Specular: 하이라이트 레이어 활성화
                specular: {
                    enabled: true,
                    intensity: 1.4,
                    threshold: 1.2,
                    blurPx: 3,
                    blendMode: "screen"
                }
            },
            {
                key: "toning",
                label: "토닝 효과",
                description: "붉은기 제거 및 맑은 톤업",
                // 1. Base: 붉은기 제거를 위해 채도 조정, 밝기 증가 (회색화 방지)
                filter: "brightness(1.12) contrast(1.05) saturate(0.9) sepia(0.05)",
                opacity: 1,
                // 2. Overlay: 핑크/진주빛 오버레이로 생기 부여
                overlayColor: "rgba(255, 245, 250, 0.15)",
                mixBlendMode: "soft-light",
                overlayOpacity: 0.8,
                specular: {
                    enabled: false,
                    intensity: 1,
                    blurPx: 0,
                    blendMode: "screen"
                }
            }
        ]
    },
    "dentistry": {
        id: "dentistry",
        label: "치과",
        baseImage: "/히어로세션/dentistry_hero.jpg",
        uiTheme: { primary: "#00CED1", text: "#0F172A" },
        titles: { main: "DENTI CREW", sub: "미소/치아 시뮬레이션" },
        brushColor: "#00CED1",
        brushGlow: "rgba(0, 206, 209, 0.6)",
        variants: [
            {
                key: "whitening",
                label: "브라이트닝",
                description: "치아 명도 업 & 옐로우 다운",
                filter: "brightness(1.3) contrast(1.1) grayscale(0.2)",
                opacity: 0.9
            },
            {
                key: "mint-glow",
                label: "민트 글로우",
                description: "상쾌한 네온 민트 아우라",
                filter: "brightness(1.1) hue-rotate(90deg)",
                overlayColor: "rgba(0, 206, 209, 0.1)",
                mixBlendMode: "overlay",
                overlayOpacity: 0.5,
                opacity: 0.8
            }
        ]
    },
    "urology": {
        id: "urology",
        label: "비뇨기과",
        uiTheme: { primary: "#8B5CF6", text: "#ffffff" },
        titles: { main: "MEN'S PRIVATE", sub: "체형/윤곽 시뮬레이션" },
        brushColor: "#8B5CF6",
        brushGlow: "rgba(139, 92, 246, 0.8)",
        variants: [
            {
                key: "body-contour",
                label: "체형 변형",
                description: "평평한 라인 & 하이-콘트라스트",
                filter: "contrast(1.3) brightness(0.95) grayscale(0.2)",
                opacity: 1
            },
            {
                key: "energy-aurora",
                label: "에너지 오로라",
                description: "퍼플 & 볼트 에너지 스트림",
                filter: "hue-rotate(240deg) saturate(1.5) contrast(1.2) brightness(1.1)",
                overlayColor: "rgba(139, 92, 246, 0.15)",
                mixBlendMode: "color-dodge",
                opacity: 0.9
            }
        ]
    },
    "orthopedics": {
        id: "orthopedics",
        label: "정형외과",
        uiTheme: { primary: "#F97316", text: "#0f172a" },
        titles: { main: "BONE BALANCE", sub: "체형 교정/밸런스" },
        brushColor: "#F97316",
        brushGlow: "rgba(249, 115, 22, 0.6)",
        variants: [
            {
                key: "alignment",
                label: "얼라인먼트",
                description: "수직 격자 & 리퀴파이 보정",
                filter: "contrast(1.1) brightness(1.05)",
                overlayColor: "rgba(15, 23, 42, 0.05)",
                opacity: 1
            },
            {
                key: "structure",
                label: "구조적 색감",
                description: "안정적인 네이비 톤 정화",
                filter: "sepia(0.5) hue-rotate(180deg) saturate(0.8) contrast(1.2)",
                opacity: 0.9
            }
        ]
    },
    "korean-medicine": {
        id: "korean-medicine",
        label: "한의원",
        uiTheme: { primary: "#4A5D23", text: "#2F4F4F" },
        titles: { main: "BON CHO", sub: "기혈/순환 시뮬레이션" },
        brushColor: "#4A5D23",
        brushGlow: "rgba(74, 93, 35, 0.6)",
        variants: [
            {
                key: "circulation",
                label: "순환 시각화",
                description: "생기 넘치는 딥 그린 컬러",
                filter: "sepia(0.4) hue-rotate(70deg) saturate(1.2) contrast(1.05)",
                opacity: 0.9
            },
            {
                key: "ink-diffusion",
                label: "먹물 번짐",
                description: "잉크 디퓨전 에너지 확산",
                filter: "grayscale(0.8) contrast(1.5) brightness(0.9)",
                overlayColor: "rgba(74, 93, 35, 0.1)",
                mixBlendMode: "multiply",
                opacity: 0.9
            }
        ]
    },
    "pediatrics": {
        id: "pediatrics",
        label: "소아과",
        uiTheme: { primary: "#FF69B4", text: "#0e4134" },
        titles: { main: "KIDS DOCTOR", sub: "성장/영양 시뮬레이션" },
        brushColor: "#FF69B4",
        brushGlow: "rgba(255, 105, 180, 0.6)",
        variants: [
            {
                key: "growth",
                label: "성장 시뮬레이션",
                description: "성장판 자극 결과 암시",
                filter: "brightness(1.05) saturate(1.1)",
                overlayColor: "rgba(135, 206, 235, 0.05)",
                opacity: 1
            },
            {
                key: "bubble-pop",
                label: "버블 팝",
                description: "파스텔 톤 광채 아우라",
                filter: "saturate(1.3) brightness(1.1) hue-rotate(-10deg)",
                opacity: 0.8
            }
        ]
    },
    "obgyn": {
        id: "obgyn",
        label: "산부인과",
        uiTheme: { primary: "#FF9EAA", text: "#4A4A4A" },
        titles: { main: "MAMAN CARE", sub: "순환/질환 케어" },
        brushColor: "#FF9EAA",
        brushGlow: "rgba(255, 158, 170, 0.6)",
        variants: [
            {
                key: "rhythmic-wave",
                label: "리드믹 웨이브",
                description: "코랄색 그라데이션 파동",
                filter: "sepia(0.4) hue-rotate(-30deg) saturate(1.4) brightness(1.05)",
                opacity: 0.9
            },
            {
                key: "peach-glow",
                label: "피치 글로우",
                description: "따뜻한 피치 톤 변화",
                filter: "sepia(0.2) saturate(1.2) brightness(1.08) contrast(1.02)",
                opacity: 0.9
            }
        ]
    },
    "internal_medicine": {
        id: "internal_medicine",
        label: "내과",
        uiTheme: { primary: "#61897c", text: "#1e3a2f" },
        titles: { main: "INNER WELLNESS", sub: "대사/장내 환경 개선" },
        brushColor: "#61897c",
        brushGlow: "rgba(97, 137, 124, 0.6)",
        variants: [
            {
                key: "clear-filter",
                label: "클리어 필터",
                description: "탁한 노이즈 정화 & 세이지 그린",
                filter: "brightness(1.1) contrast(1.1) grayscale(0.1) sepia(0.1) hue-rotate(90deg)",
                opacity: 0.9
            },
            {
                key: "metabolic-light",
                label: "메타볼릭 라이트",
                description: "빛줄기로 표현한 신진대사",
                filter: "brightness(1.3) contrast(0.9) saturate(0.8)",
                opacity: 0.8
            }
        ]
    },
    "cancer_center": {
        id: "cancer_center",
        label: "암요양",
        uiTheme: { primary: "#F59E0B", text: "#2D3633" },
        titles: { main: "CARE FOR YOU", sub: "면역/회복 시뮬레이션" },
        brushColor: "#F59E0B",
        brushGlow: "rgba(245, 158, 11, 0.6)",
        variants: [
            {
                key: "glow-shield",
                label: "글로우 쉴드",
                description: "따뜻한 앰버 톤의 방패",
                filter: "sepia(0.6) hue-rotate(20deg) saturate(1.5) brightness(1.1)",
                opacity: 0.85
            },
            {
                key: "sunlight",
                label: "빛번짐 연출",
                description: "스며드는 햇살과 희망",
                filter: "brightness(1.2) contrast(0.8) sepia(0.3) saturate(1.2)",
                opacity: 0.9
            }
        ]
    },
    "neurosurgery": {
        id: "neurosurgery",
        label: "신경외과",
        uiTheme: { primary: "#6366f1", text: "#ffffff" },
        titles: { main: "NEURO SCAN", sub: "신경/통증 완화" },
        brushColor: "#6366f1",
        brushGlow: "rgba(99, 102, 241, 0.8)",
        variants: [
            {
                key: "synapse-flow",
                label: "시냅스 플로우",
                description: "일렉트릭 퍼플 데이터 스트림",
                filter: "hue-rotate(240deg) contrast(1.4) brightness(1.1)",
                opacity: 0.9
            },
            {
                key: "scan-effect",
                label: "스캔 이펙트",
                description: "붉은 노이즈 정화 & 맑은 보라",
                filter: "brightness(1.1) grayscale(0.2) sepia(0.4) hue-rotate(200deg) saturate(1.5)",
                opacity: 0.9
            }
        ]
    }
};

export const DEFAULT_SIMULATION = DEPARTMENT_SIMULATIONS["dermatology"];
