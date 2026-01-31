/**
 * 소아과 기본 설정값
 */

import { HospitalConfig } from '../schema';

export const pediatricsDefaults: Partial<HospitalConfig> = {
  hospital: {
    id: 'default-pediatrics',
    name: '에버소아과',
    department: 'pediatrics',
    representative: {
      name: '박민준',
      title: '대표원장',
    },
    contact: {
      address: '서울특별시 강남구 대치동 111',
      phone: '1899-1158',
      fax: '02-789-0123',
      businessNumber: '890-12-34567',
    },
    searchKeywords: ['소아과', '강남 소아과', '소아청소년과', '예방접종'],
  },
  
  theme: {
    healthcare: {
      colors: {
        primary: '#F59E0B',    // 앰버 500 (따뜻함)
        secondary: '#10B981',  // 에메랄드 500 (생명)
        accent: '#3B82F6',     // 블루 500 (신뢰)
        background: '#1E293B', // 슬레이트 800
        text: '#F8FAFC',       // 슬레이트 50
      },
      hero: {
        type: 'clean-effect',
        headline: '우리 아이 건강한 성장\n함께 지켜요',
        subheadline: '아이의 건강 상태를 체크하고, 전문적인 케어 정보를 받아보세요.',
        media: {
          type: 'video',
          src: '/videos/peds-hero.mp4',
          poster: '/images/peds-hero-poster.jpg',
        },
      },
    },
    medical: {
      colors: {
        primary: '#F59E0B',
        secondary: '#10B981',
        accent: '#3B82F6',
        background: '#FFFBEB',
        text: '#451A03',
      },
    },
    admin: {
      theme: 'dark',
      primaryColor: 'yellow',
    },
  },
  
  healthcare: {
    branding: {
      logoText: '에버키즈',
      showHospitalName: false,
    },
    modules: [
      {
        id: 'growth-check',
        title: '성장 체크',
        description: '키/몸무게, 성장곡선 분석',
        icon: 'TrendingUp',
        color: 'green',
      },
      {
        id: 'fever-guide',
        title: '발열 가이드',
        description: '엄마의 걱정, 발열 대처법',
        icon: 'Thermometer',
        color: 'red',
      },
      {
        id: 'vaccination',
        title: '예방접종',
        description: '접종 스케줄, 필수/선택',
        icon: 'Shield',
        color: 'blue',
      },
      {
        id: 'allergy-check',
        title: '알레르기 체크',
        description: '아토피/천식/식이알레르기',
        icon: 'Heart',
        color: 'orange',
      },
      {
        id: 'development',
        title: '발달 체크',
        description: '연령별 발달, 걱정 거리',
        icon: 'Sparkles',
        color: 'purple',
      },
    ],
    persona: {
      name: '토리',
      title: '영업사원',
      purpose: '로그인 유도 (병원 정보 노출 없이)',
      tone: '따뜻함, 친근함, 안심시키는, 부드러움, 이해심 많음, 호기심 유발',
      rules: [
        '**절대 금지**: 병원 이름("에버소아과") 언급 금지',
        '**절대 금지**: 원장 이름("박민준") 언급 금지',
        '**절대 금지**: 진단/처방/치료 언급 금지',
        '**핵심 목표**: 5턴 내 로그인 유도',
        '**전략**: "로그인하면 원장님 몰래 꿀팁 알려드릴게요" 같은 호기심 유발',
        '**정보 제공 원칙**: 자세한 정보는 "로그인 후에" 알려준다고 안내',
        '**대체 표현**: "저희 병원", "이곳", "전문가" 등 모호한 표현 사용',
        '부모의 걱정을 공감',
        '아이 중심의 친근한 언어 사용',
        '최대 5턴까지만 대화 가능',
      ],
      maxTurns: 5,
    },
    conversion: {
      turn3SoftGate: true,
      turn5HardGate: true,
      medicalKeywords: ['열', '통증', '구토', '설사', '발진', '치료', '진단', '처방', '약', '수술', '입원'],
    },
  },
  
  medical: {
    branding: {
      logoText: '에버소아과',
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
      name: '토리',
      title: '영업 상담실장',
      purpose: '예약 유도 (진단/처방 불가)',
      tone: '전문적, 따뜻함, 부모심을 이해하는, 영업 톤, 기승전 예약',
      rules: [
        '**절대 금지**: 진단/처방/치료 행위 금지 ("분석", "솔루션" 용어 사용)',
        '**절대 금지**: 의사 흉내 금지',
        '**핵심 목표**: 10턴 내 예약 유도',
        '**전략**: 기승전-예약. 어떤 대화든 예약으로 연결',
        '**병원 노출**: "에버소아과", "박민준 원장님" 적극 언급 가능',
        '**액션**: 예약 제안 시 [[ACTION:RESERVATION_MODAL]] 토큰 필수',
        '**우회 표현**: "원장님께 여쭤보시면", "상담 받아보시면" 등 유도',
        '아이와 부모 모두를 배려하는 언어',
        '최대 10턴 대화 가능',
      ],
      maxTurns: 10,
    },
    tracks: [
      { id: 'growth', name: '성장/발율', keywords: ['성장', '키', '몸무게', '비만', '저체중'] },
      { id: 'fever', name: '발열/감염', keywords: ['열', '감기', '독감', '코로나', '발열'] },
      { id: 'respiratory', name: '호흡기', keywords: ['천식', '기침', '콧물', '비염'] },
      { id: 'digestive', name: '소화기', keywords: ['설사', '구토', '변비', '복통', '영양'] },
      { id: 'skin', name: '피부/알레르기', keywords: ['아토피', '발진', '알레르기', '두드러기'] },
      { id: 'vaccination', name: '예방접종', keywords: ['접종', '백신', '예방', '필수'] },
      { id: 'development', name: '발달/행동', keywords: ['발달', '자폐', 'ADHD', '말더듬'] },
      { id: 'general', name: '일반/기타', keywords: ['상담', '예약', '위치', '건강검진'] },
    ],
    reservation: {
      enableOnlineBooking: true,
      availableDoctors: [
        {
          name: '박민준',
          title: '대표원장',
          specialties: ['소아호흡기', '성장발율'],
        },
      ],
      timeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
    },
  },
  
  crm: {
    title: '에버소아과 관리자',
    features: ['patients', 'appointments', 'chat-history', 'marketing', 'statistics'],
    defaultView: 'patients',
  },
  
  marketing: {
    utmTracking: true,
    funnelEvents: ['f1_view', 'f1_chat_start', 'f2_enter', 'reservation_complete'],
  },
};
