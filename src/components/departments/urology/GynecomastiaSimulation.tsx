"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Image as ImageIcon, ChevronRight, Loader2, Sparkles, MessageCircle, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function GynecomastiaSimulation() {
  const [status, setStatus] = useState<"idle" | "analyzing" | "result">("idle");

  const startSimulation = () => {
    setStatus("analyzing");
    setTimeout(() => setStatus("result"), 1200);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-10 lg:py-20">
      <div className="bg-black/20 backdrop-blur-3xl rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl">
        <AnimatePresence mode="wait">
          {status === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-8 md:p-16 flex flex-col items-center text-center space-y-10"
            >
              <div className="space-y-4">
                <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black tracking-widest text-[#94a3b8] uppercase">
                  Gynecomastia Analysis MVP
                </span>
                <h3 className="text-3xl md:text-5xl font-black text-white leading-tight">
                  체형 변화 시뮬레이션
                </h3>
                <p className="text-white/50 text-base md:text-lg max-w-xl mx-auto">
                  수술 후 변화될 가슴 라인을 미리 확인하세요. <br />
                  데이터 기반의 정밀 분석으로 현실적인 변화를 보여드립니다.
                </p>
              </div>

              <div className="relative group max-w-md w-full aspect-[4/3] rounded-[2rem] overflow-hidden border border-white/10">
                <Image
                  src="/images/urology_before.jpg"
                  alt="Before Gynecomastia"
                  fill
                  className="object-cover opacity-60 grayscale-[0.5] group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Camera className="w-16 h-16 text-white/20 group-hover:text-white/40 transition-colors" />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <button
                  onClick={startSimulation}
                  className="flex-1 py-5 bg-white text-black font-black text-lg rounded-2xl hover:bg-[#cbd5e1] transition-all flex items-center justify-center gap-2 group shadow-xl active:scale-95"
                >
                  시뮬레이션 시작 <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="flex-1 py-5 bg-white/5 text-white/80 font-bold text-lg rounded-2xl hover:bg-white/10 border border-white/10 transition-all">
                  사진 업로드
                </button>
              </div>
            </motion.div>
          )}

          {status === "analyzing" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-20 flex flex-col items-center justify-center space-y-8"
            >
              <div className="relative">
                <Loader2 className="w-20 h-20 text-white/20 animate-spin" />
                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-white animate-pulse" />
              </div>
              <div className="text-center space-y-2">
                <h4 className="text-2xl font-black text-white tracking-widest uppercase">Analyzing...</h4>
                <p className="text-white/40 text-sm font-medium tracking-tight">체형 데이터를 분석하여 시뮬레이션을 생성 중입니다.</p>
              </div>
            </motion.div>
          )}

          {status === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 md:p-12 space-y-12"
            >
              <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-8">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white">시뮬레이션 분석 결과</h3>
                  <p className="text-white/50 text-sm">가슴 높이와 컨투어의 정밀 변화 예상치입니다.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-white/60 font-black uppercase tracking-widest">Confidence: 94%</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {/* Before */}
                <div className="space-y-4">
                  <div className="relative aspect-[1/1] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
                    <Image src="/images/urology_before.jpg" alt="Before" fill className="object-cover" />
                    <div className="absolute top-6 left-6 px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl text-white font-black text-xs tracking-widest border border-white/20 uppercase">
                      수술 전
                    </div>
                  </div>
                  <div className="px-6 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Current Condition</span>
                      <span className="text-white/80 text-sm font-black">유선형 여유증 의심</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="w-full h-full bg-white/20" />
                    </div>
                  </div>
                </div>

                {/* After */}
                <div className="space-y-4">
                  <div className="relative aspect-[1/1] rounded-[2.5rem] overflow-hidden border-2 border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                    <Image src="/images/urology_after.jpg" alt="After" fill className="object-cover" />
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 1 }}
                      className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none"
                    />
                    <div className="absolute top-6 left-6 px-4 py-2 bg-white text-black rounded-xl font-black text-xs tracking-widest border border-white/20 shadow-xl uppercase">
                      시뮬레이션 후(예시)
                    </div>
                    <div className="absolute bottom-6 right-6 p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="px-6 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-white text-xs font-bold uppercase tracking-widest">Expected Outcome</span>
                      <span className="text-white text-sm font-black">가슴 볼륨 약 42% 감소</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-white/10">
                <a
                  href="#session-clinic-search"
                  className="p-6 bg-white/5 hover:bg-white/10 rounded-[2rem] border border-white/10 transition-all group flex flex-col gap-4 text-left"
                >
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                    <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-white font-black">유명한 병원 찾기</h4>
                    <p className="text-white/40 text-xs">수술 후기가 좋은 비뇨기과를 매칭해드립니다.</p>
                  </div>
                </a>

                <button
                  onClick={() => {
                    const el = document.getElementById('chat-interface');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="p-6 bg-white/5 hover:bg-white/10 rounded-[2rem] border border-white/10 transition-all group flex flex-col gap-4 text-left"
                >
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white font-black">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-white font-black">헬스케어 챗봇 상담</h4>
                    <p className="text-white/40 text-xs">AI와 1분 대화로 상담 리스트를 확보하세요.</p>
                  </div>
                </button>

                <button
                  className="p-6 bg-white text-black rounded-[2.5rem] flex flex-col justify-center items-center gap-3 hover:scale-[1.02] transition-all shadow-2xl active:scale-95"
                >
                  <span className="text-2xl font-black">여유증 상담 예약</span>
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Consultation Schedule</span>
                </button>
              </div>

              <p className="text-center text-[11px] text-white/20 leading-relaxed font-medium">
                * 본 시뮬레이션은 이해를 돕기 위한 예시이며 실제 결과는 체격, 유선 조직의 정도, 수술 방식에 따라 달라질 수 있습니다. <br />
                정밀한 진단은 반드시 비뇨기과 전문의 상담을 통해 확인하시기 바랍니다.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
