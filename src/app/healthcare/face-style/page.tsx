"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { ArrowLeft, Camera } from "lucide-react";
import Link from "next/link";

import ConsentGate from "@/components/face-style/ConsentGate";
import PhotoUploader from "@/components/face-style/PhotoUploader";
import ProgressPanel from "@/components/face-style/ProgressPanel";
import FaceSwapViewer from "@/components/face-style/FaceSwapViewer";
import DeleteMyPhotosButton from "@/components/face-style/DeleteMyPhotosButton";

type Step = "loading" | "consent" | "upload" | "generating" | "result";

export default function FaceStylePage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>("loading");
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isConsentLoading, setIsConsentLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // 초기화: 인증 확인 + 동의 여부 확인
    useEffect(() => {
        const init = async () => {
            try {
                // 1. 사용자 인증 확인
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push("/login?redirect=/healthcare/face-style");
                    return;
                }
                setUserId(user.id);

                // 2. 동의 여부 확인
                const { data: consent } = await supabase
                    .from("consents")
                    .select("*")
                    .eq("user_id", user.id)
                    .eq("type", "face_style")
                    .single();

                if (consent?.agreed) {
                    // 3. 기존 진행 중인 세션 확인
                    const { data: sessions } = await supabase
                        .from("face_style_sessions")
                        .select("*")
                        .eq("user_id", user.id)
                        .neq("status", "failed")
                        .order("created_at", { ascending: false })
                        .limit(1);

                    if (sessions && sessions.length > 0) {
                        const latestSession = sessions[0];
                        setSessionId(latestSession.id);

                        if (latestSession.status === "ready") {
                            setStep("result");
                        } else if (latestSession.status === "generating") {
                            setStep("generating");
                        } else if (latestSession.status === "uploaded") {
                            setStep("generating");
                        } else {
                            setStep("upload");
                        }
                    } else {
                        setStep("upload");
                    }
                } else {
                    setStep("consent");
                }
            } catch (err) {
                console.error("Init error:", err);
                setError("초기화 중 오류가 발생했습니다.");
                setStep("consent");
            }
        };

        init();
    }, [router, supabase]);

    // 동의 처리
    const handleConsent = async () => {
        if (!userId) return;

        setIsConsentLoading(true);
        try {
            const { error: insertError } = await supabase
                .from("consents")
                .upsert({
                    user_id: userId,
                    type: "face_style",
                    agreed: true,
                    agreed_at: new Date().toISOString(),
                }, {
                    onConflict: "user_id,type",
                });

            if (insertError) throw insertError;
            setStep("upload");
        } catch (err) {
            console.error("Consent error:", err);
            setError("동의 저장 중 오류가 발생했습니다.");
        } finally {
            setIsConsentLoading(false);
        }
    };

    // 업로드 완료
    const handleUploadComplete = (newSessionId: string) => {
        setSessionId(newSessionId);
        setStep("generating");
    };

    // 변환 완료
    const handleGenerateComplete = () => {
        setStep("result");
    };

    // 에러 처리
    const handleError = (errorMessage: string) => {
        setError(errorMessage);
    };

    // 삭제 완료
    const handleDeleteComplete = () => {
        setSessionId(null);
        setStep("upload");
    };

    // 새로 시작
    const handleRestart = () => {
        setSessionId(null);
        setStep("upload");
    };

    return (
        <div className="min-h-screen bg-skin-bg text-skin-text">
            {/* 헤더 */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-skin-bg/80 backdrop-blur-md border-b border-white/10">
                <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-skin-subtext hover:text-skin-text transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm">뒤로</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Camera className="w-5 h-5 text-skin-primary" />
                        <span className="font-semibold">사진 스타일 보기</span>
                    </div>
                    <div className="w-16" /> {/* 균형용 */}
                </div>
            </header>

            {/* 메인 콘텐츠 */}
            <main className="pt-20 pb-8 px-4 max-w-lg mx-auto">
                {/* 에러 표시 */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <p className="text-sm text-red-400">{error}</p>
                        <button
                            onClick={() => setError(null)}
                            className="mt-2 text-xs text-red-300 underline"
                        >
                            닫기
                        </button>
                    </div>
                )}

                {/* Step별 컴포넌트 */}
                {step === "loading" && (
                    <div className="flex items-center justify-center py-16">
                        <div className="w-8 h-8 border-2 border-skin-primary/30 border-t-skin-primary rounded-full animate-spin" />
                    </div>
                )}

                {step === "consent" && (
                    <ConsentGate onConsent={handleConsent} isLoading={isConsentLoading} />
                )}

                {step === "upload" && (
                    <PhotoUploader onUploadComplete={handleUploadComplete} />
                )}

                {step === "generating" && sessionId && (
                    <ProgressPanel
                        sessionId={sessionId}
                        onComplete={handleGenerateComplete}
                        onError={handleError}
                    />
                )}

                {step === "result" && sessionId && (
                    <div className="space-y-6">
                        <FaceSwapViewer sessionId={sessionId} />

                        <div className="flex flex-col gap-3">
                            <DeleteMyPhotosButton
                                sessionId={sessionId}
                                onDeleteComplete={handleDeleteComplete}
                            />
                            <button
                                onClick={handleRestart}
                                className="text-xs text-skin-muted hover:text-skin-text text-center"
                            >
                                새 사진으로 다시 시작
                            </button>
                        </div>
                    </div>
                )}
            </main>

            {/* 하단 고지 */}
            <footer className="fixed bottom-0 left-0 right-0 bg-skin-bg/80 backdrop-blur-md border-t border-white/10 py-2">
                <p className="text-xs text-skin-muted text-center">
                    ℹ️ 참고용 안내이며, 진단·처방이 아닙니다.
                </p>
            </footer>
        </div>
    );
}
