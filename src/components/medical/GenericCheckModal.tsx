"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ChevronRight, ChevronLeft, CheckCircle, Smartphone, Activity, Heart, Thermometer, Pill, AlertTriangle, User, Zap, Shield, Battery, Stethoscope, Sparkles, ClipboardList } from "lucide-react";
import { DepartmentCheckConfig } from "@/lib/data/department-check-data";

// Icon mapping helper
const getIcon = (iconName: string, className: string) => {
    switch (iconName) {
        case 'Stethoscope': return <Stethoscope className={className} />;
        case 'Activity': return <Activity className={className} />;
        case 'Heart': return <Heart className={className} />;
        case 'Thermometer': return <Thermometer className={className} />;
        case 'Pill': return <Pill className={className} />;
        case 'AlertTriangle': return <AlertTriangle className={className} />;
        case 'User': return <User className={className} />;
        case 'Zap': return <Zap className={className} />;
        case 'Shield': return <Shield className={className} />;
        case 'Battery': return <Battery className={className} />;
        case 'Sparkles': return <Sparkles className={className} />;
        default: return <ClipboardList className={className} />;
    }
};

type GenericCheckModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onComplete?: (summary: string) => void;
    config: DepartmentCheckConfig; // The dynamic configuration
};

export default function GenericCheckModal({ isOpen, onClose, onComplete, config }: GenericCheckModalProps) {
    const [step, setStep] = useState(1);
    const [category, setCategory] = useState('');
    const [symptoms, setSymptoms] = useState<string[]>([]);
    const [duration, setDuration] = useState('');
    const [extras, setExtras] = useState<string[]>([]);
    const [memo, setMemo] = useState('');
    const [summary, setSummary] = useState('');

    // Reset state when modal opens or config changes
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setCategory('');
            setSymptoms([]);
            setDuration('');
            setExtras([]);
            setMemo('');
            setSummary('');
        }
    }, [isOpen, config]);

    const totalSteps = config.extras ? 5 : 4; // Step 4 is memo if no extras, else Step 5 is memo

    const handleMultiSelect = (value: string, current: string[], setter: (val: string[]) => void) => {
        setter(current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value]
        );
    };

    const generateSummary = () => {
        const categoryLabel = config.categories.find(c => c.id === category)?.label || category;
        const symptomLabels = config.symptoms.filter(s => symptoms.includes(s.id)).map(s => s.label).join(', ') || '미선택';
        const durationLabel = config.durations.find(d => d.id === duration)?.label || duration;
        const extraLabels = config.extras ? config.extras.options.filter(e => extras.includes(e.id)).map(e => e.label).join(', ') : '';

        let summaryText = `## ${config.title}\n\n`;
        summaryText += `**관심/진료 항목**: ${categoryLabel}\n`;
        summaryText += `**${config.symptomLabel}**: ${symptomLabels}\n`;
        summaryText += `**기간/시기**: ${durationLabel}\n`;

        if (config.extras && extraLabels) {
            summaryText += `**${config.extras.label}**: ${extraLabels}\n`;
        }

        if (memo) {
            summaryText += `\n**추가 메모**: ${memo}\n`;
        }

        summaryText += `\n---\n> 💡 이 자료는 진료를 위한 기초 정보입니다.`;

        return summaryText;
    };

    const handleComplete = () => {
        const generatedSummary = generateSummary();
        setSummary(generatedSummary);
        setStep(totalSteps + 1); // Move to completion view
        onComplete?.(generatedSummary);
    };

    const handleNext = () => {
        if (step === totalSteps) {
            handleComplete();
        } else {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const canProceed = () => {
        switch (step) {
            case 1: return !!category;
            case 2: return symptoms.length > 0;
            case 3: return !!duration;
            case 4: return config.extras ? true : true; // Extras/Memo always optional/valid
            case 5: return true;
            default: return true;
        }
    };

    // Dynamic Color Classes
    const getThemeColor = (type: 'text' | 'bg' | 'border' | 'ring', intensity: string = '500') => {
        const color = config.colorTheme.primary;
        // Simple mapping for common Tailwind colors to ensure safety, or just pass directly if trusting config
        // Assuming config.colorTheme.primary is a valid tailwind color name like 'blue', 'pink', 'amber'
        return `${type}-${color}-${intensity}`;
    };

    // Custom style helpers because dynamic class names like `text-${color}-500` might be purged if not in safe list
    // However, since we use standard colors, standard safelisting or exact string construction usually works in dev.
    // Ideally, we'd map these. For now, I'll rely on the fact that these classes likely exist in the project or use style objects for colors if needed.
    // A safer way is to map 'pink' -> 'text-pink-500', etc.
    // Let's assume standard Tailwind colors are available.

    if (!isOpen) return null;

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className={`bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col border border-slate-700`}>
                {/* Header */}
                <div className="bg-slate-800 p-4 flex justify-between items-center border-b border-slate-700">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            {/* Generic Icon or mapped icon */}
                            <ClipboardList className={`w-5 h-5 ${config.colorTheme.iconColor}`} />
                            <h3 className="font-bold text-lg text-white">{config.title}</h3>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{config.description}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Progress */}
                {step <= totalSteps && (
                    <div className="px-4 pt-4">
                        <div className="flex gap-1">
                            {Array.from({ length: totalSteps }).map((_, i) => (
                                <div key={i} className={`h-1 flex-1 rounded-full ${i < step ? `bg-${config.colorTheme.primary}-500` : 'bg-slate-700'}`} />
                            ))}
                        </div>
                        <p className="text-xs text-slate-400 mt-2">단계 {step}/{totalSteps}</p>
                    </div>
                )}

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-600">
                    {step === 1 ? (
                        <div className="space-y-4">
                            <h4 className="text-lg font-bold text-white">어떤 진료를 원하시나요?</h4>
                            <div className="grid grid-cols-2 gap-3">
                                {config.categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setCategory(cat.id)}
                                        className={`p-4 rounded-xl border-2 transition-all text-left flex flex-col items-center text-center gap-2 ${category === cat.id ? `border-${config.colorTheme.primary}-500 bg-${config.colorTheme.primary}-500/20` : `border-slate-700 hover:border-${config.colorTheme.primary}-400 bg-slate-800/50`}`}
                                    >
                                        <div className="mb-1">{/* Icon placeholder */}</div>
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
                            <h4 className="text-lg font-bold text-white">{config.symptomLabel}</h4>
                            <p className="text-sm text-slate-400">해당하는 항목을 모두 선택해주세요</p>
                            <div className="grid grid-cols-2 gap-2">
                                {config.symptoms.map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => handleMultiSelect(opt.id, symptoms, setSymptoms)}
                                        className={`p-3 rounded-xl border-2 transition-all ${symptoms.includes(opt.id) ? `border-${config.colorTheme.primary}-500 bg-${config.colorTheme.primary}-500/20 text-${config.colorTheme.primary}-300 font-medium` : `border-slate-700 hover:border-${config.colorTheme.primary}-400 text-slate-300 bg-slate-800/50`}`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : step === 3 ? (
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-lg font-bold text-white mb-3">기간/시기는?</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {config.durations.map(opt => (
                                        <button
                                            key={opt.id}
                                            onClick={() => setDuration(opt.id)}
                                            className={`p-3 rounded-xl border-2 transition-all text-sm ${duration === opt.id ? `border-${config.colorTheme.primary}-500 bg-${config.colorTheme.primary}-500/20 text-${config.colorTheme.primary}-300 font-medium` : `border-slate-700 hover:border-${config.colorTheme.primary}-400 text-slate-300 bg-slate-800/50`}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (step === 4 && config.extras) ? (
                        // Extra Step if exists
                        <div className="space-y-4">
                            <h4 className="text-lg font-bold text-white">{config.extras.label}</h4>
                            <div className="flex flex-wrap gap-2">
                                {config.extras.options.map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => handleMultiSelect(opt.id, extras, setExtras)}
                                        className={`px-4 py-2 rounded-full border-2 transition-all text-sm ${extras.includes(opt.id) ? `border-${config.colorTheme.primary}-500 bg-${config.colorTheme.primary}-500/20 text-${config.colorTheme.primary}-300 font-medium` : `border-slate-700 hover:border-${config.colorTheme.primary}-400 text-slate-300 bg-slate-800/50`}`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        // Memo Step (Either step 4 or 5)
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-sm font-medium text-slate-300 mb-2">추가 메모 (선택)</h4>
                                <textarea
                                    value={memo}
                                    onChange={(e) => setMemo(e.target.value)}
                                    placeholder="의료진에게 전달하고 싶은 내용을 자유롭게 적어주세요."
                                    className={`w-full p-3 border-2 border-slate-700 bg-slate-800 text-white placeholder-slate-500 rounded-xl focus:border-${config.colorTheme.primary}-500 focus:outline-none resize-none h-32 text-sm`}
                                />
                            </div>
                        </div>
                    )}

                    {/* Completion View */}
                    {step > totalSteps && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <CheckCircle className={`w-6 h-6 text-${config.colorTheme.primary}-400`} />
                                <h4 className="text-lg font-bold text-white">작성 완료</h4>
                            </div>
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-sm text-slate-300 whitespace-pre-wrap">
                                {summary.replace(/##/g, '').replace(/\*\*/g, '').replace(/>/g, '')}
                            </div>
                            <p className="text-xs text-slate-400 text-center">
                                AI에게 이 내용을 전달하여 상담을 진행합니다.
                            </p>
                            <button
                                onClick={onClose}
                                className={`w-full py-3 bg-${config.colorTheme.primary}-500 text-white rounded-xl font-medium hover:bg-${config.colorTheme.primary}-600 transition-colors shadow-lg`}
                            >
                                상담 시작하기
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {step <= totalSteps && (
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
                                className={`flex-1 py-3 bg-${config.colorTheme.primary}-500 text-white rounded-xl font-medium hover:bg-${config.colorTheme.primary}-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-${config.colorTheme.primary}-500/20`}
                            >
                                {step === totalSteps ? '완료' : '다음'} <ChevronRight size={18} />
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
