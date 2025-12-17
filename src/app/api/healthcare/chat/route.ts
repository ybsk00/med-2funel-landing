import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/ai/client";

// 의료 키워드 목록
const medicalKeywords = [
    "치료", "약", "처방", "투약", "복용", "한약", "양약", "진단", "질환", "질병",
    "병원", "수술", "시술", "검사", "MRI", "CT", "X-ray", "혈액검사",
    "먹어도 될까", "먹어도 되나", "복용해도", "먹으면 안되", "부작용",
    "어떤 약", "무슨 약", "약 이름", "약물", "성분", "효능", "효과",
    "병명", "암", "당뇨", "고혈압"
];

export async function POST(req: NextRequest) {
    try {
        const { message, history, turnCount } = await req.json();

        // 의료 키워드 감지 - 로그인 유도
        const hasMedicalQuestion = medicalKeywords.some(keyword =>
            message.toLowerCase().includes(keyword.toLowerCase())
        );

        if (hasMedicalQuestion) {
            return NextResponse.json({
                role: "ai",
                content: "말씀하신 내용은 개인의 건강 상태에 따라 답변이 달라질 수 있는 부분입니다.\n\n**정확한 정보 제공을 위해 로그인이 필요합니다.**\n\n로그인하시면 맞춤형 건강 정보와 상세 상담을 받으실 수 있습니다.",
                requireLogin: true
            });
        }

        // 5턴 제한 - 로그인 유도
        if (turnCount >= 5) {
            return NextResponse.json({
                role: "ai",
                content: "지금까지 대화를 통해 건강 패턴이 파악되었습니다! 🎉\n\n**더 자세한 분석과 맞춤 건강 조언**을 받으시려면 로그인이 필요합니다.\n\n로그인하시면:\n• 상세 건강 분석 리포트\n• 의심 증상 심층 상담\n• 맞춤 생활 가이드\n\n를 제공해 드립니다.",
                requireLogin: true
            });
        }

        // 시스템 프롬프트 - 공감/걱정/분석/질문 형태로 150-200자
        const systemPrompt = `
[역할]
당신은 "위담 건강가이드 챗"의 AI 상담사입니다.

[응답 규칙 - 매우 중요]
1. 반드시 150-200자 이내로 응답하세요.
2. 응답 구조: 공감 → 분석 → 질문
3. 말투: 정중하고 따뜻한 상담사 (~입니다, ~하시군요, ~해 보입니다)

[응답 구조 예시]
"[공감] 그런 불편함이 있으시군요, 많이 힘드셨겠습니다.
[분석] 말씀하신 증상은 생활 리듬과 관련이 있어 보입니다.
[질문] 혹시 최근 수면 패턴에 변화가 있으셨나요?"

[금지사항]
- 진단, 처방, 치료 권유 절대 금지
- 200자 초과 금지
- 버튼이나 선택지 제시 금지

[현재 턴: ${turnCount + 1}/5]
`;

        const fullPrompt = `
${systemPrompt}

[대화 내역]
${history.map((msg: any) => `${msg.role === 'user' ? '사용자' : 'AI'}: ${msg.content}`).join("\n")}
사용자: ${message}
AI:
`;

        const responseText = await generateText(fullPrompt, "healthcare");

        return NextResponse.json({
            role: "ai",
            content: responseText.trim(),
            turnCount: turnCount + 1
        });

    } catch (error) {
        console.error("Healthcare Chat API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
