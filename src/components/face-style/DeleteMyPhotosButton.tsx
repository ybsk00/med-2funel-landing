"use client";

import { useState } from "react";
import { Trash2, AlertCircle, CheckCircle } from "lucide-react";

interface DeleteMyPhotosButtonProps {
    sessionId?: string;
    onDeleteComplete?: () => void;
    variant?: "default" | "compact";
}

export default function DeleteMyPhotosButton({
    sessionId,
    onDeleteComplete,
    variant = "default",
}: DeleteMyPhotosButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [result, setResult] = useState<"success" | "error" | null>(null);

    const handleDelete = async () => {
        if (!sessionId) return;

        setIsDeleting(true);
        setResult(null);

        try {
            // TODO: 삭제 API 구현 후 연동
            // const res = await fetch(`/api/face-style/session/delete`, {
            //   method: "DELETE",
            //   headers: { "Content-Type": "application/json" },
            //   body: JSON.stringify({ sessionId }),
            // });

            // 임시: 성공 시뮬레이션
            await new Promise(resolve => setTimeout(resolve, 1000));

            setResult("success");
            setShowConfirm(false);

            setTimeout(() => {
                onDeleteComplete?.();
            }, 1500);

        } catch (err) {
            console.error("Delete error:", err);
            setResult("error");
        } finally {
            setIsDeleting(false);
        }
    };

    // 결과 표시
    if (result === "success") {
        return (
            <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-xl">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400">사진이 삭제되었습니다.</span>
            </div>
        );
    }

    if (result === "error") {
        return (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span className="text-sm text-red-400">삭제 중 오류가 발생했습니다.</span>
                <button
                    onClick={() => setResult(null)}
                    className="ml-auto text-xs text-red-300 underline"
                >
                    다시 시도
                </button>
            </div>
        );
    }

    // 확인 모달
    if (showConfirm) {
        return (
            <div className="p-4 bg-skin-surface border border-white/10 rounded-xl">
                <p className="text-sm text-skin-text mb-3">
                    정말 삭제하시겠습니까?<br />
                    <span className="text-skin-muted">원본과 변환 이미지 모두 즉시 삭제됩니다.</span>
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowConfirm(false)}
                        disabled={isDeleting}
                        className="flex-1 py-2 bg-white/10 text-skin-text rounded-lg text-sm hover:bg-white/20 transition-colors"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors flex items-center justify-center gap-1"
                    >
                        {isDeleting ? (
                            <>
                                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                삭제 중...
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-3 h-3" />
                                삭제
                            </>
                        )}
                    </button>
                </div>
            </div>
        );
    }

    // 기본 버튼
    if (variant === "compact") {
        return (
            <button
                onClick={() => setShowConfirm(true)}
                className="text-xs text-skin-muted hover:text-red-400 flex items-center gap-1 transition-colors"
            >
                <Trash2 className="w-3 h-3" />
                내 사진 삭제
            </button>
        );
    }

    return (
        <button
            onClick={() => setShowConfirm(true)}
            className="w-full py-2 bg-white/5 border border-white/10 text-skin-subtext rounded-xl text-sm hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all flex items-center justify-center gap-2"
        >
            <Trash2 className="w-4 h-4" />
            내 사진 삭제
        </button>
    );
}
