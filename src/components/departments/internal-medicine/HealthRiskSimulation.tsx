"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Activity,
    ClipboardCheck,
    ChevronRight,
    ChevronLeft,
    Loader2,
    Sparkles,
    Lock,
    MessageCircle,
    ArrowRight,
    AlertCircle,
    Info,
    Moon,
    Flame,
    Wind,
    Utensils
} from "lucide-react";

interface Option {
    id: string;
    label: string;
    icon?: any;
    score?: number;
}

interface Step {
    id: string;
    question: string;
    sub?: string;
    options: Option[];
    multi?: boolean;
}

// 설문 단계 정의
const STEPS: Step[] = [
    {
        id: "goals",
        question: "현재 가장 집중적으로 관리하고 싶은 분야는 무엇인가요?",
        sub: "(복수 선택 가능)",
        options: [
            { id: "fatigue", label: "피로", icon: Wind },
            { id: "metabolism", label: "체중/대사", icon: Flame },
            { id: "digestion", label: "소화", icon: Utensils },
            { id: "circulation", label: "혈압/순환", icon: Activity },
            { id: "sleep", label: "수면", icon: Moon },
            { id: "stress", label: "스트레스", icon: AlertCircle },
        ],
        multi: true
    },
    {
        id: "frequency",
        question: "최근 2주간 불편함(통증, 피로 등)을 얼마나 자주 느끼셨나요?",
        options: [
            { id: "rarely", label: "거의 없음", score: 0 },
            { id: "sometimes", label: "가끔 (주 1-2회)", score: 1 },
            { id: "often", label: "자주 (주 3-4회)", score: 2 },
            { id: "daily", label: "거의 매일", score: 3 },
        ]
    },
    {
        id: "lifestyle",
        question: "일주일 중 30분 이상 땀이 날 정도의 운동을 몇 번 하시나요?",
        options: [
            { id: "level1", label: "안 함 (0회)", score: 3 },
            { id: "level2", label: "주 1-2회", score: 2 },
            { id: "level3", label: "주 3-4회", score: 1 },
            { id: "level4", label: "주 5회 이상", score: 0 },
        ]
    },
    {
        id: "family",
        question: "가족 중 고혈압, 당뇨, 심혈관 질환이 있는 분이 계신가요?",
        options: [
            { id: "none", label: "없음/모름", score: 0 },
            { id: "yes", label: "있음", score: 2 },
        ]
    },
    {
        id: "recent_exam",
        question: "최근 1년 내에 종합 건강검진을 받으신 적이 있나요?",
        options: [
            { id: "none", label: "없음", score: 2 },
            { id: "within_6m", label: "6개월 내", score: 0 },
            { id: "within_1y", label: "1년 내", score: 1 },
        ]
    },
    {
        id: "priority",
        question: "내과 방문 시 가장 중요하게 생각하는 목적은 무엇인가요?",
        options: [
            { id: "quick_fix", label: "빠른 개선" },
            { id: "root_cause", label: "원인 파악" },
            { id: "lifestyle_fix", label: "생활 교정" },
            { id: "checkup", label: "검사 중심" },
        ]
    }
];

const QUESTIONS_TEMPLATES = [
    "증상이 시작된 시점과 악화/완화 요인은 무엇인가요?",
    "하루 중 언제 가장 불편한가요? (아침/오후/저녁/야간)",
    "수면 시간과 수면의 질(중간각성/기상피로)은 어떤가요?",
    "카페인/알코올 섭취가 증상에 영향을 주나요?",
    "최근 체중 변화가 있나요?",
    "식후 더부룩함/속쓰림/복통 같은 소화 증상이 있나요?",
    "활동량(걷기/운동)이 최근 줄었나요?",
    "스트레스가 높을 때 증상이 동반되나요?",
    "심계항진/어지럼/호흡 불편이 동반되나요?",
    "혈압/혈당을 측정해본 적이 있나요?",
    "복용 중인 약/보충제(영양제 포함)가 있나요?",
    "가족력(고혈압/당뇨/심혈관/갑상선 등)이 있나요?",
    "최근 검사(6개월~1년 내) 결과가 있나요?",
    "가장 큰 목표는 무엇인가요? (원인 확인/생활 교정/검사 중심)"
];

export default function HealthRiskSimulation() {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [status, setStatus] = useState<"survey" | "analyzing" | "result">("survey");

    const totalSteps = STEPS.length;
    const progress = ((step + 1) / totalSteps) * 100;

    const handleAnswer = (optionId: string) => {
        const currentStep = STEPS[step];
        if (currentStep.multi) {
            const currentAnswers = answers[currentStep.id] || [];
            const newValue = currentAnswers.includes(optionId)
                ? currentAnswers.filter((a: string) => a !== optionId)
                : [...currentAnswers, optionId];
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

    const results = useMemo(() => {
        if (status !== "result") return null;

        // 리스크 스코어 산정 로직
        let totalScore = 0;
        let maxPossible = 0;

        STEPS.forEach(s => {
            const hasScore = s.options.some(o => o.score !== undefined);
            if (hasScore) {
                maxPossible += Math.max(...s.options.map(o => o.score ?? 0));
                const selectedOption = s.options.find(o => o.id === answers[s.id]);
                totalScore += selectedOption?.score ?? 0;
            }
        });

        const normalizedScore = Math.round(Math.min(100, (totalScore / (maxPossible || 1)) * 100));

        // 영역별 요약
        const categories = [
            { id: "sleep", label: "수면", score: answers.goals?.includes("sleep") ? 85 : 40, hint: "일정한 취침 시간을 유지해보세요." },
            { id: "habit", label: "활동", score: answers.lifestyle === "level1" ? 90 : 30, hint: "하루 20분 가벼운 산책이 필요합니다." },
            { id: "stress", label: "스트레스", score: answers.goals?.includes("stress") ? 80 : 45, hint: "명상이나 심호흡 루틴을 추천합니다." },
            { id: "metabo", label: "대사", score: answers.family === "yes" ? 75 : 50, hint: "정기적인 혈압/혈당 체크 권고" }
        ].sort((a, b) => b.score - a.score);

        return {
            score: normalizedScore,
            mainRisks: categories.slice(0, 2),
            allCategories: categories
        };
    }, [status, answers]);

    return (
        <div className="w-full max-w-5xl mx-auto px-6 py-10 lg:py-20">
            <div className={`relative bg-white/[0.03] backdrop-blur-3xl rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl transition-all duration-500 ${status === 'result' ? 'min-h-[800px]' : 'min-h-[600px] font-medium'}`}>
                <AnimatePresence mode="wait">
                    {status === "survey" && (
                        <motion.div
                            key="survey"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="p-8 md:p-16 flex flex-col h-full"
                        >
                            {/* Progress bar */}
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-12">
                                <motion.div
                                    className="h-full bg-emerald-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>

                            <div className="flex-1 space-y-12">
                                <div className="space-y-4">
                                    <span className="text-emerald-500 font-black text-xs tracking-widest uppercase">Question {step + 1} / {totalSteps}</span>
                                    <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
                                        {STEPS[step].question}
                                        {STEPS[step].sub && <span className="block text-white/40 text-sm mt-2">{STEPS[step].sub}</span>}
                                    </h3>
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
                                                className={`p-6 rounded-2xl border transition-all duration-300 flex items-center gap-4 text-left group ${isSelected
                                                    ? "bg-emerald-500/10 border-emerald-500 text-white"
                                                    : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20"
                                                    }`}
                                            >
                                                {opt.icon && <opt.icon className={`w-6 h-6 ${isSelected ? 'text-emerald-500' : 'text-white/20 group-hover:text-white/40'}`} />}
                                                <span className="font-bold text-lg">{opt.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {STEPS[step].multi && (
                                <div className="mt-12 flex justify-end">
                                    <button
                                        disabled={!answers[STEPS[step].id]?.length}
                                        onClick={() => step < totalSteps - 1 ? setStep(step + 1) : analyzeResults()}
                                        className="px-10 py-4 bg-white text-black font-black rounded-xl hover:bg-[#cbd5e1] transition-all disabled:opacity-50 flex items-center gap-2"
                                    >
                                        다음 단계 <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}

                            {step > 0 && (
                                <button
                                    onClick={() => setStep(step - 1)}
                                    className="absolute top-16 left-8 md:top-20 md:left-12 p-3 text-white/30 hover:text-white/60 transition-colors"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                            )}
                        </motion.div>
                    )}

                    {status === "analyzing" && (
                        <motion.div
                            key="analyzing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="p-20 flex flex-col items-center justify-center space-y-8"
                        >
                            <div className="relative">
                                <Loader2 className="w-20 h-20 text-emerald-500/20 animate-spin" />
                                <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-emerald-500 animate-pulse" />
                            </div>
                            <div className="text-center space-y-2">
                                <h4 className="text-2xl font-black text-white tracking-widest uppercase">Analyzing...</h4>
                                <p className="text-white/40 text-sm">최근 생활습관과 증상을 기반으로 건강 리스크를 분석 중입니다.</p>
                            </div>
                        </motion.div>
                    )}

                    {status === "result" && results && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-8 md:p-16 space-y-12"
                        >
                            {/* Score dashboard */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-1 flex flex-col items-center justify-center p-8 bg-white/5 rounded-[2.5rem] border border-white/10">
                                    <span className="text-white/40 text-xs font-black uppercase tracking-widest mb-6 leading-tight">Risk Score</span>
                                    <div className="relative w-40 h-40 flex items-center justify-center font-medium">
                                        <svg className="w-full h-full -rotate-90">
                                            <circle cx="80" cy="80" r="70" className="fill-none stroke-white/5 stroke-[8px]" />
                                            <motion.circle
                                                cx="80" cy="80" r="70"
                                                className="fill-none stroke-emerald-500 stroke-[8px]"
                                                strokeDasharray="440"
                                                initial={{ strokeDashoffset: 440 }}
                                                animate={{ strokeDashoffset: 440 - (440 * results.score) / 100 }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-5xl font-black text-white">{results.score}</span>
                                            <span className="text-white/40 text-[10px] font-bold">out of 100</span>
                                        </div>
                                    </div>
                                    <p className="mt-6 text-white/50 text-xs text-center font-medium">진단이 아닌 생활습관/증상 <br /> 기반 리스크 수치입니다.</p>
                                </div>

                                <div className="lg:col-span-2 space-y-6">
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-black text-white font-medium">당신의 건강 포인트</h3>
                                        <p className="text-white/40 text-sm">현재 {results.mainRisks[0].label} 및 {results.mainRisks[1].label} 영역에서 세심한 관리가 필요해 보입니다.</p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {results.allCategories.map((cat) => (
                                            <div key={cat.id} className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-white font-black text-sm">{cat.label} 지수</span>
                                                    <span className={`text-xs font-bold ${cat.score > 70 ? 'text-orange-400' : 'text-emerald-500'}`}>{cat.score > 70 ? '주의' : '양호'}</span>
                                                </div>
                                                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${cat.score}%` }}
                                                        transition={{ duration: 1, delay: 0.5 }}
                                                        className={`h-full ${cat.score > 70 ? 'bg-orange-400' : 'bg-emerald-500'}`}
                                                    />
                                                </div>
                                                <p className="text-white/30 text-xs leading-relaxed font-black tracking-tighter">💡 {cat.hint}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Lock section: Consultation Questions */}
                            <div className="relative pt-12 border-t border-white/10">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="space-y-1">
                                        <h4 className="text-xl font-black text-white font-medium">상담을 위한 체크리스트</h4>
                                        <p className="text-white/40 text-xs">의사 상담 시 확인하면 진료 효율이 2배 올라가는 핵심 질문 리스트입니다.</p>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                                        <Sparkles className="w-3 h-3 text-emerald-500" />
                                        <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">AI Generated</span>
                                    </div>
                                </div>

                                <div className="space-y-3 relative">
                                    {QUESTIONS_TEMPLATES.slice(0, 2).map((q, i) => (
                                        <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center gap-4">
                                            <div className="w-6 h-6 flex-shrink-0 bg-white/10 rounded-lg flex items-center justify-center text-xs text-white/40 font-black tracking-normal leading-normal">{i + 1}</div>
                                            <span className="text-sm text-white/70 font-bold">{q}</span>
                                        </div>
                                    ))}

                                    {/* BLURRED LOCKED CONTENT */}
                                    <div className="space-y-3 opacity-20 filter blur-[4px] pointer-events-none select-none">
                                        {QUESTIONS_TEMPLATES.slice(2, 5).map((q, i) => (
                                            <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center gap-4">
                                                <div className="w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center text-xs text-white/40 font-black tracking-normal leading-normal">{i + 3}</div>
                                                <span className="text-sm text-white/70 font-bold">{q}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* OVERLAY CTA */}
                                    <div className="absolute inset-x-0 bottom-0 top-[88px] flex items-center justify-center z-10">
                                        <div className="bg-black/40 backdrop-blur-md p-8 rounded-3xl border border-white/10 text-center space-y-6 shadow-2xl">
                                            <div className="flex flex-col items-center gap-2">
                                                <Lock className="w-8 h-8 text-emerald-500 mb-2" />
                                                <h5 className="text-white font-black text-lg">나머지 {QUESTIONS_TEMPLATES.length - 2}개 질문 더 보기</h5>
                                                <p className="text-white/40 text-xs">로그인하시면 맞춤 상담 질문지와 검사 체크리스트가 해제됩니다.</p>
                                            </div>
                                            <button className="w-full py-4 bg-white text-black font-black rounded-xl hover:bg-[#cbd5e1] transition-all flex items-center justify-center gap-2 shadow-xl">
                                                로그인하고 전체 리스트 받기 <ArrowRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* CTAs */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-10">
                                <button className="p-6 bg-white/5 hover:bg-white/10 rounded-3xl border border-white/10 transition-all text-left flex items-center gap-4 group">
                                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <MessageCircle className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="block text-white font-black">챗봇 상담 시작</span>
                                        <span className="block text-white/30 text-xs">분석 결과를 바탕으로 1:1 대화를 시작하세요.</span>
                                    </div>
                                </button>
                                <button className="p-6 bg-white/5 hover:bg-white/10 rounded-3xl border border-white/10 transition-all text-left flex items-center gap-4 group">
                                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <ClipboardCheck className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="block text-white font-black">유명한 내과 찾기</span>
                                        <span className="block text-white/30 text-xs">검증된 내과 전문의가 있는 병원을 추천합니다.</span>
                                    </div>
                                </button>
                            </div>

                            <p className="text-center text-[11px] text-white/20 leading-relaxed max-w-2xl mx-auto font-medium">
                                * 본 기능은 일반 정보 제공을 위한 것이며 의학적 진단/처방을 대신할 수 없습니다. <br />
                                건강 상의 우려가 있거나 증상이 지속되는 경우 반드시 전문 의료진의 상담을 받으시기 바랍니다.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
