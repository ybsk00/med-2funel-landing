"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { X, ChevronRight, ChevronLeft, CheckCircle, Thermometer, Activity, Pill, HeartPulse, Stethoscope, ClipboardList } from "lucide-react";

type InternalMedicineCheckModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onComplete?: (summary: string) => void;
};

// 내과 진료 카테고리
const INTERNAL_CATEGORIES = [
    { id: 'respiratory', label: '감기·호흡기', desc: '기침·가래·목아픔', icon: <Thermometer className="w-8 h-8 text-blue-400" /> },
    { id: 'digestive', label: '소화·위장', desc: '속쓰림·복통·설사', icon: <Pill className="w-8 h-8 text-emerald-400" /> },
    { id: 'fatigue', label: '피로·수액', desc: '만성피로·영양주사', icon: <Activity className="w-8 h-8 text-yellow-400" /> },
    { id: 'chronic', label: '만성질환', desc: '고혈압·당뇨·고지혈', icon: <HeartPulse className="w-8 h-8 text-red-400" /> },
    { id: 'checkup', label: '건강검진', desc: '혈액검사·초음파', icon: <ClipboardList className="w-8 h-8 text-purple-400" /> },
    { id: 'other', label: '기타/일반', desc: '예방접종·진단서', icon: <Stethoscope className="w-8 h-8 text-gray-400" /> }
];

// 주요 증상 (카테고리별 동적 변경 가능하지만 일단 통합)
const SYMPTOM_OPTIONS = [
    { id: 'fever', label: '발열/오한' },
    { id: 'cough', label: '기침/가래' },
    { id: 'pain', label: '통증/몸살' },
    { id: 'indigestion', label: '소화불량/체함' },
    { id: 'tired', label: '무기력/피로' },
    { id: 'dizziness', label: '어지러움' },
    { id: 'checkup_req', label: '검진 희망' },
    { id: 'consult', label: '상담 필요' }
];

// 증상 기간
const DURATION_OPTIONS = [
    { id: 'today', label: '오늘 시작' },
    { id: 'few_days', label: '2-3일 전' },
    { id: 'week', label: '1주일 정도' },
    { id: 'chronic', label: '오래 지속됨' }
];

// 과거력/복용약
const HISTORY_OPTIONS = [
    { id: 'none', label: '특이사항 없음' },
    { id: 'hypertension', label: '고혈압' },
    { id: 'diabetes', label: '당뇨' },
    { id: 'allergy', label: '알레르기 있음' },
    { id: 'pregnant', label: '임신 가능성' }
];

export default function InternalMedicineCheckModal({ isOpen, onClose, onComplete }: InternalMedicineCheckModalProps) {
    const [step, setStep] = useState(1);
    const [category, setCategory] = useState('');
    const [symptoms, setSymptoms] = useState<string[]>([]);
    const [duration, setDuration] = useState('');
    const [history, setHistory] = useState<string[]>([]);
    const [memo, setMemo] = useState('');
    const [summary, setSummary] = useState('');

    const totalSteps = 5;

    const handleMultiSelect = (value: string, current: string[], setter: (val: string[]) => void) => {
        setter(current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value]
        );
    };

    const generateSummary = () => {
        const categoryLabel = INTERNAL_CATEGORIES.find(c => c.id === category)?.label || category;
        const symptomLabels = SYMPTOM_OPTIONS.filter(s => symptoms.includes(s.id)).map(s => s.label).join(', ') || '미선택';
        const durationLabel = DURATION_OPTIONS.find(d => d.id === duration)?.label || duration;
        const historyLabels = HISTORY_OPTIONS.filter(h => history.includes(h.id)).map(h => h.label).join(', ') || '없음';

        let summaryText = `## 내과 진료 예진표\n\n`;
        summaryText += `**진료 항목**: ${categoryLabel}\n`;
        summaryText += `**주요 증상**: ${symptomLabels}\n`;
        summaryText += `**증상 기간**: ${durationLabel}\n\n`;
        summaryText += `**과거력/참고**: ${historyLabels}\n`;

        if (memo) {
            summaryText += `**추가 메모**: ${memo}\n\n`;
        }

        summaryText += `---\n\n`;
        summaryText += `> 💡 정확한 진단은 전문의 진료 후 결정됩니다.`;

        return summaryText;
    };

    const handleComplete = () => {
        const generatedSummary = generateSummary();
        setSummary(generatedSummary);
        setStep(6); // Summary step
        onComplete?.(generatedSummary);
    };

    const handleNext = () => {
        if (step === 5) {
            handleComplete();
        } else {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const resetAndClose = () => {
        setStep(1);
        setCategory('');
        setSymptoms([]);
        setDuration('');
        setHistory([]);
        setMemo('');
        setSummary('');
        onClose();
    };

    const canProceed = () => {
        switch (step) {
            case 1: return !!category;
            case 2: return symptoms.length > 0;
            case 3: return !!duration;
            case 4: return true; // History optional
            case 5: return true; // Memo optional
            default: return true;
        }
    };

    if (!isOpen) return null;

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-[#1e293b] rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col border border-blue-900/50">
                {/* Header */}
                <div className="bg-slate-800 p-4 flex justify-between items-center border-b border-slate-700">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <Stethoscope className="w-5 h-5 text-blue-400" />
                            <h3 className="font-bold text-lg text-white">내과 예진 작성</h3>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">빠르고 정확한 진료를 위한 기초 설문입니다.</p>
                    </div>
                    <button onClick={resetAndClose} className="text-slate-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Progress */}
                {step <= 5 && (
                    <div className="px-4 pt-4">
                        <div className="flex gap-1">
                            {Array.from({ length: totalSteps }).map((_, i) => (
                                <div key={i} className={`h-1 flex-1 rounded-full ${i < step ? 'bg-blue-500' : 'bg-slate-700'}`} />
                            ))}
                        </div>
                        <p className="text-xs text-slate-400 mt-2">단계 {step}/{totalSteps}</p>
                    </div>
                )}

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    {step === 1 ? (
                        <div className="space-y-4">
                            <h4 className="text-lg font-bold text-white">어디가 불편하신가요?</h4>
                            <div className="grid grid-cols-2 gap-3">
                                {INTERNAL_CATEGORIES.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setCategory(cat.id)}
                                        className={`p-4 rounded-xl border-2 transition-all text-left flex flex-col items-center text-center gap-2 ${category === cat.id ? 'border-blue-500 bg-blue-500/20' : 'border-slate-700 hover:border-blue-400 bg-slate-800/50'}`}
                                    >
                                        <div className="mb-1">{cat.icon}</div>
                                        <div>
                                            <span className="text-sm font-bold text-white block">{cat.label}</span>
                                            <span className="text-xs text-slate-400">{cat.desc}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : step === 2 ? (
                        <div className="space-y-4">
                            <h4 className="text-lg font-bold text-white">주요 증상을 선택해주세요</h4>
                            <p className="text-sm text-slate-400">복수 선택 가능</p>
                            <div className="grid grid-cols-2 gap-2">
                                {SYMPTOM_OPTIONS.map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => handleMultiSelect(opt.id, symptoms, setSymptoms)}
                                        className={`p-3 rounded-xl border-2 transition-all ${symptoms.includes(opt.id) ? 'border-blue-500 bg-blue-500/20 text-blue-300 font-medium' : 'border-slate-700 hover:border-blue-400 text-slate-300 bg-slate-800/50'}`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : step === 3 ? (
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-lg font-bold text-white mb-3">증상이 언제부터 시작되었나요?</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {DURATION_OPTIONS.map(opt => (
                                        <button
                                            key={opt.id}
                                            onClick={() => setDuration(opt.id)}
                                            className={`p-3 rounded-xl border-2 transition-all text-sm ${duration === opt.id ? 'border-blue-500 bg-blue-500/20 text-blue-300 font-medium' : 'border-slate-700 hover:border-blue-400 text-slate-300 bg-slate-800/50'}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : step === 4 ? (
                        <div className="space-y-4">
                            <h4 className="text-lg font-bold text-white">특이사항이 있으신가요?</h4>
                            <p className="text-sm text-slate-400">의료진이 알면 도움되는 정보 (복수 선택)</p>
                            <div className="flex flex-wrap gap-2">
                                {HISTORY_OPTIONS.map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => handleMultiSelect(opt.id, history, setHistory)}
                                        className={`px-4 py-2 rounded-full border-2 transition-all text-sm ${history.includes(opt.id) ? 'border-blue-500 bg-blue-500/20 text-blue-300 font-medium' : 'border-slate-700 hover:border-blue-400 text-slate-300 bg-slate-800/50'}`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : step === 5 ? (
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-sm font-medium text-slate-300 mb-2">추가 메모 (선택)</h4>
                                <textarea
                                    value={memo}
                                    onChange={(e) => setMemo(e.target.value)}
                                    placeholder="예: 어제 저녁부터 열이 나요."
                                    className="w-full p-3 border-2 border-slate-700 bg-slate-800 text-white placeholder-slate-500 rounded-xl focus:border-blue-500 focus:outline-none resize-none h-32 text-sm"
                                />
                            </div>
                        </div>
                    ) : step === 6 ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <CheckCircle className="w-6 h-6 text-blue-400" />
                                <h4 className="text-lg font-bold text-white">예진표 작성 완료</h4>
                            </div>
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-sm text-slate-300 whitespace-pre-wrap">
                                {summary.replace(/##/g, '').replace(/\*\*/g, '').replace(/>/g, '')}
                            </div>
                            <p className="text-xs text-slate-400 text-center">
                                AI에게 이 내용을 전달하여 상담을 이어가시겠습니까?
                            </p>
                            <div className="space-y-2">
                                <button
                                    onClick={resetAndClose}
                                    className="w-full py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
                                >
                                    상담 시작하기
                                </button>
                            </div>
                        </div>
                    ) : null}
                </div>

                {/* Footer */}
                {step <= 5 && (
                    <div className="p-4 border-t border-slate-700">
                        <div className="flex gap-3">
                            {step > 1 && (
                                <button
                                    onClick={handleBack}
                                    className="flex-1 py-3 border border-slate-600 text-slate-300 rounded-xl font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                                >
                                    <ChevronLeft size={18} /> 이전
                                </button>
                            )}
                            <button
                                onClick={handleNext}
                                disabled={!canProceed()}
                                className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {step === 5 ? '완료' : '다음'} <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    if (typeof document !== 'undefined') {
        return createPortal(modalContent, document.body);
    }
    return modalContent;
}
