"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { RotateCcw, ZoomIn } from "lucide-react";
import { DEPARTMENT_SIMULATIONS, DEFAULT_SIMULATION, DepartmentSimulationConfig, SimulationVariant } from "@/lib/constants/simulations";

interface HeroExperienceProps {
    className?: string;
    department?: string;
}

const BRUSH_SIZE = 45; // 브러시 반경
const MIN_ZOOM = 1;
const MAX_ZOOM = 2;

export default function HeroExperience({ className = "", department = "dermatology" }: HeroExperienceProps) {
    const config: DepartmentSimulationConfig = DEPARTMENT_SIMULATIONS[department] || DEFAULT_SIMULATION;

    // Add "natural" (base) to variants list for the UI logic
    const allVariants: (SimulationVariant | { key: "natural", label: string })[] = [
        { key: "natural", label: "Original" },
        ...config.variants
    ];

    const [selectedVariantKey, setSelectedVariantKey] = useState<string>(config.variants[0].key);
    const [isPainting, setIsPainting] = useState(false);
    const [hasPainted, setHasPainted] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [initialPinchDistance, setInitialPinchDistance] = useState<number | null>(null);
    const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const tempCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const lastPosRef = useRef<{ x: number; y: number } | null>(null);

    // We only use ONE base image for everything now, effects are via CSS Filters
    // This simplifies asset management significantly for 11 departments
    const baseImage = config.baseImage || "/base.png";
    const styleImageRef = useRef<HTMLImageElement | null>(null);

    // Load Base Image for Canvas operations
    useEffect(() => {
        const img = new window.Image();
        img.src = baseImage;
        img.crossOrigin = "anonymous";
        img.onload = () => {
            styleImageRef.current = img;
            initCanvas();
        };
    }, [baseImage]);

    // Canvas Reset on Variant Change (Reset painted area)
    useEffect(() => {
        if (selectedVariantKey === "natural") {
            // Do nothing special, maybe clear canvas?
        }
        initCanvas();
    }, [selectedVariantKey]);

    const initCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        if (!tempCanvasRef.current) {
            tempCanvasRef.current = document.createElement('canvas');
        }
        tempCanvasRef.current.width = BRUSH_SIZE * 2;
        tempCanvasRef.current.height = BRUSH_SIZE * 2;

        setHasPainted(false);
    }, []);

    useEffect(() => {
        initCanvas();
        window.addEventListener("resize", initCanvas);
        return () => window.removeEventListener("resize", initCanvas);
    }, [initCanvas]);

    const paintAt = useCallback((x: number, y: number) => {
        const canvas = canvasRef.current;
        const tempCanvas = tempCanvasRef.current;
        const styleImg = styleImageRef.current;

        if (!canvas || !tempCanvas || !styleImg || selectedVariantKey === 'natural') return;

        const ctx = canvas.getContext("2d");
        const tempCtx = tempCanvas.getContext("2d");
        if (!ctx || !tempCtx) return;

        tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

        const gradient = tempCtx.createRadialGradient(BRUSH_SIZE, BRUSH_SIZE, 0, BRUSH_SIZE, BRUSH_SIZE, BRUSH_SIZE);
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.8)");
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        tempCtx.fillStyle = gradient;
        tempCtx.beginPath();
        tempCtx.arc(BRUSH_SIZE, BRUSH_SIZE, BRUSH_SIZE, 0, Math.PI * 2);
        tempCtx.fill();

        tempCtx.globalCompositeOperation = "source-in";

        const imgRatio = styleImg.naturalWidth / styleImg.naturalHeight;
        const canvasRatio = canvas.width / canvas.height;
        let drawW, drawH, offsetX, offsetY;

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

        const sourceX = (x - BRUSH_SIZE - offsetX) * (styleImg.naturalWidth / drawW);
        const sourceY = (y - BRUSH_SIZE - offsetY) * (styleImg.naturalHeight / drawH);
        const sourceW = (BRUSH_SIZE * 2) * (styleImg.naturalWidth / drawW);
        const sourceH = (BRUSH_SIZE * 2) * (styleImg.naturalHeight / drawH);

        // Draw basic image into brush tip
        tempCtx.drawImage(
            styleImg,
            sourceX, sourceY, sourceW, sourceH,
            0, 0, BRUSH_SIZE * 2, BRUSH_SIZE * 2
        );

        // Apply visual composite - we just draw normal image, 
        // but the CANVAS ELEMENT itself has the CSS Filter.
        // so we just need to ensure we draw opaque pixels here.

        tempCtx.globalCompositeOperation = "source-over";
        ctx.drawImage(tempCanvas, x - BRUSH_SIZE, y - BRUSH_SIZE);
        setHasPainted(true);
    }, [selectedVariantKey]);

    const paintLine = useCallback((fromX: number, fromY: number, toX: number, toY: number) => {
        const distance = Math.sqrt((toX - fromX) ** 2 + (toY - fromY) ** 2);
        const steps = Math.max(1, Math.floor(distance / 5));
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            paintAt(fromX + (toX - fromX) * t, fromY + (toY - fromY) * t);
        }
    }, [paintAt]);

    const getCanvasCoords = useCallback((clientX: number, clientY: number) => {
        const container = containerRef.current;
        if (!container) return null;
        const rect = container.getBoundingClientRect();
        return { x: clientX - rect.left, y: clientY - rect.top };
    }, []);

    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault(); e.stopPropagation();
        const delta = e.deltaY > 0 ? -0.15 : 0.15;
        setZoomLevel(prev => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev + delta)));
    }, []);

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
        if (lastPosRef.current) paintLine(lastPosRef.current.x, lastPosRef.current.y, coords.x, coords.y);
        else paintAt(coords.x, coords.y);
        lastPosRef.current = coords;
    };

    const handleMouseUp = () => { setIsPainting(false); lastPosRef.current = null; };
    const handleMouseLeave = () => { setIsPainting(false); lastPosRef.current = null; setCursorPos(null); };

    // ... Touch handlers omitted for brevity, logic identical to original ...
    // Re-implementing simplified Touch for reliability across depts
    const getTouchDistance = (touches: React.TouchList) => {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        e.preventDefault();
        if (e.touches.length === 2) {
            setInitialPinchDistance(getTouchDistance(e.touches));
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
                if (lastPosRef.current) paintLine(lastPosRef.current.x, lastPosRef.current.y, coords.x, coords.y);
                else paintAt(coords.x, coords.y);
                lastPosRef.current = coords;
            }
        }
    };

    const handleTouchEnd = () => { setIsPainting(false); setInitialPinchDistance(null); lastPosRef.current = null; };

    const handleReset = () => { initCanvas(); setZoomLevel(1); };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const preventDefault = (e: TouchEvent) => { if (e.touches.length >= 2 || isPainting) e.preventDefault(); };
        container.addEventListener('touchstart', preventDefault, { passive: false });
        container.addEventListener('touchmove', preventDefault, { passive: false });
        return () => { container.removeEventListener('touchstart', preventDefault); container.removeEventListener('touchmove', preventDefault); };
    }, [isPainting]);


    // Determine current variant logic
    const activeVariant = config.variants.find(v => v.key === selectedVariantKey);
    // If 'natural' or not found, no effect
    const activeFilter = activeVariant?.filter || "none";
    const activeOpacity = activeVariant?.opacity || 1;

    return (
        <div className={`relative ${className}`}>
            <div className="absolute -top-12 left-0 w-full text-center">
                <h3 className="text-xl font-bold tracking-wider" style={{ color: config.uiTheme.text }}>
                    {config.titles.main}
                </h3>
                <p className="text-sm opacity-80" style={{ color: config.uiTheme.text }}>
                    {config.titles.sub}
                </p>
            </div>

            <div
                ref={containerRef}
                className="relative w-full aspect-[3/4] max-w-xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-white/10 select-none bg-black"
                style={{ touchAction: "none", cursor: "none", borderColor: config.uiTheme.primary + '40' }}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
            >
                <div className="absolute inset-0 transition-transform duration-150 ease-out origin-center" style={{ transform: `scale(${zoomLevel})` }}>
                    <Image
                        src={baseImage}
                        alt="Base Model"
                        fill
                        className="object-cover object-top pointer-events-none"
                        priority
                        unoptimized
                    />

                    {/* The Reveal Canvas - Effect Layer */}
                    <canvas
                        ref={canvasRef}
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            filter: activeFilter, // Apply Dept Specific CSS Filter
                            opacity: activeOpacity,
                            mixBlendMode: activeVariant?.mixBlendMode as any || 'normal'
                        }}
                    />

                    {/* Optional Colored Overlay */}
                    {activeVariant?.overlayColor && hasPainted && (
                        <div
                            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                            style={{
                                backgroundColor: activeVariant.overlayColor,
                                opacity: hasPainted ? 1 : 0,
                                // We mask this div to only show where canvas is drawn? 
                                // Actually pure CSS masking of arbitrary painting is hard. 
                                // Simplified: We just apply color overlay to WHOLE image if needed, 
                                // OR we rely on the canvas filter being enough.
                                // For now, let's skip complex masking of solidity, 
                                // as canvas filter handles most color shifts.
                                display: 'none'
                            }}
                        />
                    )}
                </div>

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                {/* Brush Cursor */}
                {cursorPos && (
                    <div
                        className="absolute pointer-events-none z-20 transition-transform duration-75"
                        style={{ left: cursorPos.x - BRUSH_SIZE, top: cursorPos.y - BRUSH_SIZE, width: BRUSH_SIZE * 2, height: BRUSH_SIZE * 2 }}
                    >
                        <div
                            className={`w-full h-full rounded-full border-2 transition-all duration-75 ${isPainting ? "scale-95" : ""}`}
                            style={{
                                borderColor: config.brushColor,
                                backgroundColor: isPainting ? config.brushColor + '40' : 'rgba(255,255,255,0.1)',
                                boxShadow: isPainting ? `0 0 20px ${config.brushGlow}` : "0 0 10px rgba(255,255,255,0.2)",
                            }}
                        />
                    </div>
                )}

                {/* UI Labels */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-center pointer-events-none">
                    <p className="text-lg font-bold text-white drop-shadow-lg">
                        {hasPainted ? `${activeVariant?.label || '효과'} 적용 중` : "Original"}
                    </p>
                    <p className="text-sm text-white/80 drop-shadow">
                        {hasPainted ? activeVariant?.description : "사진 위를 드래그하여 효과를 확인하세요"}
                    </p>
                </div>

                {/* Reset / Zoom UI */}
                {(hasPainted || zoomLevel > 1) && (
                    <button
                        onClick={(e) => { e.stopPropagation(); handleReset(); }}
                        className="absolute top-3 right-3 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors z-20"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Variant Selectors */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
                {config.variants.map((variant) => (
                    <button
                        key={variant.key}
                        onClick={() => setSelectedVariantKey(variant.key)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border ${variant.key === selectedVariantKey
                                ? `bg-white/10 text-white border-${config.uiTheme.primary} shadow-[0_0_15px_${config.brushGlow}]`
                                : "bg-transparent border-white/10 text-white/50 hover:text-white hover:border-white/30"
                            }`}
                        style={{
                            borderColor: variant.key === selectedVariantKey ? config.uiTheme.primary : undefined,
                            color: variant.key === selectedVariantKey ? config.uiTheme.primary : undefined
                        }}
                    >
                        {variant.label}
                    </button>
                ))}
            </div>

            <p className="text-center text-xs text-white/40 mt-4">
                * 시뮬레이션 결과는 실제 시술 결과와 다를 수 있습니다.
            </p>
        </div>
    );
}
