"use client";

import { useHospital } from "@/components/common/HospitalProvider";
import { Calendar, Clock, Star, User, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/common/Footer";

export default function MedicalLanding() {
    const config = useHospital();
    const medicalPersona = config.personas.medical;

    return (
        <div className="min-h-screen bg-skin-bg text-skin-text font-serif">
            {/* Top Bar */}
            <div className="bg-skin-primary text-white text-xs py-2 text-center">
                <span className="opacity-90">VIP 전용 예약 센터 운영 중</span>
            </div>

            {/* Navigation */}
            <nav className="border-b border-white/10 bg-skin-bg/95 backdrop-blur sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold tracking-widest uppercase">{config.name}</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm font-medium">
                        <Link href="#" className="hover:text-skin-primary transition-colors">진료안내</Link>
                        <Link href="#" className="hover:text-skin-primary transition-colors">의료진</Link>
                        <Link href="#" className="bg-skin-primary text-white px-5 py-2 rounded-sm hover:bg-skin-accent transition-colors">
                            예약하기
                        </Link>
                        {/* User Profile Mock */}
                        <div className="w-8 h-8 rounded-full bg-skin-surface border border-white/10 flex items-center justify-center">
                            <User className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero: Persona Greeting */}
            <header className="relative py-24 px-6 border-b border-white/5">
                <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
                    <div className="inline-block p-1 rounded-full bg-gradient-to-r from-skin-primary to-skin-accent mb-4">
                        <div className="bg-skin-bg rounded-full px-4 py-1 text-xs font-bold text-white tracking-wider">
                            PREMIUM MEDICAL CONCIERGE
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-medium leading-tight">
                        환영합니다, 강남의원님.<br />
                        <span className="text-skin-primary italic">{medicalPersona.tone.split(',')[0]}</span> 솔루션을 제안합니다.
                    </h1>

                    <p className="text-lg text-skin-subtext max-w-2xl mx-auto leading-relaxed">
                        저는 {config.name}의 {medicalPersona.title}, <strong>{medicalPersona.name}</strong>입니다.<br />
                        귀하의 차트를 분석하여 최적의 진료 일정을 준비해두었습니다.
                    </p>

                    <div className="flex justify-center gap-4 pt-8">
                        <button className="px-8 py-4 bg-white text-skin-bg text-lg font-bold hover:bg-gray-100 transition-colors shadow-xl">
                            지금 상담 시작하기
                        </button>
                        <button className="px-8 py-4 border border-white/20 hover:border-skin-primary hover:text-skin-primary transition-colors text-lg">
                            제안된 시술 보기
                        </button>
                    </div>
                </div>
            </header>

            {/* Reservation Slots */}
            <section className="py-20 bg-skin-surface/30">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Calendar className="w-6 h-6 text-skin-primary" />
                            빠른 예약 가능 시간
                        </h2>
                        <span className="text-sm text-skin-subtext">실시간 업데이트됨</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {['10:00', '11:00', '14:30', '16:00', '19:00'].map((time, i) => (
                            <button key={i} className="group flex flex-col items-center justify-center p-6 border border-white/10 bg-skin-bg hover:border-skin-primary transition-all hover:-translate-y-1">
                                <span className="text-lg font-bold group-hover:text-skin-primary">{time}</span>
                                <span className="text-xs text-skin-subtext mt-1">예약 가능</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Doctor Profile */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h3 className="text-3xl font-bold">
                            {config.representative} {config.representativeTitle}
                        </h3>
                        <p className="text-skin-subtext leading-relaxed">
                            수많은 임상 경험과 노하우로 당신만의 아름다움을 찾아드립니다.
                            {config.name}은 1:1 개인 맞춤 진료를 원칙으로 하며,
                            검증된 장비와 정품 재료만을 사용합니다.
                        </p>
                        <ul className="space-y-3 pt-4">
                            {['보건복지부 인정 전문의', '대한의사협회 정회원', '다수의 방송 출연 및 자문'].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm font-medium">
                                    <Star className="w-4 h-4 text-skin-primary" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="aspect-[3/4] bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center relative overflow-hidden">
                        {/* Doctor Image Placeholder */}
                        <User className="w-32 h-32 text-white/10" />
                        <div className="absolute inset-0 bg-gradient-to-t from-skin-bg via-transparent to-transparent opacity-80" />
                    </div>
                </div>
            </section>

            {/* Footer Info (Exposed as per requirements) */}
            <footer className="bg-skin-surface py-20 px-6 border-t border-white/10 mt-auto">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div>
                        <h4 className="text-2xl font-bold mb-6">{config.name}</h4>
                        <p className="text-skin-subtext text-sm leading-relaxed">
                            {config.address}
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-skin-primary" />
                            <span className="text-xl font-bold">{config.tel}</span>
                        </div>
                        <p className="text-xs text-skin-subtext">
                            사업자등록번호: {config.businessNumber} | 대표: {config.representative}
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
