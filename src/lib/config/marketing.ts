
import { HospitalConfig } from "./hospital";

export interface RecommendedClinic {
    name: string;
    addr: string;
    tel: string;
    isRecommended: boolean;
    openToday: boolean;
    night: boolean;
    holiday: boolean;
    closeTime: string;
}

// 부서 ID와 환경변수 키 매핑
const ENV_VAR_MAPPING: Record<string, string> = {
    "plastic-surgery": "NEXT_PUBLIC_RECOMMENDED_PLASTIC_SURGERY",
    "dermatology": "NEXT_PUBLIC_RECOMMENDED_DERMATOLOGY",
    "korean-medicine": "NEXT_PUBLIC_RECOMMENDED_KOREAN_MEDICINE",
    "dentistry": "NEXT_PUBLIC_RECOMMENDED_DENTISTRY",
    "orthopedics": "NEXT_PUBLIC_RECOMMENDED_ORTHOPEDICS",
    "urology": "NEXT_PUBLIC_RECOMMENDED_UROLOGY",
    "pediatrics": "NEXT_PUBLIC_RECOMMENDED_PEDIATRICS",
    "obgyn": "NEXT_PUBLIC_RECOMMENDED_OBGYN",
    "internal-medicine": "NEXT_PUBLIC_RECOMMENDED_INTERNAL_MEDICINE",
    "oncology": "NEXT_PUBLIC_RECOMMENDED_ONCOLOGY",
    "neurosurgery": "NEXT_PUBLIC_RECOMMENDED_NEUROSURGERY"
};

// 추천 병원 가져오기
export function getRecommendedClinic(departmentId: string, currentConfig: HospitalConfig): RecommendedClinic | null {
    // 1. 환경변수 키 확인 (Client Side에서 접근 가능하게 NEXT_PUBLIC 사용)
    const envKey = ENV_VAR_MAPPING[departmentId];
    if (!envKey) return null;

    // 2. 환경변수 값 읽기 (예: "아이니의원" or "이세상치과")
    // process.env는 빌드 타임에 주입되므로, 실제 런타임 값은 window.__ENV__ 등을 쓰거나 
    // Next.js에서는 process.env.NEXT_PUBLIC_... 으로 접근
    const targetName = process.env[envKey];

    if (!targetName) return null;

    // 3. 만약 환경변수 값이 현재 설정된 병원 이름과 같다면, 현재 설정의 디테일 사용
    if (targetName === currentConfig.name) {
        return {
            name: currentConfig.name,
            addr: currentConfig.address,
            tel: currentConfig.tel,
            isRecommended: true,
            openToday: true,
            night: true,
            holiday: false,
            closeTime: "2000"
        };
    }

    // 4. 다르다면 (예: 이세상치과), 가상의 데이터 생성 (지역 로직은 모듈에서 처리)
    return {
        name: targetName,
        addr: "프리미엄 추천 위치", // 실제 주소를 알 수 없으므로 일반화
        tel: "02-1234-5678",
        isRecommended: true,
        openToday: true,
        night: true,
        holiday: false,
        closeTime: "2000"
    };
}

export function getEnvKeyForDepartment(departmentId: string): string {
    return ENV_VAR_MAPPING[departmentId] || "";
}
