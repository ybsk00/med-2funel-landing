"use client";

import { useState } from "react";
import Image from "next/image";

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

export default function HeroExperience({ className = "" }: HeroExperienceProps) {
    const [activeVariant, setActiveVariant] = useState<VariantKey>("natural");
    const [isHovering, setIsHovering] = useState(false);

    const activeStyle = STYLE_VARIANTS.find((v) => v.key === activeVariant)!;

    return (
        <div className={`relative ${className}`}>
            {/* 이미지 뷰어 */}
            <div className="relative w-full aspect-[3/4] max-w-sm mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-skin-primary/20 border border-white/10">
                {/* 크로스페이드 이미지 */}
                {STYLE_VARIANTS.map((variant) => (
                    <div
                        key={variant.key}
                        className={`absolute inset-0 transition-opacity duration-300 ${variant.key === activeVariant ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        <Image
                            src={variant.image}
                            alt={variant.label}
                            fill
                            className="object-cover object-top"
                            priority={variant.key === "natural"}
                            sizes="(max-width: 768px) 100vw, 400px"
                        />
                    </div>
                ))}

                {/* 오버레이 그라데이션 */}
                <div className="absolute inset-0 bg-gradient-to-t from-skin-bg/80 via-transparent to-transparent" />

                {/* 하단 라벨 */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                    <p className="text-lg font-bold text-white drop-shadow-lg">
                        {activeStyle.label}
                    </p>
                    <p className="text-sm text-white/80 drop-shadow">
                        {activeStyle.description}
                    </p>
                </div>
            </div>

            {/* 탭 버튼 */}
            <div className="flex justify-center gap-2 mt-6">
                {STYLE_VARIANTS.map((variant) => (
                    <button
                        key={variant.key}
                        onClick={() => setActiveVariant(variant.key)}
                        onMouseEnter={() => {
                            setIsHovering(true);
                            setActiveVariant(variant.key);
                        }}
                        onMouseLeave={() => setIsHovering(false)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${variant.key === activeVariant
                                ? "bg-skin-primary text-white shadow-lg shadow-skin-primary/30"
                                : "bg-white/10 text-skin-subtext hover:bg-white/20 hover:text-white"
                            }`}
                    >
                        {variant.label}
                    </button>
                ))}
            </div>

            {/* 참고용 고지 */}
            <p className="text-center text-xs text-skin-muted mt-4">
                ℹ️ 샘플 이미지입니다. 내 사진으로 해볼까요?
            </p>
        </div>
    );
}
