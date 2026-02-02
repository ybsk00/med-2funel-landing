"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { X, ChevronRight, ChevronLeft, CheckCircle, Zap, Activity, Shield, AlertTriangle, Battery, User } from "lucide-react";

type UrologyCheckModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onComplete?: (summary: string) => void;
};

// 비뇨기과 진료 카테고리
const UROLOGY_CATEGORIES = [
    { id: 'performance', label: '남성운영/활력', desc: '자신감 회복·갱년기', icon: <Battery className="w-8 h-8 text-yellow-500" /> },
    { id: 'prostate', label: '전립선/배뇨', desc: '잦은소변·잔뇨감·야간뇨', icon: <Activity className="w-8 h-8 text-orange-400" /> },
    { id: 'stone', label: '요로결석/통증', desc: '옆구리통증·혈뇨·응급', icon: <AlertTriangle className="w-8 h-8 text-red-500" /> },
    { id: 'infection', label: '성병/염증', desc: '가려움·분비물·따가움', icon: <Shield className="w-8 h-8 text-emerald-400" /> },
    { id: 'wedding', label: '웨딩검진', desc: '예비신랑 필수검진', icon: <User className="w-8 h-8 text-blue-400" /> },
    { id: 'surgery', label: '수술상담', desc: '확대·정관·포경', icon: <Zap className="w-8 h-8 text-purple-400" /> }
];

// 증상
const SYMPTOM_OPTIONS = [
    { id: 'weak_stream', label: '소변 줄기 약함' },
    { id: 'freq', label: '자주 마려움(빈뇨)' },
    { id: 'pain', label: '배뇨 시 통증' },
    { id: 'blood', label: '피가 섞여 나옴' },
    { id: 'night', label: '밤에 깸(야간뇨)' },
    { id: 'pain_side', label: '옆구리/하복부 통증' },
    { id: 'itch', label: '가려움/분비물' },
    { id: 'weakness', label: '활력 저하/발기부전' }
];

// 기간
const DURATION_OPTIONS = [
    { id: 'sudden', label: '갑자기 발생' },
    { id: 'few_days', label: '며칠 됨' },
    { id: 'month', label: '한 달 정도' },
    { id: 'long', label: '오래 지속됨' }
];

// 프라이버시 옵션 (비뇨기과 특화)
const PRIVACY_OPTIONS = [
    { id: 'normal', label: '일반 상담' },
    { id: 'private', label: '비밀 보장 원함' },
    { id: 'female_staff_x', label: '남성 의료진만 희망' },
    { id: 'vip', label: '1인 대기실 희망' }
];

export default function UrologyCheckModal({ isOpen, onClose, onComplete }: UrologyCheckModalProps) {
    const [step, setStep] = useState(1);
    const [category, setCategory] = useState('');
    const [symptoms, setSymptoms] = useState<string[]>([]);
    const [duration, setDuration] = useState('');
    const [privacy, setPrivacy] = useState<string[]>([]);
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
        const categoryLabel = UROLOGY_CATEGORIES.find(c => c.id === category)?.label || category;
        const symptomLabels = SYMPTOM_OPTIONS.filter(s => symptoms.includes(s.id)).map(s => s.label).join(', ') || '미선택';
        const durationLabel = DURATION_OPTIONS.find(d => d.id === duration)?.label || duration;
        const privacyLabels = PRIVACY_OPTIONS.filter(p => privacy.includes(p.id)).map(p => p.label).join(', ') || '일반';

        let summaryText = `## 비뇨의학과 상담 신청서\n\n`;
        summaryText += `**관심 분야**: ${categoryLabel}\n`;
        summaryText += `**주요 증상**: ${symptomLabels}\n`;
        summaryText += `**증상 기간**: ${durationLabel}\n\n`;
        summaryText += `**요청 사항**: ${privacyLabels}\n`;

        if (memo) {
            summaryText += `**추가 메모**: ${memo}\n\n`;
        }

        summaryText += `---\n\n`;
        summaryText += `> 🔒 고객님의 프라이버시는 철저히 보호됩니다.`;

        return summaryText;
    };

    const handleComplete = () => {
        const generatedSummary = generateSummary();
        setSummary(generatedSummary);
        setStep(6);
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
        setPrivacy([]);
        setMemo('');
        setSummary('');
        onClose();
    };

    const canProceed = () => {
        switch (step) {
            case 1: return !!category;
            case 2: return symptoms.length > 0;
            case 3: return !!duration;
            case 4: return true;
            case 5: return true;
            default: return true;
        }
    };

    if (!isOpen) return null;

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-[#121212] rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col border border-amber-900/50">
                {/* Header */}
                <div className="bg-[#1a1a1a] p-4 flex justify-between items-center border-b border-[#333]">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-amber-500" />
                            <h3 className="font-bold text-lg text-white">프라이빗 상담 신청</h3>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">남성을 위한 1:1 맞춤 상담입니다.</p>
                    </div>
                    <button onClick={resetAndClose} className="text-gray-500 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Progress */}
                {step <= 5 && (
                    <div className="px-4 pt-4">
                        <div className="flex gap-1">
                            {Array.from({ length: totalSteps }).map((_, i) => (
                                <div key={i} className={`h-1 flex-1 rounded-full ${i < step ? 'bg-amber-600' : 'bg-[#333]'}`} />
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Step {step}/{totalSteps}</p>
                    </div>
                )}

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    {step === 1 ? (
                        <div className="space-y-4">
                            <h4 className="text-lg font-bold text-white">상담받을 항목을 선택하세요</h4>
                            <div className="grid grid-cols-2 gap-3">
                                {UROLOGY_CATEGORIES.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setCategory(cat.id)}
                                        className={`p-4 rounded-xl border-2 transition-all text-left flex flex-col items-center text-center gap-2 ${category === cat.id ? 'border-amber-600 bg-amber-900/20' : 'border-[#333] hover:border-amber-600/50 bg-[#1e1e1e]'}`}
                                    >
                                        <div className="mb-1">{cat.icon}</div>
                                        <div>
                                            <span className="text-sm font-bold text-white block">{cat.label}</span>
                                            <span className="text-xs text-gray-400">{cat.desc}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : step === 2 ? (
                        <div className="space-y-4">
                            <h4 className="text-lg font-bold text-white">주요 증상 체크</h4>
                            <p className="text-sm text-gray-500">현재 겪고 있는 증상을 모두 선택해주세요</p>
                            <div className="grid grid-cols-2 gap-2">
                                {SYMPTOM_OPTIONS.map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => handleMultiSelect(opt.id, symptoms, setSymptoms)}
                                        className={`p-3 rounded-xl border-2 transition-all ${symptoms.includes(opt.id) ? 'border-amber-600 bg-amber-900/20 text-amber-500 font-medium' : 'border-[#333] hover:border-amber-600/50 text-gray-300 bg-[#1e1e1e]'}`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : step === 3 ? (
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-lg font-bold text-white mb-3">증상 지속 기간</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {DURATION_OPTIONS.map(opt => (
                                        <button
                                            key={opt.id}
                                            onClick={() => setDuration(opt.id)}
                                            className={`p-3 rounded-xl border-2 transition-all text-sm ${duration === opt.id ? 'border-amber-600 bg-amber-900/20 text-amber-500 font-medium' : 'border-[#333] hover:border-amber-600/50 text-gray-300 bg-[#1e1e1e]'}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : step === 4 ? (
                        <div className="space-y-4">
                            <h4 className="text-lg font-bold text-white">프라이버시 및 요청사항</h4>
                            <p className="text-sm text-gray-500">편안한 진료를 위해 선택해주세요</p>
                            <div className="flex flex-col gap-2">
                                {PRIVACY_OPTIONS.map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => handleMultiSelect(opt.id, privacy, setPrivacy)}
                                        className={`p-4 rounded-xl border-2 transition-all text-left flex items-center justify-between ${privacy.includes(opt.id) ? 'border-amber-600 bg-amber-900/20 text-amber-500' : 'border-[#333] hover:border-amber-600/50 text-gray-300 bg-[#1e1e1e]'}`}
                                    >
                                        <span className="font-medium">{opt.label}</span>
                                        {privacy.includes(opt.id) && <CheckCircle className="w-5 h-5" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : step === 5 ? (
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-sm font-medium text-gray-400 mb-2">원장님께 남길 메모 (선택)</h4>
                                <textarea
                                    value={memo}
                                    onChange={(e) => setMemo(e.target.value)}
                                    placeholder="말하기 곤란한 내용이 있다면 여기에 적어주세요."
                                    className="w-full p-3 border-2 border-[#333] bg-[#1a1a1a] text-white placeholder-gray-600 rounded-xl focus:border-amber-600 focus:outline-none resize-none h-32 text-sm"
                                />
                            </div>
                        </div>
                    ) : step === 6 ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <CheckCircle className="w-6 h-6 text-amber-500" />
                                <h4 className="text-lg font-bold text-white">신청서 작성 완료</h4>
                            </div>
                            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#333] text-sm text-gray-300 whitespace-pre-wrap">
                                {summary.replace(/##/g, '').replace(/\*\*/g, '').replace(/>/g, '')}
                            </div>

                            <div className="space-y-2">
                                <button
                                    onClick={resetAndClose}
                                    className="w-full py-3 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition-colors shadow-[0_0_15px_rgba(217,119,6,0.3)]"
                                >
                                    상담 시작하기 (전송)
                                </button>
                            </div>
                        </div>
                    ) : null}
                </div>

                {/* Footer */}
                {step <= 5 && (
                    <div className="p-4 border-t border-[#333]">
                        <div className="flex gap-3">
                            {step > 1 && (
                                <button
                                    onClick={handleBack}
                                    className="flex-1 py-3 border border-[#333] text-gray-400 rounded-xl font-medium hover:bg-[#333] transition-colors flex items-center justify-center gap-2"
                                >
                                    <ChevronLeft size={18} /> 이전
                                </button>
                            )}
                            <button
                                onClick={handleNext}
                                disabled={!canProceed()}
                                className="flex-1 py-3 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
