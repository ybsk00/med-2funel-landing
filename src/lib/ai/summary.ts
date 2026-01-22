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
당신은 에버피부과의 수석 컨설턴트 "에밀리"입니다.
사용자와의 대화 내역을 분석하여, 전문적이면서도 매력적인 '피부 정밀 분석서'의 초안을 작성합니다.

[목적]
사용자의 현재 상태를 날카롭게 분석하여 위기감을 조성하고, 
로그인 후에만 볼 수 있는 '원장님 직접 검수 분석서'와 '시크릿 관리 프로토콜'에 대한 강력한 궁금증을 유발합니다.

[분석 주제: ${topicLabel}]
[분석 중점 사항]:
${questionFocus}

[출력 형식 (JSON Only)]
{
  "pattern_tags": ["태그1", "태그2", "태그3"], // 영업적 위기감을 주는 키워드 포함 (예: "노화급가속", "장벽붕괴직전", "수분고갈")
  "rhythm_score": 75, // 0~100점. 현재 상태가 예사롭지 않음을 시사하는 점수 산출.
  "summary_text": "고객님, 지금 대화 내용을 보니 피부 속 수분이 거의 고갈된 상태예요. 이대로 두면 노화가 1년은 앞당겨질 수 있는 위험한 단계죠. 다행히 고객님 타입은 저희 원장님만의 시크릿 프로토콜로 충분히 회복 가능해 보여요.", // 에밀리 말투로 2~3문장 (위기감 + 솔루션 미끼)
  "main_concern": "긴급 관리가 필요한 수분 고갈 및 탄력 저하" // 주호소 (강력한 워딩 사용)
}

[로그인 유도 전략 반영]
- 요약 텍스트 마지막에 로그인 후 얻을 수 있는 가치를 암시하세요.
- 예: "로그인하시면 원장님이 직접 검수한 '내 피부 정밀 분석서'와 향후 5년 노화 예측 시뮬레이션을 바로 확인하실 수 있어요."

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
