"use client";

import { useEffect, useRef, useCallback } from "react";

interface Point3D {
    x: number;
    y: number;
    z: number;
}

export default function DentistryThreeBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | undefined>(undefined);
    const timeRef = useRef(0);

    const GRID_SIZE = 40;
    const GRID_SPACING = 30;
    const PERSPECTIVE = 600;

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = canvas.width;
        const h = canvas.height;
        const centerX = width / 2;
        const centerY = h / 2;

        // Clean White/Grey Background
        ctx.fillStyle = "#F8FAFC";
        ctx.fillRect(0, 0, width, h);

        timeRef.current += 0.005;
        const time = timeRef.current;

        // Project function
        const project = (x: number, y: number, z: number) => {
            const scale = PERSPECTIVE / (PERSPECTIVE + z);
            return {
                x: centerX + x * scale,
                y: centerY + y * scale,
                scale
            };
        };

        // 1. Draw Grid
        ctx.strokeStyle = "rgba(0, 206, 209, 0.08)";
        ctx.lineWidth = 1;

        const offsetX = (GRID_SIZE * GRID_SPACING) / 2;
        const offsetY = (GRID_SIZE * GRID_SPACING) / 2;

        // Horizontal lines
        for (let i = 0; i <= GRID_SIZE; i++) {
            ctx.beginPath();
            for (let j = 0; j <= GRID_SIZE; j++) {
                const z = Math.sin(i * 0.2 + time) * 10 + Math.cos(j * 0.2 + time) * 10;
                const p = project(j * GRID_SPACING - offsetX, i * GRID_SPACING - offsetY, z);
                if (j === 0) ctx.moveTo(p.x, p.y);
                else ctx.lineTo(p.x, p.y);
            }
            ctx.stroke();
        }

        // Vertical lines
        for (let j = 0; j <= GRID_SIZE; j++) {
            ctx.beginPath();
            for (let i = 0; i <= GRID_SIZE; i++) {
                const z = Math.sin(i * 0.2 + time) * 10 + Math.cos(j * 0.2 + time) * 10;
                const p = project(j * GRID_SPACING - offsetX, i * GRID_SPACING - offsetY, z);
                if (i === 0) ctx.moveTo(p.x, p.y);
                else ctx.lineTo(p.x, p.y);
            }
            ctx.stroke();
        }

        // 2. Draw 3D Light Bars
        const barCount = 3;
        for (let b = 0; b < barCount; b++) {
            const barPos = ((time * 100 + b * 200) % (GRID_SIZE * GRID_SPACING)) - offsetX;

            // Vertical Light Bar
            ctx.beginPath();
            const gradientV = ctx.createLinearGradient(0, 0, 0, h);
            gradientV.addColorStop(0, "rgba(0, 206, 209, 0)");
            gradientV.addColorStop(0.5, "rgba(0, 206, 209, 0.2)");
            gradientV.addColorStop(1, "rgba(0, 206, 209, 0)");
            ctx.strokeStyle = gradientV;
            ctx.lineWidth = 4;

            const startP = project(barPos, -offsetY, 50);
            const endP = project(barPos, offsetY, 50);
            ctx.moveTo(startP.x, startP.y);
            ctx.lineTo(endP.x, endP.y);
            ctx.stroke();

            // Horizontal Light Bar
            const barPosH = ((time * 80 + b * 150) % (GRID_SIZE * GRID_SPACING)) - offsetY;
            ctx.beginPath();
            const gradientH = ctx.createLinearGradient(0, 0, width, 0);
            gradientH.addColorStop(0, "rgba(0, 206, 209, 0)");
            gradientH.addColorStop(0.5, "rgba(0, 206, 209, 0.15)");
            gradientH.addColorStop(1, "rgba(0, 206, 209, 0)");
            ctx.strokeStyle = gradientH;

            const startPH = project(-offsetX, barPosH, 40);
            const endPH = project(offsetX, barPosH, 40);
            ctx.moveTo(startPH.x, startPH.y);
            ctx.lineTo(endPH.x, endPH.y);
            ctx.stroke();
        }

        animationRef.current = requestAnimationFrame(draw);
    }, []);

    const handleResize = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }, []);

    useEffect(() => {
        handleResize();
        window.addEventListener("resize", handleResize);
        animationRef.current = requestAnimationFrame(draw);
        return () => {
            window.removeEventListener("resize", handleResize);
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [draw, handleResize]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0, opacity: 0.6 }}
        />
    );
}
