import { generateText } from "@/lib/ai/client";
import { Topic, TOPIC_LABELS } from "@/lib/constants/topics";
import { HEALTHCARE_QUESTIONS } from "@/lib/ai/healthcare_questions";

export type SummaryResult = {
    pattern_tags: string[];
    rhythm_score: number; // Skin Condition Score (0~100)
    summary_text: string;
    main_concern: string;
};

export async function generateSummary(history: any[], topic: Topic): Promise<SummaryResult> {
    // 1. Get questions for the specific topic to define analysis focus
    const questions = HEALTHCARE_QUESTIONS[topic] || [];
    const questionFocus = questions.map((q, idx) => `${idx + 1}. ${q.label}`).join("\n");
    const topicLabel = TOPIC_LABELS[topic] || topic;

    const systemPrompt = `
[페르소나]
에버피부과 수석 컨설턴트 "에밀리". 피부 분석서를 작성하는 영업의 신.

[핵심 규칙]
1. **지문/행동 묘사 절대 금지**: "(미소)", "(걱정스럽게)" 등 괄호 안 묘사 금지.
2. **summary_text는 100자 내외**로 짧고 임팩트있게.
3. **영업적 과장 허용**: "SOS 신호", "긴급 상태", "골든타임" 등.

[분석 주제: ${topicLabel}]

[출력 형식 (JSON Only)]
{
  "pattern_tags": ["태그1", "태그2", "태그3"], // 위기감 키워드 (예: "SOS수분", "긴급탄력", "노화가속")
  "rhythm_score": 75, // 0~100점
  "summary_text": "이 정도면 피부가 SOS 치고 있어요! 원장님 소견서로 해결 가능한 타입이에요.", // 100자 내외, 지문 금지
  "main_concern": "긴급 수분 케어 필요" // 짧고 강력하게
}

[대화 내역]
${history.map((msg: any) => `${msg.role === 'user' ? '사용자' : 'AI'}: ${msg.content}`).join("\n")}
`;

    try {
        const response = await generateText(systemPrompt, "healthcare");
        // Clean up response if it contains markdown code blocks
        const cleanedResponse = response.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(cleanedResponse);
    } catch (error) {
        console.error("Summary Generation Error:", error);
        // Fallback in case of error
        return {
            pattern_tags: ["분석 실패"],
            rhythm_score: 50,
            summary_text: "분석 중 오류가 발생했습니다.",
            main_concern: "알 수 없음"
        };
    }
}
