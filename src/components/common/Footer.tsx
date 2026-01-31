"use client";

import { useState } from "react";
import Link from "next/link";
import { useHospital } from "@/components/common/HospitalProvider";
import PrivacyPolicyModal from "@/components/common/PrivacyPolicyModal";

interface FooterProps {
    brandName?: string;
    mode?: 'healthcare' | 'medical';
}

export default function Footer({ brandName, mode = 'medical' }: FooterProps) {
    const config = useHospital();

    // Determine the display name based on mode
    const displayName = mode === 'healthcare'
        ? (config.marketingName || brandName || "헬스케어")
        : (config.name || brandName || "에버메디컬");

    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [initialTab, setInitialTab] = useState<'privacy' | 'terms'>('privacy');

    const openModal = (tab: 'privacy' | 'terms') => {
        setInitialTab(tab);
        setShowPrivacyModal(true);
    };

    return (
        <>
            <footer className="py-16 bg-skin-bg border-t border-white/10 relative z-10">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-12">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">✨</span>
                            <span className="text-xl font-bold text-skin-text tracking-wide">{displayName}</span>
                        </div>
                        <div className="text-sm text-skin-subtext space-y-2 font-light">
                            <p>{displayName} {config.address}</p>
                            <p>Tel: {config.tel} ㅣ Fax: {config.fax}</p>
                            {/* Healthcare mode hides business number to avoid hospital exposure if requested, 
                                 but usually business info is required by law. 
                                 User said "병원 노출 안되며 헬스케어 이름 노출" -> I will render generic text or hide specific doctor names if that's the intent.
                                 For now, I'll keep business info but maybe change the label if needed. 
                                 The prompt specifically says "병원 노출 안되며". 
                                 I will just use displayName in the copyright. 
                             */}
                            {mode === 'medical' && (
                                <p className="mt-2 text-xs text-skin-subtext/60">사업자등록번호: {config.businessNumber} ㅣ 대표: {config.representative}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-16 text-sm text-skin-subtext">
                        <div className="space-y-4">
                            <h4 className="font-bold text-skin-text text-base">지원</h4>
                            <ul className="space-y-3">
                                <li>
                                    <button
                                        onClick={() => openModal('terms')}
                                        className="hover:text-skin-primary transition-colors"
                                    >
                                        이용약관
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => openModal('privacy')}
                                        className="hover:text-skin-primary transition-colors"
                                    >
                                        개인정보처리방침
                                    </button>
                                </li>
                                <li>
                                    <Link href="/healthcare/chat?topic=skin-concierge" className="hover:text-skin-primary transition-colors">
                                        문의하기
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/10 text-center text-xs text-skin-subtext/60 font-light">
                    <p>© 2026 {displayName}. All rights reserved.</p>
                </div>
            </footer>

            <PrivacyPolicyModal
                isOpen={showPrivacyModal}
                onClose={() => setShowPrivacyModal(false)}
                initialTab={initialTab}
            />
        </>
    );
}

