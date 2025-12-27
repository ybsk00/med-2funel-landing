"use client";

import { useState } from "react";
import { CheckCircle, AlertCircle, Shield } from "lucide-react";

interface ConsentGateProps {
    onConsent: () => void;
    isLoading?: boolean;
}

const CONSENT_ITEMS = [
    {
        id: "photo_processing",
        label: "[필수] 가상 스타일 변환 예시를 위해 사진 처리에 동의합니다.",
        required: true,
    },
    {
        id: "not_medical",
        label: "[필수] 본 기능은 참고용이며 진단·처방이 아닙니다.",
        required: true,
    },
    {
        id: "data_policy",
        label: "[필수] 보관/삭제 정책을 확인했습니다. (원본 24시간, 변환본 30일)",
        required: true,
    },
] as const;

export default function ConsentGate({ onConsent, isLoading = false }: ConsentGateProps) {
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
    const [error, setError] = useState<string | null>(null);

    const allRequiredChecked = CONSENT_ITEMS.filter(item => item.required).every(
        item => checkedItems[item.id]
    );

    const handleToggle = (id: string) => {
        setCheckedItems(prev => ({
            ...prev,
            [id]: !prev[id],
        }));
        setError(null);
    };

    const handleSubmit = async () => {
        if (!allRequiredChecked) {
            setError("모든 필수 항목에 동의해주세요.");
            return;
        }
        onConsent();
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-skin-surface rounded-2xl border border-white/10 shadow-xl">
            {/* 헤더 */}
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-skin-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-skin-primary" />
                </div>
                <h2 className="text-xl font-bold text-skin-text mb-2">
                    사진 처리 동의
                </h2>
                <p className="text-sm text-skin-subtext">
                    사진으로 스타일 보기 기능을 사용하려면 아래 항목에 동의해주세요.
                </p>
            </div>

            {/* 동의 항목 */}
            <div className="space-y-3 mb-6">
                {CONSENT_ITEMS.map(item => (
                    <label
                        key={item.id}
                        className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all ${checkedItems[item.id]
                                ? "bg-skin-primary/10 border border-skin-primary/30"
                                : "bg-white/5 border border-white/10 hover:bg-white/10"
                            }`}
                    >
                        <input
                            type="checkbox"
                            checked={checkedItems[item.id] || false}
                            onChange={() => handleToggle(item.id)}
                            className="sr-only"
                        />
                        <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${checkedItems[item.id]
                                    ? "bg-skin-primary text-white"
                                    : "bg-white/10 border border-white/20"
                                }`}
                        >
                            {checkedItems[item.id] && <CheckCircle className="w-3.5 h-3.5" />}
                        </div>
                        <span className="text-sm text-skin-text leading-relaxed">
                            {item.label}
                        </span>
                    </label>
                ))}
            </div>

            {/* 에러 메시지 */}
            {error && (
                <div className="flex items-center gap-2 p-3 mb-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-red-400">{error}</span>
                </div>
            )}

            {/* 동의 버튼 */}
            <button
                onClick={handleSubmit}
                disabled={!allRequiredChecked || isLoading}
                className={`w-full py-3 rounded-xl font-semibold transition-all ${allRequiredChecked && !isLoading
                        ? "bg-skin-primary text-white hover:bg-skin-accent shadow-lg shadow-skin-primary/30"
                        : "bg-white/10 text-skin-muted cursor-not-allowed"
                    }`}
            >
                {isLoading ? "처리 중..." : "동의하고 시작하기"}
            </button>

            {/* 참고 안내 */}
            <p className="text-xs text-skin-muted text-center mt-4">
                ℹ️ 언제든 "내 사진 삭제" 버튼으로 즉시 삭제할 수 있습니다.
            </p>
        </div>
    );
}
