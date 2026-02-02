"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight, Loader2, Lock, Sparkles, User, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

// --- Types ---
type Step = "intro" | "survey" | "analyzing" | "result";

// --- Mock Data ---
const SURVEY_STEPS = [
    {
        id: 1,
        question: "가장 해결하고 싶은 고민은 무엇인가요?",
        options: ["탄력 저하 / 늘어짐", "칙칙한 톤 / 착색", "건조함 / 민감성", "출산 후 회복 관리", "질염 / 냄새 케어"],
        multi: true
    },
    {
        id: 2,
        question: "시술 시 가장 중요하게 생각하는 것은?",
        options: ["확실한 효과 체감", "통증/자극 최소화", "빠른 회복/일상 복귀", "합리적인 비용"],
        multi: false
    },
    {
        id: 3,
        question: "현재 라이프스타일은 어떤가요?",
        options: ["운동을 즐김 / 활동적", "장시간 앉아있는 편", "불규칙한 수면 / 스트레스 많음"],
        multi: false
    },
    {
        id: 4,
        question: "피부 민감도나 시술 경험은?",
        options: ["시술 경험 있음", "처음이라 걱정됨", "피부가 매우 민감한 편"],
        multi: false
    },
    {
        id: 5,
        question: "원하시는 관리 시점은?",
        options: ["즉시 (2주 내)", "1달 이내", "여유 있음 (상담 후 결정)"],
        multi: false
    }
];

export default function VCareSimulation() {
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

        // Auto-advance for single choice after short delay
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
        router.push("/login?redirect=/healthcare/obgyn#session-simulation");
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6 md:p-10 relative min-h-[500px] flex items-center justify-center bg-white/5 backdrop-blur-lg rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden">
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
                            <span className="px-4 py-1.5 rounded-full bg-pink-500/10 text-pink-300 text-xs font-bold tracking-widest uppercase border border-pink-500/20">
                                Premium V-Care
                            </span>
                            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                                1분 V-케어 <span className="text-pink-300">맞춤 플랜</span> 설계
                            </h2>
                            <p className="text-white/60 text-lg max-w-lg mx-auto leading-relaxed">
                                고민과 목표를 입력하시면, <br/>
                                딱 맞는 시술 옵션과 상담 질문을 정리해드립니다.
                            </p>
                        </div>
                        
                        <div className="flex flex-col gap-3 max-w-xs mx-auto">
                            <button
                                onClick={handleStart}
                                className="w-full py-4 bg-pink-500 hover:bg-pink-400 text-white font-bold rounded-2xl shadow-lg shadow-pink-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Sparkles className="w-5 h-5" />
                                플랜 만들기
                            </button>
                            <p className="text-xs text-white/40">
                                * 비회원도 무료로 진단 가능합니다.
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
                            <span className="text-pink-300 font-bold text-sm">
                                STEP {currentSurveyIdx + 1} / {SURVEY_STEPS.length}
                            </span>
                            <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-pink-400"
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
                                        className={`w-full p-4 rounded-xl text-left transition-all border ${isSelected ? 'bg-pink-500/20 border-pink-400 text-white' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>{option}</span>
                                            {isSelected && <CheckCircle2 className="w-5 h-5 text-pink-400" />}
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
                            <div className="absolute inset-0 border-4 border-t-pink-400 rounded-full animate-spin"></div>
                            <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-pink-300 animate-pulse" />
                        </div>
                        <h3 className="text-xl font-bold text-white">
                            맞춤 V-케어 플랜을<br/>구성하고 있습니다...
                        </h3>
                    </motion.div>
                )}

                {/* --- STEP 4: RESULT --- */}
                {step === "result" && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        {/* Left: Plan Cards (Visible) */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                                <Sparkles className="w-5 h-5 text-pink-400" />
                                추천 케어 플랜 (요약)
                            </h3>
                            
                            <div className="bg-white/10 border border-white/20 p-5 rounded-2xl backdrop-blur-md">
                                <span className="text-xs font-bold text-pink-300 uppercase mb-1 block">Direction</span>
                                <h4 className="text-lg font-bold text-white mb-2">탄력 & 타이트닝 집중 케어</h4>
                                <p className="text-sm text-white/70 leading-relaxed">
                                    고객님의 고민인 '탄력 저하'에 맞춰, 통증 없이 즉각적인 효과를 볼 수 있는 고주파 레이저 관리를 추천합니다.
                                </p>
                            </div>

                            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                                <span className="text-xs font-bold text-slate-400 uppercase mb-1 block">Guide</span>
                                <h4 className="text-base font-bold text-white mb-2">회복 및 일정 가이드</h4>
                                <ul className="text-sm text-white/60 space-y-1">
                                    <li>• 시술 시간: 약 20~30분 소요</li>
                                    <li>• 일상 복귀: 즉시 가능 (통증/다운타임 없음)</li>
                                    <li>• 권장 주기: 2~3주 간격, 3회 이상 권장</li>
                                </ul>
                            </div>
                        </div>

                        {/* Right: Question List (Locked) */}
                        <div className="relative bg-black/20 border border-white/10 rounded-2xl p-6 overflow-hidden">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
                                상담 질문 리스트
                                <Lock className="w-4 h-4 text-white/50" />
                            </h3>

                            <ul className="space-y-4 opacity-30 blur-[2px] select-none">
                                <li className="flex gap-3">
                                    <span className="text-pink-400 font-bold">Q.</span>
                                    <span className="text-white">제 피부 타입에 고주파가 자극적이지 않을까요?</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-pink-400 font-bold">Q.</span>
                                    <span className="text-white">효과 유지를 위해 홈케어는 어떻게 해야 하나요?</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-pink-400 font-bold">Q.</span>
                                    <span className="text-white">패키지 결제 시 비용 혜택은 어떻게 되나요?</span>
                                </li>
                                 <li className="flex gap-3">
                                    <span className="text-pink-400 font-bold">Q.</span>
                                    <span className="text-white">...................................................</span>
                                </li>
                            </ul>

                            {/* Unlock Overlay */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-center">
                                <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center mb-3 shadow-lg shadow-pink-500/30">
                                    <Lock className="w-5 h-5 text-white" />
                                </div>
                                <h4 className="text-white font-bold mb-1">질문 리스트가 잠겨있어요</h4>
                                <p className="text-xs text-white/60 mb-4">
                                    로그인하면 12가지 맞춤 질문과<br/>상세 비용 가이드를 확인할 수 있습니다.
                                </p>
                                <button
                                    onClick={handleLoginRedirect}
                                    className="px-6 py-2.5 bg-white text-pink-600 font-bold rounded-xl hover:bg-pink-50 transition-colors flex items-center gap-2 text-sm"
                                >
                                    질문 리스트 보기
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Disclaimer */}
                        <div className="col-span-1 md:col-span-2 mt-2 flex items-start gap-2 p-3 bg-white/5 rounded-lg">
                            <ShieldCheck className="w-4 h-4 text-white/30 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-white/40 leading-tight">
                                본 결과는 입력하신 정보를 바탕으로 한 예시 플랜이며, 정확한 진단과 처방은 의료진과의 상담을 통해 결정됩니다.
                            </p>
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
}
