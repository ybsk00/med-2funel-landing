import { HospitalConfig } from "@/lib/config/hospital";
import { DepartmentId, DEFAULT_DEPARTMENT } from "@/lib/config/departments";

export type DepartmentHeroMedia = {
    type: "video" | "image";
    src: string;
    poster?: string;
};

const HERO_MEDIA: Record<DepartmentId, DepartmentHeroMedia> = {
    dermatology: { type: "video", src: "/히어로세션/피부과.mp4" },
    internal: { type: "video", src: "/히어로세션/내과.mp4" },
    urology: { type: "video", src: "/히어로세션/비뇨기과.mp4" },
    dentistry: { type: "video", src: "/히어로세션/치과.mp4", poster: "/히어로세션/dentistry_hero.jpg" },
    plastic: { type: "video", src: "/히어로세션/성형외과.mp4" },
    orthopedics: { type: "video", src: "/히어로세션/정형외과.mp4" },
    "korean-medicine": { type: "video", src: "/히어로세션/한방병원.mp4" },
    neurosurgery: { type: "video", src: "/히어로세션/신경외과.mp4" },
    obgyn: { type: "video", src: "/히어로세션/산부인과.mp4" },
    oncology: { type: "video", src: "/히어로세션/암요양병원.mp4" },
    pediatrics: { type: "video", src: "/히어로세션/소아과.mp4" }
};

const CHAT_TITLES: Record<DepartmentId, { title: string; subtitle: string }> = {
    dermatology: { title: "피부과 AI 시술상담", subtitle: "피부 고민과 시술 계획을 정리합니다" },
    internal: { title: "내과 AI 전문상담", subtitle: "증상 및 생활패턴 기반으로 진료를 돕습니다" },
    urology: { title: "비뇨의학과 AI 상담", subtitle: "프라이버시를 고려한 맞춤 상담" },
    dentistry: { title: "치과 AI 상담", subtitle: "치아·잇몸 관련 증상을 정리합니다" },
    plastic: { title: "성형외과 AI 상담", subtitle: "수술·시술 방향을 정리합니다" },
    orthopedics: { title: "정형외과 AI 통증상담", subtitle: "관절·척추 통증 기록을 돕습니다" },
    "korean-medicine": { title: "한방병원 AI 상담", subtitle: "체질·증상 기반 상담을 돕습니다" },
    neurosurgery: { title: "신경외과 AI 상담", subtitle: "두통·신경 증상을 정리합니다" },
    obgyn: { title: "산부인과 AI 상담", subtitle: "여성·산전 관련 상담을 돕습니다" },
    oncology: { title: "암요양병원 AI 상담", subtitle: "회복·증상 관리를 정리합니다" },
    pediatrics: { title: "소아과 AI 상담", subtitle: "아이 증상과 기록을 정리합니다" }
};

const MEDICAL_INTRO: Record<DepartmentId, string> = {
    dermatology: "피부 고민과 미용 시술 중심의 상담을 제공합니다.",
    internal: "내과 진료와 만성질환 관리 상담을 제공합니다.",
    urology: "비뇨의학과 진료 상담을 제공합니다.",
    dentistry: "치아·잇몸 치료 및 심미 상담을 제공합니다.",
    plastic: "성형 수술·시술 상담을 제공합니다.",
    orthopedics: "관절·척추 통증 및 운동계 상담을 제공합니다.",
    "korean-medicine": "한방 진료(침·뜸·한약) 상담을 제공합니다.",
    neurosurgery: "두통·신경·척추 관련 상담을 제공합니다.",
    obgyn: "여성·산전 관련 상담을 제공합니다.",
    oncology: "암 요양 및 회복 관리 상담을 제공합니다.",
    pediatrics: "소아 진료 및 성장·증상 상담을 제공합니다."
};

const SIMULATION_ENABLED: Record<DepartmentId, boolean> = {
    dermatology: true,
    internal: false,
    urology: false,
    dentistry: false,
    plastic: true,
    orthopedics: false,
    "korean-medicine": false,
    neurosurgery: false,
    obgyn: false,
    oncology: false,
    pediatrics: false
};

export function resolveDepartmentId(rawId?: string): DepartmentId {
    if (rawId && rawId in HERO_MEDIA) {
        return rawId as DepartmentId;
    }
    return DEFAULT_DEPARTMENT;
}

export function getDepartmentHeroMedia(rawId?: string): DepartmentHeroMedia {
    const id = resolveDepartmentId(rawId);
    return HERO_MEDIA[id];
}

export function getDepartmentChatTitle(rawId?: string) {
    const id = resolveDepartmentId(rawId);
    return CHAT_TITLES[id];
}

/**
 * 헬스케어 영역 (비로그인) 통일된 안내문구
 * 형식: "헬스케어 상담실장 {이름}입니다."
 */
export function getDepartmentHealthcareIntro(config: HospitalConfig): string {
    const persona = config.personas.healthcare;
    return `안녕하세요! 헬스케어 상담실장 ${persona.name}입니다.\n\n${config.dept} 관련 궁금한 점이 있으시면 편하게 말씀해주세요. 😊`;
}

/**
 * 메디컬 영역 (로그인 후) 통일된 안내문구
 * 형식: "상담실장 {이름}입니다. 궁금하신 사항은 무엇이든지 물어보세요"
 */
export function getDepartmentMedicalIntro(config: HospitalConfig): string {
    const persona = config.personas.medical;
    return `안녕하세요! 상담실장 ${persona.name}입니다.\n\n${config.dept} 관련 궁금하신 사항은 무엇이든지 물어보세요. 😊`;
}

export function isSimulationEnabled(rawId?: string): boolean {
    const id = resolveDepartmentId(rawId);
    return SIMULATION_ENABLED[id];
}
