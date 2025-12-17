import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/ai/client";

// 의료 키워드 목록
// 의료 키워드 목록 (증상 포함 강화)
const medicalKeywords = [
    "치료", "약", "처방", "투약", "복용", "한약", "양약", "진단", "질환", "질병",
    "병원", "수술", "시술", "검사", "MRI", "CT", "X-ray", "혈액검사", "내시경",
    "먹어도 될까", "먹어도 되나", "복용해도", "먹으면 안되", "부작용",
    "어떤 약", "무슨 약", "약 이름", "약물", "성분", "효능", "효과",
    "병명", "암", "당뇨", "고혈압", "염증", "감염", "바이러스",
    "통증", "아파", "아픔", "쑤셔", "결려", "저려", "부어", "피나", "출혈",
    "어지러", "구토", "설사", "변비", "소화불량", "두통", "복통", "요통", "관절",
    "침", "뜸", "부항", "물리치료", "도수치료", "입원", "퇴원", "응급실",
    "증상", "원인", "이유", "해결", "방법", "추천",
    "쓰려", "속쓰림", "불편", "더부룩", "체한", "답답", "울렁", "메스꺼", "따가", "화끈"
];

export async function POST(req: NextRequest) {
    try {
        const { message, history, turnCount, topic } = await req.json();

        // 1. 의료 키워드/증상 감지 - 즉시 로그인 유도 (AI 답변 생성 없이 즉시 리턴)
        const hasMedicalQuestion = medicalKeywords.some(keyword =>
            message.toLowerCase().includes(keyword.toLowerCase())
        );

        if (hasMedicalQuestion) {
            return NextResponse.json({
                role: "ai",
                content: "말씀하신 증상이나 내용은 **전문적인 의료 상담**이 필요할 수 있습니다.\n\n현행 의료법상 구체적인 증상, 질환, 치료에 대한 상담은 **로그인 후 의료진의 검토를 거친 AI 상담**을 통해서만 제공 가능합니다.\n\n로그인하시겠습니까?",
                requireLogin: true,
                isSymptomTrigger: true // 프론트엔드에서 즉시 모달을 띄우기 위한 플래그
            });
        }

        // 2. 5턴째 (마지막 턴) - 종합 분석 및 결과 제공
        if (turnCount === 4) {
            let topicPrompt = "";
            switch (topic) {
                case "digestion":
                    topicPrompt = "사용자의 식사 습관, 소화 불량 패턴, 배변 활동 등을 분석하여 위장 건강 상태를 요약하고, 개선이 필요한 생활 습관(예: 야식, 과식, 급하게 먹기 등)을 지적해 주세요.";
                    break;
                case "cognitive":
                    topicPrompt = "사용자의 기억력, 집중력, 수면 패턴 등을 분석하여 인지 건강 상태를 요약하고, 뇌 건강을 위한 생활 습관(예: 수면, 스트레스 관리 등)을 제안해 주세요.";
                    break;
                case "stress-sleep":
                    topicPrompt = "사용자의 수면 질, 스트레스 수준, 피로도 등을 분석하여 회복 리듬 상태를 요약하고, 숙면과 스트레스 완화를 위한 조언을 해주세요.";
                    break;
                case "vascular":
                    topicPrompt = "사용자의 운동 습관, 식단(짠 음식, 기름진 음식), 수면 등을 분석하여 혈관 건강 리스크를 요약하고, 생활 습관 개선 방향을 제시해 주세요.";
                    break;
                case "women":
                    topicPrompt = "사용자의 월경 주기, PMS, 컨디션 변화 등을 분석하여 여성 건강 리듬을 요약하고, 컨디션 관리를 위한 조언을 해주세요.";
                    break;
                default:
                    topicPrompt = "사용자의 전반적인 생활 습관(식사, 수면, 운동, 스트레스)을 분석하여 건강 리듬을 요약하고, 개선이 필요한 부분을 조언해 주세요.";
            }

            const finalAnalysisPrompt = `
[역할]
당신은 "위담 건강가이드 챗"의 AI 상담사입니다.
지금까지의 5턴 대화를 바탕으로 사용자의 생활 리듬을 분석하고 결과를 전달해야 합니다.

[분석 주제]
${topicPrompt}

[작성 규칙]
1. **분석 결과**: 사용자의 답변을 근거로 구체적인 패턴을 지적하세요. (예: "잦은 야식과 불규칙한 식사로 인해 소화 리듬이 깨진 것으로 보입니다.")
2. **리스크 경고**: 현재 습관이 지속될 경우 발생할 수 있는 가벼운 건강 리스크를 언급하세요. (예: "이런 습관이 지속되면 만성적인 소화불량이나 체중 증가로 이어질 수 있습니다.")
3. **개선 제안**: 당장 실천할 수 있는 가벼운 팁 1가지를 제안하세요.
4. **로그인 유도**: 더 정밀한 분석과 맞춤형 솔루션을 위해 로그인이 필요함을 자연스럽게 연결하세요.
5. **길이**: 250-300자 내외로 작성하세요.
6. **말투**: 정중하고 전문적이면서도 따뜻한 어조 (~입니다, ~합니다).
7. **절대 금지**: 병명 확진("위염입니다"), 약 처방, 치료 권유. 오직 "생활 습관"과 "리듬"에 집중하세요.

[대화 내역]
${history.map((msg: any) => `${msg.role === 'user' ? '사용자' : 'AI'}: ${msg.content}`).join("\n")}
사용자: ${message}
AI(분석 결과):
`;
            const analysisResult = await generateText(finalAnalysisPrompt, "healthcare");

            return NextResponse.json({
                role: "ai",
                content: analysisResult.trim(),
                requireLogin: true,
                isHardStop: true // 5턴 종료 및 입력 차단
            });
        }

        // 5턴 초과 방어 (이미 클라이언트에서 막히지만 안전장치)
        if (turnCount >= 5) {
            return NextResponse.json({
                role: "ai",
                content: "상담이 이미 종료되었습니다. 더 자세한 분석을 위해 로그인을 부탁드립니다.",
                requireLogin: true,
                isHardStop: true
            });
        }

        // 3. 시스템 프롬프트 - 진단 금지 및 생활 습관 점검 강조
        const systemPrompt = `
[역할]
당신은 "위담 건강가이드 챗"의 AI 상담사입니다.
**당신은 의사가 아닙니다. 절대 진단을 내리거나 치료법을 권장하지 마세요.**

[상담 목적]
오직 **생활 습관(식사, 수면, 운동, 스트레스)** 을 점검하고 리듬을 체크하는 것만이 목적입니다.

[응답 규칙 - 매우 중요]
1. 반드시 150-200자 이내로 응답하세요.
2. **[공감] [분석] 같은 명시적인 단어를 절대 사용하지 마세요.**
3. 자연스럽게 공감하고, 생활 습관과 관련된 질문을 던지세요.
4. 말투: 정중하고 따뜻한 상담사 (~입니다, ~하시군요, ~해 보입니다)

[절대 금지 사항 - 의료법 위반 방지]
- **병명, 질환명, 약 이름, 치료법, 시술, 수술 등을 절대 언급하지 마세요.**
- "진단", "처방", "치료", "증상", "원인"이라는 단어를 사용하지 마세요.
- 증상에 대해 의학적인 원인을 단정 짓지 마세요.
- 사용자가 증상을 호소하면, **"그 부분은 생활 습관과 관련이 있을 수 있습니다"** 정도로만 가볍게 언급하고, 바로 식사/수면 패턴 질문으로 넘어가세요.
- **조금이라도 의학적 판단이 필요해 보이면 답변을 멈추고 로그인을 유도하는 멘트로 끝내세요.**

[응답 예시]
"속이 불편하셔서 많이 힘드셨겠습니다. 식사 시간이 불규칙하거나 급하게 드시는 습관이 있으면 그런 느낌이 들 수 있습니다. 평소 식사 시간은 규칙적인 편이신가요?"

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

        // 4. 3턴째 (turnCount === 2 -> 다음이 3턴) - Soft Gate (로그인 유도하지만 계속 가능)
        // 응답은 보내되, requireLogin 플래그를 true로 설정하여 프론트에서 모달을 띄움
        const isTurn3 = turnCount === 2;

        return NextResponse.json({
            role: "ai",
            content: responseText.trim(),
            turnCount: turnCount + 1,
            requireLogin: isTurn3 // 3턴째에 로그인 모달 트리거
        });

    } catch (error) {
        console.error("Healthcare Chat API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
