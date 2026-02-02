"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, Thermometer, Clock, CheckCircle2, AlertCircle, Sparkles, Lock, ArrowRight, Activity, Calendar, Baby } from "lucide-react";
import Link from "next/link";

const DURATIONS = ["오늘 (1일차)", "3일 이내", "1주일 이내", "2주일 이상"];
const SYMPTOMS = ["기침", "콧물", "인후통", "구토/설사", "발진", "복통", "귀 통증"];
const CONDITIONS = [
    { id: 'meal', label: '식사/수분', options: ['양호', '감소', '거부'] },
    { id: 'sleep', label: '수면', options: ['양호', '자주 깸', '못 잠'] },
    { id: 'activity', label: '활동성', options: ['평소와 같음', '처짐/감소'] },
];

export default function SymptomTimelineSimulation() {
    const [step, setStep] = useState<'intro' | 'input' | 'analyzing' | 'result'>('intro');
    const [inputStep, setInputStep] = useState(0); // 0: Duration, 1: Fever, 2: Symptoms, 3: Condition

    // Form Stats
    const [duration, setDuration] = useState("");
    const [fever, setFever] = useState(36.5);
    const [isFever, setIsFever] = useState(false);
    const [usedAntipyretic, setUsedAntipyretic] = useState(false);
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
    const [conditionStatus, setConditionStatus] = useState<Record<string, string>>({});

    const handleStart = () => setStep('input');

    const toggleSymptom = (s: string) => {
        setSelectedSymptoms(prev =>
            prev.includes(s) ? prev.filter(i => i !== s) : [...prev, s]
        );
    };

    const handleConditionChange = (id: string, val: string) => {
        setConditionStatus(prev => ({ ...prev, [id]: val }));
    };

    const goNextInput = () => {
        if (inputStep < 3) setInputStep(prev => prev + 1);
        else {
            setStep('analyzing');
            setTimeout(() => setStep('result'), 1500);
        }
    };

    const goPrevInput = () => {
        if (inputStep > 0) setInputStep(prev => prev - 1);
        else setStep('intro');
    };

    // Validation
    const isStepValid = () => {
        if (inputStep === 0) return !!duration;
        if (inputStep === 1) return true; // Fever defaults are fine
        if (inputStep === 2) return selectedSymptoms.length > 0;
        if (inputStep === 3) return Object.keys(conditionStatus).length === 3;
        return false;
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-black/40 backdrop-blur-xl rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl min-h-[600px] flex flex-col">
            <AnimatePresence mode="wait">
                {step === 'intro' && (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8"
                    >
                        <div className="w-20 h-20 bg-yellow-400/20 rounded-3xl flex items-center justify-center border border-yellow-400/30">
                            <ClipboardList className="w-10 h-10 text-yellow-400" />
                        </div>
                        <div className="space-y-4">
                            <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold text-white/60 tracking-widest border border-white/10">AI SIMULATION</span>
                            <h2 className="text-3xl font-black text-white tracking-tight">1분 증상 타임라인 만들기</h2>
                            <p className="text-white/60 text-lg leading-relaxed">
                                열·증상·복약을 기록하면 <br />
                                진료용 요약 카드가 생성됩니다.
                            </p>
                        </div>
                        <div className="w-full p-6 bg-white/5 rounded-2xl border border-white/10 text-center space-y-2">
                            <Baby className="w-6 h-6 text-white/40 mx-auto mb-2" />
                            <p className="text-white/80 font-bold text-sm">사진 없이도 가능합니다.</p>
                            <p className="text-white/40 text-xs">체크만 해주세요, 정리는 AI가 해드릴게요.</p>
                        </div>
                        <button
                            onClick={handleStart}
                            className="w-full py-5 bg-yellow-400 text-black font-black text-xl rounded-2xl hover:bg-yellow-300 transition-all shadow-xl shadow-yellow-400/20 active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Clock className="w-5 h-5" />
                            타임라인 기록 시작하기
                        </button>
                        <p className="text-[10px] text-white/30">
                            * 진단/처방이 아니며 진료 준비를 위한 기록 기능입니다.
                        </p>
                    </motion.div>
                )}

                {step === 'input' && (
                    <motion.div
                        key="input"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex-1 flex flex-col p-8"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-bold text-white">
                                {inputStep === 0 && "언제부터 아픈가요?"}
                                {inputStep === 1 && "열이 있나요?"}
                                {inputStep === 2 && "어떤 증상이 있나요?"}
                                {inputStep === 3 && "아이 컨디션은 어떤가요?"}
                            </h3>
                            <span className="text-yellow-400 font-mono text-sm">STEP {inputStep + 1}/4</span>
                        </div>

                        <div className="flex-1 space-y-6">
                            {/* STEP 0: Duration */}
                            {inputStep === 0 && (
                                <div className="grid grid-cols-1 gap-3">
                                    {DURATIONS.map(d => (
                                        <button
                                            key={d}
                                            onClick={() => setDuration(d)}
                                            className={`p-4 rounded-xl border text-left transition-all font-bold ${duration === d
                                                    ? 'bg-yellow-400 border-yellow-400 text-black shadow-lg'
                                                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                                                }`}
                                        >
                                            {d}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* STEP 1: Fever */}
                            {inputStep === 1 && (
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span className="text-white/60 text-sm">현재 체온</span>
                                            <span className="text-2xl font-black text-white">{fever.toFixed(1)}°C</span>
                                        </div>
                                        <input
                                            type="range" min="36.0" max="41.0" step="0.1"
                                            value={fever}
                                            onChange={(e) => {
                                                const val = parseFloat(e.target.value);
                                                setFever(val);
                                                setIsFever(val >= 37.5);
                                            }}
                                            className="w-full h-4 bg-white/10 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                                        />
                                        <div className="flex justify-between text-[10px] text-white/30 uppercase font-bold">
                                            <span>정상(36.5)</span>
                                            <span>미열(37.5)</span>
                                            <span>고열(39.0+)</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setUsedAntipyretic(!usedAntipyretic)}
                                        className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${usedAntipyretic
                                                ? 'bg-yellow-400/20 border-yellow-400 text-yellow-400'
                                                : 'bg-white/5 border-white/10 text-white/40'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${usedAntipyretic ? 'border-yellow-400 bg-yellow-400' : 'border-white/40'}`}>
                                                {usedAntipyretic && <CheckCircle2 className="w-3 h-3 text-black" />}
                                            </div>
                                            <span className="font-bold">해열제 복용함</span>
                                        </div>
                                    </button>
                                </div>
                            )}

                            {/* STEP 2: Symptoms */}
                            {inputStep === 2 && (
                                <div className="grid grid-cols-2 gap-3">
                                    {SYMPTOMS.map(s => (
                                        <button
                                            key={s}
                                            onClick={() => toggleSymptom(s)}
                                            className={`p-4 rounded-xl border transition-all font-bold text-sm ${selectedSymptoms.includes(s)
                                                    ? 'bg-yellow-400 border-yellow-400 text-black shadow-lg'
                                                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* STEP 3: Condition */}
                            {inputStep === 3 && (
                                <div className="space-y-6">
                                    {CONDITIONS.map(cond => (
                                        <div key={cond.id} className="space-y-2">
                                            <label className="text-white/60 text-xs font-bold">{cond.label}</label>
                                            <div className="flex gap-2">
                                                {cond.options.map(opt => (
                                                    <button
                                                        key={opt}
                                                        onClick={() => handleConditionChange(cond.id, opt)}
                                                        className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${conditionStatus[cond.id] === opt
                                                                ? 'bg-yellow-400/20 border-yellow-400 text-yellow-400'
                                                                : 'bg-white/5 border-white/10 text-white/40'
                                                            }`}
                                                    >
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 pt-6 mt-auto">
                            <button onClick={goPrevInput} className="px-6 py-4 bg-white/5 text-white/60 rounded-xl hover:bg-white/10 transition-all font-bold">이전</button>
                            <button
                                onClick={goNextInput}
                                disabled={!isStepValid()}
                                className={`flex-1 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${isStepValid() ? 'bg-yellow-400 text-black shadow-lg' : 'bg-white/5 text-white/20 cursor-not-allowed'
                                    }`}
                            >
                                {inputStep === 3 ? '타임라인 생성하기' : '다음 단계'}
                                {inputStep < 3 && <ArrowRight className="w-5 h-5" />}
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
                        <Activity className="w-16 h-16 text-yellow-400 animate-pulse" />
                        <p className="text-xl font-bold text-white tracking-widest text-center">
                            증상 타임라인 정리 중...
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
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-400/10 border border-yellow-400/20 rounded-full mb-3">
                                <CheckCircle2 className="w-3 h-3 text-yellow-400" />
                                <span className="text-[10px] mobile:text-xs font-bold text-yellow-400">타임라인 생성 완료</span>
                            </div>
                            <h3 className="text-2xl font-black text-white mb-1">우리아이 증상 요약</h3>
                            <p className="text-white/40 text-xs">의료진에게 이 화면을 보여주시면 도움이 됩니다.</p>
                        </div>

                        {/* Summary Card */}
                        <div className="bg-white rounded-2xl p-5 text-slate-900 shadow-xl space-y-4">
                            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 block mb-1">기간</span>
                                    <span className="text-lg font-black">{duration}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-bold text-slate-400 block mb-1">현재 체온</span>
                                    <span className={`text-lg font-black ${fever >= 38 ? 'text-red-500' : 'text-slate-900'}`}>{fever.toFixed(1)}°C</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 block mb-1">주요 증상</span>
                                    <div className="flex flex-wrap gap-1">
                                        {selectedSymptoms.map(s => (
                                            <span key={s} className="px-2 py-1 bg-slate-100 rounded-md text-xs font-bold text-slate-600">{s}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="bg-slate-50 p-2 rounded-lg text-center">
                                        <span className="text-[10px] text-slate-400 block">식사/수분</span>
                                        <span className="text-xs font-bold">{conditionStatus['meal']}</span>
                                    </div>
                                    <div className="bg-slate-50 p-2 rounded-lg text-center">
                                        <span className="text-[10px] text-slate-400 block">수면</span>
                                        <span className="text-xs font-bold">{conditionStatus['sleep']}</span>
                                    </div>
                                    <div className="bg-slate-50 p-2 rounded-lg text-center">
                                        <span className="text-[10px] text-slate-400 block">활동성</span>
                                        <span className={`text-xs font-bold ${conditionStatus['activity'].includes('처짐') ? 'text-red-500' : ''}`}>{conditionStatus['activity']}</span>
                                    </div>
                                </div>
                                {usedAntipyretic && (
                                    <div className="bg-blue-50 p-2 rounded-lg flex items-center gap-2 text-xs font-bold text-blue-600">
                                        <Clock className="w-3 h-3" />
                                        해열제 복용함
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Locked Content */}
                        <div className="space-y-3 pt-2">
                            <h4 className="text-white text-sm font-bold flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-yellow-400" />
                                의료진 예상 질문 리스트
                            </h4>
                            <div className="space-y-2">
                                <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-xs text-white/70 leading-relaxed">
                                    1. 해열제 교차 복용이 필요했나요?
                                </div>
                                <div className="relative group">
                                    <div className="bg-white/5 p-4 rounded-xl border border-dashed border-white/20 text-xs text-white/20 select-none blur-[2px]">
                                        2. 최근 어린이집/학교에 유행하는 질병이 있나요?
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl backdrop-blur-[1px]">
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full border border-white/20 shadow-lg">
                                            <Lock className="w-3 h-3 text-yellow-400" />
                                            <span className="text-[10px] text-white font-bold">로그인 후 전체 보기</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2 space-y-3">
                            <a
                                href={`/login?redirect=/healthcare/pediatrics#timeline-result`}
                                className="w-full py-4 bg-yellow-400 text-black font-black text-center rounded-xl hover:bg-yellow-300 transition-all shadow-lg shadow-yellow-400/20"
                            >
                                질문 리스트 전체 보기
                            </a>
                            <p className="text-[10px] text-white/30 text-center">
                                * 로그인 시 타임라인을 저장하고 추적할 수 있습니다.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
