"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Loader2, Lock, CheckCircle, Save, ArrowRight, User, Camera } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react"; // Assuming next-auth is used

// --- Mock Data ---
const MOCK_MARKERS = [
  { id: 1, x: 35, y: 40, label: "Point 1" },
  { id: 2, x: 65, y: 40, label: "Point 2" },
  { id: 3, x: 50, y: 60, label: "Point 3" },
  { id: 4, x: 40, y: 75, label: "Point 4" },
];

const PREVIEW_QUESTIONS = [
  "현재 코끝의 각도가 이상적인 비율과 얼마나 차이가 나나요?",
  "눈매 교정 시 비대칭 개선이 가능한 범위는 어느 정도인가요?",
];

const FULL_QUESTIONS = [
  "현재 코끝의 각도가 이상적인 비율과 얼마나 차이가 나나요?",
  "눈매 교정 시 비대칭 개선이 가능한 범위는 어느 정도인가요?",
  "수술 후 붓기나 멍이 빠지는 예상 기간은 어떻게 되나요?",
  "보형물을 사용할 경우 부작용 발생 확률은 얼마나 되나요?",
  "재수술이 필요한 경우 비용과 절차는 어떻게 되나요?",
  "마취 방법(국소/수면/전신)은 무엇이며 안전장치는 있나요?",
  "수술 후 흉터 관리 프로그램이 별도로 제공되나요?",
  "일상생활 복귀까지 며칠 정도 휴식이 필요한가요?",
  "수술 결과가 마음에 들지 않을 경우 AS 정책이 있나요?",
  "담당 의사 선생님의 해당 수술 경험 건수는 대략 얼마나 되나요?",
  "수술 전후 사진 촬영 및 공개 동의 여부는 선택 가능한가요?",
  "복용 중인 약물(영양제 포함) 중 중단해야 할 것이 있나요?",
];

// --- Component ---
export default function PlasticSurgerySimulation() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [simulationState, setSimulationState] = useState<"idle" | "analyzing" | "result">("idle");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // --- Handlers ---
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      startAnalysis();
    }
  };

  const handleUseSample = () => {
    setSelectedImage("/public/images/character-patient.jpg"); // Fallback or assume public path
    // For demo, just use a placeholder if file not found, or a color block
    // Using a reliable placeholder for now
    setSelectedImage("https://placehold.co/600x800/png?text=Patient+Photo"); 
    startAnalysis();
  };

  const startAnalysis = () => {
    setSimulationState("analyzing");
    setTimeout(() => {
      setSimulationState("result");
    }, 2500); // Simulate 2.5s analysis
  };

  const handleLoginRedirect = () => {
    // Redirect to login with return url
    // Since we are in a simulation component, we construct the URL
    const returnUrl = encodeURIComponent(window.location.pathname + "#session-simulation");
    router.push(`/login?redirect=${returnUrl}`);
  };

  // Check auth status to determine Guest vs User view
  const isUser = status === "authenticated";

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 relative">
      <AnimatePresence mode="wait">
        
        {/* --- IDLE STATE --- */}
        {simulationState === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center space-y-8 py-12"
          >
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
                AI 성형 상담 시뮬레이션
              </h2>
              <p className="text-slate-500 max-w-lg mx-auto">
                사진 한 장으로 내 얼굴을 분석하고, 상담 시 꼭 물어봐야 할 질문 리스트를 받아보세요.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <label className="flex-1 cursor-pointer group">
                  <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                  <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 hover:bg-slate-100 hover:border-[#13eca4] transition-all">
                    <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6 text-slate-500" />
                    </div>
                    <span className="font-semibold text-slate-600">사진 업로드</span>
                    <span className="text-xs text-slate-400 mt-1">또는 여기로 드래그</span>
                  </div>
                </label>
                
                <button 
                  onClick={handleUseSample}
                  className="flex-1 flex flex-col items-center justify-center p-8 border-2 border-transparent bg-white shadow-lg rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                   <div className="w-12 h-12 rounded-full bg-[#13eca4]/10 flex items-center justify-center mb-3">
                      <Camera className="w-6 h-6 text-[#13eca4]" />
                    </div>
                    <span className="font-semibold text-slate-800">샘플 사진으로 시작</span>
                </button>
            </div>
            
             <p className="text-xs text-slate-400 mt-4">
              * 업로드된 사진은 분석 후 즉시 폐기됩니다.
            </p>
          </motion.div>
        )}

        {/* --- ANALYZING STATE --- */}
        {simulationState === "analyzing" && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="relative">
              <div className="w-24 h-24 border-4 border-slate-100 border-t-[#13eca4] rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <Loader2 className="w-8 h-8 text-[#13eca4] animate-pulse" />
              </div>
            </div>
            <h3 className="text-xl font-bold mt-8 text-slate-800 animate-pulse">
              AI가 얼굴을 분석하고 있습니다...
            </h3>
            <p className="text-slate-500 mt-2">
              이목구비 비율과 각도를 측정 중입니다.
            </p>
          </motion.div>
        )}

        {/* --- RESULT STATE --- */}
        {simulationState === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full"
          >
            {/* Left: Photo & Markers */}
            <div className="relative rounded-3xl overflow-hidden bg-black shadow-2xl aspect-[3/4] lg:aspect-auto lg:h-[600px] group">
              <Image 
                src={selectedImage || ""} 
                alt="Analysis Target" 
                fill 
                className="object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Scan Line Effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#13eca4]/20 to-transparent h-[10%] w-full animate-[scan_3s_ease-in-out_infinite]" />
              <style jsx>{`
                @keyframes scan {
                  0% { top: -10%; }
                  100% { top: 110%; }
                }
              `}</style>

              {/* Markers */}
              {MOCK_MARKERS.map((marker, idx) => (
                <motion.div
                  key={marker.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 + idx * 0.2 }}
                  className="absolute"
                  style={{ top: `${marker.y}%`, left: `${marker.x}%` }}
                >
                  <div className="relative">
                    <div className="w-4 h-4 bg-[#13eca4] rounded-full shadow-[0_0_15px_rgba(19,236,164,0.8)] animate-pulse" />
                    <div className="absolute -top-1 -left-1 w-6 h-6 border border-[#13eca4] rounded-full animate-ping opacity-50" />
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white whitespace-nowrap border border-white/10">
                      {marker.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right: Results Panel */}
            <div className="flex flex-col space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13eca4]/10 text-[#0eb57d] text-sm font-bold">
                   <CheckCircle className="w-4 h-4" />
                   분석 완료
                </div>
                <h3 className="text-3xl font-bold text-slate-800">
                  상담 전에 확인할 포인트를<br/>정리했어요
                </h3>
                <p className="text-slate-500">
                  사진 기반으로 상담에서 꼭 물어봐야 할 질문을<br/>
                  자동으로 구성했습니다.
                </p>
              </div>

              {/* Cards */}
              <div className="flex-1 space-y-4">
                
                {/* 1. Summary Card */}
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
                  <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <span className="w-2 h-8 bg-[#13eca4] rounded-full"/>
                    분석 포인트 요약
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                     <li>• 눈과 눈 사이의 거리가 이상적인 비율보다 약간 넓습니다.</li>
                     <li>• 코끝의 각도가 95도로 자연스러운 라인입니다.</li>
                     <li>• 하관 비대칭이 미세하게 관찰됩니다.</li>
                  </ul>
                </div>

                {/* 2. Question List Card (Locked/Unlocked) */}
                <div className={`relative bg-white border p-6 rounded-2xl shadow-sm transition-all overflow-hidden ${!isUser ? 'border-slate-200' : 'border-[#13eca4] shadow-md'}`}>
                  <h4 className="font-bold text-slate-800 mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-8 bg-slate-800 rounded-full"/>
                      상담 질문 리스트
                    </div>
                    {isUser && <span className="text-xs bg-[#13eca4] text-white px-2 py-1 rounded-full">12개 생성됨</span>}
                  </h4>

                  {!isUser ? (
                    // Guest View (Locked)
                    <div className="space-y-4">
                      <ul className="space-y-3 opacity-50 blur-[1px]">
                         {PREVIEW_QUESTIONS.map((q, i) => (
                           <li key={i} className="flex gap-2 text-slate-600">
                             <span className="text-[#13eca4] font-bold">Q.</span>
                             {q}
                           </li>
                         ))}
                         <li className="flex gap-2 text-slate-600">
                           <span className="text-[#13eca4] font-bold">Q.</span>
                           ... (로그인 후 전체 보기)
                         </li>
                      </ul>
                      
                      {/* Lock Overlay */}
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10">
                        <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mb-3 shadow-lg">
                           <Lock className="w-5 h-5 text-white" />
                        </div>
                        <h5 className="font-bold text-slate-800 mb-1">
                          전체 리스트가 잠겨있어요
                        </h5>
                        <p className="text-sm text-slate-500 mb-4">
                          로그인하면 질문 리스트 12개를<br/>모두 확인하고 저장할 수 있습니다.
                        </p>
                        <button 
                          onClick={handleLoginRedirect}
                          className="px-6 py-3 bg-[#13eca4] hover:bg-[#0eb57d] text-white font-bold rounded-xl shadow-lg shadow-[#13eca4]/20 transition-all active:scale-95 flex items-center gap-2"
                        >
                          질문 리스트 보기
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    // User View (Unlocked)
                    <div className="space-y-4">
                       <ul className="space-y-3 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                         {FULL_QUESTIONS.map((q, i) => (
                           <li key={i} className="flex gap-3 text-sm text-slate-700 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                             <span className="text-[#13eca4] font-bold shrink-0">Q{i+1}.</span>
                             {q}
                           </li>
                         ))}
                       </ul>
                       <div className="pt-4 border-t border-slate-100 flex gap-3">
                         <button className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                           <Save className="w-4 h-4" />
                           리스트 저장
                         </button>
                         <button className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg">
                           유명한 병원 찾기
                         </button>
                       </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
             {/* Safety Notice */}
             <div className="col-span-1 lg:col-span-2 mt-4 p-4 bg-slate-50 rounded-xl text-center">
                <p className="text-xs text-slate-400">
                  본 시뮬레이션 결과는 AI 분석에 기반한 예시이며, 의학적 진단을 대체할 수 없습니다.<br/>
                  정확한 상담 및 치료 계획은 전문 의료진과의 진료 후 결정됩니다.
                </p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
