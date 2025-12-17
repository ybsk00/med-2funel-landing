"use client";

import { X, Sparkles, UserPlus, FileText } from "lucide-react";
import Link from "next/link";

type GatingModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onViewSummary: () => void;
    currentProgress: number; // 4/7
    totalQuestions: number; // 7
};

export default function GatingModal({
    isOpen,
    onClose,
    onViewSummary,
    currentProgress,
    totalQuestions
}: GatingModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors z-10"
                >
                    <X size={20} />
                </button>

                {/* Header with Progress */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                            <Sparkles size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">패턴이 거의 잡혔어요!</h3>
                            <p className="text-emerald-100 text-sm">{currentProgress}/{totalQuestions} 문항 완료</p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white rounded-full transition-all duration-500"
                            style={{ width: `${(currentProgress / totalQuestions) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-gray-700 mb-6 leading-relaxed">
                        여기까지 답변으로 <strong className="text-emerald-600">패턴 분석이 거의 완료</strong>됐어요.
                        <br />
                        결과를 저장하고 <strong>상세 리포트(맞춤 루틴/체크리스트)</strong>를 보려면
                        간편가입이 필요해요.
                    </p>

                    {/* Benefits */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                        <p className="text-xs text-gray-500 mb-3">로그인 후 제공되는 혜택</p>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex items-center gap-2">
                                <FileText size={16} className="text-emerald-500" />
                                상세 리포트 & 맞춤 루틴
                            </li>
                            <li className="flex items-center gap-2">
                                <FileText size={16} className="text-emerald-500" />
                                7일 체크리스트 & 추세 분석
                            </li>
                            <li className="flex items-center gap-2">
                                <FileText size={16} className="text-emerald-500" />
                                결과 저장 & 이어하기
                            </li>
                        </ul>
                    </div>

                    {/* Buttons */}
                    <div className="space-y-3">
                        <Link href="/signup" className="block">
                            <button className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                                <UserPlus size={18} />
                                간편가입하고 상세 보기
                            </button>
                        </Link>
                        <button
                            onClick={onViewSummary}
                            className="w-full py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            일단 요약만 보기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
