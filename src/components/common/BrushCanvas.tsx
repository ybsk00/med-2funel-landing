"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { RotateCcw, ZoomIn, Bug } from "lucide-react";
import { SimulationVariant } from "@/lib/constants/simulations";

// Default fallback if no variants provided
const DEFAULT_VARIANTS: SimulationVariant[] = [
    {
        key: "natural",
        label: "원본",
        description: "필터 없음",
        filter: "none",
        opacity: 1,
    }
];

interface BrushCanvasProps {
    imageUrl: string;
    variants?: SimulationVariant[]; // Allow passing specific variants
    selectedTreatment: string;
    onTreatmentChange?: (treatment: string) => void;
    className?: string;
    showControls?: boolean;
    aspectRatio?: string;
}

const BRUSH_SIZE = 35;
const MIN_ZOOM = 1;
const MAX_ZOOM = 2;

export default function BrushCanvas({
    imageUrl,
    variants = DEFAULT_VARIANTS,
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
    const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
    const [debugMode, setDebugMode] = useState(false); // Dev Debug Mode

    // Touch handling state
    const [initialPinchDistance, setInitialPinchDistance] = useState<number | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const lastPosRef = useRef<{ x: number; y: number } | null>(null);
    const rafRef = useRef<number | null>(null);

    const currentTreatment = variants.find(v => v.key === selectedTreatment) || variants[0];

    // Canvas Initialize
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

    // Update Mask URL
    const updateMaskUrl = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        setMaskUrl(canvas.toDataURL("image/png"));
    }, []);

    // Paint Logic
    const paintAt = useCallback((x: number, y: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, BRUSH_SIZE);
        // Soft brush edge for smooth blending
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.5)");
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = gradient;

        // Clip to face area (Oval)
        ctx.save();
        ctx.beginPath();
        const centerX = canvas.width / 2;
        const centerY = canvas.height * 0.45;
        const radiusX = canvas.width * 0.35;
        const radiusY = canvas.height * 0.4;
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.clip();

        ctx.beginPath();
        ctx.arc(x, y, BRUSH_SIZE, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        setHasPainted(true);

        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(updateMaskUrl);
    }, [updateMaskUrl]);

    // Line Painting (Interpolation)
    const paintLine = useCallback((fromX: number, fromY: number, toX: number, toY: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const distance = Math.sqrt((toX - fromX) ** 2 + (toY - fromY) ** 2);
        const steps = Math.max(1, Math.floor(distance / 5)); // Optimize steps

        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const x = fromX + (toX - fromX) * t;
            const y = fromY + (toY - fromY) * t;

            const gradient = ctx.createRadialGradient(x, y, 0, x, y, BRUSH_SIZE);
            gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
            gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.5)");
            gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

            ctx.fillStyle = gradient;

            ctx.save();
            ctx.beginPath();
            const centerX = canvas.width / 2;
            const centerY = canvas.height * 0.45;
            const radiusX = canvas.width * 0.35;
            const radiusY = canvas.height * 0.4;
            ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
            ctx.clip();

            ctx.beginPath();
            ctx.arc(x, y, BRUSH_SIZE, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        setHasPainted(true);

        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(updateMaskUrl);
    }, [updateMaskUrl]);

    // Coordinate Helper
    const getCanvasCoords = useCallback((clientX: number, clientY: number) => {
        const container = containerRef.current;
        if (!container) return null;

        const rect = container.getBoundingClientRect();
        return {
            x: clientX - rect.left,
            y: clientY - rect.top,
        };
    }, []);

    // Mouse Events
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
        if (coords) setCursorPos(coords);

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

    // Touch Events
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

    const handleReset = () => {
        initCanvas();
        setZoomLevel(1);
    };

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

    // --- Render Logic Helpers ---
    const renderMaskStyle = (maskUrl: string) => ({
        maskImage: `url(${maskUrl})`,
        WebkitMaskImage: `url(${maskUrl})`,
        maskSize: "100% 100%",
        WebkitMaskSize: "100% 100%",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
    });

    return (
        <div className={`relative ${className}`}>
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
                    {/* 0. Base Image */}
                    <div className="absolute inset-0 w-full h-full">
                        <Image
                            src={imageUrl}
                            alt="Base"
                            fill
                            className="object-cover object-top pointer-events-none"
                            priority
                            unoptimized
                        />
                    </div>

                    {/* Rendering Stack (Only when mask exists) */}
                    {currentTreatment.key !== "natural" && maskUrl && (
                        <>
                            {/* Layer 1: Base Correction (Filter & Blur) */}
                            <div
                                className="absolute inset-0 pointer-events-none transition-all duration-300"
                                style={{
                                    ...renderMaskStyle(maskUrl),
                                    filter: `${currentTreatment.filter} ${currentTreatment.blurPx ? `blur(${currentTreatment.blurPx}px)` : ""}`,
                                    opacity: currentTreatment.opacity,
                                }}
                            >
                                <Image
                                    src={imageUrl}
                                    alt="Filter Layer"
                                    fill
                                    className="object-cover object-top"
                                    unoptimized
                                />
                            </div>

                            {/* Layer 2: Specular Highlight (Advanced Mulgwang) */}
                            {currentTreatment.specular?.enabled && (
                                <div
                                    className="absolute inset-0 pointer-events-none"
                                    style={{
                                        ...renderMaskStyle(maskUrl),
                                        filter: `brightness(${currentTreatment.specular.intensity}) contrast(${currentTreatment.specular.threshold || 1.2}) grayscale(100%) blur(${currentTreatment.specular.blurPx}px)`,
                                        mixBlendMode: currentTreatment.specular.blendMode as any,
                                        opacity: 0.8,
                                    }}
                                >
                                    <Image
                                        src={imageUrl}
                                        alt="Specular Layer"
                                        fill
                                        className="object-cover object-top"
                                        unoptimized
                                    />
                                </div>
                            )}

                            {/* Layer 3: Overlay (Color/Texture) */}
                            {currentTreatment.overlayColor && (
                                <div
                                    className="absolute inset-0 pointer-events-none transition-all duration-300"
                                    style={{
                                        ...renderMaskStyle(maskUrl),
                                        backgroundColor: currentTreatment.overlayColor,
                                        mixBlendMode: currentTreatment.mixBlendMode as any,
                                        opacity: currentTreatment.overlayOpacity ?? 0.5,
                                    }}
                                />
                            )}
                        </>
                    )}

                    {/* DEBUG LAYER: Show Red Mask if Enabled */}
                    {debugMode && maskUrl && (
                        <div
                            className="absolute inset-0 pointer-events-none z-50 border-2 border-red-500"
                            style={{
                                ...renderMaskStyle(maskUrl),
                                backgroundColor: "rgba(255, 0, 0, 0.5)",
                            }}
                        />
                    )}
                </div>

                {/* Hidden Logic Canvas */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 pointer-events-none opacity-0"
                />

                {/* Cursor */}
                {cursorPos && (
                    <div
                        className="absolute pointer-events-none border-2 border-white/50 rounded-full shadow-sm"
                        style={{
                            width: BRUSH_SIZE * 2,
                            height: BRUSH_SIZE * 2,
                            left: cursorPos.x - BRUSH_SIZE,
                            top: cursorPos.y - BRUSH_SIZE,
                        }}
                    />
                )}

                {/* Initial Guide */}
                {!hasPainted && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm animate-pulse">
                            👆 볼 부위를 문질러보세요
                        </div>
                    </div>
                )}
            </div>

            {/* Controls */}
            {showControls && (
                <div className="flex items-center justify-between mt-4">
                    {/* Treatments */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {variants.filter(v => v.key !== "natural").map((variant) => (
                            <button
                                key={variant.key}
                                onClick={() => onTreatmentChange?.(variant.key)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all ${selectedTreatment === variant.key
                                    ? "bg-pink-500 text-white shadow-lg shadow-pink-500/30"
                                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                    }`}
                            >
                                {variant.label}
                            </button>
                        ))}
                    </div>

                    {/* Utility Buttons */}
                    <div className="flex gap-2 shrink-0 ml-2">
                        {/* DEBUG TOGGLE */}
                        <button
                            onClick={() => setDebugMode(!debugMode)}
                            className={`p-2 rounded-full transition-colors ${debugMode ? "bg-red-500 text-white" : "bg-gray-700/80 text-gray-400 hover:text-white"}`}
                            title="Debug Mask"
                        >
                            <Bug className="w-4 h-4" />
                        </button>

                        <button
                            onClick={handleReset}
                            className="p-2 bg-gray-700/80 hover:bg-gray-600 rounded-full text-white transition-colors"
                            title="리셋"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </button>
                        <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-gray-700/80 rounded-full text-white text-xs">
                            <ZoomIn className="w-3 h-3" />
                            <span>{Math.round(zoomLevel * 100)}%</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
