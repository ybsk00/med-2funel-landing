import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/ai/client";
import { getHealthcareSystemPrompt, getHealthcareFinalAnalysisPrompt, EntryIntent, detectConcern, getConcernResponsePrompt } from "@/lib/ai/prompts";
import { DEPARTMENT_CONFIGS, DEFAULT_DEPARTMENT } from "@/lib/config/departments";

export async function POST(req: NextRequest) {
    try {
        const { message, history, turnCount, topic, entryIntent, departmentId } = await req.json();

        const config = DEPARTMENT_CONFIGS[departmentId as keyof typeof DEPARTMENT_CONFIGS] || DEPARTMENT_CONFIGS[DEFAULT_DEPARTMENT];

        // 1. Guardrails Removed - Direct AI Chat
        // 의료 키워드 차단 및 피부 고민 감지 로직 제거하고 AI가 자유롭게 답변하도록 함.

        // 3. 5턴째 (마지막 턴) - 종합 분석 및 결과 제공
        if (turnCount === 4) {
            const finalAnalysisPrompt = getHealthcareFinalAnalysisPrompt(
                topic || "default",
                entryIntent as EntryIntent
            );

            const fullPrompt = `
${finalAnalysisPrompt}

[대화 내역]
${history.map((msg: any) => `${msg.role === 'user' ? '사용자' : config.name}: ${msg.content}`).join("\n")}
사용자: ${message}
AI(분석 결과):
`;
            const analysisResult = await generateText(fullPrompt, "healthcare");

            return NextResponse.json({
                role: "ai",
                content: analysisResult.trim(),
                requireLogin: true,
                isHardStop: true
            });
        }

        // 5턴 초과 방어
        if (turnCount >= 5) {
            return NextResponse.json({
                role: "ai",
                content: "상담이 이미 종료되었습니다. 지금까지 정리한 내용을 저장하려면 로그인해 주세요.",
                requireLogin: true,
                isHardStop: true
            });
        }

        // 4. 시스템 프롬프트 from prompts.ts (entryIntent 전달)
        const systemPrompt = getHealthcareSystemPrompt(
            config,
            topic || "default",
            Number(turnCount),
            entryIntent as EntryIntent
        );

        const fullPrompt = `
${systemPrompt}

[대화 내역]
${history.map((msg: any) => `${msg.role === 'user' ? '사용자' : config.name}: ${msg.content}`).join("\n")}
사용자: ${message}
AI:
`;

        const responseText = await generateText(fullPrompt, "healthcare");

        // 5. 3턴째 - Soft Gate (로그인 유도하지만 계속 가능)
        const isTurn3 = turnCount === 2;

        return NextResponse.json({
            role: "ai",
            content: responseText.trim(),
            turnCount: turnCount + 1,
            requireLogin: isTurn3
        });

    } catch (error) {
        console.error("Healthcare Chat API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

