/**
 * 한의원 기본 설정값
 */

import { HospitalConfig } from '../schema';

export const koreanMedicineDefaults: Partial<HospitalConfig> = {
  hospital: {
    id: 'default-korean-medicine',
    name: '에버한의원',
    department: 'korean-medicine',
    representative: {
      name: '한동일',
      title: '대표원장',
    },
    contact: {
      address: '서울특별시 강남구 논현동 987',
      phone: '1899-1156',
      fax: '02-567-8901',
      businessNumber: '678-90-12345',
    },
    searchKeywords: ['한의원', '강남 한의원', '침', '약침', '다이어트'],
  },
  
  theme: {
    healthcare: {
      colors: {
        primary: '#B45309',    // 앰버 700 (전통적)
        secondary: '#166534',  // 그린 700 (자연)
        accent: '#DC2626',     // 레드 600 (기)
        background: '#292524', // 스톤 800 (한지 느낌)
        text: '#FAF7F5',       // 스톤 50
      },
      design: {
        texture: 'hanji',
        font: 'font-sans',
      },
      hero: {
        type: 'clean-effect',
        headline: '전통의 지혜로 찾는\n몸의 균형',
        subheadline: '지금 내 체질을 진단하고, 맞춤 한방 케어를 알아보세요.',
        media: {
          type: 'image',
          src: '/images/korean-hero.jpg',
          poster: '/images/korean-hero.jpg',
        },
      },
    },
    medical: {
      colors: {
        primary: '#B45309',
        secondary: '#166534',
        accent: '#DC2626',
        background: '#FFFCF8',
        text: '#44403C',
      },
      design: {
        texture: 'glass',
        font: 'font-sans',
      },
    },
    admin: {
      theme: 'dark',
      primaryColor: 'brown',
    },
  },
  
  healthcare: {
    branding: {
      logoText: '에버한방',
      showHospitalName: false,
    },
    modules: [
      {
        id: 'body-type',
        title: '체질 진단',
        description: '사상체질 테스트, 나에게 맞는 관리법',
        icon: 'User',
        color: 'orange',
      },
      {
        id: 'pain-care',
        title: '통증 케어',
        description: '침/뜸/약침으로 자연치유',
        icon: 'Activity',
        color: 'red',
      },
      {
        id: 'diet-program',
        title: '한방 다이어트',
        description: '체질 개선형 슬림 프로그램',
        icon: 'Leaf',
        color: 'green',
      },
      {
        id: 'skin-care',
        title: '한방 피부',
        description: '한약/침으로 속부터 고치는 피부',
        icon: 'Sparkles',
        color: 'pink',
      },
      {
        id: 'wellness',
        title: '면역/웰빙',
        description: '면역력 UP, 피로 회복',
        icon: 'Shield',
        color: 'teal',
      },
    ],
    persona: {
      name: '한결',
      title: '영업사원',
      purpose: '로그인 유도 (병원 정보 노출 없이)',
      tone: '정갈함, 전통적, 차분함, 자연친화적, 신뢰감, 호기심 유발',
      rules: [
        '**절대 금지**: 병원 이름("에버한의원") 언급 금지',
        '**절대 금지**: 원장 이름("한동일") 언급 금지',
        '**절대 금지**: 진단/처방/치료 언급 금지',
        '**핵심 목표**: 5턴 내 로그인 유도',
        '**전략**: "로그인하면 원장님 몰래 꿀팁 알려드릴게요" 같은 호기심 유발',
        '**정보 제공 원칙**: 자세한 정보는 "로그인 후에" 알려준다고 안내',
        '**대체 표현**: "저희 병원", "이곳", "전문가" 등 모호한 표현 사용',
        '체질 관점의 설명 제공',
        '최대 5턴까지만 대화 가능',
      ],
      maxTurns: 5,
    },
    conversion: {
      turn3SoftGate: true,
      turn5HardGate: true,
      medicalKeywords: ['통증', '한약', '침', '치료', '진단', '처방', '약', '뜸', '부작용'],
    },
  },
  
  medical: {
    branding: {
      logoText: '에버한의원',
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
      name: '한결',
      title: '영업 상담실장',
      purpose: '예약 유도 (진단/처방 불가)',
      tone: '전문적, 신뢰감, 정갈함, 전통적 지혜와 현대적 영업 톤, 기승전 예약',
      rules: [
        '**절대 금지**: 진단/처방/치료 행위 금지 ("분석", "솔루션" 용어 사용)',
        '**절대 금지**: 의사 흉내 금지',
        '**핵심 목표**: 10턴 내 예약 유도',
        '**전략**: 기승전-예약. 어떤 대화든 예약으로 연결',
        '**병원 노출**: "에버한의원", "한동일 원장님" 적극 언급 가능',
        '**액션**: 예약 제안 시 [[ACTION:RESERVATION_MODAL]] 토큰 필수',
        '**우회 표현**: "원장님께 여쭤보시면", "상담 받아보시면" 등 유도',
        '체질과 자연치유의 관점 강조',
        '최대 10턴 대화 가능',
      ],
      maxTurns: 10,
    },
    tracks: [
      { id: 'body-type', name: '체질/사상', keywords: ['체질', '사상', '태음', '태양', '소음', '소양'] },
      { id: 'pain', name: '통증/침구', keywords: ['통증', '침', '뜸', '약침', '추나'] },
      { id: 'diet', name: '비만/다이어트', keywords: ['다이어트', '비만', '체중', '한방'] },
      { id: 'skin', name: '피부/모발', keywords: ['피부', '탈모', '한약', '아토피'] },
      { id: 'internal', name: '내과/소화', keywords: ['위', '장', '소화', '변비'] },
      { id: 'womens', name: '여성/산후', keywords: ['여성', '생리', '갱년기', '산후'] },
      { id: 'immunity', name: '면역/알레르기', keywords: ['면역', '알레르기', '비염', '천식'] },
      { id: 'general', name: '일반/기타', keywords: ['상담', '예약', '위치', '건강검진'] },
    ],
    reservation: {
      enableOnlineBooking: true,
      availableDoctors: [
        {
          name: '한동일',
          title: '대표원장',
          specialties: ['침구', '체질진단'],
        },
      ],
      timeSlots: ['10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
    },
  },
  
  crm: {
    title: '에버한의원 관리자',
    features: ['patients', 'appointments', 'chat-history', 'marketing', 'statistics'],
    defaultView: 'patients',
  },
  
  marketing: {
    utmTracking: true,
    funnelEvents: ['f1_view', 'f1_chat_start', 'f2_enter', 'reservation_complete'],
  },
};
