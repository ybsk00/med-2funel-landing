"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight, Loader2, Lock, Sparkles, Heart, Activity, CalendarCheck, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

// --- Types ---
type Step = "intro" | "survey" | "analyzing" | "result";

// --- Mock Data ---
const SURVEY_STEPS = [
    {
        id: 1,
        question: "현재 치료 단계는 어디에 해당하시나요?",
        options: ["수술/항암/방사선 치료 전 (대기)", "현재 치료 중 (항암/방사선)", "모든 치료 종료 후 회복기", "장기 관리 및 재발 방지"],
        multi: false
    },
    {
        id: 2,
        question: "오늘 가장 힘들게 하는 증상은? (복수 선택)",
        options: ["극심한 피로감", "통증 (부위 불문)", "식욕 저하 / 소화 불량", "수면 장애", "불안 / 우울감", "손발 저림 / 부종"],
        multi: true
    },
    {
        id: 3,
        question: "현재 체력 및 활동 수준은?",
        options: ["거의 누워서 지냄", "집안에서 가벼운 보행 가능", "가벼운 산책/일상 가능", "규칙적인 운동 가능"],
        multi: false
    },
    {
        id: 4,
        question: "식사 및 영양 섭취 상태는?",
        options: ["거의 못 먹음 (영양 수액 필요)", "입맛이 없어 소량만 섭취", "편식하지만 어느 정도 섭취", "양호하게 섭취 중"],
        multi: false
    },
    {
        id: 5,
        question: "가족/보호자의 도움이 얼마나 필요한가요?",
        options: ["대부분 혼자 해결 가능", "가사/이동 시 도움 필요", "상주 보호자가 필수적임"],
        multi: false
    },
    {
        id: 6,
        question: "이번 회복 기간의 최우선 목표는?",
        options: ["통증 및 불편감 완화", "체력 및 면역력 회복", "수면 및 정서 안정", "식사량 늘리기 / 영양 관리"],
        multi: false
    }
];

export default function RecoveryRoadmapSimulation() {
    const router = useRouter();
    const [step, setStep] = useState<Step>("intro");
    const [currentSurveyIdx, setCurrentSurveyIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string[]>>({});

    // --- Handlers ---
    const handleStart = () => {
        setStep("survey");
    };

    const handleOptionSelect = (option: string) => {
        const currentQ = SURVEY_STEPS[currentSurveyIdx];
        const currentAnswers = answers[currentQ.id] || [];
        
        let newAnswers;
        if (currentQ.multi) {
            if (currentAnswers.includes(option)) {
                newAnswers = currentAnswers.filter(a => a !== option);
            } else {
                newAnswers = [...currentAnswers, option];
            }
        } else {
            newAnswers = [option];
        }
        
        setAnswers({ ...answers, [currentQ.id]: newAnswers });

        if (!currentQ.multi) {
            setTimeout(() => handleNext(), 300);
        }
    };

    const handleNext = () => {
        if (currentSurveyIdx < SURVEY_STEPS.length - 1) {
            setCurrentSurveyIdx(prev => prev + 1);
        } else {
            setStep("analyzing");
            setTimeout(() => {
                setStep("result");
            }, 1500);
        }
    };

    const handleLoginRedirect = () => {
        router.push("/login?redirect=/healthcare/oncology#session-simulation");
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-6 md:p-10 relative min-h-[550px] flex items-center justify-center bg-white/5 backdrop-blur-lg rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden">
            <AnimatePresence mode="wait">
                
                {/* --- STEP 1: INTRO --- */}
                {step === "intro" && (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-center space-y-8"
                    >
                        <div className="space-y-4">
                            <span className="px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-300 text-xs font-bold tracking-widest uppercase border border-amber-500/20">
                                Recovery Roadmap
                            </span>
                            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                                우리 가족을 위한 <br/>
                                <span className="text-amber-300">1분 회복 로드맵</span> 만들기
                            </h2>
                            <p className="text-white/60 text-lg max-w-lg mx-auto leading-relaxed">
                                현재 상태를 체크하시면, 7일간의 구체적인 회복 플랜과<br/>
                                의료진 상담 질문을 정리해드립니다.
                            </p>
                        </div>
                        
                        <div className="flex flex-col gap-3 max-w-xs mx-auto">
                            <button
                                onClick={handleStart}
                                className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-2xl shadow-lg shadow-amber-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Activity className="w-5 h-5" />
                                로드맵 생성하기
                            </button>
                            <p className="text-xs text-white/40">
                                * 비회원도 무료로 확인 가능합니다.
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* --- STEP 2: SURVEY --- */}
                {step === "survey" && (
                    <motion.div
                        key="survey"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="w-full max-w-lg"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <span className="text-amber-300 font-bold text-sm">
                                STEP {currentSurveyIdx + 1} / {SURVEY_STEPS.length}
                            </span>
                            <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-amber-400"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((currentSurveyIdx + 1) / SURVEY_STEPS.length) * 100}%` }}
                                />
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-8 leading-snug">
                            {SURVEY_STEPS[currentSurveyIdx].question}
                        </h3>

                        <div className="space-y-3">
                            {SURVEY_STEPS[currentSurveyIdx].options.map((option, idx) => {
                                const isSelected = answers[SURVEY_STEPS[currentSurveyIdx].id]?.includes(option);
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleOptionSelect(option)}
                                        className={`w-full p-4 rounded-xl text-left transition-all border ${isSelected ? 'bg-amber-500/20 border-amber-400 text-white' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>{option}</span>
                                            {isSelected && <CheckCircle2 className="w-5 h-5 text-amber-400" />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {SURVEY_STEPS[currentSurveyIdx].multi && (
                            <button
                                onClick={handleNext}
                                className="w-full mt-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all"
                            >
                                다음으로
                            </button>
                        )}
                    </motion.div>
                )}

                {/* --- STEP 3: ANALYZING --- */}
                {step === "analyzing" && (
                    <motion.div
                        key="analyzing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center space-y-6"
                    >
                         <div className="relative w-24 h-24 mx-auto">
                            <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-t-amber-400 rounded-full animate-spin"></div>
                            <Heart className="absolute inset-0 m-auto w-8 h-8 text-amber-300 animate-pulse" />
                        </div>
                        <h3 className="text-xl font-bold text-white">
                            환자분에게 최적화된<br/>회복 로드맵을 구성 중입니다...
                        </h3>
                    </motion.div>
                )}

                {/* --- STEP 4: RESULT --- */}
                {step === "result" && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 items-start"
                    >
                        {/* Card 1: Priority */}
                        <div className="bg-white/10 border border-white/20 p-6 rounded-2xl backdrop-blur-md flex flex-col h-full">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="p-2 bg-amber-500/20 rounded-lg text-amber-300">
                                    <Activity className="w-5 h-5" />
                                </span>
                                <h4 className="font-bold text-white text-lg">우선 관리 포인트</h4>
                            </div>
                            <div className="space-y-4 flex-1">
                                <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                    <span className="text-xs text-amber-200 font-bold block mb-1">KEYWORD 1</span>
                                    <p className="text-white font-medium">영양 섭취 불균형 해소</p>
                                    <p className="text-white/60 text-xs mt-1">소화가 편한 고단백 유동식 위주 구성 필요</p>
                                </div>
                                <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                    <span className="text-xs text-amber-200 font-bold block mb-1">KEYWORD 2</span>
                                    <p className="text-white font-medium">기초 체력 유지</p>
                                    <p className="text-white/60 text-xs mt-1">하루 15분 실내 가벼운 보행 권장</p>
                                </div>
                            </div>
                        </div>

                        {/* Card 2: 7-Day Plan (Summary) */}
                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col h-full">
                             <div className="flex items-center gap-2 mb-4">
                                <span className="p-2 bg-blue-500/20 rounded-lg text-blue-300">
                                    <CalendarCheck className="w-5 h-5" />
                                </span>
                                <h4 className="font-bold text-white text-lg">7일 플랜 가이드 (예시)</h4>
                            </div>
                            <ul className="space-y-3 text-sm text-white/70 flex-1">
                                <li className="flex gap-2">
                                    <span className="text-blue-300 font-bold">Day 1-2</span>
                                    소화기 안정 및 수면 패턴 체크
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-blue-300 font-bold">Day 3-5</span>
                                    영양 섭취량 10% 증량 및 보행 연습
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-blue-300 font-bold">Day 6-7</span>
                                    증상 변화 기록 및 2주차 목표 설정
                                </li>
                            </ul>
                            <div className="mt-4 pt-4 border-t border-white/10 text-center">
                                <p className="text-xs text-white/40 mb-2">상세 시간표는 로그인 후 제공됩니다.</p>
                            </div>
                        </div>

                        {/* Card 3: Questions (Locked) */}
                        <div className="relative bg-black/30 border border-white/10 rounded-2xl p-6 overflow-hidden h-full flex flex-col">
                             <div className="flex items-center gap-2 mb-4">
                                <span className="p-2 bg-slate-700/50 rounded-lg text-slate-300">
                                    <Shield className="w-5 h-5" />
                                </span>
                                <h4 className="font-bold text-white text-lg">의료진 상담 질문</h4>
                            </div>

                            <ul className="space-y-4 opacity-30 blur-[2px] select-none flex-1">
                                <li className="flex gap-3 text-sm">
                                    <span className="text-amber-400 font-bold">Q.</span>
                                    <span className="text-white">현재 소화 기능 저하의 원인이 약물 부작용인가요?</span>
                                </li>
                                <li className="flex gap-3 text-sm">
                                    <span className="text-amber-400 font-bold">Q.</span>
                                    <span className="text-white">집에서 응급 상황(고열 등) 발생 시 대처 매뉴얼은?</span>
                                </li>
                                <li className="flex gap-3 text-sm">
                                    <span className="text-amber-400 font-bold">Q.</span>
                                    <span className="text-white">...................................................</span>
                                </li>
                            </ul>

                            {/* Unlock Overlay */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 text-center">
                                <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center mb-3 shadow-lg shadow-amber-500/30">
                                    <Lock className="w-5 h-5 text-slate-900" />
                                </div>
                                <h4 className="text-white font-bold mb-1">상담 질문 & 상세 로드맵</h4>
                                <p className="text-xs text-white/60 mb-4">
                                    로그인하면 16가지 맞춤 질문 리스트와<br/>보호자 체크리스트를 확인할 수 있습니다.
                                </p>
                                <button
                                    onClick={handleLoginRedirect}
                                    className="px-6 py-2.5 bg-white text-slate-900 font-bold rounded-xl hover:bg-amber-50 transition-colors flex items-center gap-2 text-sm"
                                >
                                    전체 질문 보기
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                         {/* Disclaimer */}
                         <div className="col-span-1 lg:col-span-3 mt-4 text-center">
                            <p className="text-[11px] text-white/30">
                                * 본 결과는 일반 정보 제공을 위한 가이드이며, 정확한 치료 계획은 의료진과의 상담을 통해 결정됩니다.<br/>
                                응급 증상(고열, 심한 호흡곤란, 의식저하 등)이 있으면 즉시 의료기관에 연락하세요.
                            </p>
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
}
