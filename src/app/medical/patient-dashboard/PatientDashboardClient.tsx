"use client";

import { useState, Suspense, useEffect } from "react";
import { Calendar, Clock, MoreHorizontal, Send, ClipboardList, Pill, Upload, MessageSquare, MapPin, Users, FileText, Sparkles, Stethoscope, Activity, Shield } from "lucide-react";
import Image from "next/image";
import ChatInterface from "@/components/chat/ChatInterface";
import PatientHeader from "@/components/medical/PatientHeader";
import ReservationModal from "@/components/medical/ReservationModal";
import GenericCheckModal from "@/components/medical/GenericCheckModal";
import MedicationModal from "@/components/medical/MedicationModal";
import FileUploadModal from "@/components/medical/FileUploadModal";
import { DEPARTMENT_CHECK_DATA } from "@/lib/data/department-check-data";
import MapModal from "@/components/medical/MapModal";
import ReviewModal from "@/components/medical/ReviewModal";
import DoctorIntroModal from "@/components/medical/DoctorIntroModal";
import EvidenceModal from "@/components/medical/EvidenceModal";
import { createClient } from "@/lib/supabase/client";
import FaceSimulationModal from "@/components/face-style/FaceSimulationModal";
import { useSession } from "next-auth/react";
import { DOCTORS, SCI_EVIDENCE } from "@/lib/ai/prompts";
import { useHospital } from "@/components/common/HospitalProvider";

export default function PatientDashboardClient() {
    const { data: nextAuthSession } = useSession();
    const config = useHospital(); // Use dynamic config
    const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
    const [isCheckModalOpen, setIsCheckModalOpen] = useState(false); // Generic state for check modal
    const [showMedicationModal, setShowMedicationModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showMapModal, setShowMapModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showDoctorIntroModal, setShowDoctorIntroModal] = useState(false);
    const [showEvidenceModal, setShowEvidenceModal] = useState(false);
    const [showFaceSimulationModal, setShowFaceSimulationModal] = useState(false);
    const [highlightedTabs, setHighlightedTabs] = useState<('review' | 'map')[]>([]);
    const [symptomSummary, setSymptomSummary] = useState<string | undefined>(undefined);  // 증상정리 요약
    const [appointment, setAppointment] = useState({
        date: "예약 없음",
        time: "",
        type: "예정된 진료가 없습니다.",
        doctor: ""
    });
    const [doctors, setDoctors] = useState<any[]>([]);

    const supabase = createClient();

    useEffect(() => {
        fetchLatestAppointment();
        fetchDoctors();
    }, [isReservationModalOpen, nextAuthSession, config]); // Include config in dependency

    const fetchDoctors = async () => {
        try {
            const res = await fetch('/api/doctors');
            const data = await res.json();
            if (data.doctors && data.doctors.length > 0) {
                // Map API format to Modal format
                setDoctors(data.doctors.map((d: any) => ({
                    name: d.name,
                    title: d.title,
                    education: d.education,
                    specialty: d.specialty || [],
                    tracks: d.tracks || [],
                    image: d.image_url
                })));
            } else {
                // Fallback 1: Use config's representative
                const representative = {
                    name: config.representative,
                    title: config.representativeTitle,
                    education: `${config.dept || '전문의'}`,
                    specialty: ["전문 진료", "상담", "치료"],
                    tracks: [],
                    image: "/images/character-doctor.jpg"
                };

                // Fallback 2: Use DOCTORS from prompts if available
                if (DOCTORS && DOCTORS.length > 0) {
                    setDoctors([...DOCTORS.map((d: any) => ({
                        ...d,
                        title: d.role, // role maps to title
                        education: d.field, // field maps to education
                        specialty: d.history // history maps to specialty or similar
                    })), representative]);
                } else {
                    setDoctors([representative]);
                }
            }
        } catch (error) {
            console.error("Doctors fetch error", error);
        }
    };

    const fetchLatestAppointment = async () => {
        try {
            // 1. Get current user IDs
            const { data: { user: supabaseUser } } = await supabase.auth.getUser();
            const supabaseUserId = supabaseUser?.id;
            const naverUserId = nextAuthSession?.user?.id;

            if (!supabaseUserId && !naverUserId) {
                setAppointment({
                    date: "예약 없음",
                    time: "",
                    type: "예정된 진료가 없습니다.",
                    doctor: ""
                });
                return;
            }

            // 2. Query 'appointments' table (Primary source)
            let query = supabase.from('appointments').select('*');

            if (supabaseUserId && naverUserId) {
                query = query.or(`user_id.eq.${supabaseUserId},naver_user_id.eq.${naverUserId}`);
            } else if (supabaseUserId) {
                query = query.eq('user_id', supabaseUserId);
            } else if (naverUserId) {
                query = query.eq('naver_user_id', naverUserId);
            }

            const { data: appointmentData } = await query
                .in('status', ['scheduled', 'pending', 'confirmed'])
                .order('scheduled_at', { ascending: true }) // Get the closest upcoming appointment
                .limit(1)
                .maybeSingle();

            let finalData = null;

            if (appointmentData) {
                const scheduledDate = new Date(appointmentData.scheduled_at);
                finalData = {
                    time: `${scheduledDate.toISOString().split('T')[0]} ${scheduledDate.toTimeString().slice(0, 5)}`,
                    status: appointmentData.status === 'scheduled' ? 'pending' : appointmentData.status,
                    complaint: appointmentData.notes || `${config.name} 진료`,
                    source: 'appointments'
                };
            } else {
                // 3. Fallback to 'patients' table (Legacy or intake source)
                let patientQuery = supabase.from('patients').select('*');

                if (supabaseUserId && naverUserId) {
                    patientQuery = patientQuery.or(`user_id.eq.${supabaseUserId},naver_user_id.eq.${naverUserId}`);
                } else if (supabaseUserId) {
                    patientQuery = patientQuery.eq('user_id', supabaseUserId);
                } else if (naverUserId) {
                    patientQuery = patientQuery.eq('naver_user_id', naverUserId);
                }

                const { data: patientData } = await patientQuery
                    .eq('status', 'pending')
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .maybeSingle();

                if (patientData) {
                    finalData = {
                        time: patientData.time,
                        status: patientData.status,
                        complaint: patientData.complaint || "일반 진료",
                        source: 'patients'
                    };
                }
            }

            if (finalData) {
                // Parse the time string "YYYY-MM-DD HH:MM"
                const timeStr = finalData.time;
                let displayDate = "예약 없음";
                let displayTime = "";
                let shouldHide = false;

                if (timeStr) {
                    // Handle both "YYYY-MM-DD HH:MM" and ISO strings
                    const parts = timeStr.split(' ');
                    if (parts.length === 2) {
                        displayDate = parts[0];
                        displayTime = parts[1];
                    } else {
                        const d = new Date(timeStr);
                        if (!isNaN(d.getTime())) {
                            displayDate = d.toISOString().split('T')[0];
                            displayTime = d.toTimeString().slice(0, 5);
                        }
                    }

                    // Check if 24 hours have passed since the appointment
                    try {
                        const appointmentDate = new Date(timeStr.includes(' ') ? timeStr.replace(' ', 'T') : timeStr);
                        const now = new Date();
                        const diffInHours = (now.getTime() - appointmentDate.getTime()) / (1000 * 60 * 60);

                        // If more than 24 hours passed since appointment time, and it's cancelled or completed
                        if (diffInHours > 24 && (finalData.status === 'cancelled' || finalData.status === 'completed')) {
                            shouldHide = true;
                        }
                    } catch (e) {
                        console.error("Date parsing error", e);
                    }
                }

                if (shouldHide) {
                    setAppointment({
                        date: "예약 없음",
                        time: "",
                        type: "예정된 진료가 없습니다.",
                        doctor: ""
                    });
                } else if (finalData.status === 'cancelled') {
                    setAppointment({
                        date: displayDate,
                        time: displayTime,
                        type: "예약이 취소되었습니다.",
                        doctor: ""
                    });
                } else if (finalData.status === 'completed') {
                    setAppointment({
                        date: "예약 없음",
                        time: "",
                        type: "예정된 진료가 없습니다.",
                        doctor: ""
                    });
                } else {
                    setAppointment({
                        date: displayDate,
                        time: displayTime,
                        type: finalData.complaint || "일반 진료",
                        doctor: `${config.representative} ${config.representativeTitle}`
                    });
                }
            } else {
                setAppointment({
                    date: "예약 없음",
                    time: "",
                    type: "예정된 진료가 없습니다.",
                    doctor: ""
                });
            }
        } catch (error) {
            console.error("Error fetching appointment:", error);
        }
    };

    const handleAIChatStart = (summary: string) => {
        setSymptomSummary(summary);
    };

    // Dynamic Check Icon & Label based on Department
    const getDepartmentCheckInfo = () => {
        const checkData = DEPARTMENT_CHECK_DATA[config.id as string];
        if (!checkData) {
            // Fallback for unknown departments
            return {
                icon: <ClipboardList className="w-4 h-4 md:w-5 md:h-5 text-white" />,
                label: "상담 신청",
                desc: "진료 전 상담을 신청하세요"
            };
        }

        const iconColor = checkData.colorTheme?.iconColor || 'text-white';

        return {
            icon: <ClipboardList className={`w-4 h-4 md:w-5 md:h-5 ${iconColor}`} />,
            label: checkData.title,
            desc: checkData.description
        };
    };

    const { icon: checkIcon, label: checkLabel, desc: checkDesc } = getDepartmentCheckInfo();

    return (
        <div className="min-h-screen bg-skin-bg font-sans selection:bg-skin-accent selection:text-white">
            <PatientHeader />

            <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">

                {/* Header / Appointment Card */}
                <div className="bg-[#1a2332] backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 transition-all hover:shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-sm ${appointment.date === "예약 없음" ? "bg-dental-subtext/20 text-dental-subtext" : "bg-dental-primary/20 text-dental-primary"}`}>
                            <Calendar size={24} />
                        </div>
                        <div>
                            <h2 className="text-sm text-dental-subtext font-medium mb-1">다음 예약 안내</h2>
                            <div className="flex items-baseline gap-2">
                                <span className={`text-xl font-bold ${appointment.date === "예약 없음" ? "text-dental-subtext/60" : "text-white"}`}>{appointment.date}</span>
                                {appointment.time && <span className="text-xl font-bold text-white">{appointment.time}</span>}
                            </div>
                            <p className={`${appointment.date === "예약 없음" ? "text-dental-subtext/60" : appointment.type === "예약이 취소되었습니다." ? "text-red-400" : "text-dental-primary"} text-sm font-medium mt-1`}>{appointment.type}</p>
                        </div>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <button
                            onClick={() => setIsReservationModalOpen(true)}
                            className="flex-1 md:flex-none px-6 py-2.5 bg-dental-primary text-white rounded-xl text-sm font-medium hover:bg-dental-accent transition-all shadow-sm"
                        >
                            예약관리
                        </button>
                    </div>
                </div>

                <ReservationModal
                    isOpen={isReservationModalOpen}
                    onClose={() => {
                        setIsReservationModalOpen(false);
                        fetchLatestAppointment(); // Refresh on close
                    }}
                />

                {/* Generic Check Modal */}
                {isCheckModalOpen && DEPARTMENT_CHECK_DATA[config.id as string] && (
                    <GenericCheckModal
                        isOpen={isCheckModalOpen}
                        onClose={() => setIsCheckModalOpen(false)}
                        config={DEPARTMENT_CHECK_DATA[config.id as string]}
                        onComplete={(summary: string) => {
                            handleAIChatStart(summary);
                            setIsCheckModalOpen(false);
                        }}
                    />
                )}

                {/* Medication Modal */}
                <MedicationModal
                    isOpen={showMedicationModal}
                    onClose={() => setShowMedicationModal(false)}
                    onComplete={(result) => {
                        setSymptomSummary(result);
                        setShowMedicationModal(false);
                    }}
                />

                {/* File Upload Modal (검사결과지 분석) */}
                <FileUploadModal
                    isOpen={showUploadModal}
                    onClose={() => setShowUploadModal(false)}
                    onComplete={(result) => {
                        setSymptomSummary(result);
                        setShowUploadModal(false);
                    }}
                />

                {/* Map Modal (위치 보기) */}
                <MapModal
                    isOpen={showMapModal}
                    onClose={() => setShowMapModal(false)}
                />

                {/* Review Modal (후기 보기) */}
                <ReviewModal
                    isOpen={showReviewModal}
                    onClose={() => setShowReviewModal(false)}
                />

                {/* Video Section with Glassmorphism Quick Actions */}
                <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-white/50 relative">
                    {/* Main Video Banner */}
                    <div className="relative w-full h-96 md:h-[500px]">
                        <video
                            src="/3.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover object-[center_25%]"
                        />
                    </div>

                    {/* Light Gradient Overlay - More transparent */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                    {/* Quick Actions Card - 6 buttons */}
                    <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-3 shadow-lg">
                            <div className="grid grid-cols-7 gap-2">
                                <button
                                    onClick={() => setIsReservationModalOpen(true)}
                                    className="flex flex-col items-center gap-1.5 p-2 bg-white/5 hover:bg-white/20 rounded-xl transition-all duration-300 group"
                                >
                                    <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-blue-500/80 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                        <Calendar className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                    </div>
                                    <span className="text-[10px] md:text-xs font-medium text-white/90 whitespace-nowrap">예약하기</span>
                                </button>
                                <button
                                    onClick={() => setIsCheckModalOpen(true)}
                                    className="flex flex-col items-center gap-1.5 p-2 bg-white/5 hover:bg-white/20 rounded-xl transition-all duration-300 group"
                                >
                                    <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-emerald-500/80 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                        {checkIcon}
                                    </div>
                                    <span className="text-[10px] md:text-xs font-medium text-white/90 whitespace-nowrap">{checkLabel}</span>
                                </button>
                                <button
                                    onClick={() => setShowMedicationModal(true)}
                                    className="flex flex-col items-center gap-1.5 p-2 bg-white/5 hover:bg-white/20 rounded-xl transition-all duration-300 group"
                                >
                                    <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-purple-500/80 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                        <Pill className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                    </div>
                                    <span className="text-[10px] md:text-xs font-medium text-white/90 whitespace-nowrap">복약도우미</span>
                                </button>
                                <button
                                    onClick={() => setShowUploadModal(true)}
                                    className="flex flex-col items-center gap-1.5 p-2 bg-white/5 hover:bg-white/20 rounded-xl transition-all duration-300 group"
                                >
                                    <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-orange-500/80 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                        <Upload className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                    </div>
                                    <span className="text-[10px] md:text-xs font-medium text-white/90 whitespace-nowrap">검사결과지</span>
                                </button>
                                <button
                                    onClick={() => setShowFaceSimulationModal(true)}
                                    className="flex flex-col items-center gap-1.5 p-2 bg-white/5 hover:bg-white/20 rounded-xl transition-all duration-300 group"
                                >
                                    <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-pink-500/80 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                        <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                    </div>
                                    <span className="text-[10px] md:text-xs font-medium text-white/90 whitespace-nowrap">시뮬레이션</span>
                                </button>
                                <button
                                    onClick={() => setShowReviewModal(true)}
                                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-300 group ${highlightedTabs.includes('review')
                                        ? 'bg-amber-500/30 ring-2 ring-amber-400 ring-offset-2 ring-offset-transparent animate-pulse'
                                        : 'bg-white/5 hover:bg-white/20'
                                        }`}
                                >
                                    <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-amber-500/80 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                        <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                    </div>
                                    <span className="text-[10px] md:text-xs font-medium text-white/90 whitespace-nowrap">후기보기</span>
                                </button>
                                <button
                                    onClick={() => setShowMapModal(true)}
                                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-300 group ${highlightedTabs.includes('map')
                                        ? 'bg-rose-500/30 ring-2 ring-rose-400 ring-offset-2 ring-offset-transparent animate-pulse'
                                        : 'bg-white/5 hover:bg-white/20'
                                        }`}
                                >
                                    <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-rose-500/80 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                        <MapPin className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                    </div>
                                    <span className="text-[10px] md:text-xs font-medium text-white/90 whitespace-nowrap">위치보기</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Chat Interface Area */}
                <div className="bg-[#1a2332] backdrop-blur-xl rounded-3xl shadow-xl border border-white/10 overflow-hidden h-[650px] flex flex-col">
                    <div className="p-5 border-b border-white/10 flex justify-between items-center bg-[#1a2332]">
                        <div>
                            <h3 className="font-bold text-white text-lg">{config.id === 'internal' ? '내과 AI 전문상담' : config.id === 'urology' ? '비뇨의학과 AI 상담' : 'AI 예진 상담'}</h3>
                            <p className="text-xs text-dental-primary font-medium flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-dental-primary rounded-full animate-pulse"></span>
                                {config.representativeTitle} 감독 하에 운영
                            </p>
                        </div>
                        <button className="text-dental-subtext hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors">
                            <MoreHorizontal size={20} />
                        </button>
                    </div>

                    {/* 안전 가드 배지 */}
                    <div className="px-5 py-2 bg-amber-900/30 border-b border-amber-700/30">
                        <p className="text-xs text-amber-300 text-center">
                            ⚠️ 본 서비스는 진단/처방이 아닌 생활 정리 도움입니다. 응급 시 119/응급실 이용
                        </p>
                    </div>

                    <div className="flex-1 overflow-hidden bg-dental-bg">
                        <Suspense fallback={<div className="flex items-center justify-center h-full text-dental-subtext">Loading...</div>}>
                            <ChatInterface
                                isEmbedded={true}
                                isLoggedIn={true}
                                mode="medical"
                                externalMessage={symptomSummary}
                                onExternalMessageSent={() => setSymptomSummary(undefined)}
                                onAction={(action, data) => {
                                    if (action === 'DOCTOR_INTRO_MODAL') {
                                        setShowDoctorIntroModal(true);
                                    } else if (action === 'EVIDENCE_MODAL') {
                                        setShowEvidenceModal(true);
                                    }
                                }}
                                onTabHighlight={(tabs) => {
                                    setHighlightedTabs(tabs);
                                    // 3초 후 하이라이트 해제
                                    setTimeout(() => setHighlightedTabs([]), 3000);
                                }}
                            />
                        </Suspense>
                    </div>
                </div>

            </div>

            {/* Doctor Intro Modal */}
            <DoctorIntroModal
                isOpen={showDoctorIntroModal}
                onClose={() => setShowDoctorIntroModal(false)}
                doctors={doctors.length > 0 ? doctors : []}
                hospitalName={config.name}
                onReservation={() => setIsReservationModalOpen(true)}
                onReviewTabClick={() => setShowReviewModal(true)}
                onMapTabClick={() => setShowMapModal(true)}
            />

            {/* Evidence Modal */}
            <EvidenceModal
                isOpen={showEvidenceModal}
                onClose={() => setShowEvidenceModal(false)}
                evidence={SCI_EVIDENCE}
            />

            {/* Face Simulation Modal */}
            <FaceSimulationModal
                isOpen={showFaceSimulationModal}
                onClose={() => setShowFaceSimulationModal(false)}
            />
        </div>
    );
}


