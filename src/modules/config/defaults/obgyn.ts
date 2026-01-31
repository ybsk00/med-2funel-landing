/**
 * 산부인과 기본 설정값
 */

import { HospitalConfig } from '../schema';

export const obgynDefaults: Partial<HospitalConfig> = {
  hospital: {
    id: 'default-obgyn',
    name: '에버산부인과',
    department: 'obgyn',
    representative: {
      name: '김소연',
      title: '대표원장',
    },
    contact: {
      address: '서울특별시 강남구 청담로 333',
      phone: '1899-1160',
      fax: '02-901-2345',
      businessNumber: '012-34-56789',
    },
    searchKeywords: ['산부인과', '강남 산부인과', '산전검사', '여성검진'],
  },
  
  theme: {
    healthcare: {
      colors: {
        primary: '#EC4899',    // 핑크 500 (여성성)
        secondary: '#8B5CF6',  // 바이올렛 500
        accent: '#F43F5E',     // 로즈 500 (생명)
        background: '#2E1065', // 딥 퍼플
        text: '#FDF2F8',       // 핑크 50
      },
      hero: {
        type: 'clean-effect',
        headline: '여성의 건강한 삶을\n응원합니다',
        subheadline: '지금 나의 건강 상태를 체크하고, 전문적인 케어를 받아보세요.',
        media: {
          type: 'video',
          src: '/videos/obgyn-hero.mp4',
          poster: '/images/obgyn-hero-poster.jpg',
        },
      },
    },
    medical: {
      colors: {
        primary: '#EC4899',
        secondary: '#8B5CF6',
        accent: '#F43F5E',
        background: '#FFF1F2',
        text: '#881337',
      },
    },
    admin: {
      theme: 'dark',
      primaryColor: 'pink',
    },
  },
  
  healthcare: {
    branding: {
      logoText: '에버우먼',
      showHospitalName: false,
    },
    modules: [
      {
        id: 'pregnancy-care',
        title: '임신 케어',
        description: '산전관리, 주차별 체크리스트',
        icon: 'Baby',
        color: 'pink',
      },
      {
        id: 'gynecology-check',
        title: '여성검진',
        description: '자궁경부암, 유방암, 골반 검진',
        icon: 'Heart',
        color: 'rose',
      },
      {
        id: 'menstrual-care',
        title: '생리 케어',
        description: '불규칙/통증/월경전증후군',
        icon: 'CalendarHeart',
        color: 'purple',
      },
      {
        id: 'menopause-guide',
        title: '갱년기 가이드',
        description: '폐경전후, 호륙몬 관리',
        icon: 'Sparkles',
        color: 'fuchsia',
      },
      {
        id: 'fertility-check',
        title: '임신 준비',
        description: '배란 체크, 난임 상담',
        icon: 'Flower2',
        color: 'green',
      },
    ],
    persona: {
      name: '마야',
      title: '영업사원',
      purpose: '로그인 유도 (병원 정보 노출 없이)',
      tone: '따뜻함, 공감, 여성적, 세심함, 편안함, 호기심 유발',
      rules: [
        '**절대 금지**: 병원 이름("에버산부인과") 언급 금지',
        '**절대 금지**: 원장 이름("김소연") 언급 금지',
        '**절대 금지**: 진단/처방/치료 언급 금지',
        '**핵심 목표**: 5턴 내 로그인 유도',
        '**전략**: "로그인하면 원장님 몰래 꿀팁 알려드릴게요" 같은 호기심 유발',
        '**정보 제공 원칙**: 자세한 정보는 "로그인 후에" 알려준다고 안내',
        '**대체 표현**: "저희 병원", "이곳", "전문가" 등 모호한 표현 사용',
        '여성 특화 주제에 대한 섬세한 접근',
        '민감한 정보에 대한 프라이버시 보장',
        '최대 5턴까지만 대화 가능',
      ],
      maxTurns: 5,
    },
    conversion: {
      turn3SoftGate: true,
      turn5HardGate: true,
      medicalKeywords: ['임신', '유산', '출혈', '통증', '치료', '진단', '처방', '약', '수술', '입원', '분만'],
    },
  },
  
  medical: {
    branding: {
      logoText: '에버산부인과',
      showHospitalName: true,
    },
    footer: {
      showHospitalInfo: true,
      showBusinessNumber: true,
      showAddress: true,
      links: {
        privacy: '/privacy',
        terms: '/terms',
      },
    },
    persona: {
      name: '마야',
      title: '영업 상담실장',
      purpose: '예약 유도 (진단/처방 불가)',
      tone: '전문적, 따뜻함, 여성 전문가 느낌, 신뢰감, 공감, 영업 톤, 기승전 예약',
      rules: [
        '**절대 금지**: 진단/처방/치료 행위 금지 ("분석", "솔루션" 용어 사용)',
        '**절대 금지**: 의사 흉내 금지',
        '**핵심 목표**: 10턴 내 예약 유도',
        '**전략**: 기승전-예약. 어떤 대화든 예약으로 연결',
        '**병원 노출**: "에버산부인과", "김소연 원장님" 적극 언급 가능',
        '**액션**: 예약 제안 시 [[ACTION:RESERVATION_MODAL]] 토큰 필수',
        '**우회 표현**: "원장님께 여쭤보시면", "상담 받아보시면" 등 유도',
        '여성 건강에 대한 전문성 강조',
        '임산부/여성 환자를 배려하는 언어',
        '최대 10턴 대화 가능',
      ],
      maxTurns: 10,
    },
    tracks: [
      { id: 'pregnancy', name: '임신/산전', keywords: ['임신', '산전', '태아', '분만', '유산'] },
      { id: 'gynecology', name: '부인과 질환', keywords: ['질염', '자궁', '난소', '골반', '생리'] },
      { id: 'cancer-screening', name: '여성암 검진', keywords: ['자궁경부암', '유방암', '검진', ' pap'] },
      { id: 'menopause', name: '갱년기/호륙몬', keywords: ['갱년기', '폐경', '호륙몬', '안면홍조'] },
      { id: 'fertility', name: '난임/시험관', keywords: ['난임', '시험관', '배란', '정자'] },
      { id: 'contraception', name: '피임/생식', keywords: ['피임', '피임약', '루프', '생리'] },
      { id: 'breast', name: '유방', keywords: ['유방', '젖', '유방종양', '유방통'] },
      { id: 'general', name: '상담/기타', keywords: ['상담', '예약', '위치', '검진'] },
    ],
    reservation: {
      enableOnlineBooking: true,
      availableDoctors: [
        {
          name: '김소연',
          title: '대표원장',
          specialties: ['고위험임신', '산전진단'],
        },
      ],
      timeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
    },
  },
  
  crm: {
    title: '에버산부인과 관리자',
    features: ['patients', 'appointments', 'chat-history', 'marketing', 'statistics'],
    defaultView: 'patients',
  },
  
  marketing: {
    utmTracking: true,
    funnelEvents: ['f1_view', 'f1_chat_start', 'f2_enter', 'reservation_complete'],
  },
};
