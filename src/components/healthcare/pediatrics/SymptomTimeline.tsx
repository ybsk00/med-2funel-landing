"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Thermometer, CalendarDays, Activity, 
    CheckCircle2, AlertCircle, ArrowRight, Lock, 
    Baby, Stethoscope, Clock, Pill
} from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import { Button, Text, Card, Group, Stack, Badge, Loader, ThemeIcon, SegmentedControl, Checkbox, SimpleGrid } from "@mantine/core";

// --- Types & Constants ---

type StepType = "intro" | "period" | "fever" | "symptoms" | "condition" | "analyzing" | "result";

const PERIOD_OPTIONS = ["오늘", "최근 3일", "1주일", "2주일 이상"];
const FEVER_OPTIONS = ["없음", "37.5 미만", "37.5 ~ 38.5", "38.5 ~ 39.5", "40도 이상"];
const SYMPTOM_LIST = ["기침", "콧물", "인후통", "설사/구토", "발진", "복통", "귀통증", "호흡곤란(주의)"];

const DOCTOR_QUESTIONS = [
    { id: 1, text: "해열제를 먹여도 열이 떨어지지 않는 구간이 있었나요?", isPublic: true },
    { id: 2, text: "최근 24시간 내 소변 횟수가 평소의 절반 이하인가요?", isPublic: true },
    { id: 3, text: "밤에 기침 때문에 깨는 횟수가 얼마나 되나요?", isPublic: false },
    { id: 4, text: "특정 음식 섭취 후 발진이나 구토가 있었나요?", isPublic: false },
    { id: 5, text: "아이가 평소보다 늘어지거나 반응이 느린가요?", isPublic: false },
    { id: 6, text: "최근 어린이집/유치원에서 유행하는 질병이 있나요?", isPublic: false },
    { id: 7, text: "귀를 자꾸 만지거나 보채는 행동이 있었나요?", isPublic: false },
];

export default function SymptomTimeline() {
    const { data: session } = useSession();
    const [step, setStep] = useState<StepType>("intro");
    
    // Form Data
    const [data, setData] = useState({
        period: "최근 3일",
        feverTemp: "37.5 ~ 38.5",
        feverMeds: false,
        symptoms: [] as string[],
        condition: { food: "보통", sleep: "양호", activity: "평소" }
    });

    // Helper: Update Data
    const updateData = (key: string, val: any) => {
        setData(prev => ({ ...prev, [key]: val }));
    };

    const handleNext = (nextStep: StepType) => {
        setStep(nextStep);
    };

    const startAnalysis = () => {
        setStep("analyzing");
        setTimeout(() => setStep("result"), 1500);
    };

    // --- Animation Variants ---
    const slideVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    // --- Renders ---

    // 1. Intro Step
    if (step === "intro") {
        return (
            <Card padding="xl" radius="xl" className="max-w-md mx-auto bg-white/90 backdrop-blur-md shadow-xl border-white/40">
                <Stack align="center" gap="md" py="lg">
                    <div className="bg-teal-50 p-4 rounded-full">
                        <Clock className="w-10 h-10 text-teal-600" />
                    </div>
                    <Badge size="lg" variant="gradient" gradient={{ from: 'teal', to: 'cyan' }}>소아과 전용</Badge>
                    <div className="text-center">
                        <Text size="xl" fw={900} className="text-slate-800">1분 증상 타임라인</Text>
                        <Text c="dimmed" size="sm" mt="xs">
                            열·기침·식사·수면을 정리하면<br />
                            <strong>진료가 빨라지고 정확해집니다.</strong>
                        </Text>
                    </div>
                    <Button 
                        size="lg" 
                        fullWidth 
                        onClick={() => setStep("period")}
                        className="mt-6 bg-teal-600 hover:bg-teal-700 transition-all shadow-lg hover:shadow-xl"
                    >
                        타임라인 만들기
                    </Button>
                </Stack>
            </Card>
        );
    }

    // 2. Analysis Spinner
    if (step === "analyzing") {
        return (
            <Card padding="xl" radius="xl" className="max-w-md mx-auto bg-white/80 backdrop-blur-md shadow-xl h-[400px] flex items-center justify-center">
                <Stack align="center" gap="md">
                    <Loader color="teal" size="lg" type="dots" />
                    <Text fw={700} size="lg" className="text-slate-700">타임라인 정리 중...</Text>
                    <Text size="sm" c="dimmed">아이의 컨디션을 분석하고 있어요.</Text>
                </Stack>
            </Card>
        );
    }

    // 3. Result Step
    if (step === "result") {
        return (
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Timeline Card */}
                <Card padding="xl" radius="1.5rem" className="bg-white/95 backdrop-blur-md shadow-2xl border-2 border-teal-50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 to-blue-400" />
                    <Stack gap="lg">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                            <div>
                                <Text size="xs" fw={700} c="teal">SYMPTOM TIMELINE</Text>
                                <Text size="xl" fw={900} className="text-slate-800">증상 요약 카드</Text>
                            </div>
                            <ThemeIcon size="lg" radius="md" color="teal" variant="light">
                                <Activity size={20} />
                            </ThemeIcon>
                        </div>

                        <SimpleGrid cols={2} spacing="md">
                            <div className="bg-slate-50 p-4 rounded-xl">
                                <Text size="xs" c="dimmed" fw={700}>기간</Text>
                                <Text fw={800} size="lg" className="text-slate-700">{data.period}</Text>
                            </div>
                            <div className={`p-4 rounded-xl ${data.feverTemp.includes("38") || data.feverTemp.includes("40") ? 'bg-red-50' : 'bg-slate-50'}`}>
                                <Text size="xs" c="dimmed" fw={700}>발열 최고</Text>
                                <Group gap="xs">
                                    <Thermometer size={16} className="text-red-500" />
                                    <Text fw={800} size="lg" className="text-slate-700">{data.feverTemp}</Text>
                                </Group>
                                {data.feverMeds && <Badge color="red" size="xs" mt={4}>해열제 복용</Badge>}
                            </div>
                        </SimpleGrid>

                        <div className="bg-slate-50 p-4 rounded-xl">
                            <Text size="xs" c="dimmed" fw={700} mb="xs">주요 증상</Text>
                            <Group gap="xs">
                                {data.symptoms.length > 0 ? (
                                    data.symptoms.map(s => (
                                        <Badge key={s} variant="white" size="lg" className="shadow-sm border border-slate-200 text-slate-700">
                                            {s}
                                        </Badge>
                                    ))
                                ) : (
                                    <Text size="sm" c="dimmed">선택된 증상 없음</Text>
                                )}
                            </Group>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl">
                            <Text size="xs" c="dimmed" fw={700} mb="xs">컨디션 체크</Text>
                            <Stack gap="xs">
                                <Group justify="space-between">
                                    <Text size="sm" fw={500}>식사/수분</Text>
                                    <Text size="sm" fw={700} c="teal">{data.condition.food}</Text>
                                </Group>
                                <Group justify="space-between">
                                    <Text size="sm" fw={500}>수면 상태</Text>
                                    <Text size="sm" fw={700} c="teal">{data.condition.sleep}</Text>
                                </Group>
                                <Group justify="space-between">
                                    <Text size="sm" fw={500}>활동성</Text>
                                    <Text size="sm" fw={700} c="teal">{data.condition.activity}</Text>
                                </Group>
                            </Stack>
                        </div>
                    </Stack>
                </Card>

                {/* Right: Question List (Locked) */}
                <Card padding="xl" radius="1.5rem" className="bg-white/90 backdrop-blur-md shadow-2xl border border-white/20 flex flex-col relative overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                        <Text fw={900} size="lg" className="text-slate-800">의료진 질문 리스트</Text>
                        {session ? <Badge color="green">Unlock</Badge> : <Lock size={18} className="text-slate-400" />}
                    </div>

                    <Stack gap="sm" className="flex-1">
                        {DOCTOR_QUESTIONS.map((q, idx) => {
                            const isLocked = !session && !q.isPublic;
                            return (
                                <div 
                                    key={q.id} 
                                    className={`p-4 rounded-xl border transition-all ${isLocked ? 'blur-[4px] opacity-40 select-none bg-slate-50 border-slate-100' : 'bg-white border-slate-200 shadow-sm'}`}
                                >
                                    <div className="flex gap-3">
                                        <div className="min-w-[24px] h-6 flex items-center justify-center bg-teal-100 rounded-full text-xs font-bold text-teal-700">
                                            Q{idx + 1}
                                        </div>
                                        <Text size="sm" fw={600} className="text-slate-700">{q.text}</Text>
                                    </div>
                                </div>
                            );
                        })}
                    </Stack>

                    {!session && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[3px] p-6 text-center">
                            <div className="bg-white p-4 rounded-full shadow-lg mb-4">
                                <Lock className="w-8 h-8 text-teal-600" />
                            </div>
                            <Text fw={800} size="xl" className="text-slate-900 mb-2">
                                질문 리스트 전체 보기
                            </Text>
                            <Text size="sm" c="dimmed" mb="lg">
                                로그인하고 타임라인을 저장하세요.<br/>
                                진료 시 바로 보여줄 수 있습니다.
                            </Text>
                            <Button 
                                size="lg" 
                                color="teal"
                                onClick={() => signIn()}
                                rightSection={<ArrowRight size={16} />}
                                className="shadow-xl hover:translate-y-[-2px] transition-transform"
                            >
                                로그인하고 확인하기
                            </Button>
                        </div>
                    )}

                    {session && (
                        <Button fullWidth variant="light" color="teal" mt="md" leftSection={<CheckCircle2 size={16} />}>
                            타임라인 저장하기
                        </Button>
                    )}
                </Card>

                <div className="md:col-span-2 text-center">
                    <Text size="xs" c="dimmed">
                        * 본 결과는 보호자의 기록을 돕기 위한 메모이며, 의학적 진단이 아닙니다. 응급 상황 시 즉시 내원하세요.
                    </Text>
                </div>
            </div>
        );
    }

    // --- Inputs Steps (Animated) ---
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={step}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={slideVariants}
                transition={{ duration: 0.3 }}
                className="max-w-md mx-auto"
            >
                <Card padding="xl" radius="xl" className="bg-white/95 backdrop-blur-md shadow-xl min-h-[400px] flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <Badge variant="dot" color="teal" size="lg">{getTitle(step)}</Badge>
                        <Text size="xs" c="dimmed" fw={700}>{getStepNum(step)}/4</Text>
                    </div>

                    <div className="flex-1 py-4">
                        {step === "period" && (
                            <Stack>
                                <Text fw={700} size="xl">증상이 언제 시작됐나요?</Text>
                                {PERIOD_OPTIONS.map(opt => (
                                    <Button 
                                        key={opt} 
                                        variant={data.period === opt ? "filled" : "default"}
                                        color="teal"
                                        size="lg"
                                        fullWidth
                                        className="justify-start h-14"
                                        onClick={() => updateData("period", opt)}
                                    >
                                        {opt}
                                    </Button>
                                ))}
                            </Stack>
                        )}

                        {step === "fever" && (
                            <Stack>
                                <Text fw={700} size="xl">열이 있었나요?</Text>
                                <SegmentedControl
                                    value={data.feverTemp}
                                    onChange={(val) => updateData("feverTemp", val)}
                                    orientation="vertical"
                                    size="md"
                                    color="teal"
                                    data={FEVER_OPTIONS}
                                />
                                <Checkbox
                                    label="해열제를 먹였습니다"
                                    checked={data.feverMeds}
                                    onChange={(e) => updateData("feverMeds", e.currentTarget.checked)}
                                    size="md"
                                    color="teal"
                                    mt="md"
                                    wrapperProps={{ className: "p-4 border rounded-xl" }}
                                />
                            </Stack>
                        )}

                        {step === "symptoms" && (
                            <Stack>
                                <Text fw={700} size="xl">해당되는 증상을 모두 선택해주세요.</Text>
                                <SimpleGrid cols={2}>
                                    {SYMPTOM_LIST.map(sym => (
                                        <Button
                                            key={sym}
                                            variant={data.symptoms.includes(sym) ? "light" : "default"}
                                            color={data.symptoms.includes(sym) ? "teal" : "gray"}
                                            onClick={() => {
                                                const newSyms = data.symptoms.includes(sym)
                                                    ? data.symptoms.filter(s => s !== sym)
                                                    : [...data.symptoms, sym];
                                                updateData("symptoms", newSyms);
                                            }}
                                            className={`h-12 ${sym.includes("주의") ? "text-red-500 font-bold" : ""}`}
                                        >
                                            {sym}
                                        </Button>
                                    ))}
                                </SimpleGrid>
                            </Stack>
                        )}

                        {step === "condition" && (
                            <Stack>
                                <Text fw={700} size="xl">아이 컨디션은 어떤가요?</Text>
                                
                                <Text size="sm" fw={700} mt="sm">식사/수유</Text>
                                <SegmentedControl fullWidth color="teal" data={["잘 먹음", "보통", "거부/감소"]} 
                                    value={data.condition.food} onChange={v => updateData("condition", {...data.condition, food: v})} />

                                <Text size="sm" fw={700} mt="sm">수면</Text>
                                <SegmentedControl fullWidth color="teal" data={["양호", "자주 깸", "거의 못 잠"]}
                                    value={data.condition.sleep} onChange={v => updateData("condition", {...data.condition, sleep: v})} />

                                <Text size="sm" fw={700} mt="sm">활동성(처짐)</Text>
                                <SegmentedControl fullWidth color="teal" data={["평소와 같음", "약간 감소", "많이 처짐"]}
                                    value={data.condition.activity} onChange={v => updateData("condition", {...data.condition, activity: v})} />
                            </Stack>
                        )}
                    </div>

                    <Group mt="xl" grow>
                        <Button variant="default" onClick={() => handleBack(step, setStep)} disabled={step === "period"}>이전</Button>
                        <Button 
                            color="teal" 
                            onClick={() => {
                                if (step === "period") setStep("fever");
                                else if (step === "fever") setStep("symptoms");
                                else if (step === "symptoms") setStep("condition");
                                else if (step === "condition") startAnalysis();
                            }}
                        >
                            {step === "condition" ? "결과 보기" : "다음"}
                        </Button>
                    </Group>
                </Card>
            </motion.div>
        </AnimatePresence>
    );
}

function getTitle(step: StepType) {
    if (step === "period") return "기간 확인";
    if (step === "fever") return "발열 체크";
    if (step === "symptoms") return "증상 체크";
    if (step === "condition") return "컨디션";
    return "";
}

function getStepNum(step: StepType) {
    if (step === "period") return 1;
    if (step === "fever") return 2;
    if (step === "symptoms") return 3;
    if (step === "condition") return 4;
    return 1;
}

function handleBack(step: StepType, setStep: (s: StepType) => void) {
    if (step === "fever") setStep("period");
    if (step === "symptoms") setStep("fever");
    if (step === "condition") setStep("symptoms");
}
