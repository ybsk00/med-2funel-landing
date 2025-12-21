import { NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";

// 응급실 혼잡도 API 엔드포인트
const BASE_URL =
    "http://apis.data.go.kr/B552657/ErmctInfoInqireService/getEmrrmRltmUsefulSckbdInfoInqire";

// 응급실 정보 타입
export interface ERStatus {
    name: string;
    addr: string;
    tel: string;
    hvec: number;      // 응급실 가용 병상
    hvoc: number;      // 일반 병상
    hvicc: number;     // 중환자실
    hvctayn: string;   // CT 가능 여부
    hvmriayn: string;  // MRI 가능 여부
    distance?: number;
}

// XML 파서 설정
const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
});

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    const stage1 = searchParams.get("stage1") ?? "경기도"; // 시도
    const stage2 = searchParams.get("stage2") ?? ""; // 시군구
    const pageNo = searchParams.get("pageNo") ?? "1";
    const numOfRows = searchParams.get("numOfRows") ?? "50";
    const debug = searchParams.get("debug") === "true";

    const serviceKey = process.env.DATA_GO_KR_SERVICE_KEY;
    if (!serviceKey) {
        return NextResponse.json(
            { error: "Missing ServiceKey - 공공 API 키가 설정되지 않았습니다." },
            { status: 500 }
        );
    }

    try {
        // URL 파라미터 구성
        const params = new URLSearchParams({
            ServiceKey: serviceKey,
            STAGE1: stage1,
            pageNo,
            numOfRows,
        });

        if (stage2) {
            params.append("STAGE2", stage2);
        }

        const url = `${BASE_URL}?${params.toString()}`;
        console.log("[ER Status API] Request URL:", url.replace(serviceKey, "***KEY***"));

        const response = await fetch(url, {
            next: { revalidate: 60 }, // 1분 캐싱
        });

        if (!response.ok) {
            console.error("[ER Status API] Fetch failed:", response.status, response.statusText);
            return NextResponse.json(
                { error: `API 호출 실패: ${response.status} ${response.statusText}` },
                { status: response.status }
            );
        }

        const xmlText = await response.text();
        console.log("[ER Status API] Response length:", xmlText.length);

        // XML → JSON 파싱
        const parsed = parser.parse(xmlText);
        const body = parsed?.response?.body;
        const header = parsed?.response?.header;

        // 에러 응답 체크
        const resultCode = header?.resultCode;
        const resultMsg = header?.resultMsg;

        if (resultCode && resultCode !== "00") {
            console.error("[ER Status API] API Error:", resultCode, resultMsg);
            return NextResponse.json({
                error: `API 오류: ${resultMsg}`,
                resultCode,
                resultMsg,
            }, { status: 400 });
        }

        const items = body?.items?.item;
        const totalCount = body?.totalCount ?? 0;

        console.log("[ER Status API] totalCount:", totalCount);

        if (!items) {
            return NextResponse.json({
                hospitals: [],
                totalCount: 0,
                message: "검색 결과가 없습니다.",
            });
        }

        // 단일 결과를 배열로 변환
        const itemList = Array.isArray(items) ? items : [items];

        // 응급실 정보 매핑
        const hospitals: ERStatus[] = itemList.map((item: any) => ({
            name: item.dutyName || "이름 없음",
            addr: item.dutyAddr || "",
            tel: item.dutyTel1 || "",
            hvec: parseInt(item.hvec) || 0,      // 응급실 가용 병상
            hvoc: parseInt(item.hvoc) || 0,      // 일반 병상
            hvicc: parseInt(item.hvicc) || 0,    // 중환자실
            hvctayn: item.hvctayn || "N",        // CT 가능
            hvmriayn: item.hvmriayn || "N",      // MRI 가능
        }));

        // 가용 병상 많은 순으로 정렬
        hospitals.sort((a, b) => b.hvec - a.hvec);

        if (debug) {
            return NextResponse.json({
                hospitals,
                totalCount,
                debug: {
                    url: url.replace(serviceKey, "***KEY***"),
                    xmlPreview: xmlText.substring(0, 500),
                    rawItems: itemList.slice(0, 3),
                },
            });
        }

        return NextResponse.json({
            hospitals,
            totalCount,
        });
    } catch (error) {
        console.error("[ER Status API] Error:", error);
        return NextResponse.json(
            { error: "응급실 정보 조회 중 오류가 발생했습니다.", details: String(error) },
            { status: 500 }
        );
    }
}
