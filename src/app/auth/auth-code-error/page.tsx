"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function AuthCodeErrorPage() {
    return (
        <div className="min-h-screen bg-traditional-bg flex flex-col items-center justify-center p-6 font-sans">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-traditional-muted text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-traditional-text mb-3">
                    로그인 오류
                </h1>
                <p className="text-traditional-subtext mb-8 leading-relaxed">
                    로그인 과정에서 문제가 발생했습니다.<br />
                    잠시 후 다시 시도해 주세요.
                </p>
                <Link
                    href="/login"
                    className="block w-full py-3 bg-traditional-primary text-white rounded-lg font-medium hover:bg-traditional-primary/90 transition-colors"
                >
                    로그인 페이지로 돌아가기
                </Link>
            </div>
        </div>
    );
}
