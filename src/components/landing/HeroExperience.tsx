"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { RotateCcw } from "lucide-react";

// 샘플 이미지 매핑 (동일 인물 3장)
const STYLE_VARIANTS = [
    {
        key: "natural",
        label: "내추럴",
        description: "피부결/톤 정리",
        image: "/base.png",
    },
    {
        key: "makeup",
        label: "메이크업 느낌",
        description: "색감/채도 조정",
        image: "/makeup.png",
    },
    {
        key: "bright",
        label: "밝은 톤",
        description: "밝기/화이트밸런스",
        image: "/highlight.png",
    },
] as const;

type VariantKey = (typeof STYLE_VARIANTS)[number]["key"];

interface HeroExperienceProps {
    className?: string;
}

const BRUSH_SIZE = 40;

export default function HeroExperience({ className = "" }: HeroExperienceProps) {
    const [selectedVariant, setSelectedVariant] = useState<VariantKey>("makeup");
    const [isPainting, setIsPainting] = useState(false);
    const [maskDataUrl, setMaskDataUrl] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

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
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        setMaskDataUrl(null);
    }, []);

    // 창 크기 변경 시 Canvas 재초기화
    useEffect(() => {
        initCanvas();
        window.addEventListener("resize", initCanvas);
        return () => window.removeEventListener("resize", initCanvas);
    }, [initCanvas]);

    // 페인팅 함수
    const paint = useCallback((clientX: number, clientY: number) => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const rect = container.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(x, y, BRUSH_SIZE, 0, Math.PI * 2);
            ctx.fill();

            // Canvas를 dataURL로 변환
            setMaskDataUrl(canvas.toDataURL());
        }
    }, []);

    // 마우스 이벤트
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsPainting(true);
        paint(e.clientX, e.clientY);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isPainting) return;
        paint(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
        setIsPainting(false);
    };

    const handleMouseLeave = () => {
        setIsPainting(false);
    };

    // 터치 이벤트
    const handleTouchStart = (e: React.TouchEvent) => {
        e.preventDefault();
        setIsPainting(true);
        const touch = e.touches[0];
        paint(touch.clientX, touch.clientY);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        e.preventDefault();
        if (!isPainting) return;
        const touch = e.touches[0];
        paint(touch.clientX, touch.clientY);
    };

    const handleTouchEnd = () => {
        setIsPainting(false);
    };

    // 리셋
    const handleReset = () => {
        initCanvas();
    };

    const selectedStyle = STYLE_VARIANTS.find((v) => v.key === selectedVariant)!;
    const baseStyle = STYLE_VARIANTS.find((v) => v.key === "natural")!;

    return (
        <div className={`relative ${className}`}>
            {/* 이미지 뷰어 */}
            <div
                ref={containerRef}
                className="relative w-full aspect-[3/4] max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-skin-primary/20 border border-white/10 cursor-crosshair select-none"
                style={{ touchAction: "none" }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Base 이미지 (항상 표시) */}
                <Image
                    src={baseStyle.image}
                    alt={baseStyle.label}
                    fill
                    className="object-cover object-top pointer-events-none"
                    priority
                    sizes="(max-width: 768px) 100vw, 768px"
                    quality={90}
                />

                {/* Reveal 이미지 (마스크로 표시) */}
                {selectedVariant !== "natural" && (
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            maskImage: maskDataUrl ? `url(${maskDataUrl})` : "none",
                            WebkitMaskImage: maskDataUrl ? `url(${maskDataUrl})` : "none",
                            maskSize: "100% 100%",
                            WebkitMaskSize: "100% 100%",
                        }}
                    >
                        <Image
                            src={selectedStyle.image}
                            alt={selectedStyle.label}
                            fill
                            className="object-cover object-top"
                            sizes="(max-width: 768px) 100vw, 768px"
                            quality={90}
                        />
                    </div>
                )}

                {/* Hidden Canvas for mask */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 pointer-events-none opacity-0"
                />

                {/* 오버레이 그라데이션 */}
                <div className="absolute inset-0 bg-gradient-to-t from-skin-bg/80 via-transparent to-transparent pointer-events-none" />

                {/* 하단 라벨 */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-center pointer-events-none">
                    <p className="text-lg font-bold text-white drop-shadow-lg">
                        {selectedVariant === "natural" ? "내추럴" : `${selectedStyle.label} 미리보기`}
                    </p>
                    <p className="text-sm text-white/80 drop-shadow">
                        {selectedVariant === "natural" ? "아래에서 스타일을 선택하고 칠해보세요" : "드래그하여 칠하기"}
                    </p>
                </div>

                {/* 리셋 버튼 */}
                {maskDataUrl && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleReset();
                        }}
                        className="absolute top-3 right-3 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors z-10"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* 스타일 선택 버튼 */}
            <div className="flex justify-center gap-2 mt-6">
                {STYLE_VARIANTS.filter(v => v.key !== "natural").map((variant) => (
                    <button
                        key={variant.key}
                        onClick={() => {
                            setSelectedVariant(variant.key);
                            initCanvas();
                        }}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${variant.key === selectedVariant
                                ? "bg-skin-primary text-white shadow-lg shadow-skin-primary/30"
                                : "bg-white/10 text-skin-subtext hover:bg-white/20 hover:text-white"
                            }`}
                    >
                        {variant.label}
                    </button>
                ))}
            </div>

            {/* 안내 문구 */}
            <p className="text-center text-xs text-skin-muted mt-4">
                👆 사진 위를 드래그하여 스타일 변화를 확인해보세요
            </p>
        </div>
    );
}
