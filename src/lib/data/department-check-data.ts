import { LucideIcon, Stethoscope, Activity, Heart, Brain, Bone, Baby, User, Sparkles, AlertTriangle, Pill, Thermometer, Zap, Shield, Battery, Cross, Circle, Smile } from "lucide-react";

export interface CheckCategory {
    id: string;
    label: string;
    desc: string;
    iconName?: string; // We'll map this in the component or use a function
}

export interface CheckOption {
    id: string;
    label: string;
}

export interface DepartmentCheckConfig {
    title: string;
    description: string;
    categories: CheckCategory[];
    symptoms: CheckOption[];
    symptomLabel: string;
    durations: CheckOption[];
    extras?: {
        label: string;
        options: CheckOption[];
    };
    colorTheme: {
        primary: string; // Tailwind class prefix like 'blue' (for blue-500, blue-500/20) or hex
        iconColor: string;
    }
}

export const DEPARTMENT_CHECK_DATA: Record<string, DepartmentCheckConfig> = {
    dermatology: {
        title: "미용 시술 상담 체크",
        description: "나에게 맞는 시술을 찾기 위한 기초 설문입니다.",
        colorTheme: { primary: "pink", iconColor: "text-pink-400" },
        categories: [
            { id: 'pigment', label: '기미·색소', desc: '잡티·주근깨·칙칙한 톤' },
            { id: 'lifting', label: '리프팅·탄력', desc: '처진 살·주름' },
            { id: 'acne', label: '여드름·모공', desc: '화농성·흉터·피지' },
            { id: 'petit', label: '쁘띠·윤곽', desc: '필러·보톡스' },
            { id: 'body', label: '제모·바디', desc: '겨드랑이·다리' },
            { id: 'care', label: '스킨케어', desc: '수분·진정' }
        ],
        symptomLabel: "고민 부위",
        symptoms: [
            { id: 'forehead', label: '이마' },
            { id: 'eyes', label: '눈가' },
            { id: 'cheek', label: '볼/광대' },
            { id: 'nose', label: '코' },
            { id: 'jaw', label: '턱/입가' },
            { id: 'neck', label: '목' }
        ],
        durations: [
            { id: 'recent', label: '최근 고민 시작' },
            { id: 'under_1y', label: '1년 미만' },
            { id: 'over_1y', label: '1년 이상' },
            { id: 'constant', label: '꾸준한 관리 필요' }
        ],
        extras: {
            label: "선호 효과",
            options: [
                { id: 'natural', label: '자연스럽게' },
                { id: 'definite', label: '확실한 변화' },
                { id: 'nopain', label: '통증 적게' },
                { id: 'cost', label: '가성비' }
            ]
        }
    },
    'internal-medicine': {
        title: "내과 예진 작성",
        description: "빠르고 정확한 진료를 위한 기초 설문입니다.",
        colorTheme: { primary: "blue", iconColor: "text-blue-400" },
        categories: [
            { id: 'respiratory', label: '감기·호흡기', desc: '침·가래·목아픔' },
            { id: 'digestive', label: '소화·위장', desc: '속쓰림·복통' },
            { id: 'fatigue', label: '피로·수액', desc: '만성피로·영양' },
            { id: 'chronic', label: '만성질환', desc: '혈압·당뇨' },
            { id: 'checkup', label: '건강검진', desc: '혈액·초음파' },
            { id: 'other', label: '기타', desc: '진단서·접종' }
        ],
        symptomLabel: "주요 증상",
        symptoms: [
            { id: 'fever', label: '발열/오한' },
            { id: 'cough', label: '기침/가래' },
            { id: 'pain', label: '통증/몸살' },
            { id: 'indigestion', label: '소화불량' },
            { id: 'headache', label: '두통/어지럼' },
            { id: 'diarrhea', label: '설사/변비' }
        ],
        durations: [
            { id: 'today', label: '오늘 시작' },
            { id: 'few_days', label: '2-3일 전' },
            { id: 'week', label: '1주일 정도' },
            { id: 'chronic', label: '오래 지속됨' }
        ]
    },
    urology: {
        title: "프라이빗 상담 신청",
        description: "남성을 위한 1:1 맞춤 상담입니다.",
        colorTheme: { primary: "amber", iconColor: "text-amber-500" },
        categories: [
            { id: 'performance', label: '남성활력', desc: '자신감·갱년기' },
            { id: 'prostate', label: '전립선', desc: '빈뇨·잔뇨' },
            { id: 'stone', label: '요로결석', desc: '옆구리통증' },
            { id: 'infection', label: '염증/성병', desc: '가려움·따가움' },
            { id: 'wedding', label: '웨딩검진', desc: '예비신랑' },
            { id: 'surgery', label: '수술상담', desc: '확대·정관' }
        ],
        symptomLabel: "불편한 점",
        symptoms: [
            { id: 'weak', label: '소변 줄기 약함' },
            { id: 'freq', label: '자주 마려움' },
            { id: 'pain', label: '통증/작열감' },
            { id: 'blood', label: '혈뇨' },
            { id: 'sex', label: '성기능 저하' },
            { id: 'itch', label: '가려움' }
        ],
        durations: [
            { id: 'sudden', label: '갑자기 발생' },
            { id: 'weeks', label: '몇 주 됨' },
            { id: 'months', label: '몇 달 됨' },
            { id: 'chronic', label: '오래됨' }
        ],
        extras: {
            label: "요청사항",
            options: [
                { id: 'private', label: '비밀보장 필수' },
                { id: 'male', label: '남성 의료진만' },
                { id: 'quiet', label: '조용한 대기' },
                { id: 'fast', label: '빠른 진료' }
            ]
        }
    },
    dentistry: {
        title: "치과 예진표",
        description: "치아/잇몸 상태를 체크해주세요.",
        colorTheme: { primary: "teal", iconColor: "text-teal-400" },
        categories: [
            { id: 'implant', label: '임플란트', desc: '상실된 치아' },
            { id: 'braces', label: '치아교정', desc: '삐뚤어진 치아' },
            { id: 'cavity', label: '충치/신경', desc: '이 아픔·시림' },
            { id: 'gums', label: '잇몸치료', desc: '붓고 피남' },
            { id: 'wisdom', label: '사랑니', desc: '발치 상담' },
            { id: 'scaling', label: '스케일링', desc: '검진·청소' }
        ],
        symptomLabel: "증상 체크",
        symptoms: [
            { id: 'pain', label: '씹을 때 아픔' },
            { id: 'cold', label: '찬물에 시림' },
            { id: 'bleed', label: '양치 때 피남' },
            { id: 'move', label: '이가 흔들림' },
            { id: 'jaw', label: '턱 관절 소리' },
            { id: 'shape', label: '치아 모양/색' }
        ],
        durations: [
            { id: 'recent', label: '최근 불편' },
            { id: 'week', label: '1주일 정도' },
            { id: 'month', label: '한 달 이상' },
            { id: 'checkup', label: '정기 검진' }
        ]
    },
    'plastic-surgery': {
        title: "성형외과 상담 신청",
        description: "원하시는 변화를 말씀해주세요.",
        colorTheme: { primary: "pink", iconColor: "text-pink-500" },
        categories: [
            { id: 'eyes', label: '눈 성형', desc: '쌍꺼풀·트임' },
            { id: 'nose', label: '코 성형', desc: '콧대·코끝' },
            { id: 'contour', label: '안면윤곽', desc: '광대·사각턱' },
            { id: 'breast', label: '가슴성형', desc: '확대·축소' },
            { id: 'antiaging', label: '동안성형', desc: '리프팅·거상' },
            { id: 'fat', label: '지방성형', desc: '흡입·이식' }
        ],
        symptomLabel: "고민 부위",
        symptoms: [
            { id: 'eyes', label: '눈 (크기/모양)' },
            { id: 'nose', label: '코 (높이/라인)' },
            { id: 'line', label: '얼굴형/턱선' },
            { id: 'volume', label: '볼륨 부족' },
            { id: 'wrinkle', label: '주름/처짐' },
            { id: 'body', label: '몸매 라인' }
        ],
        durations: [
            { id: 'interest', label: '단순 관심' },
            { id: 'plan', label: '수술 계획 중' },
            { id: 'revision', label: '재수술 고려' },
            { id: 'urgent', label: '빠른 수술 희망' }
        ]
    },
    orthopedics: {
        title: "정형외과 통증 척도",
        description: "통증 부위와 정도를 알려주세요.",
        colorTheme: { primary: "green", iconColor: "text-green-500" },
        categories: [
            { id: 'spine', label: '척추/허리', desc: '디스크·협착' },
            { id: 'joint', label: '관절', desc: '무릎·어깨' },
            { id: 'neck', label: '목/거북목', desc: '일자목·통증' },
            { id: 'posture', label: '체형교정', desc: '측만증·골반' },
            { id: 'sports', label: '스포츠손상', desc: '골절·인대' },
            { id: 'pain', label: '만성통증', desc: '물리치료' }
        ],
        symptomLabel: "통증 부위",
        symptoms: [
            { id: 'neck', label: '목/어깨' },
            { id: 'waist', label: '허리/골반' },
            { id: 'knee', label: '무릎/다리' },
            { id: 'wrist', label: '손목/팔꿈치' },
            { id: 'ankle', label: '발목/발' },
            { id: 'muscle', label: '근육통' }
        ],
        durations: [
            { id: 'acute', label: '갑자기 삐끗' },
            { id: 'week', label: '며칠 됨' },
            { id: 'chronic', label: '만성적임' },
            { id: 'accident', label: '사고/부상' }
        ]
    },
    'korean-medicine': {
        title: "한의원 체질 설문",
        description: "체질과 증상에 따른 맞춤 처방을 위해 작성해주세요.",
        colorTheme: { primary: "amber", iconColor: "text-amber-700" },
        categories: [
            { id: 'diet', label: '다이어트', desc: '체중감량' },
            { id: 'pain', label: '통증/추나', desc: '허리·어깨' },
            { id: 'traffic', label: '교통사고', desc: '후유증 관리' },
            { id: 'women', label: '여성질환', desc: '생리·갱년기' },
            { id: 'energy', label: '보약/공진단', desc: '피로회복' },
            { id: 'skin', label: '피부/비염', desc: '아토피·알러지' }
        ],
        symptomLabel: "주요 증상",
        symptoms: [
            { id: 'fatigue', label: '피로/무기력' },
            { id: 'digest', label: '소화불량' },
            { id: 'cold', label: '수족냉증' },
            { id: 'sleep', label: '불면증' },
            { id: 'pain', label: '관절통증' },
            { id: 'weight', label: '체중증가' }
        ],
        durations: [
            { id: 'recent', label: '최근 발생' },
            { id: 'chronic', label: '오래된 증상' },
            { id: 'seasonal', label: '환절기마다' },
            { id: 'stress', label: '스트레스 시' }
        ]
    },
    neurosurgery: {
        title: "신경외과 예진",
        description: "두통, 척추, 신경계 증상을 체크해주세요.",
        colorTheme: { primary: "indigo", iconColor: "text-indigo-500" },
        categories: [
            { id: 'headache', label: '두통/어지럼', desc: '편두통·빈혈' },
            { id: 'spine', label: '척추클리닉', desc: '디스크·시술' },
            { id: 'brain', label: '뇌혈관', desc: '검진·예방' },
            { id: 'dementia', label: '치매/기억력', desc: '인지기능' },
            { id: 'numb', label: '손발저림', desc: '말초신경' },
            { id: 'accident', label: '외상', desc: '머리부상' }
        ],
        symptomLabel: "증상 체크",
        symptoms: [
            { id: 'head', label: '머리가 아픔' },
            { id: 'dizzy', label: '어지러움' },
            { id: 'numb', label: '손발이 저림' },
            { id: 'back', label: '허리 통증' },
            { id: 'memory', label: '기억력 감퇴' },
            { id: 'faint', label: '실신/마비' }
        ],
        durations: [
            { id: 'acute', label: '급성(갑자기)' },
            { id: 'recur', label: '반복적임' },
            { id: 'chronic', label: '지속적임' },
            { id: 'worse', label: '점점 심해짐' }
        ]
    },
    obgyn: {
        title: "산부인과 상담",
        description: "여성 건강을 위한 비공개 상담입니다.",
        colorTheme: { primary: "rose", iconColor: "text-rose-500" },
        categories: [
            { id: 'checkup', label: '여성검진', desc: '초음파·암검진' },
            { id: 'pregnancy', label: '산과/임신', desc: '산전검사' },
            { id: 'disease', label: '질환클리닉', desc: '질염·방광염' },
            { id: 'cycle', label: '생리/피임', desc: '불규칙·통증' },
            { id: 'menopause', label: '갱년기', desc: '호르몬·노화' },
            { id: 'wedding', label: '웨딩검진', desc: '예비신부' }
        ],
        symptomLabel: "불편한 점",
        symptoms: [
            { id: 'pain', label: '하복부 통증' },
            { id: 'discharge', label: '분비물/가려움' },
            { id: 'irregular', label: '생리 불순' },
            { id: 'bleed', label: '부정 출혈' },
            { id: 'check', label: '임신 확인' },
            { id: 'hot', label: '열감/갱년기' }
        ],
        durations: [
            { id: 'today', label: '오늘/어제' },
            { id: 'week', label: '1주일 내' },
            { id: 'month', label: '한 달 이상' },
            { id: 'checkup', label: '정기 검진' }
        ]
    },
    oncology: {
        title: "암 예방/관리 상담",
        description: "암 예방 및 면역 관리를 위한 상담입니다.",
        colorTheme: { primary: "emerald", iconColor: "text-emerald-600" },
        categories: [
            { id: 'immune', label: '면역치료', desc: '항암 부작용' },
            { id: 'prevention', label: '암 예방', desc: '고위험군' },
            { id: 'nutrition', label: '영양관리', desc: '식이요법' },
            { id: 'pain', label: '통증완화', desc: '만성통증' },
            { id: 'checkup', label: '정밀검진', desc: '표지자검사' },
            { id: 'consult', label: '2차소견', desc: '진료상담' }
        ],
        symptomLabel: "현재 상태",
        symptoms: [
            { id: 'tired', label: '극심한 피로' },
            { id: 'weight', label: '체중 감소' },
            { id: 'lump', label: '멍울/종괴' },
            { id: 'pain', label: '지속적 통증' },
            { id: 'digest', label: '소화 장애' },
            { id: 'breathe', label: '호흡 곤란' }
        ],
        durations: [
            { id: 'diagnosis', label: '진단 직후' },
            { id: 'treating', label: '치료 중' },
            { id: 'after', label: '치료 종료 후' },
            { id: 'pre', label: '예방 차원' }
        ]
    },
    pediatrics: {
        title: "소아청소년과 예진",
        description: "우리 아이의 증상을 체크해주세요.",
        colorTheme: { primary: "yellow", iconColor: "text-yellow-500" },
        categories: [
            { id: 'cold', label: '감기/열', desc: '호흡기' },
            { id: 'growth', label: '성장/비만', desc: '키·체중' },
            { id: 'allergy', label: '알레르기', desc: '아토피·비염' },
            { id: 'digest', label: '배앓이', desc: '구토·설사' },
            { id: 'vaccine', label: '예방접종', desc: '영유아검진' },
            { id: 'skin', label: '피부질환', desc: '발진·두드러기' }
        ],
        symptomLabel: "아이 증상",
        symptoms: [
            { id: 'fever', label: '열이 나요' },
            { id: 'cough', label: '기침/콧물' },
            { id: 'stomach', label: '배가 아파요' },
            { id: 'skin', label: '뭐가 났어요' },
            { id: 'eat', label: '밥을 안먹어요' },
            { id: 'ear', label: '귀가 아파요' }
        ],
        durations: [
            { id: 'today', label: '오늘부터' },
            { id: 'night', label: '어제 밤부터' },
            { id: 'days', label: '며칠 됐어요' },
            { id: 'checkup', label: '검진/접종' }
        ]
    }
};
