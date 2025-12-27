"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface ProgressPanelProps {
    sessionId: string;
    onComplete: () => void;
    onError: (error: string) => void;
}

type ProgressStatus = "generating" | "done" | "error";

interface VariantProgress {
    key: string;
    label: string;
    status: "pending" | "processing" | "done" | "failed";
}

const VARIANT_LABELS: Record<string, string> = {
    natural: "내추럴",
    makeup: "메이크업 느낌",
    bright: "밝은 톤",
};

export default function ProgressPanel({ sessionId, onComplete, onError }: ProgressPanelProps) {
    const [status, setStatus] = useState<ProgressStatus>("generating");
    const [variants, setVariants] = useState<VariantProgress[]>([
        { key: "natural", label: "내추럴", status: "pending" },
        { key: "makeup", label: "메이크업 느낌", status: "pending" },
        { key: "bright", label: "밝은 톤", status: "pending" },
    ]);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        let isCancelled = false;

        const runGeneration = async () => {
            try {
                // 1. 변환 시작
                const generateRes = await fetch("/api/face-style/session/generate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ sessionId }),
                });

                if (!generateRes.ok) {
                    const data = await generateRes.json();
                    throw new Error(data.error || "변환 실패");
                }

                const result = await generateRes.json();

                if (isCancelled) return;

                // 2. 결과 업데이트
                setVariants(prev =>
                    prev.map(v => ({
                        ...v,
                        status: result.results[v.key]?.success ? "done" : "failed",
                    }))
                );

                if (result.success) {
                    setStatus("done");
                    setTimeout(() => !isCancelled && onComplete(), 1500);
                } else {
                    setStatus("error");
                    onError("일부 변환에 실패했습니다.");
                }

            } catch (err) {
                if (!isCancelled) {
                    setStatus("error");
                    onError(err instanceof Error ? err.message : "변환 중 오류가 발생했습니다.");
                }
            }
        };

        // 애니메이션 효과
        const animationInterval = setInterval(() => {
            setCurrentStep(prev => (prev + 1) % 4);
            setVariants(prev =>
                prev.map((v, idx) => ({
                    ...v,
                    status: idx <= Math.floor(currentStep / 1.3) ? "processing" : "pending",
                }))
            );
        }, 800);

        runGeneration();

        return () => {
            isCancelled = true;
            clearInterval(animationInterval);
        };
    }, [sessionId, onComplete, onError, currentStep]);

    return (
        <div className="max-w-md mx-auto p-6 bg-skin-surface rounded-2xl border border-white/10 shadow-xl">
            {/* 헤더 */}
            <div className="text-center mb-6">
                {status === "generating" && (
                    <div className="w-16 h-16 bg-skin-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Loader2 className="w-8 h-8 text-skin-primary animate-spin" />
                    </div>
                )}
                {status === "done" && (
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                )}
                {status === "error" && (
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-red-400" />
                    </div>
                )}

                <h2 className="text-xl font-bold text-skin-text mb-2">
                    {status === "generating" && "스타일 변환 중..."}
                    {status === "done" && "변환 완료!"}
                    {status === "error" && "변환 오류"}
                </h2>
                <p className="text-sm text-skin-subtext">
                    {status === "generating" && "잠시만 기다려주세요. 3가지 스타일을 생성 중입니다."}
                    {status === "done" && "결과를 확인해보세요."}
                    {status === "error" && "일부 스타일 변환에 문제가 발생했습니다."}
                </p>
            </div>

            {/* 진행 상태 */}
            <div className="space-y-3">
                {variants.map(variant => (
                    <div
                        key={variant.key}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-all ${variant.status === "done"
                                ? "bg-green-500/10 border border-green-500/30"
                                : variant.status === "failed"
                                    ? "bg-red-500/10 border border-red-500/30"
                                    : variant.status === "processing"
                                        ? "bg-skin-primary/10 border border-skin-primary/30"
                                        : "bg-white/5 border border-white/10"
                            }`}
                    >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                            {variant.status === "pending" && (
                                <div className="w-3 h-3 rounded-full bg-white/20" />
                            )}
                            {variant.status === "processing" && (
                                <Loader2 className="w-4 h-4 text-skin-primary animate-spin" />
                            )}
                            {variant.status === "done" && (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                            )}
                            {variant.status === "failed" && (
                                <AlertCircle className="w-4 h-4 text-red-400" />
                            )}
                        </div>
                        <span className="text-sm text-skin-text font-medium">
                            {variant.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
