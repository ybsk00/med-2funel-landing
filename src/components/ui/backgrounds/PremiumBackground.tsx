"use client";

import { useEffect, useRef } from 'react';

interface PremiumBackgroundProps {
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
    };
    intensity?: 'subtle' | 'medium' | 'strong';
}

export default function PremiumBackground({ colors, intensity = 'medium' }: PremiumBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let time = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        // Convert hex to rgb for mixing
        const hexToRgb = (hex: string) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : { r: 0, g: 0, b: 0 };
        };

        const color1 = hexToRgb(colors.primary);
        const color2 = hexToRgb(colors.secondary);
        const color3 = hexToRgb(colors.accent);

        const particles: any[] = [];
        const particleCount = 6;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.min(canvas.width, canvas.height) * 0.4,
                color: i % 3 === 0 ? color1 : i % 3 === 1 ? color2 : color3
            });
        }

        const render = () => {
            time += 0.005;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Base background
            ctx.fillStyle = colors.background;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                // Bounce
                if (p.x < -p.radius) p.vx *= -1;
                if (p.x > canvas.width + p.radius) p.vx *= -1;
                if (p.y < -p.radius) p.vy *= -1;
                if (p.y > canvas.height + p.radius) p.vy *= -1;

                // Circular motion noise
                p.x += Math.sin(time + p.y * 0.01) * 0.5;
                p.y += Math.cos(time + p.x * 0.01) * 0.5;

                const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
                const alpha = intensity === 'subtle' ? 0.05 : intensity === 'medium' ? 0.08 : 0.12;

                gradient.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha})`);
                gradient.addColorStop(1, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0)`);

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [colors, intensity]);

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Aurora Canvas */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full opacity-60 mix-blend-multiply"
            />

            {/* Noise Texture Overlay for Material Feel */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    filter: 'contrast(120%) brightness(100%)'
                }}
            />

            {/* Subtle Grid for Depth (Optional, very faint) */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(19,236,164,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(19,236,164,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />
        </div>
    );
}
