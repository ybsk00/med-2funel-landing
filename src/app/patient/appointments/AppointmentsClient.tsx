'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Bell, Sparkles, ArrowRight, Clock, Edit2, X } from 'lucide-react'

type Appointment = {
    id: string
    scheduled_at: string
    status: string
    notes?: string
    doctor_name?: string
    type?: string
}

export function AppointmentsClientPage({ initialAppointments }: { initialAppointments: Appointment[] }) {
    const router = useRouter()
    const [appointments, setAppointments] = useState(initialAppointments)
    const [showCancelModal, setShowCancelModal] = useState(false)
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
    const [cancelReason, setCancelReason] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    // 미래 예약만 필터링 (취소된 예약 제외)
    const upcomingAppointments = appointments.filter(a =>
        new Date(a.scheduled_at) >= new Date() && a.status !== 'cancelled'
    )

    const getDaysUntil = (dateStr: string) => {
        const date = new Date(dateStr)
        const today = new Date()
        const diff = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        return diff
    }

    const formatDateTime = (dateStr: string) => {
        const date = new Date(dateStr)
        return {
            month: date.getMonth() + 1,
            day: date.getDate(),
            weekday: ['일', '월', '화', '수', '목', '금', '토'][date.getDay()],
            time: date.toLocaleTimeString('ko-KR', { hour: 'numeric', minute: '2-digit', hour12: true })
        }
    }

    const handleCancelClick = (apt: Appointment) => {
        setSelectedAppointment(apt)
        setShowCancelModal(true)
    }

    const handleConfirmCancel = async () => {
        if (!selectedAppointment) return

        setIsLoading(true)
        try {
            const response = await fetch(`/api/patient/appointments/${selectedAppointment.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'cancelled', cancel_reason: cancelReason })
            })

            if (response.ok) {
                // Update local state
                setAppointments(prev =>
                    prev.map(a => a.id === selectedAppointment.id ? { ...a, status: 'cancelled' } : a)
                )
                setShowCancelModal(false)
                setSelectedAppointment(null)
                setCancelReason('')
            } else {
                alert('예약 취소에 실패했습니다.')
            }
        } catch (error) {
            alert('오류가 발생했습니다.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen pb-24" style={{ backgroundColor: '#0a0f1a' }}>
            <div className="max-w-lg mx-auto px-4 pt-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-white">내 예약</h1>
                    <button className="relative p-2 rounded-full hover:bg-white/10 transition-colors">
                        <Bell size={24} className="text-gray-400" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                </div>

                {/* Tab Control */}
                <div
                    className="flex p-1 rounded-full mb-6"
                    style={{ backgroundColor: '#1f2937' }}
                >
                    <button className="flex-1 py-2.5 px-4 text-sm font-medium text-white rounded-full" style={{ backgroundColor: '#374151' }}>
                        예정된 예약
                    </button>
                    <Link href="/patient/history" className="flex-1 py-2.5 px-4 text-sm font-medium text-gray-400 hover:text-gray-300 transition-colors text-center">
                        이전 내역
                    </Link>
                </div>

                {/* AI Health Recommendation */}
                <div
                    className="p-4 rounded-2xl mb-6"
                    style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.15))', border: '1px solid rgba(59, 130, 246, 0.3)' }}
                >
                    <div className="flex items-start gap-3">
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
                        >
                            <Sparkles size={20} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-white font-bold mb-1">AI 건강 알림</h4>
                            <p className="text-sm text-gray-300 leading-relaxed mb-2">
                                정기 검진을 통해 건강을 관리해보세요. <span className="text-blue-400 font-medium">추천 검진일</span>이 다가오고 있습니다.
                            </p>
                            <Link href="/patient/appointments/new" className="inline-flex items-center gap-1 text-sm text-blue-400 font-medium hover:text-blue-300 transition-colors">
                                예약하러 가기 <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Upcoming Appointments Section */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-white">이후 일정</h2>
                    </div>

                    {upcomingAppointments.length > 0 ? (
                        <div className="space-y-3">
                            {upcomingAppointments.map((apt) => {
                                const dt = formatDateTime(apt.scheduled_at)
                                const daysUntil = getDaysUntil(apt.scheduled_at)

                                return (
                                    <div
                                        key={apt.id}
                                        className="p-4 rounded-2xl"
                                        style={{ backgroundColor: '#1a2332', border: '1px solid #1f2937' }}
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Date Box */}
                                            <div
                                                className="flex flex-col items-center justify-center w-14 h-16 rounded-xl flex-shrink-0"
                                                style={{ backgroundColor: '#111827' }}
                                            >
                                                <span className="text-xs text-gray-400">{dt.month}월</span>
                                                <span className="text-xl font-bold text-white">{dt.day}</span>
                                            </div>

                                            {/* Appointment Info */}
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="text-white font-bold">
                                                        {apt.type || '진료 예약'}
                                                    </h4>
                                                    <span className="px-2 py-0.5 text-xs font-medium rounded bg-blue-500/20 text-blue-400">
                                                        D-{daysUntil}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                                    <div className="flex items-center gap-1">
                                                        <Clock size={14} />
                                                        <span>{dt.time}</span>
                                                    </div>
                                                </div>

                                                {apt.notes && (
                                                    <p className="mt-2 text-xs text-gray-500 line-clamp-2">
                                                        {apt.notes}
                                                    </p>
                                                )}

                                                {/* Action Buttons */}
                                                <div className="flex gap-2 mt-3">
                                                    <Link
                                                        href="/patient/appointments/new"
                                                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                                                    >
                                                        <Edit2 size={12} />
                                                        예약 변경
                                                    </Link>
                                                    <button
                                                        onClick={() => handleCancelClick(apt)}
                                                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                                                    >
                                                        <X size={12} />
                                                        예약 취소
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div
                            className="p-6 rounded-2xl text-center"
                            style={{ backgroundColor: '#1a2332', border: '1px solid #1f2937' }}
                        >
                            <p className="text-gray-400 mb-3">추가 예약이 없습니다.</p>
                            <Link href="/patient/appointments/new" className="inline-flex items-center gap-1 text-blue-400 font-medium hover:text-blue-300 transition-colors">
                                새 예약 만들기 <ArrowRight size={14} />
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Cancel Modal */}
            {showCancelModal && selectedAppointment && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
                    <div className="w-full max-w-sm rounded-2xl p-6" style={{ backgroundColor: '#1a2332' }}>
                        <h3 className="text-xl font-bold text-white mb-4">예약을 취소하시겠습니까?</h3>
                        <p className="text-gray-400 mb-4">취소 후에는 다시 예약해야 합니다.</p>

                        <div className="mb-4">
                            <label className="block text-sm text-gray-400 mb-2">취소 사유 (선택)</label>
                            <select
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                className="w-full p-3 rounded-xl bg-gray-800 text-white border border-gray-700"
                            >
                                <option value="">선택해주세요</option>
                                <option value="일정 변경">일정 변경</option>
                                <option value="건강 상태 호전">건강 상태 호전</option>
                                <option value="다른 병원 방문">다른 병원 방문</option>
                                <option value="기타">기타</option>
                            </select>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowCancelModal(false)
                                    setSelectedAppointment(null)
                                    setCancelReason('')
                                }}
                                className="flex-1 py-3 rounded-xl text-white font-medium"
                                style={{ backgroundColor: '#374151' }}
                            >
                                돌아가기
                            </button>
                            <button
                                onClick={handleConfirmCancel}
                                disabled={isLoading}
                                className="flex-1 py-3 rounded-xl text-white font-medium bg-red-500 hover:bg-red-600 disabled:opacity-50"
                            >
                                {isLoading ? '처리중...' : '예약 취소'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
