"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Brain, Thermometer, Droplets, CheckCircle2, Lock, ArrowRight, ClipboardList, Loader2, RefreshCcw } from "lucide-react";

// Questions mapping to 4 axes: Heat, Dampness, Tension, Fatigue
// Each question gives points to one or more axes.
const QUESTIONS = [
    { id: 1, text: "얼굴이나 머리로 열이 확 오르는 느낌이 자주 드나요?", axis: 'heat', weight: 2 },
    { id: 2, text: "손발이 차갑고 추위를 많이 타는 편인가요?", axis: 'heat', weight: -2 }, // Cold implies Low Heat score (or separate?) Let's do Bipolar: 0(Cold) - 5(Balance) - 10(Heat)
    { id: 3, text: "식사 후 속이 자주 더부룩하거나 소화가 안 되나요?", axis: 'damp', weight: 2 },
    { id: 4, text: "몸이 무겁고 아침에 일어날 때 부종이 심한가요?", axis: 'damp', weight: 2 },
    { id: 5, text: "평소 목이나 어깨가 뻣뻣하고 잘 뭉치나요?", axis: 'tension', weight: 2 },
    { id: 6, text: "사소한 일에도 예민해지거나 가슴이 답답한가요?", axis: 'tension', weight: 2 },
    { id: 7, text: "오후만 되면 급격히 체력이 떨어지나요?", axis: 'fatigue', weight: 2 },
    { id: 8, text: "충분히 자도 피로가 풀리지 않나요?", axis: 'fatigue', weight: 2 },
    // More questions for better granularity
    { id: 9, text: "갈증을 자주 느끼고 찬물을 좋아하나요?", axis: 'heat', weight: 1 },
    { id: 10, text: "비오는 날이면 몸이 더 처지거나 관절이 쑤시나요?", axis: 'damp', weight: 1 },
    { id: 11, text: "잠들기 어렵거나 자다가 자주 깨나요?", axis: 'tension', weight: 1 },
    { id: 12, text: "말하기 귀찮을 정도로 기운이 없나요?", axis: 'fatigue', weight: 1 },
];

export default function FourAxisBalanceSimulation() {
    const [step, setStep] = useState<'intro' | 'survey' | 'analyzing' | 'result'>('intro');
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({}); // id -> score (0-5)

    // Axes Scores: 0-100
    // Heat: 0(Very Cold) - 50(Balanced) - 100(Very Hot)
    // Damp: 0(Dry) - 50(Balanced) - 100(Very Damp)
    // Tension: 0(Relaxed) - 100(Very Tense)
    // Fatigue: 0(Energetic) - 100(Exhausted)
    const [scores, setScores] = useState({ heat: 50, damp: 50, tension: 0, fatigue: 0 });

    const handleAnswer = (score: number) => {
        const q = QUESTIONS[currentQIndex];
        setAnswers(prev => ({ ...prev, [q.id]: score }));

        // Advance
        if (currentQIndex < QUESTIONS.length - 1) {
            setCurrentQIndex(prev => prev + 1);
        } else {
            calculateResults({ ...answers, [q.id]: score });
            setStep('analyzing');
            setTimeout(() => setStep('result'), 1500);
        }
    };

    const calculateResults = (finalAnswers: Record<number, number>) => {
        // Simple logic for illustration
        let heat = 50;
        let damp = 30; // Base damp level
        let tension = 10;
        let fatigue = 10;

        QUESTIONS.forEach(q => {
            const val = finalAnswers[q.id] || 0; // 0=No, 1=Yes (simplified button logic below)
            // Let's assume buttons are: "그렇다(1)", "아니다(0)" or Likert?
            // User asked for "Check". Let's use Yes/No for speed.

            if (val === 1) { // User said YES
                if (q.axis === 'heat') heat += (q.weight * 10);
                if (q.axis === 'damp') damp += (q.weight * 10);
                if (q.axis === 'tension') tension += (q.weight * 10);
                if (q.axis === 'fatigue') fatigue += (q.weight * 10);
            }
        });

        // Clamp
        const clamp = (n: number) => Math.min(100, Math.max(0, n));
        setScores({
            heat: clamp(heat),
            damp: clamp(damp),
            tension: clamp(tension),
            fatigue: clamp(fatigue)
        });
    };

    // Radar Chart SVG
    const RadarChart = ({ data }: { data: typeof scores }) => {
        // 4 axes: Top(Heat), Right(Tension), Bottom(Damp), Left(Fatigue) - arbitrary mapping
        // Center (50, 50), Radius 40.
        // Heat (0-100) -> 50 is balance. But for "4 Axis Balance Map", we usually plot "Imbalance magnitude".
        // Let's plot the raw scores on 4 axes.
        const scale = (val: number) => 10 + (val / 100) * 40; // min 10 radius, max 50 radius? No.
        // Let's use 0-100 map to 0-45 radius.
        const r = (val: number) => (val / 100) * 45;

        // Coordinates
        // Axis 1 (Top): Heat
        const p1 = { x: 50, y: 50 - r(data.heat) };
        // Axis 2 (Right): Tension
        const p2 = { x: 50 + r(data.tension), y: 50 };
        // Axis 3 (Bottom): Damp
        const p3 = { x: 50, y: 50 + r(data.damp) };
        // Axis 4 (Left): Fatigue
        const p4 = { x: 50 - r(data.fatigue), y: 50 };

        const path = `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`;

        return (
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl overflow-visible">
                {/* Background Grid */}
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="33.75" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="22.5" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="11.25" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />

                {/* Axes Lines */}
                <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />

                {/* Labels */}
                <text x="50" y="4" textAnchor="middle" fontSize="4" fill="#fb923c" fontWeight="bold">열(Heat)</text>
                <text x="96" y="51" textAnchor="start" fontSize="4" fill="#fb923c" fontWeight="bold">긴장(Tension)</text>
                <text x="50" y="99" textAnchor="middle" fontSize="4" fill="#fb923c" fontWeight="bold">습(Damp)</text> // '습' or '냉' usually opposite heat. But let's follow user 4-axis for visualization.
                <text x="4" y="51" textAnchor="end" fontSize="4" fill="#fb923c" fontWeight="bold">피로(Fatigue)</text>

                {/* Data Polygon */}
                <polygon points={path} fill="rgba(251, 146, 60, 0.5)" stroke="#fb923c" strokeWidth="2" />
                <circle cx={p1.x} cy={p1.y} r="1.5" fill="white" />
                <circle cx={p2.x} cy={p2.y} r="1.5" fill="white" />
                <circle cx={p3.x} cy={p3.y} r="1.5" fill="white" />
                <circle cx={p4.x} cy={p4.y} r="1.5" fill="white" />
            </svg>
        );
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-black/40 backdrop-blur-xl rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl min-h-[500px] flex flex-col">
            <AnimatePresence mode="wait">
                {step === 'intro' && (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8"
                    >
                        <div className="w-20 h-20 bg-orange-500/20 rounded-3xl flex items-center justify-center border border-orange-500/30">
                            <Brain className="w-10 h-10 text-orange-400" />
                        </div>
                        <div className="space-y-4">
                            <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold text-white/60 tracking-widest border border-white/10">AI SIMULATION</span>
                            <h2 className="text-3xl font-black text-white tracking-tight">내 컨디션 4축 밸런스 맵</h2>
                            <p className="text-white/60 text-lg leading-relaxed">
                                1~2분 설문으로 내 컨디션 패턴을 정리하고,<br />
                                상담에서 필요한 질문을 자동으로 만들어드립니다.
                            </p>
                        </div>
                        <div className="w-full p-6 bg-white/5 rounded-2xl border border-white/10 text-center space-y-2">
                            <ClipboardList className="w-6 h-6 text-white/40 mx-auto mb-2" />
                            <p className="text-white/80 font-bold text-sm">사진 없이 가능합니다.</p>
                            <p className="text-white/40 text-xs">생활 습관과 컨디션을 체크해 주세요.</p>
                        </div>
                        <button
                            onClick={() => setStep('survey')}
                            className="w-full py-5 bg-orange-500 text-white font-black text-xl rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Activity className="w-5 h-5" />
                            4축 밸런스 체크하기
                        </button>
                        <p className="text-[10px] text-white/30">
                            * 본 기능은 진단이 아닌 상담 준비용 정보입니다.
                        </p>
                    </motion.div>
                )}

                {step === 'survey' && (
                    <motion.div
                        key="survey"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex-1 flex flex-col p-8"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-bold text-white">
                                나의 상태를 체크해주세요
                            </h3>
                            <span className="text-orange-400 font-mono text-sm">Q{currentQIndex + 1}/{QUESTIONS.length}</span>
                        </div>

                        <div className="flex-1 flex flex-col justify-center space-y-8">
                            <h2 className="text-2xl font-bold text-white leading-relaxed text-center">
                                "{QUESTIONS[currentQIndex].text}"
                            </h2>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => handleAnswer(1)}
                                    className="py-6 rounded-2xl border border-orange-500/50 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 font-bold text-lg transition-all"
                                >
                                    그렇다
                                </button>
                                <button
                                    onClick={() => handleAnswer(0)}
                                    className="py-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 font-bold text-lg transition-all"
                                >
                                    아니다
                                </button>
                            </div>
                        </div>

                        <div className="pt-8 text-center">
                            <button onClick={() => setStep('intro')} className="text-white/40 text-xs underline">
                                처음으로 돌아가기
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 'analyzing' && (
                    <motion.div
                        key="analyzing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col items-center justify-center p-12 space-y-6"
                    >
                        <Loader2 className="w-16 h-16 text-orange-400 animate-spin" />
                        <p className="text-xl font-bold text-white tracking-widest text-center">
                            4축 밸런스 분석 중...
                        </p>
                    </motion.div>
                )}

                {step === 'result' && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex-1 flex flex-col p-8 space-y-6 h-full overflow-y-auto custom-scrollbar"
                    >
                        <div className="text-center pb-4 border-b border-white/10">
                            <span className="px-3 py-1 bg-orange-400/10 border border-orange-400/20 rounded-full text-[10px] font-bold text-orange-400 mb-3 inline-block">
                                분석 완료
                            </span>
                            <h3 className="text-2xl font-black text-white mb-1">나의 4축 밸런스 맵</h3>
                        </div>

                        {/* Radar Chart */}
                        <div className="relative aspect-square max-w-[280px] mx-auto">
                            <RadarChart data={scores} />
                        </div>

                        {/* Summary Card */}
                        <div className="bg-white/10 rounded-2xl p-5 border border-white/10 space-y-3">
                            <h4 className="text-orange-400 text-sm font-bold flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                밸런스 요약
                            </h4>
                            <p className="text-white/80 text-sm leading-relaxed">
                                {scores.tension > 60 && "긴장도가 다소 높은 상태입니다. "}
                                {scores.fatigue > 60 && "피로가 누적되어 휴식이 필요해 보입니다. "}
                                {scores.heat > 70 && "상열감이 있어 열을 내리는 습관이 필요합니다. "}
                                {(scores.tension <= 60 && scores.fatigue <= 60 && scores.heat <= 70) && "전반적으로 밸런스가 양호한 편입니다. "}
                            </p>
                        </div>

                        {/* Locked Content */}
                        <div className="space-y-3 pt-2">
                            <h4 className="text-white text-sm font-bold flex items-center gap-2">
                                <ClipboardList className="w-4 h-4 text-orange-400" />
                                맞춤 상담 질문 리스트
                            </h4>
                            <div className="space-y-2">
                                <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-xs text-white/70 leading-relaxed">
                                    1. 수면의 질 개선을 위해 어떤 차(Tea)가 도움이 될까요?
                                </div>
                                <div className="relative group">
                                    <div className="bg-white/5 p-4 rounded-xl border border-dashed border-white/20 text-xs text-white/20 select-none blur-[2px]">
                                        2. 소화 불량과 피로감이 연관이 있나요?
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl backdrop-blur-[1px]">
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full border border-white/20 shadow-lg">
                                            <Lock className="w-3 h-3 text-orange-400" />
                                            <span className="text-[10px] text-white font-bold">로그인 후 전체 보기</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2 space-y-3">
                            <a
                                href={`/login?redirect=/healthcare/korean-medicine#balance-result`}
                                className="w-full py-4 bg-orange-500 text-white font-black text-center rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
                            >
                                질문 리스트 전체 보기
                            </a>
                            <p className="text-[10px] text-white/30 text-center">
                                * 로그인 시 결과를 저장하고 추적할 수 있습니다.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
