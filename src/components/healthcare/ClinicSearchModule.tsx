"use client";

import { useState, useCallback, useEffect } from "react";
import { Search, Sun, Moon, Calendar, Loader2, MapPin, Phone, Clock, AlertCircle, RefreshCw, ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import Link from "next/link";
import LoginRequiredModal from "./LoginRequiredModal";
import { useHospital } from "@/components/common/HospitalProvider";
import { getRecommendedClinic } from "@/lib/config/marketing";

// 클리닉 타입
interface Clinic {
    name: string;
    addr: string;
    tel: string;
    lat?: number;
    lng?: number;
    closeTime?: string;
    openToday?: boolean;
    night?: boolean;
    holiday?: boolean;
    isRecommended?: boolean; // 추천 병원 여부 추가
}

// 검색 상태
type SearchState = "idle" | "loading" | "success" | "error" | "empty" | "auto-expanded";

// 서울 지역 목록
const SEOUL_REGIONS = [
    "강남구", "강동구", "강북구", "강서구", "관악구",
    "광진구", "구로구", "금천구", "노원구", "도봉구",
    "동대문구", "동작구", "마포구", "서대문구", "서초구",
    "성동구", "성북구", "송파구", "양천구", "영등포구",
    "용산구", "은평구", "종로구", "중구", "중랑구"
];

// 경기도 지역 목록 (주요 지역)
const GYEONGGI_REGIONS = [
    "의정부시", "양주시", "포천시", "고양시", "구리시", "남양주시",
    "동두천시", "성남시", "수원시", "안양시", "용인시", "파주시"
];

// 추천 병원 노출 대상 지역
const TARGET_REGIONS = ["강남구", "서초구", "송파구", "용산구", "성동구", "강동구"];

// 피부과 검색 키워드
const SKIN_KEYWORDS = ["피부과", "피부의원", "피부클리닉", "더마", "derma"];

// THEME_CLASSES removed for dynamic button styling


// 오늘 요일 계산 (1=월 ~ 7=일)
function getTodayQt(): string {
    const day = new Date().getDay();
    return day === 0 ? "7" : String(day);
}

// 공휴일 판별
function isHoliday(): boolean {
    return false;
}

interface ClinicSearchModuleProps {
    department?: string; // 부서 ID 추가
    searchKeyword?: string; // 검색 키워드 추가
    theme?: "glass" | "silk" | "hanji" | "modern" | "dark" | "light"; // 테마 모드 추가
}

export default function ClinicSearchModule({ department = "dermatology", searchKeyword = "", theme }: ClinicSearchModuleProps) {
    const config = useHospital();

    // 배경색 기반 다크모드 감지 유틸리티
    const isColorDark = (hex: string) => {
        if (!hex || hex.length < 4) return false;
        const h = hex.replace('#', '');
        const r = parseInt(h.substring(0, 2), 16);
        const g = parseInt(h.substring(2, 4), 16);
        const b = parseInt(h.substring(4, 6), 16);
        return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
    };

    // 실제 테마 모드 결정 (설정 또는 override 기반)
    const isThemeDark = () => {
        if (theme === "dark") return true;
        if (theme === "light" || theme === "hanji" || theme === "modern") return false;
        if (config?.theme?.background) return isColorDark(config.theme.background);
        return false; // 기본값 Light
    };

    const isLight = !isThemeDark();
    // const currentTheme = isLight ? "light" : "dark"; // Not really needed for logic below, isLight is key

    // 밝은 Primary 컬러를 사용하는 진료과인지 확인 (White Text 가독성 문제 해결)
    // 성형외과(#13eca4), 피부과(#FFC0CB), 소아과(#FBBF24), 치과(#2DD4BF) 등 밝은 배경일 때 텍스트를 어둡게
    // 단, Dark Mode일 때는 Primary Color가 어두울 수 있으므로(혹은 배경이 어두우므로) White Text 유지
    const isBrightPrimary = ["plastic-surgery", "dermatology", "pediatrics", "dentistry"].includes(department);
    const buttonTextColor = (isBrightPrimary && isLight) ? "text-slate-900 font-extrabold" : "text-white";

    // 테마별 스타일 정의 (동적 적용)
    const getThemeStyles = () => {
        return {
            // 컨테이너 배경
            container: isLight
                ? "bg-white/95 backdrop-blur-xl border-stone-200 shadow-xl" // Light
                : "bg-black/40 backdrop-blur-xl border-white/10",

            // 텍스트 기본 색상
            textPrimary: isLight ? "text-stone-900" : "text-skin-text",
            textSecondary: isLight ? "text-stone-600" : "text-skin-text/70",
            textAccent: "text-skin-primary",

            // 라벨 (입력폼 위)
            label: isLight ? "text-stone-700 font-bold" : "text-skin-primary/80 font-bold",

            // 입력 필드 (배경색/테두리/텍스트)
            input: isLight
                ? "bg-stone-50 border-2 text-stone-900 border-stone-200 focus:border-skin-primary placeholder:text-stone-400 font-medium shadow-sm transition-all focus:bg-white"
                : "bg-white/5 border border-white/10 text-skin-text focus:border-skin-primary placeholder:text-skin-text/20",

            // 선택창 옵션
            select: {
                bg: isLight ? "#ffffff" : "#1a1a1a",
                text: isLight ? "#111111" : "#e5e5e5"
            },

            // 칩 (버튼) - Inactive 상태 가독성 확실하게 수정
            chip: {
                // Active: Skin Primary Background + Dynamic Text Color
                active: `bg-skin-primary ${buttonTextColor} border-2 border-skin-primary shadow-md transform scale-105`,

                // Inactive: White Background + Grey Border + Grey Text (Standard Light Button)
                inactive: isLight
                    ? "bg-white border-2 border-stone-300 text-stone-500 hover:border-skin-primary hover:text-skin-primary hover:bg-stone-50 transition-all font-bold"
                    : "bg-white/10 border-white/20 text-gray-200 hover:bg-white/20 hover:text-white hover:border-white/40 font-medium"
            },

            // 결과 카드
            card: isLight
                ? "bg-white border-stone-200 shadow-xl text-stone-900"
                : "bg-gray-900/90 backdrop-blur-md border-white/10 text-gray-200",

            // 구분선
            divider: isLight ? "bg-stone-200" : "bg-white/10"
        };
    };

    const styles = getThemeStyles();

    // Dynamic Button Class (Main Search Button)
    const themeButtonClass = isLight
        ? `bg-skin-primary ${buttonTextColor} shadow-xl shadow-skin-primary/30 hover:bg-skin-accent`
        : `bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-2xl hover:bg-white/20`;

    const finalButtonClass = `${themeButtonClass} hover:-translate-y-1 active:scale-95 active:translate-y-0 transition-all duration-200 font-black px-10 py-5 text-lg rounded-2xl`;

    // 추천 병원 로드 (동적 로딩)
    const [recommendedClinic, setRecommendedClinic] = useState<any>(null);

    useEffect(() => {
        const fetchRecommended = async () => {
            if (!config?.name) return;

            try {
                // 환경설정의 병원명으로 검색 (API 필터 제한 해제됨)
                const res = await fetch(`/api/clinics/search?qn=${encodeURIComponent(config.name)}&q0=서울`);
                const data = await res.json();

                if (data.clinics && data.clinics.length > 0) {
                    // 첫 번째 결과를 추천 병원으로 설정
                    const premiumClinic = {
                        ...data.clinics[0],
                        isRecommended: true // 강제 추천 플래그
                    };
                    setRecommendedClinic(premiumClinic);
                }
            } catch (error) {
                console.error("Failed to fetch recommended clinic:", error);
            }
        };

        fetchRecommended();
    }, [config.name]);

    // 지역 선택
    const [selectedCity, setSelectedCity] = useState("서울");
    const [selectedRegion, setSelectedRegion] = useState("강남구");

    // 토글 상태
    const [todayOpen, setTodayOpen] = useState(true);
    const [nightOpen, setNightOpen] = useState(false);
    const [holidayOpen, setHolidayOpen] = useState(isHoliday());

    // 검색 상태
    const DEPARTMENT_KEYWORDS: Record<string, string> = {
        "dermatology": "피부과",
        "plastic-surgery": "성형외과",
        "korean-medicine": "한의원",
        "dentistry": "치과",
        "orthopedics": "정형외과",
        "internal-medicine": "내과",
        "surgery": "외과",
        "obgyn": "산부인과",
        "urology": "비뇨기과",
        "pediatrics": "소아과",
        "oncology": "암요양병원",
        "neurosurgery": "신경외과",
        "rehabilitation": "재활의학과",
        "mental-health": "정신건강의학과",
        "ophthalmology": "안과",
        "ent": "이비인후과"
    };

    // 검색어 결정 로직 (하드코딩 제거 및 환경설정 기반 동적 적용)
    const resolveKeyword = () => {
        if (searchKeyword) return searchKeyword;
        if (department && DEPARTMENT_KEYWORDS[department]) return DEPARTMENT_KEYWORDS[department];
        if (config?.name) return config.name; // 환경설정의 병원명 사용 (ex: 소아과, 내과)
        return "병원";
    };

    const targetKeyword = resolveKeyword();
    const [searchTerm, setSearchTerm] = useState(targetKeyword);
    const debouncedSearch = searchTerm;

    const [searchState, setSearchState] = useState<SearchState>("idle");
    const [clinics, setClinics] = useState<Clinic[]>([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [autoExpanded, setAutoExpanded] = useState(false);

    // 로그인 모달 상태
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    // 검색 실행
    const handleSearch = useCallback(async (expandToCity: boolean = false) => {
        setSearchState("loading");
        setErrorMessage("");
        setAutoExpanded(false);

        try {
            let qt = getTodayQt();
            if (holidayOpen) {
                qt = "8";
            }

            // 키워드 조합 (동적 적용)
            const qn = targetKeyword;

            const params = new URLSearchParams({
                q0: selectedCity,
                ...(expandToCity ? {} : { q1: selectedRegion }),
                qn,
            });

            const res = await fetch(`/api/clinics/search?${params.toString()}`);

            if (!res.ok) {
                throw new Error("API 호출 실패");
            }

            const data = await res.json();

            if (data.error) {
                throw new Error(data.error);
            }

            let results: Clinic[] = data.clinics || [];

            // 0. 추천 병원 최우선 주입 (환경변수 매칭 시)
            if (recommendedClinic) {
                // 지역 매칭 로직 (서울이면 강남구 등 주요 구에 노출, 경기도면 전체 노출 등)
                // 사용자가 선택한 지역이 추천 병원의 타겟 지역과 맞는지 확인
                // 여기서는 간단하게 "무조건 상단 노출" 하되, 도시(City)만 맞으면 보여주는 식으로 구현

                // 만약 추천 병원이 '현재 병원'이면 주소가 있으므로 주소 기반 매칭
                const isRegionMatch = recommendedClinic.addr.includes(selectedCity) ||
                    (selectedCity === "서울" && TARGET_REGIONS.includes(selectedRegion)) ||
                    recommendedClinic.addr === "프리미엄 추천 위치"; // 외부 병원은 항상 노출

                if (isRegionMatch) {
                    // 중복 제거
                    results = results.filter(c => c.name !== recommendedClinic.name);
                    // 최상단 추가
                    results.unshift(recommendedClinic);
                }
            }

            // 키워드 필터 (검색어 없을 때 대비)
            if (qn) {
                results = results.filter((c) => c.name.includes(qn) || c.name.includes("의원") || c.name.includes("병원"));
            }

            // 야간 진료 필터
            if (nightOpen) {
                results = results.filter((c) => c.night);
            }

            if (results.length === 0) {
                if (!expandToCity && !autoExpanded) {
                    // 자동으로 서울 전체 확장 재검색
                    setAutoExpanded(true);
                    handleSearch(true);
                    return;
                }
                setSearchState("empty");
            } else {
                if (expandToCity) {
                    setSearchState("auto-expanded");
                } else {
                    setSearchState("success");
                }
            }

            setClinics(results);
        } catch (error) {
            console.error("Search error:", error);
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "일시적으로 조회가 어렵습니다. 잠시 후 다시 시도해 주세요."
            );
            setSearchState("error");
        }
    }, [holidayOpen, nightOpen, selectedCity, selectedRegion, autoExpanded, searchKeyword, department, recommendedClinic, targetKeyword]);

    // 상담 연결 클릭
    const handleConnect = () => {
        setIsLoginModalOpen(true);
    };

    // 세그먼트 컨트롤 스타일 칩 컴포넌트
    const SegmentChip = ({
        label,
        icon,
        active,
        onChange,
        ariaLabel,
    }: {
        label: string;
        icon: React.ReactNode;
        active: boolean;
        onChange: () => void;
        ariaLabel: string;
    }) => (
        <button
            onClick={onChange}
            aria-pressed={active}
            aria-label={ariaLabel}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${active
                ? styles.chip.active
                : styles.chip.inactive
                }`}
        >
            {icon}
            {label}
        </button>
    );

    return (
        <>
            {/* 조회 모듈 - Row 기반 레이아웃 */}
            <div className="w-full space-y-6">
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <div className="relative flex-1 max-w-[200px] mx-auto sm:mx-0">
                        <label className={`text-xs font-black uppercase tracking-widest absolute -top-5 left-1 opacity-90 ${styles.label}`}>Location / City</label>
                        <select
                            value={selectedCity}
                            onChange={(e) => {
                                const city = e.target.value;
                                setSelectedCity(city);
                                if (city === "서울") setSelectedRegion("강남구");
                                else if (city === "경기도") setSelectedRegion("의정부시");
                            }}
                            className={`w-full appearance-none rounded-2xl px-5 py-4 pr-12 text-sm font-semibold focus:outline-none cursor-pointer transition-all duration-300 ${styles.input}`}
                            style={{ color: styles.select.text, backgroundColor: styles.select.bg }}
                        >
                            <option value="서울" style={{ color: styles.select.text, backgroundColor: styles.select.bg }}>서울</option>
                            <option value="경기도" style={{ color: styles.select.text, backgroundColor: styles.select.bg }}>경기도</option>
                        </select>
                        <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${styles.textAccent}`} />
                    </div>
                    <div className="relative flex-1 max-w-[240px] mx-auto sm:mx-0">
                        <label className={`text-xs font-black uppercase tracking-widest absolute -top-5 left-1 opacity-90 ${styles.label}`}>Area / District</label>
                        <select
                            value={selectedRegion}
                            onChange={(e) => setSelectedRegion(e.target.value)}
                            className={`w-full appearance-none rounded-2xl px-5 py-4 pr-12 text-sm font-semibold focus:outline-none cursor-pointer transition-all duration-300 ${styles.input}`}
                            style={{ color: styles.select.text, backgroundColor: styles.select.bg }}
                        >
                            {(selectedCity === "서울" ? SEOUL_REGIONS : GYEONGGI_REGIONS).map((region) => (
                                <option key={region} value={region} style={{ color: styles.select.text, backgroundColor: styles.select.bg }}>{region}</option>
                            ))}
                        </select>
                        <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${styles.textAccent}`} />
                    </div>
                </div>

                {/* Row 2: 운영 필터 세그먼트 칩 */}
                <div className="flex justify-center gap-2">
                    <SegmentChip
                        label="오늘 운영"
                        icon={<Sun size={16} />}
                        active={todayOpen}
                        onChange={() => setTodayOpen(!todayOpen)}
                        ariaLabel="오늘 운영 필터"
                    />
                    <SegmentChip
                        label="야간 운영"
                        icon={<Moon size={16} />}
                        active={nightOpen}
                        onChange={() => setNightOpen(!nightOpen)}
                        ariaLabel="야간 운영 필터"
                    />
                    <SegmentChip
                        label="공휴일 운영"
                        icon={<Calendar size={16} />}
                        active={holidayOpen}
                        onChange={() => setHolidayOpen(!holidayOpen)}
                        ariaLabel="공휴일 운영 필터"
                    />
                </div>

                {/* Row 3: 검색 버튼 (Primary - 글로우 허용) */}
                <div className="flex justify-center pt-4">
                    <button
                        onClick={() => handleSearch(false)}
                        disabled={searchState === "loading"}
                        className={`${finalButtonClass} disabled:opacity-70 disabled:cursor-not-allowed`}
                    >
                        {searchState === "loading" ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin mr-3" />
                                최적의 병원 탐색 중...
                            </>
                        ) : (
                            <>
                                <Search className="w-6 h-6 mr-3" />
                                운영병원 찾기
                            </>
                        )}
                    </button>
                </div>

                {/* 검색 결과 영역 */}
                <div
                    aria-live="polite"
                    className={`transition-all duration-700 ${searchState !== "idle" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                >
                    {searchState !== "idle" && (
                        <div className={`rounded-[2rem] p-6 md:p-8 mt-12 max-h-[70vh] overflow-y-auto custom-scrollbar border ${styles.card}`}>
                            {/* 초기화 버튼 */}
                            <div className="flex justify-end mb-3">
                                <button
                                    onClick={() => {
                                        setSearchState("idle");
                                        setClinics([]);
                                    }}
                                    className={`text-xs hover:text-skin-primary transition-colors flex items-center gap-1 font-bold ${styles.textSecondary}`}
                                >
                                    ✕ 닫기
                                </button>
                            </div>

                            {/* 자동 확장 안내 */}
                            {searchState === "auto-expanded" && (
                                <div className="mb-4 px-3 py-2 bg-skin-secondary/20 text-skin-secondary rounded-lg text-sm">
                                    📍 {selectedRegion}에 결과가 없어 {selectedCity} 전체로 확장하여 검색했습니다.
                                </div>
                            )}

                            {/* 로딩 */}
                            {searchState === "loading" && (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-skin-primary" />
                                </div>
                            )}

                            {/* 에러 */}
                            {searchState === "error" && (
                                <div className="text-center py-8 space-y-4">
                                    <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
                                    <p className={styles.textSecondary}>{errorMessage}</p>
                                    <button
                                        onClick={() => handleSearch(false)}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-skin-primary text-white rounded-lg hover:bg-skin-accent transition-colors"
                                    >
                                        <RefreshCw size={16} />
                                        다시 시도
                                    </button>
                                </div>
                            )}

                            {/* 빈 결과 */}
                            {searchState === "empty" && (
                                <div className="text-center py-8">
                                    <p className={styles.textSecondary}>
                                        선택한 조건에 맞는 결과가 없습니다.
                                        <br />
                                        다른 지역을 선택해보세요.
                                    </p>
                                </div>
                            )}

                            {/* 성공 - 결과 리스트 */}
                            {(searchState === "success" || searchState === "auto-expanded") && (
                                <div className="space-y-4">
                                    {/* 추천 병원 카드 (환경설정 기반 동적 로딩) */}
                                    {recommendedClinic && (
                                        <div className={`relative overflow-hidden rounded-3xl p-6 md:p-10 border-2 border-skin-primary/40 bg-gradient-to-br from-skin-primary/20 via-white/[0.03] to-skin-accent/20 shadow-2xl group/card transition-all duration-700 hover:border-skin-primary mb-8 animate-in zoom-in-95 duration-500`}>
                                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover/card:opacity-[0.08] transition-opacity pointer-events-none">
                                                <Sparkles className="w-32 h-32 text-skin-primary" />
                                            </div>

                                            <div className="absolute top-6 right-6">
                                                <span className="px-4 py-1.5 bg-skin-primary text-white text-[10px] font-black rounded-full shadow-lg z-10 border border-white/20 tracking-widest uppercase flex items-center gap-2">
                                                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                                    Premium Network
                                                </span>
                                            </div>

                                            <div className="relative z-10">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                                    <div className="flex-1">
                                                        <h3 className="text-3xl md:text-4xl font-black text-skin-text mb-4 tracking-tight">
                                                            {recommendedClinic.name}
                                                        </h3>
                                                        <div className="flex flex-wrap gap-2 mb-6">
                                                            <span className="px-3.5 py-1.5 bg-skin-primary/20 text-skin-primary text-[11px] font-black rounded-xl border border-skin-primary/30 uppercase tracking-tighter">
                                                                오늘 진료 가능
                                                            </span>
                                                            <span className="px-3.5 py-1.5 bg-white/5 text-white/50 text-[11px] font-bold rounded-xl border border-white/10 uppercase tracking-tighter">
                                                                보건복지부 인증
                                                            </span>
                                                        </div>
                                                        <p className="text-white/60 text-lg md:text-xl flex items-center gap-3 font-light">
                                                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                                                <MapPin size={20} className="text-skin-primary" />
                                                            </div>
                                                            {recommendedClinic.addr}
                                                        </p>
                                                    </div>

                                                    <div className="flex flex-col gap-3 min-w-[180px]">
                                                        <button
                                                            onClick={handleConnect}
                                                            className={`w-full py-5 px-8 rounded-2xl font-black transition-all duration-300 text-lg active:scale-95 ${isLight
                                                                    ? "bg-skin-primary text-white shadow-[0_10px_30px_-10px_rgba(var(--skin-primary-rgb),0.5)] hover:bg-skin-accent"
                                                                    : "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 shadow-2xl"
                                                                }`}
                                                        >
                                                            비대면 상담예약
                                                        </button>
                                                        <a
                                                            href={`tel:${recommendedClinic.tel}`}
                                                            className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-white/5 text-white rounded-2xl font-black hover:bg-white/10 transition-all duration-300 text-base border border-white/10 active:scale-95"
                                                        >
                                                            <Phone size={20} />
                                                            직통 전화
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* 변동 고지 문구 */}
                                    <p className={`text-xs text-center rounded-lg py-2 ${styles.textSecondary} bg-black/5`}>
                                        ⚠️ 운영정보는 변동될 수 있어요. 방문 전 확인이 필요합니다.
                                    </p>

                                    {/* 검색 결과 목록 */}
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between px-2 mb-2">
                                            <h4 className={`text-xl font-black tracking-tight ${styles.textPrimary}`}>
                                                검색 결과 <span className="text-skin-primary ml-1 opacity-100">({clinics.length}개)</span>
                                            </h4>
                                            <div className={`h-[1px] flex-1 mx-6 ${styles.divider}`}></div>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                            {clinics.filter(c => !c.isRecommended).slice(0, 10).map((clinic, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`group p-6 rounded-[1.5rem] transition-all duration-500 border relative overflow-hidden ${styles.card} hover:-translate-y-1`}
                                                >
                                                    <div className="flex items-start justify-between gap-6">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <h4 className={`text-xl font-bold group-hover:text-skin-primary transition-colors truncate ${styles.textPrimary}`}>
                                                                    {clinic.name}
                                                                </h4>
                                                                {clinic.night && (
                                                                    <span className="flex-shrink-0 px-2.5 py-1 bg-amber-500/20 text-amber-400 text-[10px] font-black rounded-lg border border-amber-500/20 uppercase">
                                                                        야간
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className={`text-sm mb-4 truncate flex items-center gap-2 font-medium ${styles.textSecondary}`}>
                                                                <MapPin size={16} className={`opacity-50 group-hover:text-skin-primary transition-colors`} />
                                                                {clinic.addr}
                                                            </p>
                                                            {clinic.closeTime && (
                                                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[11px] font-bold ${styles.textSecondary} bg-black/5 border-black/5`}>
                                                                    <Clock size={14} className="opacity-50" />
                                                                    {clinic.closeTime.substring(0, 2)}:{clinic.closeTime.substring(2, 4)} 종료
                                                                </div>
                                                            )}
                                                        </div>
                                                        {clinic.tel && (
                                                            <a
                                                                href={`tel:${clinic.tel}`}
                                                                className={`flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-2xl hover:bg-skin-primary hover:text-white transition-all duration-300 border active:scale-90 ${styles.chip.inactive}`}
                                                                aria-label={`${clinic.name} 전화하기`}
                                                            >
                                                                <Phone size={24} className="text-skin-primary group-hover:text-white" />
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {clinics.length > 10 && (
                                        <p className="text-center text-skin-subtext text-sm">
                                            외 {clinics.length - 10}개 결과가 더 있습니다
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </div>

            {/* 로그인 필요 모달 */}
            <LoginRequiredModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                returnUrl="/medical/patient-dashboard"
            />
        </>
    );
}