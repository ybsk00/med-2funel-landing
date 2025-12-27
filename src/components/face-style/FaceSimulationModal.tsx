"use client";

import { useState, useEffect, useCallback } from "react";
import { X, AlertCircle } from "lucide-react";
import ConsentGate from "./ConsentGate";
import PhotoUploader from "./PhotoUploader";
import ProgressPanel from "./ProgressPanel";
import FaceSwapViewer from "./FaceSwapViewer";
import DeleteMyPhotosButton from "./DeleteMyPhotosButton";

type Step = "consent" | "upload" | "generating" | "result";

interface FaceSimulationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function FaceSimulationModal({ isOpen, onClose }: FaceSimulationModalProps) {
    const [step, setStep] = useState<Step>("consent");
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    // 모달 열기/닫기 애니메이션
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsAnimating(true);
                });
            });
        } else {
            setIsAnimating(false);
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // ESC 키로 닫기
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    // 스크롤 방지
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // 동의 완료 핸들러 (ConsentGate의 onConsent prop과 연결)
    const handleConsent = useCallback(() => {
        setStep("upload");
    }, []);

    // 업로드 완료 핸들러
    const handleUploadComplete = useCallback((newSessionId: string) => {
        setSessionId(newSessionId);
        setStep("generating");
    }, []);

    // 생성 완료 핸들러
    const handleGenerateComplete = useCallback(() => {
        setStep("result");
    }, []);

    // 생성 에러 핸들러
    const handleGenerateError = useCallback((error: string) => {
        console.error("Generate error:", error);
        // 에러시에도 result로 전환 (부분 성공 표시)
        setStep("result");
    }, []);

    // 삭제 완료 핸들러
    const handleDeleteComplete = useCallback(() => {
        setSessionId(null);
        setStep("upload");
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* 배경 오버레이 */}
            <div
                className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isAnimating ? "opacity-100" : "opacity-0"
                    }`}
                onClick={onClose}
            />

            {/* 모달 */}
            <div
                className={`absolute inset-4 md:inset-8 lg:inset-16 bg-skin-bg rounded-2xl shadow-2xl border border-white/10 flex flex-col overflow-hidden transition-all duration-300 ${isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* 헤더 */}
                <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-skin-text">
                            가상 시각화<span className="text-skin-muted font-normal">(참고용)</span>
                        </h2>
                        <p className="text-xs text-skin-subtext">
                            내 사진을 기반으로 피부 표현을 시각화합니다
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                    >
                        <X className="w-5 h-5 text-skin-subtext" />
                    </button>
                </div>

                {/* 콘텐츠 */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    {step === "consent" && (
                        <ConsentGate onConsent={handleConsent} />
                    )}

                    {step === "upload" && (
                        <PhotoUploader onUploadComplete={handleUploadComplete} />
                    )}

                    {step === "generating" && sessionId && (
                        <ProgressPanel
                            sessionId={sessionId}
                            onComplete={handleGenerateComplete}
                            onError={handleGenerateError}
                        />
                    )}

                    {step === "result" && sessionId && (
                        <div className="space-y-6">
                            <FaceSwapViewer sessionId={sessionId} />
                            <div className="flex justify-center">
                                <DeleteMyPhotosButton
                                    sessionId={sessionId}
                                    onDeleteComplete={handleDeleteComplete}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* 하단 고지 (상시 노출) */}
                <div className="flex-shrink-0 p-4 border-t border-white/10 bg-skin-bg">
                    <div className="flex items-start gap-2 text-xs text-skin-muted">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <p>
                            참고용 시각화이며 실제 시술 결과를 예측/보장하지 않습니다.
                            개인 상태에 따라 달라질 수 있습니다.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
