"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { RotateCcw, ZoomIn } from "lucide-react";

// 샘플 이미지 매핑 (동일 인물 3장)
const STYLE_VARIANTS = [
    {
        key: "natural",
        label: "내추럴",
        description: "피부결/톤 정리",
        image: "/base.png",
    },
    {
        key: "glow",
        label: "생기 톤",
        description: "혈색/생기 강조",
        image: "/생기 톤.png",
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

const BRUSH_SIZE = 45; // 브러시 반경 (px) - 조금 더 키워서 시원하게
const MIN_ZOOM = 1;
const MAX_ZOOM = 2;

export default function HeroExperience({ className = "" }: HeroExperienceProps) {
    const [selectedVariant, setSelectedVariant] = useState<VariantKey>("glow");
    const [isPainting, setIsPainting] = useState(false);
    const [hasPainted, setHasPainted] = useState(false);
    // maskUrl 제거됨 (직접 렌더링)
    const [zoomLevel, setZoomLevel] = useState(1);
    const [initialPinchDistance, setInitialPinchDistance] = useState<number | null>(null);
    const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const tempCanvasRef = useRef<HTMLCanvasElement | null>(null); // 브러시 합성용 임시 캔버스
    const containerRef = useRef<HTMLDivElement>(null);
    const lastPosRef = useRef<{ x: number; y: number } | null>(null);

    // 선택된 스타일 이미지를 메모리에 로드해둠
    const styleImageRef = useRef<HTMLImageElement | null>(null);

    // 스타일 이미지 로드
    useEffect(() => {
        if (selectedVariant === "natural") {
            styleImageRef.current = null;
            return;
        }

        const variant = STYLE_VARIANTS.find(v => v.key === selectedVariant);
        if (!variant) return;

        const img = new window.Image();
        img.src = variant.image;
        img.crossOrigin = "anonymous"; // 필요 시
        img.onload = () => {
            styleImageRef.current = img;
            // 이미지가 로드되면 캔버스 초기화 (새로운 스타일 적용 준비)
            initCanvas();
        };
    }, [selectedVariant]);

    // Canvas 초기화
    const initCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const rect = container.getBoundingClientRect();
        // 캔버스 크기를 실제 렌더링 크기에 맞춤 (레티나 디스플레이 고려 가능하지만 성능 위해 1:1 권장)
        canvas.width = rect.width;
        canvas.height = rect.height;

        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        // 임시 캔버스도 크기 맞춤 (브러시 작업용)
        if (!tempCanvasRef.current) {
            tempCanvasRef.current = document.createElement('canvas');
        }
        tempCanvasRef.current.width = BRUSH_SIZE * 2;
        tempCanvasRef.current.height = BRUSH_SIZE * 2;

        setHasPainted(false);
    }, []);

    // 창 크기 변경 시 Canvas 재초기화
    useEffect(() => {
        initCanvas();
        window.addEventListener("resize", initCanvas);
        return () => window.removeEventListener("resize", initCanvas);
    }, [initCanvas]);

    // 부드러운 브러시로 페인팅 (직접 렌더링)
    const paintAt = useCallback((x: number, y: number) => {
        const canvas = canvasRef.current;
        const tempCanvas = tempCanvasRef.current;
        const styleImg = styleImageRef.current;

        if (!canvas || !tempCanvas || !styleImg) return;

        const ctx = canvas.getContext("2d");
        const tempCtx = tempCanvas.getContext("2d");
        if (!ctx || !tempCtx) return;

        // 1. 임시 캔버스 초기화
        tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

        // 2. 임시 캔버스에 브러시 알파 마스크 그리기 (중앙이 진하고 가장자리가 흐린 원)
        const gradient = tempCtx.createRadialGradient(BRUSH_SIZE, BRUSH_SIZE, 0, BRUSH_SIZE, BRUSH_SIZE, BRUSH_SIZE);
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.8)");
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        tempCtx.fillStyle = gradient;
        tempCtx.beginPath();
        tempCtx.arc(BRUSH_SIZE, BRUSH_SIZE, BRUSH_SIZE, 0, Math.PI * 2);
        tempCtx.fill();

        // 3. 소스 이미지 합성 (source-in: 기존 그려진 브러시 영역에만 이미지가 나타남)
        tempCtx.globalCompositeOperation = "source-in";

        // 현재 캔버스 좌표(x, y)에 해당하는 이미지 부분을 임시 캔버스에 그림
        // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
        // 이미지의 원본 크기와 캔버스 크기 비율 계산 필요

        // 간단한 처리를 위해: 이미지를 캔버스 크기에 맞춰 그리는 방식(cover)을 가정
        // 실제로는 object-cover 처럼 비율 계산이 필요하지만, 여기서는 캔버스 크기와 이미지 표시 영역이 같다고 가정
        const imgRatio = styleImg.naturalWidth / styleImg.naturalHeight;
        const canvasRatio = canvas.width / canvas.height;

        let drawW, drawH, offsetX, offsetY;

        // object-cover 로직 시뮬레이션
        if (canvasRatio > imgRatio) {
            drawW = canvas.width;
            drawH = canvas.width / imgRatio;
            offsetX = 0;
            offsetY = (canvas.height - drawH) / 2;
        } else {
            drawH = canvas.height;
            drawW = canvas.height * imgRatio;
            offsetX = (canvas.width - drawW) / 2;
            offsetY = 0;
        }

        // 임시 캔버스(브러시) 위치에 해당하는 이미지 영역을 가져와야 함
        // 복잡하므로, 더 쉬운 방법:
        // 1. 메인 캔버스에 브러시 그리기 (destination-out 등으로 구멍 뚫기? 아니면 바로 그리기?)

        // [최적화 방식 수정]
        // 매번 drawImage를 전체 캔버스에 하는건 무거움.
        // 하지만 브러시 크기만큼만 잘라서 그리는건 좌표 계산이 복잡함.
        // -> 성능 테스트 결과: 작은 캔버스(temp)에 부분만 그리는게 훨씬 빠름.

        // 소스 이미지에서 가져올 좌표 계산
        // 현재 캔버스 상의 (x, y)는 이미지 상의 어디인가?
        // 위에서 계산한 drawW, drawH, offsetX, offsetY를 역산

        const sourceX = (x - BRUSH_SIZE - offsetX) * (styleImg.naturalWidth / drawW);
        const sourceY = (y - BRUSH_SIZE - offsetY) * (styleImg.naturalHeight / drawH);
        const sourceW = (BRUSH_SIZE * 2) * (styleImg.naturalWidth / drawW);
        const sourceH = (BRUSH_SIZE * 2) * (styleImg.naturalHeight / drawH);

        tempCtx.drawImage(
            styleImg,
            sourceX, sourceY, sourceW, sourceH, // Source rect
            0, 0, BRUSH_SIZE * 2, BRUSH_SIZE * 2 // Dest rect (temp canvas)
        );

        // 4. 메인 캔버스에 합성
        tempCtx.globalCompositeOperation = "source-over"; // 복구

        // 메인 캔버스에 임시 캔버스 내용 복사
        ctx.drawImage(tempCanvas, x - BRUSH_SIZE, y - BRUSH_SIZE);

        setHasPainted(true);
    }, []);

    // 선을 그리며 페인팅 (드래그 시 부드러운 연결)
    const paintLine = useCallback((fromX: number, fromY: number, toX: number, toY: number) => {
        const distance = Math.sqrt((toX - fromX) ** 2 + (toY - fromY) ** 2);
        const steps = Math.max(1, Math.floor(distance / 5)); // 간격 조절

        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const x = fromX + (toX - fromX) * t;
            const y = fromY + (toY - fromY) * t;
            paintAt(x, y);
        }
    }, [paintAt]);

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

    // 마우스 휠 줌
    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const delta = e.deltaY > 0 ? -0.15 : 0.15;
        setZoomLevel(prev => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev + delta)));
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

    // 두 터치 포인트 거리 계산
    const getTouchDistance = (touches: React.TouchList) => {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    // 터치 이벤트
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

    // 모바일 스크롤 방지를 위한 non-passive 리스너 등록
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const preventDefault = (e: TouchEvent) => {
            if (e.touches.length >= 2 || isPainting) {
                e.preventDefault();
            }
        };

        container.addEventListener('touchstart', preventDefault, { passive: false });
        container.addEventListener('touchmove', preventDefault, { passive: false });

        return () => {
            container.removeEventListener('touchstart', preventDefault);
            container.removeEventListener('touchmove', preventDefault);
        };
    }, [isPainting]);

    const selectedStyle = STYLE_VARIANTS.find((v) => v.key === selectedVariant)!;
    const baseStyle = STYLE_VARIANTS.find((v) => v.key === "natural")!;

    return (
        <div className={`relative ${className}`}>
            {/* 이미지 뷰어 컨테이너 */}
            <div
                ref={containerRef}
                className="relative w-full aspect-[3/4] max-w-xl mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-skin-primary/20 border border-white/10 select-none"
                style={{ touchAction: "none", cursor: "none" }}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* 줌 가능한 이미지 래퍼 */}
                <div
                    className="absolute inset-0 transition-transform duration-150 ease-out origin-center"
                    style={{ transform: `scale(${zoomLevel})` }}
                >
                    {/* Base 이미지 (항상 표시) */}
                    <Image
                        src={baseStyle.image}
                        alt={baseStyle.label}
                        fill
                        className="object-cover object-top pointer-events-none"
                        priority
                        unoptimized
                    />

                    {/* Canvas (Reveal Layer) - 이제 여기에 직접 그림 */}
                    <canvas
                        ref={canvasRef}
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            // 선택된 스타일에 따른 필터 효과 (캔버스 전체에 적용됨)
                            // 주의: 캔버스에 그려진 부분(Reveal된 부분)에만 필터가 먹힘
                            filter: selectedVariant === "glow"
                                ? "saturate(1.15) hue-rotate(-3deg) brightness(1.02) contrast(1.01)"
                                : selectedVariant === "bright"
                                    ? "brightness(1.1) contrast(1.05)"
                                    : "none",
                            opacity: selectedVariant === "glow" ? 0.75 : 1,
                        }}
                    />
                </div>

                {/* 오버레이 그라데이션 */}
                <div className="absolute inset-0 bg-gradient-to-t from-skin-bg/80 via-transparent to-transparent pointer-events-none" />

                {/* 커스텀 브러시 커서 */}
                {cursorPos && (
                    <div
                        className="absolute pointer-events-none z-20 transition-transform duration-75"
                        style={{
                            left: cursorPos.x - BRUSH_SIZE,
                            top: cursorPos.y - BRUSH_SIZE,
                            width: BRUSH_SIZE * 2,
                            height: BRUSH_SIZE * 2,
                        }}
                    >
                        <div
                            className={`w-full h-full rounded-full border-2 transition-all duration-75 ${isPainting
                                ? "border-skin-primary bg-skin-primary/30 scale-95"
                                : "border-white/60 bg-white/10"
                                }`}
                            style={{
                                boxShadow: isPainting
                                    ? "0 0 20px rgba(236, 72, 153, 0.5)"
                                    : "0 0 10px rgba(255,255,255,0.2)",
                            }}
                        />
                    </div>
                )}

                {/* 하단 라벨 */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-center pointer-events-none">
                    <p className="text-lg font-bold text-white drop-shadow-lg">
                        {hasPainted ? `${selectedStyle.label} 미리보기` : "내추럴"}
                    </p>
                    <p className="text-sm text-white/80 drop-shadow">
                        {hasPainted
                            ? "칙칙함은 걷어내고, 숨어있던 '로지 글로우(Rosy Glow)'를 깨워보세요."
                            : "사진 위를 드래그하여 스타일을 칠해보세요"}
                    </p>
                </div>

                {/* 줌 인디케이터 */}
                {zoomLevel > 1 && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-black/50 rounded-lg flex items-center gap-1 text-white text-xs z-10">
                        <ZoomIn className="w-3 h-3" />
                        {Math.round(zoomLevel * 100)}%
                    </div>
                )}

                {/* 리셋 버튼 */}
                {(hasPainted || zoomLevel > 1) && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleReset();
                        }}
                        className="absolute top-3 right-3 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors z-20"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </button>
                )}

                {/* 페인팅 중 효과 */}
                {isPainting && (
                    <div className="absolute inset-0 ring-2 ring-skin-primary/50 rounded-3xl pointer-events-none" />
                )}
            </div>

            {/* 스타일 선택 버튼 */}
            <div className="flex justify-center gap-2 mt-6">
                {STYLE_VARIANTS.filter(v => v.key !== "natural").map((variant) => (
                    <button
                        key={variant.key}
                        onClick={() => {
                            setSelectedVariant(variant.key);
                            // initCanvas는 useEffect에서 처리됨
                        }}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${variant.key === selectedVariant
                            ? "bg-pink-500 text-white shadow-lg shadow-pink-500/30 ring-2 ring-pink-400 ring-offset-2 ring-offset-skin-bg"
                            : "bg-white/10 text-skin-subtext hover:bg-white/20 hover:text-white"
                            }`}
                    >
                        {variant.label}
                    </button>
                ))}
            </div>

            {/* 안내 문구 */}
            <p className="text-center text-xs text-skin-muted mt-4">
                🖌️ 드래그하여 스타일 변화 영역을 칠해보세요
            </p>
        </div>
    );
}
