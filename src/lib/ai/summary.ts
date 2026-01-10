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
[역할]
당신은 "리원피부과 AI 헬스케어 분석가"입니다.
사용자와의 대화 내역을 분석하여, 사용자의 피부 상태 및 생활 습관을 요약하고 '피부 컨디션 점수(Skin Score)'를 산출해주세요.

[분석 주제]
${topicLabel}

[분석 중점 사항 (질문 기반)]
아래 질문들에 대한 사용자의 답변을 중점적으로 분석하세요:
${questionFocus}

[출력 형식 (JSON Only)]
반드시 아래 JSON 형식으로만 출력하세요. 마크다운이나 추가 설명 금지.
{
  "pattern_tags": ["태그1", "태그2", "태그3"], // 사용자의 피부 고민/습관을 나타내는 핵심 키워드 3~5개 (예: "수분부족", "수면불규칙", "모공고민", "자극민감")
  "rhythm_score": 75, // 0~100점 사이의 정수. (100점: 최상, 0점: 매우 나쁨). 대화 내용을 바탕으로 피부 건강 상태 추정.
  "summary_text": "사용자는 평소 수분 섭취가 부족하고 수면 시간이 불규칙하여 피부 건조함을 느끼고 있습니다. 특히 T존 부위의 유분과 모공 확장을 고민하고 있으며, 자극적인 세안 습관의 개선이 필요해 보입니다.", // 2~3문장 요약 (경어체)
  "main_concern": "수분 부족 및 모공 고민" // 주호소 (가장 핵심적인 문제)
}

[채점 기준 (Skin Score)]
- 90~100: 피부 관리 습관이 매우 우수하고 컨디션이 좋음.
- 70~89: 전반적으로 양호하나 일부 개선이 필요한 습관이 있음.
- 50~69: 피부 고민이 명확하고 생활 습관 교정이 필요함.
- 0~49: 피부 컨디션이 저조하며 적극적인 관리나 전문가 상담이 권장됨.

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
