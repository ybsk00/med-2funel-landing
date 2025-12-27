"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { RefreshCw, AlertCircle } from "lucide-react";
import Link from "next/link";

interface Variant {
    key: string;
    status: string;
    url: string | null;
}

interface FaceSwapViewerProps {
    sessionId: string;
}

const VARIANT_CONFIG = [
    { key: "natural", label: "내추럴", description: "피부결/톤 정리" },
    { key: "makeup", label: "메이크업 느낌", description: "색감/채도 조정" },
    { key: "bright", label: "밝은 톤", description: "밝기/화이트밸런스" },
] as const;

type VariantKey = (typeof VARIANT_CONFIG)[number]["key"];

export default function FaceSwapViewer({ sessionId }: FaceSwapViewerProps) {
    const [activeVariant, setActiveVariant] = useState<VariantKey>("natural");
    const [variants, setVariants] = useState<Variant[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSession = async () => {
        try {
            setIsLoading(true);
            const res = await fetch(`/api/face-style/session/get?sessionId=${sessionId}`);

            if (!res.ok) {
                throw new Error("세션 조회 실패");
            }

            const data = await res.json();
            setVariants(data.variants || []);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSession();
        // URL 갱신을 위해 4분마다 재조회 (5분 만료 전)
        const interval = setInterval(fetchSession, 240000);
        return () => clearInterval(interval);
    }, [sessionId]);

    const activeConfig = VARIANT_CONFIG.find(c => c.key === activeVariant);
    const activeUrl = variants.find(v => v.key === activeVariant)?.url;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <RefreshCw className="w-8 h-8 text-skin-primary animate-spin" />
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
            {/* 이미지 뷰어 */}
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl shadow-skin-primary/20 border border-white/10 mb-6">
                {activeUrl ? (
                    <>
                        {VARIANT_CONFIG.map(config => {
                            const url = variants.find(v => v.key === config.key)?.url;
                            return (
                                <div
                                    key={config.key}
                                    className={`absolute inset-0 transition-opacity duration-300 ${config.key === activeVariant ? "opacity-100" : "opacity-0"
                                        }`}
                                >
                                    {url && (
                                        <Image
                                            src={url}
                                            alt={config.label}
                                            fill
                                            className="object-cover object-top"
                                            unoptimized // Signed URL이므로 최적화 비활성화
                                        />
                                    )}
                                </div>
                            );
                        })}

                        {/* 오버레이 */}
                        <div className="absolute inset-0 bg-gradient-to-t from-skin-bg/80 via-transparent to-transparent" />

                        {/* 하단 라벨 */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                            <p className="text-lg font-bold text-white drop-shadow-lg">
                                {activeConfig?.label}
                            </p>
                            <p className="text-sm text-white/80 drop-shadow">
                                {activeConfig?.description}
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-skin-surface">
                        <p className="text-skin-muted">이미지를 불러올 수 없습니다.</p>
                    </div>
                )}
            </div>

            {/* 탭 버튼 */}
            <div className="flex justify-center gap-2 mb-6">
                {VARIANT_CONFIG.map(config => {
                    const variantData = variants.find(v => v.key === config.key);
                    const isAvailable = variantData?.status === "done" && variantData?.url;

                    return (
                        <button
                            key={config.key}
                            onClick={() => isAvailable && setActiveVariant(config.key)}
                            disabled={!isAvailable}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${config.key === activeVariant
                                    ? "bg-skin-primary text-white shadow-lg shadow-skin-primary/30"
                                    : isAvailable
                                        ? "bg-white/10 text-skin-subtext hover:bg-white/20 hover:text-white"
                                        : "bg-white/5 text-skin-muted cursor-not-allowed"
                                }`}
                        >
                            {config.label}
                        </button>
                    );
                })}
            </div>

            {/* CTA */}
            <div className="space-y-3">
                <Link
                    href="#clinic-search"
                    className="block w-full py-3 bg-skin-primary text-white text-center font-semibold rounded-xl hover:bg-skin-accent transition-colors shadow-lg shadow-skin-primary/30"
                >
                    가까운 피부과 찾기
                </Link>
                <p className="text-xs text-skin-muted text-center">
                    ℹ️ 참고용 안내이며, 진단·처방이 아닙니다.
                </p>
            </div>
        </div>
    );
}
