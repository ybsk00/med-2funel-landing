"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { Lock, ArrowRight, CheckCircle2, RefreshCw, Save, Activity } from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import { Button, Progress, Text, Card, Group, Stack, Badge, ThemeIcon, Loader } from "@mantine/core";

// --- Data & Constants ---

type AxisType = "수면" | "소화" | "피로" | "스트레스";

const QUESTIONS = [
    // 수면
    { id: 1, axis: "수면", text: "잠들기까지 시간이 오래 걸린다." },
    { id: 2, axis: "수면", text: "자다가 중간에 자주 깬다." },
    { id: 3, axis: "수면", text: "아침에 개운하지 않다(기상 피로)." },
    // 소화
    { id: 4, axis: "소화", text: "식후 더부룩함/복부팽만이 잦다." },
    { id: 5, axis: "소화", text: "속이 자주 쓰리거나 트림/가스가 많다." },
    { id: 6, axis: "소화", text: "변비 또는 설사 경향이 반복된다." },
    // 피로
    { id: 7, axis: "피로", text: "오후에 집중력이 급격히 떨어진다." },
    { id: 8, axis: "피로", text: "가벼운 활동 후에도 회복이 느리다." },
    { id: 9, axis: "피로", text: "몸이 무겁고 의욕이 떨어지는 날이 많다." },
    // 스트레스
    { id: 10, axis: "스트레스", text: "긴장/예민함이 쉽게 올라온다." },
    { id: 11, axis: "스트레스", text: "두근거림/답답함을 느끼는 때가 있다." },
    { id: 12, axis: "스트레스", text: "생각이 많아져 머리가 쉬지 않는다." },
];

const CONSULTATION_QUESTIONS = [
    { id: 1, text: "최근 3개월 내에 수면 패턴이 급격히 변한 계기가 있나요?", isPublic: true },
    { id: 2, text: "소화 불량이 특정 음식 섭취 후 심해지나요?", isPublic: true },
    { id: 3, text: "오전/오후 중 피로감이 더 심한 시간대가 언제인가요?", isPublic: false },
    { id: 4, text: "스트레스를 받을 때 주로 나타나는 신체 반응은 무엇인가요?", isPublic: false },
    { id: 5, text: "현재 복용 중인 영양제나 약물이 있나요?", isPublic: false },
    { id: 6, text: "체온 변화(추위/더위)를 남들보다 많이 타나요?", isPublic: false },
    { id: 7, text: "식욕이나 체중의 급격한 변화가 있었나요?", isPublic: false },
];

const ROUTINES = [
    { title: "저녁 루틴", desc: "잠들기 1시간 전, 조명을 낮추고 스마트폰 멀리하기" },
    { title: "식사 템포", desc: "한 입에 30번 씹기, 식사 시간 20분 이상 유지" },
    { title: "수면 환경", desc: "침실 온도 22도 유지, 암막 커튼 활용" },
];

// --- Main Component ---

export default function ConditionBalanceMap() {
    const { data: session } = useSession();
    const [step, setStep] = useState<"intro" | "survey" | "analyzing" | "result">("intro");
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [currentQIdx, setCurrentQIdx] = useState(0);

    // --- Logic ---

    const handleAnswer = (score: number) => {
        setAnswers((prev) => ({ ...prev, [QUESTIONS[currentQIdx].id]: score }));
        
        if (currentQIdx < QUESTIONS.length - 1) {
            setCurrentQIdx((prev) => prev + 1);
        } else {
            setStep("analyzing");
            setTimeout(() => setStep("result"), 1500);
        }
    };

    const scores = useMemo(() => {
        if (Object.keys(answers).length === 0) return [];
        
        const axisScores: Record<string, number> = { "수면": 0, "소화": 0, "피로": 0, "스트레스": 0 };
        const axisCounts: Record<string, number> = { "수면": 0, "소화": 0, "피로": 0, "스트레스": 0 };

        QUESTIONS.forEach((q) => {
            const score = answers[q.id] || 0;
            axisScores[q.axis as AxisType] += score;
            axisCounts[q.axis as AxisType] += 1;
        });

        return Object.keys(axisScores).map((axis) => {
            const avg = axisScores[axis] / axisCounts[axis];
            // Normalize 1-5 to 0-100
            // 1->0, 2->25, 3->50, 4->75, 5->100
            const normalized = Math.round(((avg - 1) / 4) * 100);
            return { subject: axis, A: normalized, fullMark: 100 };
        });
    }, [answers]);

    const topAxis = useMemo(() => {
        if (scores.length === 0) return null;
        return [...scores].sort((a, b) => b.A - a.A)[0];
    }, [scores]);

    const restart = () => {
        setAnswers({});
        setCurrentQIdx(0);
        setStep("intro");
    };

    // --- Renderers ---

    if (step === "intro") {
        return (
            <Card padding="xl" radius="xl" className="max-w-md mx-auto bg-white/80 backdrop-blur-md shadow-xl border-white/20">
                <Stack align="center" gap="md" py="lg">
                    <Badge size="lg" variant="gradient" gradient={{ from: 'orange', to: 'red' }}>AI 헬스케어</Badge>
                    <Text size="xl" fw={900} className="text-slate-800">3분 컨디션 밸런스 점검</Text>
                    <Text c="dimmed" ta="center" size="sm">
                        수면·소화·피로·스트레스 패턴을 정리해<br />
                        나에게 딱 맞는 <strong>상담 질문</strong>을 만들어드립니다.
                    </Text>
                    <Button 
                        size="lg" 
                        fullWidth 
                        onClick={() => setStep("survey")}
                        className="mt-4 bg-slate-900 hover:bg-slate-800 transition-all"
                    >
                        밸런스 점검하기
                    </Button>
                </Stack>
            </Card>
        );
    }

    if (step === "survey") {
        const q = QUESTIONS[currentQIdx];
        const progress = ((currentQIdx) / QUESTIONS.length) * 100;

        return (
            <Card padding="xl" radius="xl" className="max-w-md mx-auto bg-white/90 backdrop-blur-md shadow-xl">
                <Stack gap="lg">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                        <span>QUESTION {currentQIdx + 1}/{QUESTIONS.length}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} size="sm" color="dark" radius="xl" />

                    <div className="py-8 min-h-[160px] flex flex-col justify-center">
                        <Badge mb="md" variant="light" color="gray">{q.axis}</Badge>
                        <Text size="xl" fw={700} className="text-slate-800 leading-snug">
                            {q.text}
                        </Text>
                    </div>

                    <Stack gap="xs">
                        {[1, 2, 3, 4, 5].map((val) => (
                            <button
                                key={val}
                                onClick={() => handleAnswer(val)}
                                className="w-full py-4 px-6 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-400 transition-all text-left flex justify-between items-center group"
                            >
                                <span className="text-slate-600 font-medium group-hover:text-slate-900">
                                    {val === 1 && "전혀 아니다"}
                                    {val === 2 && "아니다"}
                                    {val === 3 && "보통이다"}
                                    {val === 4 && "그렇다"}
                                    {val === 5 && "매우 그렇다"}
                                </span>
                                <div className={`w-4 h-4 rounded-full border-2 border-slate-300 group-hover:border-slate-800`} />
                            </button>
                        ))}
                    </Stack>
                </Stack>
            </Card>
        );
    }

    if (step === "analyzing") {
        return (
            <Card padding="xl" radius="xl" className="max-w-md mx-auto bg-white/80 backdrop-blur-md shadow-xl h-[400px] flex items-center justify-center">
                <Stack align="center" gap="md">
                    <Loader color="dark" type="bars" />
                    <Text fw={700} size="lg">패턴을 분석 중...</Text>
                    <Text size="sm" c="dimmed">잠시만 기다려주세요.</Text>
                </Stack>
            </Card>
        );
    }

    // Result Step
    return (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Chart & Summary */}
            <Card padding="xl" radius="2rem" className="bg-white/90 backdrop-blur-md shadow-2xl border border-white/20">
                <Stack gap="md">
                    <div className="text-center">
                        <Badge variant="outline" color="dark" mb="xs">오늘의 밸런스 맵</Badge>
                        <Text size="xl" fw={900}>
                            {topAxis ? `${topAxis.subject} 관리` : "밸런스"}가 필요해요
                        </Text>
                    </div>

                    <div className="h-[250px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={scores}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12, fontWeight: 700 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="Condition"
                                    dataKey="A"
                                    stroke="#334155"
                                    strokeWidth={3}
                                    fill="#94a3b8"
                                    fillOpacity={0.4}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <Text size="sm" fw={700} mb="xs" className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-blue-500" />
                            분석 요약
                        </Text>
                        <Text size="sm" c="dimmed" lh={1.6}>
                            현재 <strong>{topAxis?.subject}</strong> 지수가 가장 높게 나타났습니다.
                            평소보다 예민하거나 피로감을 느낄 수 있으니, 아래 상담 질문을 확인해보세요.
                        </Text>
                    </div>
                    
                    <Button variant="subtle" color="gray" size="xs" onClick={restart} leftSection={<RefreshCw size={14} />}>
                        다시 검사하기
                    </Button>
                </Stack>
            </Card>

            {/* Right: Consultation Questions (Login Lock) */}
            <Stack>
                <Card padding="xl" radius="2rem" className="bg-white/90 backdrop-blur-md shadow-2xl border border-white/20 flex-1 relative overflow-hidden">
                    <Stack gap="md">
                        <div className="flex items-center justify-between">
                            <Text fw={900} size="lg">상담 질문 리스트</Text>
                            {session ? <Badge color="green">Unlock</Badge> : <Lock size={18} className="text-slate-400" />}
                        </div>
                        
                        <Stack gap="sm">
                            {CONSULTATION_QUESTIONS.map((q, idx) => {
                                const isLocked = !session && !q.isPublic;
                                return (
                                    <div 
                                        key={q.id} 
                                        className={`p-4 rounded-xl border transition-all ${isLocked ? 'blur-[4px] opacity-40 select-none bg-slate-50 border-slate-100' : 'bg-white border-slate-200'}`}
                                    >
                                        <div className="flex gap-3">
                                            <div className="min-w-[24px] h-6 flex items-center justify-center bg-slate-100 rounded-full text-xs font-bold text-slate-600">
                                                {idx + 1}
                                            </div>
                                            <Text size="sm" fw={500} className="text-slate-700">{q.text}</Text>
                                        </div>
                                    </div>
                                );
                            })}
                        </Stack>

                        {/* Login Overlay */}
                        {!session && (
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px] p-6 text-center">
                                <Lock className="w-12 h-12 text-slate-800 mb-4" />
                                <Text fw={800} size="xl" className="text-slate-900 mb-2">
                                    전체 질문 보기
                                </Text>
                                <Text size="sm" c="dimmed" mb="lg">
                                    로그인하고 맞춤형 상담 질문과<br/>건강 루틴을 저장하세요.
                                </Text>
                                <Button 
                                    size="lg" 
                                    color="dark"
                                    onClick={() => signIn()}
                                    rightSection={<ArrowRight size={16} />}
                                    className="shadow-xl hover:translate-y-[-2px] transition-transform"
                                >
                                    로그인하고 확인하기
                                </Button>
                            </div>
                        )}
                        
                        {session && (
                            <Button fullWidth variant="outline" color="dark" mt="md" leftSection={<Save size={16} />}>
                                결과 저장하기
                            </Button>
                        )}
                    </Stack>
                </Card>

                {/* Routine Cards (Bonus) */}
                <div className="grid grid-cols-1 gap-3">
                    {ROUTINES.map((routine, idx) => (
                        <Card key={idx} padding="md" radius="xl" className="bg-white/60 hover:bg-white/80 transition-colors border-white/20">
                            <Group>
                                <CheckCircle2 className="w-5 h-5 text-teal-600" />
                                <div>
                                    <Text size="sm" fw={700}>{routine.title}</Text>
                                    <Text size="xs" c="dimmed">{routine.desc}</Text>
                                </div>
                            </Group>
                        </Card>
                    ))}
                </div>
            </Stack>

            {/* Disclaimer */}
            <div className="md:col-span-2 text-center py-4">
                 <Text size="xs" c="dimmed">
                    * 본 결과는 간단한 자가 점검용이며, 의학적 진단이 아닙니다. 정확한 진단은 내원하여 상담받으세요.
                 </Text>
            </div>
        </div>
    );
}
