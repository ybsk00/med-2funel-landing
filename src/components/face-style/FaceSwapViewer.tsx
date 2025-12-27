"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { RefreshCw, AlertCircle, GripVertical } from "lucide-react";

interface Variant {
    key: string;
    status: string;
    url: string | null;
}

interface FaceSwapViewerProps {
    sessionId: string;
    selectedVariant?: string;
}

const VARIANT_CONFIG: Record<string, { label: string; description: string }> = {
    laser: { label: "결·톤 정돈", description: "레이저 느낌" },
    botox: { label: "표정주름 완화", description: "보톡스 느낌" },
    filler: { label: "볼륨감 변화", description: "필러 느낌" },
    booster: { label: "광채/물광", description: "스킨부스터 느낌" },
    natural: { label: "내추럴", description: "피부결/톤 정리" },
    makeup: { label: "메이크업 느낌", description: "색감/채도 조정" },
    bright: { label: "밝은 톤", description: "밝기/화이트밸런스" },
};

export default function FaceSwapViewer({ sessionId, selectedVariant }: FaceSwapViewerProps) {
    const [variants, setVariants] = useState<Variant[]>([]);
    const [originalUrl, setOriginalUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const fetchSession = async () => {
        try {
            setIsLoading(true);
            const res = await fetch(`/api/face-style/session/get?sessionId=${sessionId}`);

            if (!res.ok) {
                throw new Error("세션 조회 실패");
            }

            const data = await res.json();
            setVariants(data.variants || []);
            setOriginalUrl(data.originalUrl || null);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSession();
        const interval = setInterval(fetchSession, 240000);
        return () => clearInterval(interval);
    }, [sessionId]);

    // 슬라이더 드래그 핸들러
    const handleDrag = (clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
        setSliderPosition(percentage);
    };

    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) handleDrag(e.clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (isDragging) handleDrag(e.touches[0].clientX);
    };

    useEffect(() => {
        const handleGlobalMouseUp = () => setIsDragging(false);
        window.addEventListener("mouseup", handleGlobalMouseUp);
        window.addEventListener("touchend", handleGlobalMouseUp);
        return () => {
            window.removeEventListener("mouseup", handleGlobalMouseUp);
            window.removeEventListener("touchend", handleGlobalMouseUp);
        };
    }, []);

    const activeVariant = selectedVariant || variants[0]?.key || "laser";
    const activeConfig = VARIANT_CONFIG[activeVariant] || { label: activeVariant, description: "" };
    const activeUrl = variants.find(v => v.key === activeVariant)?.url;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <RefreshCw className="w-8 h-8 text-pink-500 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto p-6 bg-red-500/10 border border-red-500/30 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <span className="text-red-400 font-medium">오류 발생</span>
                </div>
                <p className="text-sm text-red-300">{error}</p>
                <button
                    onClick={fetchSession}
                    className="mt-4 px-4 py-2 bg-red-500/20 rounded-lg text-red-300 text-sm hover:bg-red-500/30 transition-colors"
                >
                    다시 시도
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto">
            {/* 전후비교 슬라이더 */}
            <div
                ref={containerRef}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-gray-700 mb-4 cursor-ew-resize select-none"
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
            >
                {/* Before 이미지 (원본) */}
                {originalUrl && (
                    <div className="absolute inset-0">
                        <Image
                            src={originalUrl}
                            alt="원본"
                            fill
                            className="object-cover object-top"
                            unoptimized
                            draggable={false}
                        />
                        {/* Before 라벨 */}
                        <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 rounded text-xs text-white font-medium">
                            Before
                        </div>
                    </div>
                )}

                {/* After 이미지 (변환) - 클리핑 */}
                {activeUrl && (
                    <div
                        className="absolute inset-0 overflow-hidden"
                        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                    >
                        <Image
                            src={activeUrl}
                            alt={activeConfig.label}
                            fill
                            className="object-cover object-top"
                            unoptimized
                            draggable={false}
                        />
                        {/* After 라벨 */}
                        <div className="absolute top-3 right-3 px-2 py-1 bg-pink-500/80 rounded text-xs text-white font-medium">
                            After
                        </div>
                    </div>
                )}

                {/* 슬라이더 핸들 */}
                <div
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize z-10"
                    style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleMouseDown}
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                        <GripVertical className="w-4 h-4 text-gray-600" />
                    </div>
                </div>

                {/* 하단 라벨 */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-center text-white font-bold text-lg drop-shadow-lg">
                        {activeConfig.label}
                    </p>
                    <p className="text-center text-white/80 text-sm">
                        {activeConfig.description}
                    </p>
                </div>
            </div>

            {/* 안내 */}
            <p className="text-xs text-gray-500 text-center">
                ⚠️ 참고용 시각화이며, 실제 시술 결과와 다를 수 있습니다.
            </p>
        </div>
    );
}
