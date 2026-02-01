"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { DEPARTMENTS } from "@/lib/constants/departments";

export default function IntroPage() {
  const [hoveredDept, setHoveredDept] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-pink-500 selection:text-white overflow-x-hidden">
      {/* Background Video Layer */}
      <div className="fixed inset-0 z-0 opacity-40 transition-opacity duration-700">
        {hoveredDept ? (
          <video
            key={hoveredDept} // Key change forces reload for instant switch
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover animate-fade-in"
          >
            <source src={DEPARTMENTS.find(d => d.id === hoveredDept)?.video || "/2.mp4"} type="video/mp4" />
          </video>
        ) : (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/2.mp4" type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">

        {/* Header */}
        <header className="text-center mb-16 space-y-4 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md mb-4 text-xs font-medium text-pink-300">
            <Sparkles className="w-3 h-3" />
            <span>AI 맞춤형 헬스케어</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70">
            당신의 병원을 선택하세요
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-light">
            AI가 분석하는 전문적인 관리 솔루션. <br className="hidden md:block" />
            원하는 진료 과목을 선택하시면 맞춤형 헬스케어 공간으로 이동합니다.
          </p>
        </header>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 w-full max-w-6xl mx-auto px-4">
          {DEPARTMENTS.map((dept) => (
            <Link
              key={dept.id}
              href={`/${dept.id}`}
              onMouseEnter={() => setHoveredDept(dept.id)}
              onMouseLeave={() => setHoveredDept(null)}
              className="group relative flex flex-col items-center justify-center p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-pink-500/50 hover:scale-105 transition-all duration-300 backdrop-blur-sm aspect-square md:aspect-[4/3]"
            >
              <div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                style={{ background: `linear-gradient(135deg, ${dept.theme.primary}, ${dept.theme.secondary})` }}
              />

              <h3 className="text-2xl md:text-3xl font-bold z-10 text-white group-hover:text-pink-200 transition-colors">
                {dept.label}
              </h3>

              <div className="mt-4 flex flex-wrap justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 transform translate-y-2 group-hover:translate-y-0">
                {dept.keywords.slice(0, 2).map(k => (
                  <span key={k} className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/90">
                    #{k}
                  </span>
                ))}
              </div>

              <div className="absolute bottom-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <div className="flex items-center gap-1 text-sm font-medium text-pink-400">
                  입장하기 <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer Info */}
        <footer className="mt-20 text-center text-white/30 text-xs">
          © 2026 AI Healthcare Platform. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
