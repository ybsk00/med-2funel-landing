"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { RotateCcw, ZoomIn } from "lucide-react";

// 치료 메뉴별 필터 및 설정
export const TREATMENT_VARIANTS = [
    {
        key: "natural",
        label: "원본",
        description: "필터 없음",
        filter: "none",
        opacity: 1,
    },
    {
        key: "skinbooster",
        label: "물광주사",
        description: "혈색/생기 강조",
        filter: "saturate(1.15) hue-rotate(-3deg) brightness(1.02) contrast(1.01)",
        opacity: 0.75,
    },
    {
        key: "brightening",
        label: "미백/화이트닝",
        description: "밝기 강조",
        filter: "brightness(1.1) contrast(1.05)",
        opacity: 0.85,
    },
    {
        key: "lifting",
        label: "리프팅",
        description: "탄력/윤곽 강조",
        filter: "contrast(1.08) saturate(1.1) brightness(1.02)",
        opacity: 0.9,
    },
] as const;

export type TreatmentKey = (typeof TREATMENT_VARIANTS)[number]["key"];

interface BrushCanvasProps {
    imageUrl: string;                    // 베이스 이미지 URL (샘플 또는 업로드된 사진)
    selectedTreatment: TreatmentKey;     // 선택된 치료 타입
    onTreatmentChange?: (treatment: TreatmentKey) => void;
    className?: string;
    showControls?: boolean;              // 컨트롤 버튼 표시 여부
    aspectRatio?: string;                // 이미지 비율 (예: "3/4")
}

const BRUSH_SIZE = 35;
const MIN_ZOOM = 1;
const MAX_ZOOM = 2;

export default function BrushCanvas({
    imageUrl,
    selectedTreatment,
    onTreatmentChange,
    className = "",
    showControls = true,
    aspectRatio = "3/4",
}: BrushCanvasProps) {
    const [isPainting, setIsPainting] = useState(false);
    const [hasPainted, setHasPainted] = useState(false);
    const [maskUrl, setMaskUrl] = useState<string | null>(null);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [initialPinchDistance, setInitialPinchDistance] = useState<number | null>(null);
    const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const lastPosRef = useRef<{ x: number; y: number } | null>(null);
    const rafRef = useRef<number | null>(null);

    const currentTreatment = TREATMENT_VARIANTS.find(v => v.key === selectedTreatment) || TREATMENT_VARIANTS[0];

    // Canvas 초기화
    const initCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        setMaskUrl(null);
        setHasPainted(false);
    }, []);

    useEffect(() => {
        initCanvas();
        window.addEventListener("resize", initCanvas);
        return () => window.removeEventListener("resize", initCanvas);
    }, [initCanvas]);

    // 마스크 URL 업데이트
    const updateMaskUrl = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        setMaskUrl(canvas.toDataURL("image/png"));
    }, []);

    // 브러시 페인팅
    const paintAt = useCallback((x: number, y: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, BRUSH_SIZE);
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        gradient.addColorStop(0.4, "rgba(255, 255, 255, 0.3)");
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, BRUSH_SIZE, 0, Math.PI * 2);
        ctx.fill();

        setHasPainted(true);

        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(updateMaskUrl);
    }, [updateMaskUrl]);

    // 선 그리기
    const paintLine = useCallback((fromX: number, fromY: number, toX: number, toY: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const distance = Math.sqrt((toX - fromX) ** 2 + (toY - fromY) ** 2);
        const steps = Math.max(1, Math.floor(distance / 3));

        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const x = fromX + (toX - fromX) * t;
            const y = fromY + (toY - fromY) * t;

            const gradient = ctx.createRadialGradient(x, y, 0, x, y, BRUSH_SIZE);
            gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
            gradient.addColorStop(0.4, "rgba(255, 255, 255, 0.3)");
            gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, BRUSH_SIZE, 0, Math.PI * 2);
            ctx.fill();
        }

        setHasPainted(true);

        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(updateMaskUrl);
    }, [updateMaskUrl]);

    // 좌표 계산
    const getCanvasCoords = useCallback((clientX: number, clientY: number) => {
        const container = containerRef.current;
        if (!container) return null;

        const rect = container.getBoundingClientRect();
        return {
            x: clientX - rect.left,
            y: clientY - rect.top,
        };
    }, []);

    // 마우스 이벤트
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        const coords = getCanvasCoords(e.clientX, e.clientY);
        if (!coords) return;

        setIsPainting(true);
        paintAt(coords.x, coords.y);
        lastPosRef.current = coords;
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        const coords = getCanvasCoords(e.clientX, e.clientY);
        if (coords) {
            setCursorPos(coords);
        }

        if (!isPainting || !coords) return;

        if (lastPosRef.current) {
            paintLine(lastPosRef.current.x, lastPosRef.current.y, coords.x, coords.y);
        } else {
            paintAt(coords.x, coords.y);
        }
        lastPosRef.current = coords;
    };

    const handleMouseUp = () => {
        setIsPainting(false);
        lastPosRef.current = null;
    };

    const handleMouseLeave = () => {
        setIsPainting(false);
        lastPosRef.current = null;
        setCursorPos(null);
    };

    // 터치 이벤트
    const getTouchDistance = (touches: React.TouchList) => {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        e.preventDefault();

        if (e.touches.length === 2) {
            const distance = getTouchDistance(e.touches);
            setInitialPinchDistance(distance);
        } else if (e.touches.length === 1) {
            const coords = getCanvasCoords(e.touches[0].clientX, e.touches[0].clientY);
            if (coords) {
                setIsPainting(true);
                paintAt(coords.x, coords.y);
                lastPosRef.current = coords;
            }
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        e.preventDefault();

        if (e.touches.length === 2 && initialPinchDistance !== null) {
            const currentDistance = getTouchDistance(e.touches);
            const scale = currentDistance / initialPinchDistance;
            setZoomLevel(prev => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev * scale)));
            setInitialPinchDistance(currentDistance);
        } else if (e.touches.length === 1 && isPainting) {
            const coords = getCanvasCoords(e.touches[0].clientX, e.touches[0].clientY);
            if (coords) {
                if (lastPosRef.current) {
                    paintLine(lastPosRef.current.x, lastPosRef.current.y, coords.x, coords.y);
                } else {
                    paintAt(coords.x, coords.y);
                }
                lastPosRef.current = coords;
            }
        }
    };

    const handleTouchEnd = () => {
        setIsPainting(false);
        setInitialPinchDistance(null);
        lastPosRef.current = null;
    };

    // 리셋
    const handleReset = () => {
        initCanvas();
        setZoomLevel(1);
    };

    // 정리
    useEffect(() => {
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    // 터치 스크롤 방지
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const preventDefault = (e: TouchEvent) => {
            if (e.touches.length >= 2 || isPainting) {
                e.preventDefault();
            }
        };

        container.addEventListener("touchmove", preventDefault, { passive: false });
        return () => container.removeEventListener("touchmove", preventDefault);
    }, [isPainting]);

    return (
        <div className={`relative ${className}`}>
            {/* 이미지 영역 */}
            <div
                ref={containerRef}
                className="relative w-full overflow-hidden rounded-2xl bg-gray-800 touch-none select-none"
                style={{ aspectRatio }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div
                    className="absolute inset-0 origin-center transition-transform duration-200"
                    style={{ transform: `scale(${zoomLevel})` }}
                >
                    {/* 베이스 이미지 */}
                    <Image
                        src={imageUrl}
                        alt="베이스 이미지"
                        fill
                        className="object-cover object-top pointer-events-none"
                        priority
                        unoptimized
                    />

                    {/* 효과 적용 이미지 (마스크) */}
                    {selectedTreatment !== "natural" && maskUrl && (
                        <div
                            className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                            style={{
                                maskImage: `url(${maskUrl})`,
                                WebkitMaskImage: `url(${maskUrl})`,
                                maskSize: "100% 100%",
                                WebkitMaskSize: "100% 100%",
                                filter: currentTreatment.filter,
                                opacity: currentTreatment.opacity,
                            }}
                        >
                            <Image
                                src={imageUrl}
                                alt="효과 적용"
                                fill
                                className="object-cover object-top"
                                unoptimized
                            />
                        </div>
                    )}
                </div>

                {/* Hidden Canvas */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 pointer-events-none opacity-0"
                />

                {/* 커서 */}
                {cursorPos && (
                    <div
                        className="absolute pointer-events-none border-2 border-white/50 rounded-full"
                        style={{
                            width: BRUSH_SIZE * 2,
                            height: BRUSH_SIZE * 2,
                            left: cursorPos.x - BRUSH_SIZE,
                            top: cursorPos.y - BRUSH_SIZE,
                        }}
                    />
                )}

                {/* 안내 문구 */}
                {!hasPainted && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm">
                            👆 볼 부위를 문질러보세요
                        </div>
                    </div>
                )}
            </div>

            {/* 컨트롤 */}
            {showControls && (
                <div className="flex items-center justify-between mt-4">
                    {/* 치료 선택 */}
                    <div className="flex gap-2">
                        {TREATMENT_VARIANTS.filter(v => v.key !== "natural").map((variant) => (
                            <button
                                key={variant.key}
                                onClick={() => onTreatmentChange?.(variant.key)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${selectedTreatment === variant.key
                                        ? "bg-pink-500 text-white"
                                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                    }`}
                            >
                                {variant.label}
                            </button>
                        ))}
                    </div>

                    {/* 리셋 & 줌 */}
                    <div className="flex gap-2">
                        <button
                            onClick={handleReset}
                            className="p-2 bg-gray-700/80 hover:bg-gray-600 rounded-full text-white transition-colors"
                            title="리셋"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-1 px-2 py-1 bg-gray-700/80 rounded-full text-white text-xs">
                            <ZoomIn className="w-3 h-3" />
                            <span>{Math.round(zoomLevel * 100)}%</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
