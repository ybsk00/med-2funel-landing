"use client";

import { useState, useRef, useCallback } from "react";
import { X, ArrowLeft, Camera, ImageIcon, Shield } from "lucide-react";
import BrushCanvas from "@/components/common/BrushCanvas";
import { DEFAULT_SIMULATION } from "@/lib/constants/simulations";

type Step = "consent" | "photo" | "experience";

interface FaceSimulationModalProps {
    isOpen: boolean;
    onClose: () => void;
    isMobile?: boolean;
}

// 동의 항목
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
        label: "[필수] 사진은 브라우저에서만 처리되며 서버에 저장되지 않습니다.",
        required: true,
    },
] as const;

// 샘플 이미지
const SAMPLE_IMAGE = "/base.png";

export default function FaceSimulationModal({ isOpen, onClose, isMobile = false }: FaceSimulationModalProps) {
    const [step, setStep] = useState<Step>("consent");
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
    // Default to the first treatment option (usually index 1, as 0 is 'natural')
    const [selectedTreatment, setSelectedTreatment] = useState<string>(DEFAULT_SIMULATION.variants[1]?.key || "skinbooster");
    const [imageUrl, setImageUrl] = useState<string>(SAMPLE_IMAGE);
    const [isUsingOwnPhoto, setIsUsingOwnPhoto] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const allRequiredChecked = CONSENT_ITEMS.filter(item => item.required).every(
        item => checkedItems[item.id]
    );

    const handleToggle = (id: string) => {
        setCheckedItems(prev => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleConsent = () => {
        if (allRequiredChecked) {
            setStep("photo");
        }
    };

    const handleUseSample = () => {
        setImageUrl(SAMPLE_IMAGE);
        setIsUsingOwnPhoto(false);
        setStep("experience");
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 클라이언트 사이드에서만 처리 (서버 업로드 없음)
        const objectUrl = URL.createObjectURL(file);
        setImageUrl(objectUrl);
        setIsUsingOwnPhoto(true);
        setStep("experience");
    }, []);

    const handleBack = () => {
        if (step === "photo") {
            setStep("consent");
        } else if (step === "experience") {
            // 이전 이미지 URL 해제
            if (isUsingOwnPhoto && imageUrl.startsWith("blob:")) {
                URL.revokeObjectURL(imageUrl);
            }
            setImageUrl(SAMPLE_IMAGE);
            setIsUsingOwnPhoto(false);
            setStep("photo");
        }
    };

    const handleClose = () => {
        // 정리
        if (isUsingOwnPhoto && imageUrl.startsWith("blob:")) {
            URL.revokeObjectURL(imageUrl);
        }
        setStep("consent");
        setCheckedItems({});
        setImageUrl(SAMPLE_IMAGE);
        setIsUsingOwnPhoto(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* 배경 오버레이 */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* 모달 */}
            <div
                className={`absolute flex flex-col overflow-hidden ${isMobile
                    ? "inset-0 rounded-none bg-[#0f172a]"
                    : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md max-h-[90vh] rounded-2xl shadow-2xl border border-gray-700 bg-[#1e293b]"
                    }`}
                style={isMobile ? { maxWidth: '480px', margin: '0 auto', left: 0, right: 0 } : undefined}
                onClick={(e) => e.stopPropagation()}
            >
                {/* 헤더 */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        {step !== "consent" && (
                            <button
                                onClick={handleBack}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-white" />
                            </button>
                        )}
                        <div>
                            <h2 className="text-lg font-bold text-white">
                                가상 시뮬레이션<span className="text-gray-400 font-normal ml-1">(참고용)</span>
                            </h2>
                            <p className="text-xs text-gray-400">
                                {step === "consent" && "시작하기 전 동의가 필요합니다"}
                                {step === "photo" && "사진을 선택해주세요"}
                                {step === "experience" && "볼 부위를 문질러보세요"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* 콘텐츠 */}
                <div className="flex-1 overflow-y-auto p-4">
                    {/* Step 1: 동의 */}
                    {step === "consent" && (
                        <div className="max-w-md mx-auto">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Shield className="w-8 h-8 text-pink-400" />
                                </div>
                                <h2 className="text-xl font-bold text-white mb-2">
                                    사진 처리 동의
                                </h2>
                                <p className="text-sm text-gray-400">
                                    사진으로 스타일 보기 기능을 사용하려면 아래 항목에 동의해주세요.
                                </p>
                            </div>

                            <div className="space-y-3 mb-6">
                                {CONSENT_ITEMS.map(item => (
                                    <label
                                        key={item.id}
                                        className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all ${checkedItems[item.id]
                                            ? "bg-pink-500/10 border border-pink-500/30"
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
                                                ? "bg-pink-500 text-white"
                                                : "bg-white/10 border border-white/20"
                                                }`}
                                        >
                                            {checkedItems[item.id] && (
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                        <span className="text-sm text-white leading-relaxed">
                                            {item.label}
                                        </span>
                                    </label>
                                ))}
                            </div>

                            <button
                                onClick={handleConsent}
                                disabled={!allRequiredChecked}
                                className={`w-full py-3 rounded-xl font-semibold transition-all ${allRequiredChecked
                                    ? "bg-pink-500 text-white hover:bg-pink-600 shadow-lg shadow-pink-500/30"
                                    : "bg-white/10 text-gray-500 cursor-not-allowed"
                                    }`}
                            >
                                동의하고 시작하기
                            </button>
                        </div>
                    )}

                    {/* Step 2: 사진 선택 */}
                    {step === "photo" && (
                        <div className="space-y-4">
                            <h3 className="text-center text-base font-semibold text-white mb-6">
                                어떤 사진을 사용할까요?
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={handleUseSample}
                                    className="flex flex-col items-center gap-3 p-6 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-pink-500/50 rounded-2xl transition-all group"
                                >
                                    <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                        <ImageIcon className="w-7 h-7 text-white" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-base font-medium text-white">샘플로 체험</p>
                                        <p className="text-xs text-gray-500 mt-0.5">준비된 사진 사용</p>
                                    </div>
                                </button>

                                <button
                                    onClick={handleUploadClick}
                                    className="flex flex-col items-center gap-3 p-6 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-pink-500/50 rounded-2xl transition-all group"
                                >
                                    <div className="w-14 h-14 bg-pink-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                        <Camera className="w-7 h-7 text-white" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-base font-medium text-white">내 사진 업로드</p>
                                        <p className="text-xs text-gray-500 mt-0.5">서버 저장 없음</p>
                                    </div>
                                </button>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            <p className="text-xs text-gray-500 text-center mt-4">
                                ℹ️ 업로드된 사진은 브라우저에서만 처리되며 서버에 저장되지 않습니다.
                            </p>
                        </div>
                    )}

                    {/* Step 3: 브러시 체험 */}
                    {step === "experience" && (
                        <BrushCanvas
                            imageUrl={imageUrl}
                            // Pass the unified variants from constants
                            variants={DEFAULT_SIMULATION.variants}
                            selectedTreatment={selectedTreatment}
                            onTreatmentChange={setSelectedTreatment}
                            showControls={true}
                            aspectRatio="3/4"
                        />
                    )}
                </div>

                {/* 하단 고지 */}
                <div className="flex-shrink-0 p-3 border-t border-gray-700 bg-gray-800/50">
                    <p className="text-xs text-gray-500 text-center">
                        ℹ️ 참고용 시각화이며 실제 시술 결과를 예측/보장하지 않습니다.
                    </p>
                </div>
            </div>
        </div>
    );
}
