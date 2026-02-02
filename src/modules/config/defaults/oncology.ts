/**
 * 암요양병원 기본 설정값
 */

import { HospitalConfig } from '../schema';

export const oncologyDefaults: Partial<HospitalConfig> = {
  hospital: {
    id: 'default-oncology',
    name: '에버암요양병원',
    department: 'oncology',
    representative: {
      name: '정희망',
      title: '대표원장',
    },
    contact: {
      address: '경기도 양평군 용문면',
      phone: '1899-1155',
      fax: '031-123-4567',
      businessNumber: '567-89-01234',
    },
    searchKeywords: ['암요양병원', '암환자', '호스피스', '완화의료'],
  },
  
  theme: {
    healthcare: {
      colors: {
        primary: '#10B981',    // 딥 그린 (희망/회복)
        secondary: '#6EE7B7',  // 에메랄드 라이트
        accent: '#F59E0B',     // 앰버 (따뜻함)
        background: '#0A1A14', // 딥 그린 블랙
        text: '#F0FDF4',       // 그린 화이트 (오프화이트)
      },
      design: {
        texture: 'linen',
        font: 'font-sans',
      },
      hero: {
        type: 'clean-effect',
        headline: '치료의 시간,\n회복의 시스템',
        subheadline: '회복 목표와 생활 루틴을 정리해 더 안전하게 준비하세요.',
        media: {
          type: 'video',
          src: '/히어로세션/암요양병원.mp4',
          poster: '/히어로세션/dentistry_hero.jpg',
        },
      },
    },
    medical: {
      colors: {
        primary: '#EC4899',
        secondary: '#8B5CF6',
        accent: '#F59E0B',
        background: '#FFFBFE', // 따뜻한 화이트
        text: '#4A044E',
      },
      design: {
        texture: 'glass',
        font: 'font-sans',
      },
    },
    admin: {
      theme: 'dark',
      primaryColor: 'pink',
    },
  },
  
  healthcare: {
    branding: {
      logoText: '에버케어',
      showHospitalName: false,
    },
    modules: [
      {
        id: 'cancer-care',
        title: '암 케어 가이드',
        description: '암 종류별 관리법, 영양 정보',
        icon: 'Heart',
        color: 'pink',
      },
      {
        id: 'palliative-care',
        title: '완화의료',
        description: '통증 관리, 삶의 질 개선',
        icon: 'Shield',
        color: 'purple',
      },
      {
        id: 'family-support',
        title: '가족 지원',
        description: '보호자 케어, 심리 지원 정보',
        icon: 'Users',
        color: 'orange',
      },
      {
        id: 'rehab-guide',
        title: '재활 가이드',
        description: '치료 후 회복, 욕동 요법',
        icon: 'Activity',
        color: 'green',
      },
      {
        id: 'hospice-care',
        title: '호스피스 케어',
        description: '마지막까지 존중받는 돌봄',
        icon: 'Sparkles',
        color: 'teal',
      },
    ],
    persona: {
      name: '수지',
      title: '영업사원',
      purpose: '로그인 유도 (병원 정보 노출 없이)',
      tone: '따뜻함, 공감, 희망적, 차분함, 섬세함, 호기심 유발',
      rules: [
        '**절대 금지**: 병원 이름("에버암요양병원") 언급 금지',
        '**절대 금지**: 원장 이름("정희망") 언급 금지',
        '**절대 금지**: 진단/처방/치료 언급 금지',
        '**핵심 목표**: 5턴 내 로그인 유도',
        '**전략**: "로그인하면 원장님 몰래 꿀팁 알려드릴게요" 같은 호기심 유발',
        '**정보 제공 원칙**: 자세한 정보는 "로그인 후에" 알려준다고 안내',
        '**대체 표현**: "저희 병원", "이곳", "전문가" 등 모호한 표현 사용',
        '민감한 주제에 대한 공감과 존중',
        '희망적이지만 현실적인 정보 제공',
        '최대 5턴까지만 대화 가능',
      ],
      maxTurns: 5,
    },
    conversion: {
      turn3SoftGate: true,
      turn5HardGate: true,
      medicalKeywords: ['통증', '항암', '방사선', '치료', '진단', '처방', '약', '수술', '입원', '호스피스'],
    },
  },
  
  medical: {
    branding: {
      logoText: '에버암요양병원',
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
      name: '수지',
      title: '영업 상담실장',
      purpose: '예약 유도 (진단/처방 불가)',
      tone: '전문적, 따뜻함, 공감, 희망적, 영업 톤, 기승전 예약',
      rules: [
        '**절대 금지**: 진단/처방/치료 행위 금지 ("분석", "솔루션" 용어 사용)',
        '**절대 금지**: 의사 흉내 금지',
        '**핵심 목표**: 10턴 내 예약 유도',
        '**전략**: 기승전-예약. 어떤 대화든 예약으로 연결',
        '**병원 노출**: "에버암요양병원", "정희망 원장님" 적극 언급 가능',
        '**액션**: 예약 제안 시 [[ACTION:RESERVATION_MODAL]] 토큰 필수',
        '**우회 표현**: "원장님께 여쭤보시면", "상담 받아보시면" 등 유도',
        '환자와 가족의 감정을 섬세하게 다루기',
        '최대 10턴 대화 가능',
      ],
      maxTurns: 10,
    },
    tracks: [
      { id: 'breast-cancer', name: '유방암', keywords: ['유방', '유방암', '젖'] },
      { id: 'lung-cancer', name: '폐암', keywords: ['폐', '폐암', '기침', '흡연'] },
      { id: 'colorectal-cancer', name: '대장암', keywords: ['대장', '대장암', '변', '혈변'] },
      { id: 'stomach-cancer', name: '위암', keywords: ['위', '위암', '소화', '명'] },
      { id: 'liver-cancer', name: '간암', keywords: ['간', '간암', 'B형', 'C형'] },
      { id: 'palliative', name: '완화의료/통증', keywords: ['통증', '완화', '호스피스', '마약'] },
      { id: 'rehab', name: '재활/회복', keywords: ['재활', '회복', '식사', '영양'] },
      { id: 'general', name: '일반/기타', keywords: ['상담', '예약', '위치', '입원'] },
    ],
    reservation: {
      enableOnlineBooking: true,
      availableDoctors: [
        {
          name: '정희망',
          title: '대표원장',
          specialties: ['완화의료', '암통증관리'],
        },
      ],
      timeSlots: ['10:00', '11:00', '14:00', '15:00', '16:00'],
    },
  },
  
  crm: {
    title: '에버암요양병원 관리자',
    features: ['patients', 'appointments', 'chat-history', 'marketing', 'statistics'],
    defaultView: 'patients',
  },
  
  marketing: {
    utmTracking: true,
    funnelEvents: ['f1_view', 'f1_chat_start', 'f2_enter', 'reservation_complete'],
  },
};
