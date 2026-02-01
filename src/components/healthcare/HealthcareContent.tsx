"use client";

import { useState } from "react";
import { useHospital } from "@/components/common/HospitalProvider";
import { HEALTHCARE_CONTENT } from "@/lib/constants/healthcare_content";
import { Check, ArrowRight, Activity, Moon, Sun, ShieldCheck } from "lucide-react";
import ChatInterface from "@/components/chat/ChatInterface";

export default function HealthcareContent() {
    const config = useHospital();
    const content = config.id ? HEALTHCARE_CONTENT[config.id as keyof typeof HEALTHCARE_CONTENT] : null;
    const [activeSession, setActiveSession] = useState<string | null>(null);
    const [isChatOpen, setIsChatOpen] = useState(false);

    // Theme Darkness Check (Refined)
    const isColorDark = (hex?: string) => {
        if (!hex) return false;
        let h = hex.replace('#', '');
        if (h.length === 3) {
            h = h.split('').map(c => c + c).join('');
        }
        if (h.length !== 6) return false;
        const r = parseInt(h.substring(0, 2), 16);
        const g = parseInt(h.substring(2, 4), 16);
        const b = parseInt(h.substring(4, 6), 16);
        return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
    };

    const isThemeDark = config.theme ? isColorDark(config.theme.background) : false;

    // Dynamic Styles based on Theme Mode (Improved contrast for dark mode)
    const styles = {
        // Session A Container
        container: isThemeDark
            ? "bg-white/10 border border-white/20 backdrop-blur-md shadow-2xl"
            : "bg-white/95 border border-stone-200 shadow-2xl backdrop-blur-xl",

        // Session A Checklist Items
        checkItem: isThemeDark
            ? "bg-white/5 border border-white/10 hover:border-skin-primary/50"
            : "bg-white border border-stone-100 shadow-sm hover:border-skin-primary hover:shadow-md",

        // Session B Guide Cards
        guideCard: isThemeDark
            ? "bg-white/10 border border-white/10 hover:border-skin-primary/50 shadow-xl"
            : "bg-white border border-stone-100 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:border-skin-primary/50",

        // Session D FAQ Items
        faqItem: isThemeDark
            ? "bg-white/5 border border-white/5 hover:bg-white/10"
            : "bg-white border border-stone-200 hover:bg-stone-50 shadow-sm"
    };

    if (!content) return null;

    // Helper to scroll to chat
    const scrollToChat = () => {
        setIsChatOpen(true);
        setTimeout(() => {
            const chatElement = document.getElementById("healthcare-content-chat");
            if (chatElement) {
                chatElement.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 100);
    };

    return (
        <section className="w-full max-w-7xl mx-auto px-4 space-y-24 mb-24 relative z-10">
            {/* Session A: 60-Second Check / Symptom Check */}
            <div className={`relative group p-8 md:p-12 rounded-[2.5rem] overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 ${styles.container}`}>
                <div className={`absolute top-0 left-0 w-2 h-full bg-skin-primary opactiy-80`} />

                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start justify-between">
                    <div className="flex-1">
                        <span className="inline-block px-3 py-1 rounded-full bg-skin-primary/10 text-skin-primary text-xs font-bold uppercase tracking-wider mb-4 border border-skin-primary/20">
                            Session A · Check
                        </span>
                        <h3 className="text-3xl md:text-4xl font-black text-skin-text mb-4 leading-tight">
                            {content.sessionA.title}
                        </h3>
                        <p className="text-lg text-skin-text/70 mb-8 max-w-xl">
                            {content.sessionA.subtitle}
                        </p>

                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                            {content.sessionA.checkList.map((item: string, idx: number) => (
                                <div key={idx} className={`flex items-center gap-3 p-4 rounded-xl transition-all cursor-pointer group/item ${styles.checkItem}`}>
                                    <div className="w-6 h-6 rounded-full border-2 border-skin-text/20 flex items-center justify-center group-hover/item:border-skin-primary group-hover/item:bg-skin-primary transition-all">
                                        <Check className="w-3 h-3 text-white opacity-0 group-hover/item:opacity-100" />
                                    </div>
                                    <span className={`font-medium transition-colors ${isThemeDark ? 'text-gray-200' : 'text-gray-800'} group-hover/item:text-skin-primary`}>{item}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8">
                            <button
                                onClick={scrollToChat}
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-skin-primary text-white font-bold text-lg hover:bg-skin-accent transition-all shadow-lg shadow-skin-primary/20 active:scale-95"
                            >
                                {content.sessionA.cta}
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Session B: Guide Cards */}
            <div className="space-y-8">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <span className="inline-block px-3 py-1 rounded-full bg-skin-primary/10 text-skin-primary text-xs font-bold uppercase tracking-wider mb-4 border border-skin-primary/20">
                        Session B · Guide
                    </span>
                    <h3 className="text-2xl md:text-4xl font-black text-skin-text mb-4">
                        {content.sessionB.title}
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {content.sessionB.cards.map((card: { title: string; description: string }, idx: number) => (
                        <div key={idx} className={`p-8 rounded-[2rem] transition-all duration-300 group ${styles.guideCard}`}>
                            <div className="w-12 h-12 rounded-2xl bg-skin-primary/10 flex items-center justify-center mb-6 text-skin-primary group-hover:scale-110 transition-transform duration-300">
                                {idx === 0 ? <Sun className="w-6 h-6" /> : idx === 1 ? <Activity className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                            </div>
                            <h4 className={`text-xl font-bold mb-3 ${isThemeDark ? 'text-white' : 'text-slate-900'}`}>{card.title}</h4>
                            <p className={`${isThemeDark ? 'text-gray-400' : 'text-slate-500'} leading-relaxed font-light`}>{card.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Session C & Chat Integration */}
            <div className={`relative overflow-hidden rounded-[2.5rem] p-8 md:p-16 text-center shadow-2xl transition-all duration-500 ${isThemeDark
                    ? 'bg-gradient-to-br from-skin-primary to-skin-accent text-white'
                    : 'bg-white border border-stone-200'
                }`}>
                <div className="relative z-10 max-w-3xl mx-auto space-y-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 backdrop-blur-md ${isThemeDark ? 'bg-white/20 text-white' : 'bg-skin-primary/10 text-skin-primary border border-skin-primary/20'
                        }`}>
                        Session C · Personal Plan
                    </span>
                    <h3 className={`text-3xl md:text-5xl font-black mb-6 leading-tight ${isThemeDark ? 'text-white' : 'text-slate-900'
                        }`}>
                        {content.sessionC.title}
                    </h3>
                    <p className={`text-lg md:text-xl leading-relaxed mb-8 ${isThemeDark ? 'text-white/80' : 'text-slate-600'
                        }`}>
                        {content.sessionC.description}
                    </p>
                    <button
                        onClick={scrollToChat}
                        className={`inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-xl active:scale-95 ${isThemeDark
                                ? 'bg-white text-skin-primary hover:bg-white/90'
                                : 'bg-skin-primary text-white hover:bg-skin-accent'
                            }`}
                    >
                        {content.sessionC.cta}
                        <ShieldCheck className="w-5 h-5" />
                    </button>
                </div>

                {/* Decorative Elements - Hidden or adjusted for light theme */}
                {isThemeDark && (
                    <>
                        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                        <div className="absolute bottom-0 right-0 w-80 h-80 bg-black/10 rounded-full blur-[80px] translate-x-1/2 translate-y-1/2 pointer-events-none" />
                    </>
                )}
            </div>

            {/* Inline Chat Display Area */}
            <div id="healthcare-content-chat" className={`transition-all duration-700 ease-in-out ${isChatOpen ? 'opacity-100 max-h-[800px] mt-12' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                {isChatOpen && (
                    <div className={`rounded-[2rem] overflow-hidden shadow-2xl border ${isThemeDark ? 'border-white/10 bg-white/5' : 'border-skin-text/10 bg-skin-surface'} h-[600px] md:h-[700px]`}>
                        <ChatInterface
                            mode="healthcare"
                            isEmbedded={true}
                            topic={config.id}
                        />
                    </div>
                )}
            </div>

            {/* Session D: FAQ */}
            <div className="max-w-4xl mx-auto pt-12 border-t border-skin-text/5">
                <h4 className="text-2xl font-bold text-center text-skin-text mb-12 opacity-80">
                    {content.sessionD.title}
                </h4>
                <div className="grid gap-4">
                    {content.sessionD.faqs.map((faq: { question: string; answer: string }, idx: number) => (
                        <div key={idx} className={`p-6 rounded-2xl transition-colors ${styles.faqItem}`}>
                            <h5 className="font-bold text-lg text-skin-text mb-2 flex items-start gap-3">
                                <span className="text-skin-primary">Q.</span>
                                {faq.question}
                            </h5>
                            <p className="text-skin-text/70 pl-8 leading-relaxed font-light">
                                {faq.answer}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

        </section>
    );
}
