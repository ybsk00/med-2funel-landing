/**
 * 병원 정보 중앙 관리 설정 파일
 * 모든 하드코딩된 병원명, 원장명, 주소 등을 이 파일에서 관리합니다.
 */

export const HOSPITAL_CONFIG = {
    name: "에버피부과",
    representative: "김지은",
    representativeTitle: "대표원장",
    address: "서울특별시 강남구 압구정로 222",
    tel: "1899-1150",
    fax: "02-516-0514",
    businessNumber: "317-14-00846",
    aiPersonaName: "에밀리",
    aiPersonaTitle: "수석 VIP 컨시어지",

    // AI 응답에서 사용할 범용 명칭
    genericName: "우리 병원",

    // 네이버 검색용 키워드
    naverSearchKeyword: "에버피부과",
};

export type HospitalConfig = typeof HOSPITAL_CONFIG;
