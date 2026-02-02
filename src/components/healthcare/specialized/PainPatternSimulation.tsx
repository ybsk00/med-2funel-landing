"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Loader2, Sparkles, Lock, CheckCircle2, AlertCircle, Info } from "lucide-react";

const BODY_PARTS = [
    { id: 'neck', label: '목', x: 50, y: 15 },
    { id: 'shoulder_l', label: '왼쪽 어깨', x: 35, y: 22 },
    { id: 'shoulder_r', label: '오른쪽 어깨', x: 65, y: 22 },
    { id: 'back', label: '등', x: 50, y: 35 },
    { id: 'waist', label: '허리', x: 50, y: 50 },
    { id: 'knee_l', label: '왼쪽 무릎', x: 40, y: 75 },
    { id: 'knee_r', label: '오른쪽 무릎', x: 60, y: 75 },
    { id: 'ankle_l', label: '왼쪽 발목', x: 42, y: 92 },
    { id: 'ankle_r', label: '오른쪽 발목', x: 58, y: 92 },
];

const SITUATIONS = [
    "걷기/조깅", "계단 이용", "장시간 앉기", "운동/활동", "수면 중", "특정 동작 시"
];

const PERIODS = [
    "3일 이내", "2주 이내", "3개월 이내", "6개월 이상"
];

const QUESTIONS = [
    "통증이 시작된 시점과 계기가 있나요?",
    "특정 동작(계단/쪼그려 앉기/팔 들기)에서 악화되나요?",
    "통증이 찌릿함/뻐근함/저림 중 어떤 느낌에 가깝나요?",
    "통증이 한쪽인가요, 양쪽인가요?",
    "야간 통증 또는 수면 방해가 있나요?",
    "붓기/열감/움직임 제한이 동반되나요?",
    "이전 외상/수술/재활 경험이 있나요?",
    "최근 운동량 또는 업무 자세 변화가 있었나요?",
    "통증이 방사(퍼짐)하나요? (예: 허리→다리)",
    "스트레칭/찜질/휴식에 반응이 있나요?",
    "진통제/소염제 복용 여부와 효과는 어땠나요?",
    "최근 영상검사(X-ray/MRI/초음파)를 받은 적이 있나요?",
    "목표는 무엇인가요? (통증 감소/운동 복귀/일상 복귀)",
    "치료 선호(보존치료 우선/시술 고려/수술은 최후) 기준이 있나요?"
];

export default function PainPatternSimulation() {
    const [step, setStep] = useState(0); // 0: Start, 1: Part, 2: Detail, 3: Analyzing, 4: Result
    const [selectedPart, setSelectedPart] = useState<string | null>(null);
    const [intensity, setIntensity] = useState(5);
    const [situation, setSituation] = useState("");
    const [period, setPeriod] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Demo purpose

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleStart = () => {
        setStep(1);
    };

    const handleComplete = () => {
        setStep(3);
        setTimeout(() => setStep(4), 1500);
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-black/40 backdrop-blur-xl rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl min-h-[500px] flex flex-col">
            <AnimatePresence mode="wait">
                {step === 0 && (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8"
                    >
                        <div className="w-20 h-20 bg-cyan-500/20 rounded-3xl flex items-center justify-center border border-cyan-500/30">
                            <Sparkles className="w-10 h-10 text-cyan-400" />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-3xl font-black text-white tracking-tight">1분 통증 패턴 기록</h2>
                            <p className="text-white/60 text-lg leading-relaxed">
                                아픈 위치와 상황을 정리하면, <br />상담에서 필요한 질문이 자동으로 만들어집니다.
                            </p>
                        </div>
                        <button
                            onClick={handleStart}
                            className="w-full py-5 bg-cyan-500 text-white font-black text-xl rounded-2xl hover:bg-cyan-600 transition-all shadow-xl shadow-cyan-500/20 active:scale-95"
                        >
                            통증 패턴 기록하기
                        </button>
                    </motion.div>
                )}

                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex-1 flex flex-col p-8 space-y-6"
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">어디가 불편하세요?</h3>
                            <span className="text-cyan-400 font-mono text-sm">STEP 1/2</span>
                        </div>

                        <div className="relative flex-1 bg-white/5 rounded-3xl border border-white/5 overflow-hidden flex items-center justify-center py-10">
                            {/* Simple Body Silhouette SVG */}
                            <svg viewBox="0 0 100 120" className="h-full w-auto opacity-20 fill-white">
                                <path d="M50 5 C55 5, 58 8, 58 13 C58 18, 55 21, 50 21 C45 21, 42 18, 42 13 C42 8, 45 5, 50 5 Z" /> {/* Head */}
                                <path d="M50 22 L50 26 M40 25 L60 25 C68 25, 75 30, 75 40 L70 65 M30 65 L25 40 C25 30, 32 25, 40 25 Z" /> {/* Torso & Arms */}
                                <path d="M35 65 L45 65 L45 110 L35 110 Z M55 65 L65 65 L65 110 L55 110 Z" /> {/* Legs */}
                            </svg>

                            {/* Interaction Points */}
                            {BODY_PARTS.map(part => (
                                <button
                                    key={part.id}
                                    onClick={() => setSelectedPart(part.id)}
                                    className={`absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-all flex items-center justify-center text-[10px] font-bold ${selectedPart === part.id
                                            ? 'bg-cyan-500 border-white scale-110 shadow-[0_0_15px_rgba(6,182,212,0.5)] text-white'
                                            : 'bg-white/10 border-white/20 hover:bg-white/30 text-white/40'
                                        }`}
                                    style={{ left: `${part.x}%`, top: `${part.y}%` }}
                                >
                                    {part.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button onClick={prevStep} className="px-6 py-4 bg-white/5 text-white/60 rounded-xl hover:bg-white/10 transition-all font-bold">이전</button>
                            <button
                                onClick={nextStep}
                                disabled={!selectedPart}
                                className={`flex-1 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${selectedPart ? 'bg-cyan-500 text-white shadow-lg' : 'bg-white/5 text-white/20 cursor-not-allowed'
                                    }`}
                            >
                                다음 단계 <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex-1 flex flex-col p-8 space-y-8"
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">상세 증상을 알려주세요</h3>
                            <span className="text-cyan-400 font-mono text-sm">STEP 2/2</span>
                        </div>

                        <div className="space-y-6">
                            {/* Intensity Slider */}
                            <div className="space-y-4 pt-4">
                                <div className="flex justify-between items-end">
                                    <label className="text-white/60 text-sm font-bold">통증 강도 (0-10)</label>
                                    <span className="text-2xl font-black text-cyan-400">{intensity}</span>
                                </div>
                                <input
                                    type="range" min="0" max="10" step="1"
                                    value={intensity}
                                    onChange={(e) => setIntensity(parseInt(e.target.value))}
                                    className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                />
                                <div className="flex justify-between text-[10px] text-white/30 font-bold uppercase tracking-widest">
                                    <span>가벼움</span>
                                    <span>중간</span>
                                    <span>매우 심함</span>
                                </div>
                            </div>

                            {/* Situation Grid */}
                            <div className="space-y-3">
                                <label className="text-white/60 text-sm font-bold">언제 주로 아프신가요?</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {SITUATIONS.map(s => (
                                        <button
                                            key={s}
                                            onClick={() => setSituation(s)}
                                            className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all ${situation === s
                                                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                                                    : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Period Grid */}
                            <div className="space-y-3">
                                <label className="text-white/60 text-sm font-bold">얼마나 되었나요?</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {PERIODS.map(p => (
                                        <button
                                            key={p}
                                            onClick={() => setPeriod(p)}
                                            className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all ${period === p
                                                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                                                    : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button onClick={prevStep} className="px-6 py-4 bg-white/5 text-white/60 rounded-xl hover:bg-white/10 transition-all font-bold">이전</button>
                            <button
                                onClick={handleComplete}
                                disabled={!situation || !period}
                                className={`flex-1 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${situation && period ? 'bg-cyan-500 text-white shadow-lg' : 'bg-white/5 text-white/20 cursor-not-allowed'
                                    }`}
                            >
                                분석 결과 보기 <CheckCircle2 className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        key="analyzing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col items-center justify-center p-12 space-y-6"
                    >
                        <Loader2 className="w-16 h-16 text-cyan-400 animate-spin" />
                        <p className="text-xl font-bold text-white animate-pulse tracking-widest text-center">
                            통증 패턴을 분석 중입니다...
                        </p>
                    </motion.div>
                )}

                {step === 4 && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex-1 flex flex-col p-8 space-y-8"
                    >
                        <div className="flex justify-between items-center border-b border-white/10 pb-4">
                            <h3 className="text-2xl font-black text-white">통증 패턴 요약</h3>
                            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                <span className="text-[10px] text-white/50 font-black uppercase tracking-widest">Analysis Result</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Visual Heatmap */}
                            <div className="relative aspect-square bg-white/5 rounded-3xl border border-white/5 flex items-center justify-center overflow-hidden">
                                <svg viewBox="0 0 100 120" className="h-4/5 w-auto opacity-10 fill-white">
                                    <path d="M50 5 C55 5, 58 8, 58 13 C58 18, 55 21, 50 21 C45 21, 42 18, 42 13 C42 8, 45 5, 50 5 Z" />
                                    <path d="M50 22 L50 26 M40 25 L60 25 C68 25, 75 30, 75 40 L70 65 M30 65 L25 40 C25 30, 32 25, 40 25 Z" />
                                    <path d="M35 65 L45 65 L45 110 L35 110 Z M55 65 L65 65 L65 110 L55 110 Z" />
                                </svg>

                                {/* Heatmap Overlay */}
                                {selectedPart && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: intensity / 10 * 0.8 }}
                                        className="absolute w-24 h-24 bg-red-500 rounded-full blur-3xl pointer-events-none"
                                        style={{
                                            left: `${BODY_PARTS.find(p => p.id === selectedPart)?.x}%`,
                                            top: `${BODY_PARTS.find(p => p.id === selectedPart)?.y}%`,
                                            transform: 'translate(-50%, -50%)'
                                        }}
                                    />
                                )}
                                <div className="absolute bottom-4 left-4 flex items-center gap-2 text-[10px] text-white/40 font-bold">
                                    <Info className="w-3 h-3" />
                                    <span>진단이 아닌 ‘패턴 정리’ 결과입니다.</span>
                                </div>
                            </div>

                            {/* Summary Card */}
                            <div className="space-y-6">
                                <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-4">
                                    <h4 className="text-cyan-400 text-sm font-bold flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" /> 주요 불편 보고서
                                    </h4>
                                    <dl className="space-y-3">
                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                            <dt className="text-white/40 text-xs">불편 부위</dt>
                                            <dd className="text-white text-sm font-bold">{BODY_PARTS.find(p => p.id === selectedPart)?.label}</dd>
                                        </div>
                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                            <dt className="text-white/40 text-xs">통증 강도</dt>
                                            <dd className="text-white text-sm font-bold">{intensity} / 10</dd>
                                        </div>
                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                            <dt className="text-white/40 text-xs">악화 상황</dt>
                                            <dd className="text-white text-sm font-bold">{situation}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-white/40 text-xs">지속 기간</dt>
                                            <dd className="text-white text-sm font-bold">{period}</dd>
                                        </div>
                                    </dl>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-white text-sm font-bold">상담 질문 리스트</h4>
                                    <div className="space-y-2">
                                        {QUESTIONS.slice(0, 2).map((q, i) => (
                                            <div key={i} className="bg-white/5 p-3 rounded-xl border border-white/5 text-xs text-white/70 leading-relaxed flex gap-3">
                                                <span className="text-cyan-500 font-bold">{i + 1}.</span>
                                                {q}
                                            </div>
                                        ))}
                                        <div className="relative group">
                                            <div className="bg-white/5 p-4 rounded-xl border border-dashed border-white/20 text-xs text-white/20 select-none blur-[2px]">
                                                {QUESTIONS[2]}
                                            </div>
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl backdrop-blur-[1px]">
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full border border-white/20 shadow-lg">
                                                    <Lock className="w-3 h-3 text-cyan-400" />
                                                    <span className="text-[10px] text-white font-bold">로그인 후 12개 더 보기</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 pt-4">
                            <a
                                href={`/login?redirect=/healthcare/orthopedics#session-simulation`}
                                className="w-full py-4 bg-cyan-500 text-white font-black text-center rounded-xl hover:bg-cyan-600 transition-all shadow-lg shadow-cyan-500/20"
                            >
                                전체 상담 질문 및 리포트 보기
                            </a>
                            <button
                                onClick={() => {
                                    const el = document.getElementById('session-clinic-search');
                                    el?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="w-full py-4 bg-white/5 text-white/80 font-bold text-center rounded-xl hover:bg-white/10 transition-all"
                            >
                                유명한 정형외과 병원 찾기
                            </button>
                        </div>

                        <p className="text-[10px] text-white/30 text-center leading-relaxed">
                            본 기능은 일반 정보 제공을 위한 것이며 진단/처방이 아닙니다. <br />
                            증상이 지속되거나 심하면 의료진 상담을 권장합니다.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
