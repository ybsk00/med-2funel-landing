"use client";

import { useState, useRef, useEffect } from "react";
import { User, ArrowUp, Paperclip, Sparkles, Droplet, Shield, ArrowUpRight, Heart, ChevronDown, Info, Camera, Calendar, Zap, Moon, Brain, Battery } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, redirect } from "next/navigation";
import ReservationModal from "@/components/medical/ReservationModal";
import MedicalInfoPanel from "@/components/medical/MedicalInfoPanel";
import AestheticCheckModal from "@/components/medical/AestheticCheckModal";
import FileUploadModal from "@/components/medical/FileUploadModal";
import MedicationModal from "@/components/medical/MedicationModal";
import SafetyBadge from "@/components/medical/SafetyBadge";
import { useMarketingTracker } from "@/hooks/useMarketingTracker";
import { VALID_TOPICS, TOPIC_LABELS, TOPIC_DESCRIPTIONS, Topic, sanitizeTopic, DEFAULT_TOPIC } from "@/lib/constants/topics";
import { useHospital } from "@/components/common/HospitalProvider";

type Message = {
    role: "user" | "ai";
    content: string;
};

type ActionType = 'RESERVATION_MODAL' | 'DOCTOR_INTRO_MODAL' | 'EVIDENCE_MODAL' | null;

type ChatInterfaceProps = {
    isEmbedded?: boolean;
    isLoggedIn?: boolean;
    mode?: 'healthcare' | 'medical';
    externalMessage?: string;
    onExternalMessageSent?: () => void;
    onAction?: (action: ActionType, data?: any) => void;
    onTabHighlight?: (tabs: ('review' | 'map')[]) => void;
    topic?: string; // NEW: Inline topic override
};

// 모듈 아이콘/컬러 매핑 (확장)
const MODULE_CONFIG: Record<string, { icon: any; color: string }> = {
    // 피부과
    'glow-booster': { icon: Sparkles, color: 'pink' },
    'makeup-killer': { icon: Droplet, color: 'rose' },
    'barrier-reset': { icon: Shield, color: 'teal' },
    'lifting-check': { icon: ArrowUpRight, color: 'purple' },
    'skin-concierge': { icon: Heart, color: 'fuchsia' },

    // 성형외과
    'face-ratio': { icon: Camera, color: 'rose' },
    'trend-check': { icon: Sparkles, color: 'gold' },
    'virtual-plastic': { icon: User, color: 'indigo' },

    // 한의원
    'body-type': { icon: User, color: 'stone' },
    'detox': { icon: Droplet, color: 'amber' },

    // 치과
    'smile-design': { icon: Heart, color: 'cyan' },
    'whitening-check': { icon: Sparkles, color: 'blue' },

    // 정형외과
    'posture-check': { icon: ArrowUpRight, color: 'blue' },
    'spine-reset': { icon: Sparkles, color: 'orange' },

    // 비뇨기과
    'vitality-check': { icon: Sparkles, color: 'yellow' },
    'private-counsel': { icon: Shield, color: 'indigo' },

    // 소아과
    'growth-check': { icon: ArrowUp, color: 'yellow' },
    'fever-guide': { icon: Heart, color: 'red' },

    // 산부인과
    'cycle-check': { icon: Calendar, color: 'pink' },
    'pregnancy-guide': { icon: Heart, color: 'rose' },

    // 내과
    'fatigue-reset': { icon: Droplet, color: 'blue' },
    'digestive-check': { icon: Sparkles, color: 'green' },

    // 암요양
    'immunity-up': { icon: Shield, color: 'amber' },
    'nutrition-plan': { icon: Heart, color: 'orange' },

    // 신경외과
    'headache-check': { icon: Sparkles, color: 'indigo' },
    'spine-balance': { icon: ArrowUpRight, color: 'violet' }
};

export default function ChatInterface(props: ChatInterfaceProps) {
    const config = useHospital();
    const searchParams = useSearchParams();
    const rawTopic = props.topic || searchParams.get("topic"); // Use prop if available
    const topic = sanitizeTopic(rawTopic);
    const { track } = useMarketingTracker();

    // 잘못된 topic이면 리다이렉트
    useEffect(() => {
        if (rawTopic && !VALID_TOPICS.includes(rawTopic as Topic)) {
            // window.location.href = `/healthcare/chat?topic=${DEFAULT_TOPIC}`;
            // Client-side redirect without full reload if possible, but href is safe
        }
    }, [rawTopic]);

    // Track chat start on mount
    useEffect(() => {
        track('tab_click', { metadata: { topic, mode: props.mode || 'healthcare' } });
    }, [topic]);

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [turnCount, setTurnCount] = useState(0);
    const [askedQuestionCount, setAskedQuestionCount] = useState(0);
    const [currentTrack, setCurrentTrack] = useState<string | null>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loginModalContent, setLoginModalContent] = useState({
        title: "상세한 상담이 필요하신가요?",
        desc: "더 정확한 피부 분석과 맞춤형 조언을 위해<br />로그인이 필요합니다."
    });
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [showReservationModal, setShowReservationModal] = useState(false);
    const [showBadgeExpanded, setShowBadgeExpanded] = useState(false);

    // Modal states for quick actions
    const [showAestheticCheckModal, setShowAestheticCheckModal] = useState(false);
    const [showMedicationModal, setShowMedicationModal] = useState(false);
    const [showFileUploadModal, setShowFileUploadModal] = useState(false);

    // 초기 질문 맵
    const initialQuestionMap: Record<string, string> = {
        // 피부과
        'glow-booster': '하루 수분 섭취량은 어느 정도인가요?',
        'makeup-killer': '메이크업이 보통 몇 시간 정도 지속되나요?',
        'barrier-reset': '하루 세안 횟수는 몇 번인가요?',
        'lifting-check': '탄력이 가장 신경 쓰이는 부위는 어디인가요?',
        'skin-concierge': '본인의 피부 타입은 어떻다고 생각하시나요?',

        // 성형외과
        'face-ratio': '가장 개선하고 싶은 얼굴 부위는 어디인가요?',
        'trend-check': '선호하는 연예인이나 스타일이 있으신가요?',
        'virtual-plastic': '어떤 시술 효과를 미리 보고 싶으신가요?',

        // 한의원
        'body-type': '평소 추위를 많이 타시나요, 더위를 많이 타시나요?',
        'detox': '최근 소화불량이나 더부룩함을 자주 느끼시나요?',

        // 치과
        'smile-design': '웃을 때 가장 신경 쓰이는 부분은 무엇인가요?',
        'whitening-check': '평소 커피나 차를 자주 드시나요?',

        // 정형외과
        'posture-check': '하루 중 앉아있는 시간은 대략 몇 시간인가요?',
        'spine-reset': '허리 통증이 주로 언제 발생하나요?',

        // 비뇨기과
        'vitality-check': '최근 피로감이 급격히 늘었다고 느끼시나요?',
        'private-counsel': '어떤 증상에 대해 상담받고 싶으신가요?',

        // 소아과
        'growth-check': '아이의 현재 키와 몸무게를 알고 계신가요?',
        'fever-guide': '현재 아이의 체온은 몇 도인가요?',

        // 산부인과
        'cycle-check': '마지막 생리 시작일은 언제인가요?',
        'pregnancy-guide': '현재 임신 몇 주차이신가요?',

        // 내과
        'fatigue-reset': '하루 평균 수면 시간은 몇 시간인가요?',
        'digestive-check': '식사 후 속이 자주 불편하신가요?',

        // 암요양
        'immunity-up': '최근 감기에 걸리거나 몸이 자주 아프신가요?',
        'nutrition-plan': '현재 식사량은 평소와 비교해 어떤가요?',

        // 신경외과
        'headache-check': '두통이 주로 머리의 어느 부위에서 느껴지나요?',
        'spine-balance': '손이나 발이 저린 증상이 있나요?'
    };

    // 초기 메시지 설정
    useEffect(() => {
        if (props.mode === 'medical') {
            const persona = config.personas.medical;
            setMessages([{
                role: "ai",
                content: `안녕하세요, ${config.name} ${persona.name}입니다.\n\n**✨ ${config.name}**는 ${config.theme.concept} 피부 관리와 미용 시술을 전문으로 하는 피부과입니다.\n\n어떤 피부 고민이 있으신가요? 궁금하신 점을 편하게 질문해주세요.`
            }]);
        } else {
            const persona = config.personas.healthcare;
            const topicLabel = TOPIC_LABELS[topic] || '상담';
            const initialQuestion = initialQuestionMap[topic] || '무엇을 도와드릴까요?';

            setMessages([{
                role: "ai",
                content: `안녕하세요! **${topicLabel}** 상담을 도와드릴 ${persona.name}입니다. ✨\n\n이 대화는 **진단이 아닌 참고용 안내**입니다.\n\n${initialQuestion}`
            }]);
        }
        setTurnCount(0);
    }, [topic, props.mode, config]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // 외부 메시지 자동 발송
    useEffect(() => {
        if (props.externalMessage && !isLoading) {
            sendExternalMessage(props.externalMessage);
        }
    }, [props.externalMessage]);

    const sendExternalMessage = async (message: string) => {
        setMessages(prev => [...prev, { role: "user", content: message }]);
        setIsLoading(true);

        try {
            const response = await fetch(props.isLoggedIn ? "/api/medical/chat" : "/api/healthcare/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: message,
                    history: messages,
                    turnCount: turnCount,
                    topic: topic,
                }),
            });

            if (!response.ok) throw new Error("Failed to send message");

            const data = await response.json();
            const aiContent = data.content;
            setMessages(prev => [...prev, { role: "ai", content: aiContent }]);
            props.onExternalMessageSent?.();

            if (data.action) {
                if (data.action === 'RESERVATION_MODAL' || aiContent.includes('[[ACTION:RESERVATION_MODAL]]')) {
                    setShowReservationModal(true);
                } else {
                    props.onAction?.(data.action, {
                        doctorsData: data.doctorsData,
                        evidenceData: data.evidenceData
                    });
                }
            } else if (aiContent.includes('[[ACTION:RESERVATION_MODAL]]')) {
                setShowReservationModal(true);
            }
        } catch (error) {
            console.error("Error:", error);
            setMessages(prev => [...prev, { role: "ai", content: "죄송합니다. 잠시 문제가 발생했습니다." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageClick = () => {
        if (props.isLoggedIn) return;
        setLoginModalContent({
            title: "이미지 분석 기능",
            desc: "이미지 분석을 통한 피부 상담은<br />로그인 후 이용 가능합니다."
        });
        setShowLoginModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");

        const newTurnCount = turnCount + 1;
        setTurnCount(newTurnCount);
        setMessages(prev => [...prev, { role: "user", content: userMessage }]);

        // 트래킹
        track('question_answered', { metadata: { topic, turn: newTurnCount } });

        setIsLoading(true);

        try {
            const apiEndpoint = props.isLoggedIn ? "/api/medical/chat" : "/api/healthcare/chat";

            const response = await fetch(apiEndpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage,
                    history: messages,
                    turnCount: turnCount,
                    topic: topic,
                    track: currentTrack,
                    askedQuestionCount: askedQuestionCount,
                }),
            });

            if (!response.ok) throw new Error("Failed to send message");

            const data = await response.json();
            const aiContent = data.content;

            if (data.track) setCurrentTrack(data.track);
            if (typeof data.askedQuestionCount === 'number') {
                setAskedQuestionCount(data.askedQuestionCount);
            }

            setMessages(prev => [...prev, { role: "ai", content: aiContent }]);

            if (data.action) {
                if (data.action === 'RESERVATION_MODAL' || aiContent.includes('[[ACTION:RESERVATION_MODAL]]')) {
                    track('reservation_modal_open');
                    setShowReservationModal(true);
                } else {
                    props.onAction?.(data.action, {
                        doctorsData: data.doctorsData,
                        evidenceData: data.evidenceData
                    });
                }
            } else if (aiContent.includes('[[ACTION:RESERVATION_MODAL]]')) {
                track('reservation_modal_open');
                setShowReservationModal(true);
            }

            if (data.highlightTabs && data.highlightTabs.length > 0) {
                props.onTabHighlight?.(data.highlightTabs);
            }

            if (data.isRedFlag) {
                setTurnCount(10);
            }

            // 5턴 완료 트래킹
            if (newTurnCount >= 5) {
                track('chat_completed', { metadata: { topic } });
            }

            if (!props.isLoggedIn && data.requireLogin) {
                if (data.isSymptomTrigger || data.isHardStop) {
                    setTimeout(() => {
                        setLoginModalContent({
                            title: "현재는 참고용 안내 단계입니다",
                            desc: "로그인하면 내용을 저장하고,<br />더 맞춤형으로 정리해 드립니다."
                        });
                        setShowLoginModal(true);
                        if (data.isSymptomTrigger) {
                            setTurnCount(5);
                        }
                    }, 500);
                } else {
                    setTimeout(() => {
                        setLoginModalContent({
                            title: "현재는 참고용 안내 단계입니다",
                            desc: "로그인하면 내용을 저장하고,<br />더 맞춤형으로 정리해 드립니다."
                        });
                        setShowLoginModal(true);
                    }, 1000);
                }
            }
        } catch (error) {
            console.error("Error:", error);
            setMessages(prev => [...prev, { role: "ai", content: "죄송합니다. 잠시 문제가 발생했습니다. 다시 시도해주세요." }]);
        } finally {
            setIsLoading(false);
        }
    };

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
    const isPrimaryDark = config.theme ? isColorDark(config.theme.primary) : true;

    return (
        <div className={`${props.isEmbedded ? "h-full" : "min-h-screen"} ${isThemeDark ? 'bg-skin-bg' : 'bg-stone-50'} font-sans flex flex-col selection:bg-skin-accent selection:text-white`}>
            {/* Header */}
            {!props.isEmbedded && (
                <header className={`${isThemeDark ? 'bg-skin-bg/80 border-white/10' : 'bg-white/80 border-stone-200'} backdrop-blur-md border-b px-6 py-4 flex items-center justify-between sticky top-0 z-50 transition-all duration-300`}>
                    <Link href="/" className="flex items-center gap-3 group cursor-pointer">
                        <span className="text-2xl">✨</span>
                        <span className={`text-xl font-bold tracking-wide ${isThemeDark ? 'text-white' : 'text-slate-900'}`}>
                            {props.mode === 'medical' ? `${config.name} AI` : "에버헬스케어"}
                        </span>
                    </Link>
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <Link href="/login" className="px-6 py-2 bg-skin-primary text-white text-sm font-medium rounded-full hover:bg-skin-accent hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                            로그인
                        </Link>
                    </div>
                </header>
            )}

            <main className={`flex-1 w-full mx-auto ${props.isEmbedded ? "flex flex-col overflow-hidden p-0" : "max-w-5xl px-4 pb-20 pt-6"}`}>
                {/* Policy Badge */}
                {!props.isLoggedIn && (
                    <div className="mb-4">
                        <button
                            onClick={() => setShowBadgeExpanded(!showBadgeExpanded)}
                            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm transition-colors ${isThemeDark ? 'bg-skin-muted/50 text-skin-subtext hover:bg-skin-muted' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                                }`}
                        >
                            <Info size={14} />
                            <span>참고용 안내 | 진단·처방 아님</span>
                            <ChevronDown size={14} className={`transition-transform ${showBadgeExpanded ? 'rotate-180' : ''}`} />
                        </button>
                        {showBadgeExpanded && (
                            <div className={`mt-2 px-4 py-3 rounded-xl text-sm ${isThemeDark ? 'bg-skin-surface text-skin-subtext' : 'bg-white border border-stone-100 text-stone-600 shadow-sm'}`}>
                                본 기능은 참고용 루틴/선택 기준 안내이며, 진단·처방을 대신하지 않습니다.
                                {topic === 'lifting-check' && (
                                    <p className="mt-2 text-skin-primary">
                                        ⚠️ 개인 상태에 따라 달라질 수 있어, 상담 시 확인이 필요합니다.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Logged In: Info Panel | Logged Out: Module Tabs */}
                {!props.isEmbedded && (
                    props.isLoggedIn ? (
                        <MedicalInfoPanel
                            onOpenSymptomCheck={() => setShowAestheticCheckModal(true)}
                            onOpenMedicationHelper={() => setShowMedicationModal(true)}
                            onOpenFileUpload={() => setShowFileUploadModal(true)}
                        />
                    ) : (
                        <div className="mb-6">
                            {/* Healthcare Banner Image */}
                            <div className="relative w-full h-40 md:h-48 rounded-2xl overflow-hidden mb-4 shadow-lg">
                                <Image
                                    src="/GALLERY MINIMAL.png"
                                    alt={`${props.mode === 'medical' ? config.name : '프리미엄'} 스킨케어`}
                                    fill
                                    className="object-cover object-[center_25%]"
                                    priority
                                />
                                <div className={`absolute inset-0 ${isThemeDark ? 'bg-gradient-to-t from-skin-bg/80' : 'bg-gradient-to-t from-black/40'} via-transparent to-transparent`} />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h2 className="text-lg md:text-xl font-bold text-white drop-shadow-lg">
                                        {props.mode === 'medical' ? `${config.name} 프리미엄 스킨케어` : "프리미엄 스킨케어 루틴"}
                                    </h2>
                                    <p className="text-sm text-white/80 drop-shadow">{config.theme.concept} 피부 관리의 시작</p>
                                </div>
                            </div>
                            {/* Module Tabs */}
                            <div className="flex overflow-x-auto gap-2 pb-2 -mx-4 px-4 scrollbar-hide">
                                {VALID_TOPICS.map((t) => {
                                    const modConfig = MODULE_CONFIG[t] || MODULE_CONFIG['glow-booster'];
                                    const IconComponent = modConfig.icon;
                                    const isActive = topic === t;

                                    return (
                                        <Link
                                            key={t}
                                            href={`/healthcare/chat?topic=${t}`}
                                            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full transition-all ${isActive
                                                ? `bg-skin-primary text-white shadow-lg`
                                                : isThemeDark ? 'bg-white/10 text-skin-subtext hover:bg-white/20' : 'bg-white text-stone-500 border border-stone-200 hover:bg-stone-50'
                                                }`}
                                        >
                                            <IconComponent size={16} />
                                            <span className="text-sm font-medium whitespace-nowrap">{TOPIC_LABELS[t]}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )
                )}

                {/* Chat Area */}
                <div className={`backdrop-blur-xl rounded-3xl p-6 space-y-8 shadow-xl ${props.isEmbedded
                    ? "flex-1 overflow-y-auto rounded-none border-x-0 border-t-0 bg-transparent shadow-none"
                    : `${isThemeDark ? 'bg-skin-surface border-white/10' : 'bg-white border-stone-200'} border min-h-[500px]`
                    }`}>
                    {/* Safety Badge (logged in only) */}
                    {props.isLoggedIn && <SafetyBadge />}

                    {/* Turn Counter (로그인 전만 표시) */}
                    {!props.isLoggedIn && (
                        <div className="flex justify-center">
                            <span className={`px-4 py-1.5 text-xs rounded-full border ${isThemeDark ? 'text-skin-subtext bg-skin-bg border-white/10' : 'text-stone-500 bg-stone-50 border-stone-200'
                                }`}>
                                대화 {turnCount}/5 {turnCount >= 5 && "· 로그인하면 계속 상담 가능"}
                            </span>
                        </div>
                    )}

                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex items-start gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                        >
                            <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-md overflow-hidden border-2 transition-transform hover:scale-105 active:scale-95 ${msg.role === "ai"
                                    ? "border-skin-primary bg-skin-bg"
                                    : "border-skin-accent bg-skin-bg"
                                    }`}
                            >
                                {msg.role === "ai" ? (
                                    <span className="text-2xl">✨</span>
                                ) : (
                                    <div className="w-full h-full bg-skin-accent flex items-center justify-center text-white">
                                        <User size={20} />
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-1 max-w-[80%]">
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${msg.role === "user" ? "text-right opacity-60" : "text-left text-skin-primary"}`}>
                                    {msg.role === "ai"
                                        ? (props.mode === 'medical' ? `${config.name} AI` : config.personas.healthcare.name)
                                        : "나"}
                                </span>
                                <div
                                    className={`px-6 py-4 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-line ${msg.role === "ai"
                                        ? isThemeDark
                                            ? "bg-stone-800/50 text-white border border-white/10 rounded-tl-none backdrop-blur-sm"
                                            : "bg-stone-50 text-slate-800 border border-stone-200 rounded-tl-none"
                                        : `${isPrimaryDark ? 'text-white' : 'text-slate-900'} bg-skin-primary rounded-tr-none shadow-md`
                                        }`}
                                >
                                    {msg.content.replace(/[[ACTION:RESERVATION_MODAL]]/g, '').trim()}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full border-2 border-skin-primary bg-skin-bg flex items-center justify-center shadow-md">
                                <span className="text-2xl">✨</span>
                            </div>
                            <div className="bg-skin-surface px-6 py-4 rounded-2xl rounded-tl-none border border-white/10 shadow-sm">
                                <div className="flex gap-1.5">
                                    <span className="w-2 h-2 bg-skin-primary/50 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-skin-primary/50 rounded-full animate-bounce delay-100"></span>
                                    <span className="w-2 h-2 bg-skin-primary/50 rounded-full animate-bounce delay-200"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </main>

            {/* Input Area */}
            <div className={`${props.isEmbedded ? "relative border-t" : "fixed bottom-0 left-0 right-0 border-t backdrop-blur-xl"} p-4 z-40 transition-colors ${isThemeDark ? 'bg-skin-bg/90 border-white/10' : 'bg-white/90 border-stone-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]'
                }`}>
                <div className={`${props.isEmbedded ? "w-full" : "max-w-4xl mx-auto"} relative`}>
                    <form onSubmit={handleSubmit} className={`relative rounded-full shadow-xl border flex items-center p-2 pl-6 transition-all ${isThemeDark ? 'bg-skin-surface border-white/10 hover:shadow-2xl' : 'bg-stone-50 border-stone-200 hover:shadow-md'
                        }`}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="피부 고민이나 궁금한 점을 입력해주세요..."
                            className={`flex-1 bg-transparent border-none focus:ring-0 text-base ${isThemeDark ? 'text-white placeholder:text-skin-subtext/50' : 'text-slate-800 placeholder:text-stone-400'
                                }`}
                            disabled={!props.isLoggedIn && turnCount >= 5}
                        />
                        <button
                            type="button"
                            onClick={handleImageClick}
                            className={`p-3 transition-colors rounded-full ${isThemeDark ? 'text-skin-subtext hover:text-skin-primary hover:bg-white/10' : 'text-stone-400 hover:text-skin-primary hover:bg-stone-100'
                                }`}
                        >
                            <Paperclip size={20} />
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim() || (!props.isLoggedIn && turnCount >= 5)}
                            className="p-3 bg-skin-primary text-white rounded-full hover:bg-skin-accent transition-all disabled:opacity-50 disabled:hover:bg-skin-primary ml-2 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                        >
                            <ArrowUp size={20} />
                        </button>
                    </form>
                    {!props.isLoggedIn && turnCount >= 5 && (
                        <div className="mt-2 text-center">
                            <button
                                onClick={() => { track('login_cta_click'); setShowLoginModal(true); }}
                                className="text-sm text-skin-primary font-medium hover:underline"
                            >
                                상담을 계속하시려면 로그인이 필요합니다
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Login Modal */}
            {showLoginModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center transform transition-all scale-100 border border-white/20">
                        <div className="w-16 h-16 bg-skin-bg rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <span className="text-3xl">✨</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif">
                            {loginModalContent.title}
                        </h3>
                        <p
                            className="text-gray-600 text-sm mb-8 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: loginModalContent.desc }}
                        />
                        <div className="flex flex-col gap-3">
                            <Link
                                href="/login"
                                onClick={() => track('login_cta_click')}
                                className="w-full py-3.5 bg-skin-primary text-white rounded-xl font-bold hover:bg-skin-accent transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-center"
                            >
                                로그인하고 계속하기
                            </Link>
                            <button
                                onClick={() => setShowLoginModal(false)}
                                className="w-full py-3.5 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                            >
                                나중에 하기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reservation Modal */}
            <ReservationModal
                isOpen={showReservationModal}
                onClose={() => setShowReservationModal(false)}
                initialTab="book"
            />

            {/* Aesthetic Check Modal */}
            <AestheticCheckModal
                isOpen={showAestheticCheckModal}
                onClose={() => setShowAestheticCheckModal(false)}
            />

            {/* File Upload Modal */}
            <FileUploadModal
                isOpen={showFileUploadModal}
                onClose={() => setShowFileUploadModal(false)}
            />

            {/* Medication Modal */}
            <MedicationModal
                isOpen={showMedicationModal}
                onClose={() => setShowMedicationModal(false)}
            />
        </div>
    );
}