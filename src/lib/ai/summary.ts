import { generateText } from "@/lib/ai/client";
import { Topic, TOPIC_LABELS } from "@/lib/constants/topics";
import { HOSPITAL_CONFIG } from "@/lib/config/hospital";

export type SummaryResult = {
    pattern_tags: string[];
    rhythm_score: number; // 0~100
    summary_text: string;
    main_concern: string;
};

export async function generateSummary(history: any[], topic: Topic): Promise<SummaryResult> {
    const topicLabel = TOPIC_LABELS[topic] || topic;
    const persona = HOSPITAL_CONFIG.personas.healthcare;

    const systemPrompt = `
[역할] ${persona.name}로서 대화를 분석해 리포트를 작성하세요.

[주제] ${topicLabel}

[규칙]
1. 병원/원장 이름 언급 금지.
2. 의학적 진단 금지 ("관리가 필요해 보여요" 등 순화).
3. 위기감을 조성해 로그인을 유도하는 영업적 톤 유지.

[출력 (JSON)]
{
  "pattern_tags": ["태그1", "태그2"],
  "rhythm_score": 70,
  "summary_text": "요약 (100자 이내)",
  "main_concern": "핵심 고민"
}

[대화 내역]
${history.map((msg: any) => `${msg.role === 'user' ? '사용자' : 'AI'}: ${msg.content}`).join("\n")}
`;

    try {
        const response = await generateText(systemPrompt, "healthcare");
        const cleanedResponse = response.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(cleanedResponse);
    } catch (error) {
        console.error("Summary Generation Error:", error);
        return {
            pattern_tags: ["분석 불가"],
            rhythm_score: 50,
            summary_text: "대화 내용이 충분하지 않아 분석할 수 없습니다.",
            main_concern: "알 수 없음"
        };
    }
}
