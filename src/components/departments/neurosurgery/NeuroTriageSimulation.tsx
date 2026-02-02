"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Activity,
    Brain,
    ChevronRight,
    ChevronLeft,
    Loader2,
    AlertTriangle,
    Lock,
    MessageCircle,
    ArrowRight,
    MapPin,
    Clock,
    Zap,
    Search,
    Stethoscope
} from "lucide-react";

interface Option {
    id: string;
    label: string;
    icon?: any;
    isRedFlag?: boolean;
}

interface Step {
    id: string;
    question: string;
    sub?: string;
    options: Option[];
    multi?: boolean;
    isHybrid?: boolean;
}

// 설문 단계 정의
const STEPS: Step[] = [
    {
        id: "symptoms",
        question: "현재 느껴지는 주요 신경 증상은 무엇인가요?",
        sub: "(중복 선택 가능)",
        options: [
            { id: "headache", label: "두통", icon: Zap },
            { id: "dizziness", label: "어지럼", icon: Activity },
            { id: "numbness", label: "저림/감각이상", icon: Zap },
            { id: "weakness", label: "근력저하", icon: Activity },
            { id: "pain", label: "목/허리 통증", icon: MapPin },
            { id: "balance", label: "보행 불안정", icon: Activity },
        ],
        multi: true
    },
    {
        id: "pattern",
        question: "증상이 어떤 양상으로 발생하기 시작했나요?",
        options: [
            { id: "sudden", label: "갑자기 (벼락 치듯)", isRedFlag: true },
            { id: "gradual", label: "서서히 (점진적으로)" },
            { id: "recurrent", label: "반복적 (생겼다 없어짐)" },
            { id: "positional", label: "특정 자세/동작 시" },
        ]
    },
    {
        id: "location",
        question: "주요 불편 부위는 어디인가요?",
        options: [
            { id: "head_front", label: "머리 앞쪽/옆쪽" },
            { id: "head_back", label: "머리 뒤쪽/목 연결부" },
            { id: "spine_neck", label: "목 ~ 어깨/팔" },
            { id: "spine_lumbar", label: "허리 ~ 골반/다리" },
        ]
    },
    {
        id: "redflags",
        question: "다음 중 해당되는 동반 증상이 있나요?",
        sub: "(매우 중요: 중복 선택 가능)",
        options: [
            { id: "vision", label: "시야 이상/복시", isRedFlag: true },
            { id: "speech", label: "언어 장애/어눌함", isRedFlag: true },
            { id: "paralysis", label: "한쪽 팔다리 마비", isRedFlag: true },
            { id: "consciousness", label: "의식 변화/혼미", isRedFlag: true },
            { id: "convulsion", label: "경련/발작", isRedFlag: true },
            { id: "stiffness", label: "발열과 함께 목 뻣뻣함", isRedFlag: true },
            { id: "none", label: "해당 사항 없음" }
        ],
        multi: true
    },
    {
        id: "intensity",
        question: "증상의 지속 기간과 통증 강도는 어느 정도인가요?",
        isHybrid: true, // 기간 선택 + 강도 슬라이더 느낌 (간소화)
        options: [
            { id: "today", label: "오늘 시작 (급성)" },
            { id: "3days", label: "3일 전부터" },
            { id: "2weeks", label: "2주 이내" },
            { id: "chronic", label: "3개월 이상 (만성)" },
        ]
    }
];

const QUESTIONS_TEMPLATES = [
    "증상이 시작된 시점과 계기가 있나요?",
    "갑자기 시작했나요, 서서히 심해졌나요?",
    "증상이 반복되나요, 지속되나요?",
    "특정 자세/동작/시간대에 악화되나요?",
    "통증/저림이 어느 부위에서 어디로 퍼지나요?",
    "감각 이상(저림/화끈거림/무감각)이 있나요?",
    "근력 저하(물건 떨어뜨림/다리 풀림)가 있나요?",
    "보행이 불안정하거나 균형이 흔들리나요?",
    "시야/언어/의식 변화 같은 동반 증상이 있었나요?",
    "발열/목 경직/심한 구토가 동반되나요?",
    "수면/스트레스/카페인이 증상에 영향을 주나요?",
    "기존 목/허리 질환 또는 외상이 있나요?",
    "복용 중인 약(진통제 포함)과 효과는 어땠나요?",
    "최근 검사(X-ray/MRI/CT)를 받은 적이 있나요?",
    "현재 가장 큰 목표는 무엇인가요?",
    "수술적 치료에 대해 어떻게 생각하시나요?"
];

export default function NeuroTriageSimulation() {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [status, setStatus] = useState<"survey" | "analyzing" | "result">("survey");

    const totalSteps = STEPS.length;
    const progress = ((step + 1) / totalSteps) * 100;

    const handleAnswer = (optionId: string) => {
        const currentStep = STEPS[step];
        if (currentStep.multi) {
            const currentAnswers = answers[currentStep.id] || [];
            // "없음" 선택 시 다른 것 해제, 다른 것 선택 시 "없음" 해제
            let newValue;
            if (optionId === 'none') {
                newValue = ['none'];
            } else {
                const filtered = currentAnswers.filter((a: string) => a !== 'none');
                newValue = filtered.includes(optionId)
                    ? filtered.filter((a: string) => a !== optionId)
                    : [...filtered, optionId];
            }
            setAnswers(prev => ({ ...prev, [currentStep.id]: newValue }));
        } else {
            setAnswers(prev => ({ ...prev, [currentStep.id]: optionId }));
            if (step < totalSteps - 1) {
                setTimeout(() => setStep(step + 1), 300);
            } else {
                analyzeResults();
            }
        }
    };

    const analyzeResults = () => {
        setStatus("analyzing");
        setTimeout(() => setStatus("result"), 1500);
    };

    const resultData = useMemo(() => {
        if (status !== 'result') return null;

        const hasRedFlag = STEPS.some(s => {
            const answer = answers[s.id];
            if (Array.isArray(answer)) {
                return answer.some(aId => {
                    const opt = s.options.find(o => o.id === aId);
                    return opt?.isRedFlag ?? false;
                });
            }
            const opt = s.options.find(o => o.id === answer);
            return opt?.isRedFlag ?? false;
        });

        const symptomLabels = (answers.symptoms || []).map((id: string) =>
            STEPS[0].options.find(o => o.id === id)?.label
        ).filter(Boolean);

        return {
            hasRedFlag,
            symptomLabels,
            pattern: STEPS[1].options.find(o => o.id === answers.pattern)?.label,
            location: STEPS[2].options.find(o => o.id === answers.location)?.label,
            duration: STEPS[4].options.find(o => o.id === answers.intensity)?.label
        };
    }, [status, answers]);

    return (
        <div className="w-full max-w-5xl mx-auto px-6 py-12 lg:py-24">
            <div className="relative bg-[#0a1525]/80 backdrop-blur-3xl rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl transition-all duration-500">
                <AnimatePresence mode="wait">
                    {status === "survey" && (
                        <motion.div
                            key="survey"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="p-8 md:p-16"
                        >
                            <div className="flex flex-col h-full gap-10">
                                <div className="space-y-6">
                                    <div className="flex justify-between items-end">
                                        <span className="text-cyan-400 font-black text-xs tracking-widest uppercase">Triage Step {step + 1} / {totalSteps}</span>
                                        <span className="text-white/20 text-xs font-bold leading-normal">{Math.round(progress)}%</span>
                                    </div>
                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    <div className="space-y-4">
                                        <h3 className="text-2xl md:text-4xl font-black text-white leading-tight">
                                            {STEPS[step].question}
                                        </h3>
                                        {STEPS[step].sub && <p className="text-white/40 text-sm font-medium">{STEPS[step].sub}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {STEPS[step].options.map((opt) => {
                                            const isSelected = STEPS[step].multi
                                                ? answers[STEPS[step].id]?.includes(opt.id)
                                                : answers[STEPS[step].id] === opt.id;

                                            return (
                                                <button
                                                    key={opt.id}
                                                    onClick={() => handleAnswer(opt.id)}
                                                    className={`p-6 md:p-8 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between text-left group ${isSelected
                                                        ? "bg-cyan-500/10 border-cyan-500 text-white shadow-[0_0_30px_rgba(6,182,212,0.15)]"
                                                        : "bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:border-white/20"
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        {opt.icon && <opt.icon className={`w-6 h-6 ${isSelected ? 'text-cyan-500' : 'text-white/20'}`} />}
                                                        <span className="font-black text-lg md:text-xl">{opt.label}</span>
                                                    </div>
                                                    {isSelected && <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mt-6">
                                    {step > 0 ? (
                                        <button
                                            onClick={() => setStep(step - 1)}
                                            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors font-bold"
                                        >
                                            <ChevronLeft className="w-5 h-5" /> 이전
                                        </button>
                                    ) : <div />}

                                    {STEPS[step].multi && (
                                        <button
                                            disabled={!answers[STEPS[step].id]?.length}
                                            onClick={() => step < totalSteps - 1 ? setStep(step + 1) : analyzeResults()}
                                            className="px-10 py-4 bg-white text-black font-black rounded-xl hover:bg-cyan-50 transition-all disabled:opacity-50 flex items-center gap-2 shadow-xl"
                                        >
                                            {step === totalSteps - 1 ? "결과 보기" : "다음 단계"} <ChevronRight className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {status === "analyzing" && (
                        <motion.div
                            key="analyzing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-32 flex flex-col items-center justify-center space-y-10"
                        >
                            <div className="relative">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    className="w-32 h-32 rounded-full border-2 border-dashed border-cyan-500/30 flex items-center justify-center"
                                />
                                <Brain className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-cyan-400 animate-pulse" />
                            </div>
                            <div className="text-center space-y-3">
                                <h4 className="text-2xl font-black text-white tracking-[0.2em] uppercase">Neural Analysis</h4>
                                <p className="text-white/40 text-sm font-medium">증상 패턴과 응급 신호를 매칭 중입니다...</p>
                            </div>
                        </motion.div>
                    )}

                    {status === "result" && resultData && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-8 md:p-16 space-y-12"
                        >
                            <div className="flex flex-col lg:flex-row gap-10">
                                {/* Left Side: Summary Cards */}
                                <div className="flex-1 space-y-6">
                                    <div className="space-y-2">
                                        <h3 className="text-3xl font-black text-white font-medium">증상 트리아지 요약</h3>
                                        <p className="text-white/40 text-sm font-medium">입력하신 정보를 바탕으로 정리된 현재 상태의 패턴입니다.</p>
                                    </div>

                                    {resultData.hasRedFlag && (
                                        <motion.div
                                            initial={{ scale: 0.95, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-4"
                                        >
                                            <AlertTriangle className="w-8 h-8 text-red-500 shrink-0" />
                                            <div className="space-y-2">
                                                <h4 className="text-red-500 font-black tracking-normal leading-normal">주의: 위험 신호 감지</h4>
                                                <p className="text-red-500/80 text-sm font-medium leading-relaxed">
                                                    선택하신 동반 증상은 빠른 전문의 상담이 필요할 수 있는 신호입니다. <br />
                                                    즉시 가까운 의료기관을 방문하시는 것을 권장합니다.
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 tracking-tighter">
                                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                                            <div className="flex items-center gap-2 text-white/40">
                                                <Activity className="w-4 h-4" />
                                                <span className="text-xs font-black uppercase">Symptoms</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {resultData.symptomLabels.map((l: string, i: number) => (
                                                    <span key={i} className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-lg text-xs font-bold">{l}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                                            <div className="flex items-center gap-2 text-white/40">
                                                <Clock className="w-4 h-4" />
                                                <span className="text-xs font-black uppercase">Pattern & Duration</span>
                                            </div>
                                            <p className="text-white font-bold">{resultData.pattern} / {resultData.duration}</p>
                                        </div>
                                    </div>

                                    <div className="p-8 rounded-[2rem] bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20">
                                        <div className="flex items-center gap-4 mb-4">
                                            <Search className="w-6 h-6 text-cyan-400" />
                                            <h4 className="text-white font-black text-xl">상담을 위한 체크리스트</h4>
                                        </div>
                                        <div className="space-y-3">
                                            {QUESTIONS_TEMPLATES.slice(0, 2).map((q, i) => (
                                                <div key={i} className="flex items-start gap-3 p-4 bg-black/20 rounded-xl border border-white/5">
                                                    <div className="w-6 h-6 bg-cyan-500/20 rounded-lg flex items-center justify-center text-cyan-400 text-xs font-black shrink-0 tracking-normal leading-normal">{i + 1}</div>
                                                    <p className="text-white/80 text-sm font-bold">{q}</p>
                                                </div>
                                            ))}

                                            {/* Locked Items */}
                                            <div className="relative group/lock cursor-pointer">
                                                <div className="space-y-3 blur-sm opacity-20 select-none">
                                                    {QUESTIONS_TEMPLATES.slice(2, 4).map((q, i) => (
                                                        <div key={i} className="flex items-start gap-3 p-4 bg-black/20 rounded-xl border border-white/5">
                                                            <div className="w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center text-white/20 text-xs font-bold shrink-0 tracking-normal leading-normal">{i + 3}</div>
                                                            <p className="text-white/80 text-sm">{q}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-2xl border border-white/10 p-10 text-center gap-6 shadow-2xl">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Lock className="w-10 h-10 text-cyan-400 mb-2" />
                                                        <p className="text-white text-lg font-black">{QUESTIONS_TEMPLATES.length - 2}개 질문 더 보기</p>
                                                        <p className="text-white/40 text-xs font-medium">로그인하시면 개인별 맞춤 상담 질문지가 해제됩니다.</p>
                                                    </div>
                                                    <button className="px-10 py-4 bg-white text-black font-black rounded-xl hover:bg-cyan-50 transition-all flex items-center gap-2">
                                                        로그인하고 질문지 받기 <ArrowRight className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Mini Map of Human Figure (Visual Triage) */}
                                <div className="lg:w-80 flex flex-col items-center justify-center p-12 bg-white/5 rounded-[2.5rem] border border-white/10 gap-10">
                                    <div className="text-center space-y-1">
                                        <span className="text-cyan-400 font-extrabold text-[10px] tracking-widest uppercase mb-2 block">Visual Triage</span>
                                        <h4 className="text-white font-black text-lg">불편 부위 맵</h4>
                                    </div>

                                    <div className="relative w-40 h-72 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
                                        {/* Simple SVG Human Figure - Placeholder for 3D/Map logic */}
                                        <svg viewBox="0 0 100 200" className="w-full h-full fill-none stroke-white/20 stroke-[1.5]">
                                            <circle cx="50" cy="20" r="15" /> {/* Head */}
                                            <path d="M50 35 v120" /> {/* Spine */}
                                            <path d="M20 50 h60" /> {/* Shoulders */}
                                            <path d="M35 155 v35 M65 155 v35" /> {/* Legs */}
                                            <path d="M20 50 v40 M80 50 v40" /> {/* Arms */}

                                            {/* Dynamic Mark based on location */}
                                            {resultData.location?.includes('머리') && (
                                                <circle cx="50" cy="20" r="8" className="fill-cyan-500/50 stroke-cyan-400 animate-pulse" />
                                            )}
                                            {resultData.location?.includes('목') && (
                                                <circle cx="50" cy="45" r="8" className="fill-cyan-500/50 stroke-cyan-400 animate-pulse" />
                                            )}
                                            {resultData.location?.includes('허리') && (
                                                <circle cx="50" cy="110" r="8" className="fill-cyan-500/50 stroke-cyan-400 animate-pulse" />
                                            )}
                                        </svg>
                                    </div>

                                    <p className="text-white/30 text-xs text-center leading-relaxed font-medium">
                                        선택 부위: <span className="text-white font-black">{resultData.location}</span> <br />
                                        집중 검사 권장 영역
                                    </p>
                                </div>
                            </div>

                            {/* Final CTA Buttons */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-10">
                                <button className="p-8 rounded-3xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <MessageCircle className="w-7 h-7 text-cyan-400" />
                                        </div>
                                        <div className="text-left space-y-1">
                                            <span className="text-white font-black text-lg">헬스케어 챗봇 상담</span>
                                            <p className="text-white/30 text-xs font-medium">트리아지 결과를 바탕으로 상담 리스폰스를 구성합니다.</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-6 h-6 text-white/20 group-hover:text-cyan-400 transition-colors" />
                                </button>
                                <button className="p-8 rounded-3xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Stethoscope className="w-7 h-7 text-white/60" />
                                        </div>
                                        <div className="text-left space-y-1">
                                            <span className="text-white font-black text-lg">전문의 병원 찾기</span>
                                            <p className="text-white/30 text-xs font-medium">내 주변 신경외과 명의가 있는 병원을 추천합니다.</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-6 h-6 text-white/20 group-hover:white transition-colors" />
                                </button>
                            </div>

                            <p className="text-center text-[11px] text-white/20 leading-relaxed max-w-2xl mx-auto font-medium">
                                * 본 기능은 일반 정보 제공 및 상담 준비를 위한 가이드이며 진단/처방이 아닙니다. <br />
                                응급 증상(의식 변화, 한쪽 마비, 경련, 극심한 두통 등)이 있으면 즉시 의료기관에 연락하시기 바랍니다.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
