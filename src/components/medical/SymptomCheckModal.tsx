"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { X, ChevronRight, ChevronLeft, AlertTriangle, CheckCircle, ClipboardList } from "lucide-react";

type SymptomCheckModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onComplete?: (summary: string) => void;
};

// 치과 증상 카테고리
const SYMPTOM_CATEGORIES = [
    { id: 'tooth_pain', label: '치아 통증·시림', desc: '찌릿함·깨물 때 통증', icon: '🦷' },
    { id: 'gum', label: '잇몸 불편', desc: '붓기·피·통증', icon: '🩸' },
    { id: 'cavity', label: '충치 의심', desc: '파절·구멍·변색', icon: '🔍' },
    { id: 'jaw', label: '턱관절·이갈이', desc: '턱 통증·딱딱 소리', icon: '😬' },
    { id: 'breath', label: '구취·구강건조', desc: '입냄새·마름', icon: '💨' },
    { id: 'ortho', label: '교정·보철', desc: '교정장치·크라운·임플란트', icon: '🔧' }
];

// 부위 옵션
const AREA_OPTIONS = [
    { id: 'front', label: '앞니' },
    { id: 'molar', label: '어금니' },
    { id: 'gum', label: '잇몸' },
    { id: 'jaw', label: '턱관절' },
    { id: 'all', label: '전체' },
    { id: 'unknown', label: '잘 모르겠음' }
];

// 기간 옵션
const DURATION_OPTIONS = [
    { id: 'today', label: '오늘' },
    { id: '2_3_days', label: '2~3일' },
    { id: '1_week', label: '1주 이상' },
    { id: '1_month', label: '1개월 이상' },
    { id: 'recurring', label: '반복됨' }
];

// 빈도 옵션
const FREQUENCY_OPTIONS = [
    { id: 'sometimes', label: '가끔' },
    { id: 'once_twice', label: '하루 1~2회' },
    { id: 'daily', label: '매일' },
    { id: 'always', label: '지속됨' }
];

// 트리거 옵션
const TRIGGER_OPTIONS = [
    { id: 'cold_hot', label: '차가운/뜨거운 음식' },
    { id: 'sweet', label: '단 음식' },
    { id: 'chewing', label: '씹을 때' },
    { id: 'rest', label: '가만히 있어도' },
    { id: 'brushing', label: '양치할 때' },
    { id: 'morning', label: '아침에 심함' },
    { id: 'night', label: '밤에 심함' },
    { id: 'unknown', label: '잘 모르겠음' }
];

// 동반 증상 옵션
const ACCOMPANYING_OPTIONS = [
    { id: 'swelling', label: '붓기' },
    { id: 'bleeding', label: '출혈' },
    { id: 'heat', label: '열감' },
    { id: 'open_mouth', label: '입 벌리기 어려움' },
    { id: 'swallow', label: '삼키기 어려움' },
    { id: 'asymmetry', label: '얼굴 비대칭' },
    { id: 'pus', label: '고름/악취' },
    { id: 'fever', label: '발열' }
];

// 치과 레드플래그
const RED_FLAGS = [
    { id: 'breathing', label: '호흡 곤란' },
    { id: 'swallowing', label: '삼킴 곤란' },
    { id: 'face_swelling', label: '얼굴이 급격히 붓는 경우' },
    { id: 'high_fever', label: '고열 동반 (38°C 이상)' },
    { id: 'severe_bleeding', label: '심한 출혈' },
    { id: 'open_mouth_hard', label: '입 벌리기 매우 어려움' }
];

export default function SymptomCheckModal({ isOpen, onClose, onComplete }: SymptomCheckModalProps) {
    const [step, setStep] = useState(1);
    const [category, setCategory] = useState('');
    const [area, setArea] = useState<string[]>([]);
    const [duration, setDuration] = useState('');
    const [frequency, setFrequency] = useState('');
    const [triggers, setTriggers] = useState<string[]>([]);
    const [severity, setSeverity] = useState(3);
    const [accompanying, setAccompanying] = useState<string[]>([]);
    const [redFlags, setRedFlags] = useState<string[]>([]);
    const [memo, setMemo] = useState('');
    const [showEmergencyWarning, setShowEmergencyWarning] = useState(false);
    const [summary, setSummary] = useState('');

    const totalSteps = 6;

    const handleMultiSelect = (value: string, current: string[], setter: (val: string[]) => void) => {
        setter(current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value]
        );
    };

    const handleRedFlagChange = (flagId: string) => {
        setRedFlags(prev =>
            prev.includes(flagId)
                ? prev.filter(f => f !== flagId)
                : [...prev, flagId]
        );
    };

    const generateSummary = () => {
        const categoryLabel = SYMPTOM_CATEGORIES.find(c => c.id === category)?.label || category;
        const areaLabels = AREA_OPTIONS.filter(a => area.includes(a.id)).map(a => a.label).join(', ') || '미선택';
        const durationLabel = DURATION_OPTIONS.find(d => d.id === duration)?.label || duration;
        const frequencyLabel = FREQUENCY_OPTIONS.find(f => f.id === frequency)?.label || frequency;
        const triggerLabels = TRIGGER_OPTIONS.filter(t => triggers.includes(t.id)).map(t => t.label).join(', ') || '미선택';
        const accompanyingLabels = ACCOMPANYING_OPTIONS.filter(a => accompanying.includes(a.id)).map(a => a.label).join(', ') || '없음';
        const selectedRedFlags = RED_FLAGS.filter(f => redFlags.includes(f.id)).map(f => f.label);

        let summaryText = `## 내 구강 불편 요약 (참고용)\n\n`;
        summaryText += `**주요 불편**: ${categoryLabel} / ${areaLabels}\n\n`;
        summaryText += `**기간/빈도**: ${durationLabel} / ${frequencyLabel}\n\n`;
        summaryText += `**유발 상황**: ${triggerLabels}\n\n`;
        summaryText += `**강도**: ${severity}/5\n\n`;
        summaryText += `**동반 증상**: ${accompanyingLabels}\n\n`;

        if (memo) {
            summaryText += `**추가 메모**: ${memo}\n\n`;
        }

        if (selectedRedFlags.length > 0) {
            summaryText += `**⚠️ 주의 증상**: ${selectedRedFlags.join(', ')}\n\n`;
        }

        summaryText += `---\n\n`;
        summaryText += `> 💡 이 정리는 진단이 아닌 **상담 시 참고용**입니다. 증상이 지속·악화되면 의료진 상담이 필요합니다.`;

        return summaryText;
    };

    const handleComplete = () => {
        const generatedSummary = generateSummary();
        setSummary(generatedSummary);

        if (redFlags.length > 0) {
            setShowEmergencyWarning(true);
        } else {
            setStep(7); // Summary step
        }

        onComplete?.(generatedSummary);
    };

    const handleNext = () => {
        if (step === 6) {
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
        setArea([]);
        setDuration('');
        setFrequency('');
        setTriggers([]);
        setSeverity(3);
        setAccompanying([]);
        setRedFlags([]);
        setMemo('');
        setShowEmergencyWarning(false);
        setSummary('');
        onClose();
    };

    const canProceed = () => {
        switch (step) {
            case 1: return !!category;
            case 2: return area.length > 0;
            case 3: return !!duration && !!frequency;
            case 4: return triggers.length > 0;
            case 5: return true;
            case 6: return true;
            default: return true;
        }
    };

    if (!isOpen) return null;

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-emerald-50 p-4 flex justify-between items-center border-b border-emerald-100">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <ClipboardList className="w-5 h-5 text-emerald-600" />
                            <h3 className="font-bold text-lg text-gray-900">구강 불편 정리</h3>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">간단한 선택으로 현재 상태를 정리합니다. (진단 아님)</p>
                    </div>
                    <button onClick={resetAndClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                {/* Progress */}
                {step <= 6 && (
                    <div className="px-4 pt-4">
                        <div className="flex gap-1">
                            {Array.from({ length: totalSteps }).map((_, i) => (
                                <div key={i} className={`h-1 flex-1 rounded-full ${i < step ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">단계 {step}/{totalSteps}</p>
                    </div>
                )}

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    {showEmergencyWarning ? (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle size={32} />
                            </div>
                            <h4 className="text-xl font-bold text-red-600 mb-2">응급 상황일 수 있습니다</h4>
                            <p className="text-gray-600 mb-4 text-sm">
                                선택하신 증상 중 응급 상황일 수 있는 항목이 있습니다.<br />
                                즉시 의료기관/응급실 상담이 필요합니다.
                            </p>
                            <div className="bg-red-50 p-4 rounded-xl border border-red-200 mb-4 text-left">
                                <p className="text-sm text-red-800 font-medium mb-2">해당 증상:</p>
                                <ul className="text-sm text-red-700 space-y-1">
                                    {redFlags.map(flagId => {
                                        const flag = RED_FLAGS.find(f => f.id === flagId);
                                        return <li key={flagId}>• {flag?.label}</li>;
                                    })}
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <button
                                    onClick={() => window.location.href = 'tel:119'}
                                    className="w-full py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
                                >
                                    119 응급 연락
                                </button>
                                <button
                                    onClick={() => { setShowEmergencyWarning(false); setStep(7); }}
                                    className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                                >
                                    비응급 상황입니다
                                </button>
                            </div>
                        </div>
                    ) : step === 1 ? (
                        <div className="space-y-4">
                            <h4 className="text-lg font-bold text-gray-900">어떤 불편이 가장 크신가요?</h4>
                            <div className="grid grid-cols-2 gap-3">
                                {SYMPTOM_CATEGORIES.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setCategory(cat.id)}
                                        className={`p-4 rounded-xl border-2 transition-all text-left ${category === cat.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-200'}`}
                                    >
                                        <span className="text-2xl block mb-2">{cat.icon}</span>
                                        <span className="text-sm font-medium text-gray-700 block">{cat.label}</span>
                                        <span className="text-xs text-gray-400">{cat.desc}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : step === 2 ? (
                        <div className="space-y-4">
                            <h4 className="text-lg font-bold text-gray-900">어디가 불편하신가요?</h4>
                            <p className="text-sm text-gray-500">복수 선택 가능</p>
                            <div className="grid grid-cols-2 gap-2">
                                {AREA_OPTIONS.map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => handleMultiSelect(opt.id, area, setArea)}
                                        className={`p-3 rounded-xl border-2 transition-all ${area.includes(opt.id) ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-200'}`}
                                    >
                                        <span className="font-medium text-gray-700">{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : step === 3 ? (
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 mb-3">언제부터 불편하셨나요?</h4>
                                <div className="flex flex-wrap gap-2">
                                    {DURATION_OPTIONS.map(opt => (
                                        <button
                                            key={opt.id}
                                            onClick={() => setDuration(opt.id)}
                                            className={`px-4 py-2 rounded-full border-2 transition-all text-sm ${duration === opt.id ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 hover:border-emerald-200'}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 mb-3">얼마나 자주 불편하신가요?</h4>
                                <div className="flex flex-wrap gap-2">
                                    {FREQUENCY_OPTIONS.map(opt => (
                                        <button
                                            key={opt.id}
                                            onClick={() => setFrequency(opt.id)}
                                            className={`px-4 py-2 rounded-full border-2 transition-all text-sm ${frequency === opt.id ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 hover:border-emerald-200'}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : step === 4 ? (
                        <div className="space-y-4">
                            <h4 className="text-lg font-bold text-gray-900">언제 더 불편해지나요?</h4>
                            <p className="text-sm text-gray-500">복수 선택 가능</p>
                            <div className="flex flex-wrap gap-2">
                                {TRIGGER_OPTIONS.map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => handleMultiSelect(opt.id, triggers, setTriggers)}
                                        className={`px-4 py-2 rounded-full border-2 transition-all text-sm ${triggers.includes(opt.id) ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 hover:border-emerald-200'}`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : step === 5 ? (
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 mb-2">불편 정도를 선택해주세요</h4>
                                <p className="text-sm text-gray-500 mb-4">1: 가벼움 ~ 5: 매우 심함</p>
                                <div className="flex justify-center gap-3">
                                    {[1, 2, 3, 4, 5].map(num => (
                                        <button
                                            key={num}
                                            onClick={() => setSeverity(num)}
                                            className={`w-12 h-12 rounded-full border-2 font-bold transition-all ${severity === num ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-gray-200 hover:border-emerald-200 text-gray-600'}`}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 mb-3">동반 증상 (선택)</h4>
                                <div className="flex flex-wrap gap-2">
                                    {ACCOMPANYING_OPTIONS.map(opt => (
                                        <button
                                            key={opt.id}
                                            onClick={() => handleMultiSelect(opt.id, accompanying, setAccompanying)}
                                            className={`px-3 py-1.5 rounded-full border-2 transition-all text-sm ${accompanying.includes(opt.id) ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 hover:border-orange-200'}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">추가 메모 (선택)</h4>
                                <textarea
                                    value={memo}
                                    onChange={(e) => setMemo(e.target.value)}
                                    placeholder="예: 오른쪽 어금니 씹을 때 통증"
                                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none resize-none h-20 text-sm"
                                />
                            </div>
                        </div>
                    ) : step === 6 ? (
                        <div className="space-y-4">
                            <h4 className="text-lg font-bold text-gray-900">⚠️ 주의 증상 체크</h4>
                            <p className="text-sm text-gray-500">아래 증상 중 해당하는 것이 있나요?</p>
                            <div className="space-y-2">
                                {RED_FLAGS.map(flag => (
                                    <button
                                        key={flag.id}
                                        onClick={() => handleRedFlagChange(flag.id)}
                                        className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${redFlags.includes(flag.id) ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-red-200'}`}
                                    >
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${redFlags.includes(flag.id) ? 'border-red-500 bg-red-500' : 'border-gray-300'}`}>
                                            {redFlags.includes(flag.id) && <CheckCircle className="w-4 h-4 text-white" />}
                                        </div>
                                        <span className="font-medium text-gray-700">{flag.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : step === 7 ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <CheckCircle className="w-6 h-6 text-emerald-500" />
                                <h4 className="text-lg font-bold text-gray-900">구강 불편 정리 완료</h4>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-sm text-gray-700 whitespace-pre-wrap">
                                {summary.replace(/##/g, '').replace(/\*\*/g, '').replace(/>/g, '')}
                            </div>
                            <p className="text-xs text-gray-500 text-center">
                                본 체크는 의료정보 제공 및 상담 준비용 참고입니다.<br />
                                증상이 지속·악화되면 의료진 상담이 필요합니다.
                            </p>
                            <div className="space-y-2">
                                <button
                                    onClick={() => window.location.href = '/login?returnTo=/medical/patient-dashboard'}
                                    className="w-full py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors"
                                >
                                    요약 저장 (로그인)
                                </button>
                                <button
                                    onClick={resetAndClose}
                                    className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                                >
                                    닫기
                                </button>
                            </div>
                        </div>
                    ) : null}
                </div>

                {/* Footer */}
                {step <= 6 && !showEmergencyWarning && (
                    <div className="p-4 border-t border-gray-100">
                        <p className="text-xs text-gray-400 text-center mb-3">
                            운영정보는 변동될 수 있어요. 방문 전 확인이 필요합니다.
                        </p>
                        <div className="flex gap-3">
                            {step > 1 && (
                                <button
                                    onClick={handleBack}
                                    className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    <ChevronLeft size={18} /> 이전
                                </button>
                            )}
                            <button
                                onClick={handleNext}
                                disabled={!canProceed()}
                                className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {step === 6 ? '완료' : '다음'} <ChevronRight size={18} />
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
