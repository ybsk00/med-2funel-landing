/**
 * 비뇨기과 기본 설정값
 */

import { HospitalConfig } from '../schema';

export const urologyDefaults: Partial<HospitalConfig> = {
  hospital: {
    id: 'default-urology',
    name: '에버비뇨기과',
    department: 'urology',
    representative: {
      name: '김성현',
      title: '대표원장',
    },
    contact: {
      address: '서울특별시 강남구 논현로 789',
      phone: '1899-1153',
      fax: '02-345-6789',
      businessNumber: '345-67-89012',
    },
    searchKeywords: ['비뇨기과', '강남 비뇨기과', '전립선', '불임'],
  },
  
  theme: {
    healthcare: {
      colors: {
        primary: '#6366F1',    // 인디고
        secondary: '#14B8A6',  // 틸
        accent: '#8B5CF6',     // 바이올렛
        background: '#0F172A', // 딥 네이비
        text: '#F8FAFC',       // 화이트
      },
      design: {
        texture: 'carbon',
        font: 'font-sans',
      },
      hero: {
        type: 'clean-effect',
        headline: '남성 체형 인상,\n\'가슴 라인\'에서 결정됩니다',
        subheadline: '여유증 수술의 변화 방향과 회복 흐름을 먼저 확인하세요.',
        media: {
          type: 'video',
          src: '/히어로세션/비뇨기과.mp4',
          poster: '/히어로세션/dentistry_hero.jpg',
        },
      },
    },
    medical: {
      colors: {
        primary: '#6366F1',
        secondary: '#14B8A6',
        accent: '#8B5CF6',
        background: '#FFFFFF',
        text: '#1E293B',
      },
      design: {
        texture: 'glass',
        font: 'font-sans',
      },
    },
    admin: {
      theme: 'dark',
      primaryColor: 'indigo',
    },
  },
  
  healthcare: {
    branding: {
      logoText: '에버케어',
      showHospitalName: false,
    },
    modules: [
      {
        id: 'prostate-check',
        title: '전립선 체크',
        description: '잔여감/빈뇨? 전립선 건강 진단',
        icon: 'Activity',
        color: 'purple',
      },
      {
        id: 'mens-health',
        title: '남성 건강',
        description: '성 건강 고민? 프라이빗 상담',
        icon: 'Heart',
        color: 'blue',
      },
      {
        id: 'urinary-check',
        title: '배뇨 체크',
        description: '아픈 소변? 요로감염/결석 확인',
        icon: 'Droplet',
        color: 'teal',
      },
      {
        id: 'fertility-check',
        title: '생식 건강',
        description: '임신 준비? 남성 불임 체크',
        icon: 'Sparkles',
        color: 'green',
      },
      {
        id: 'kidney-check',
        title: '신장 체크',
        description: '허리 통증? 신장/요로 건강',
        icon: 'Shield',
        color: 'indigo',
      },
    ],
    persona: {
      name: '라이언',
      title: '영업사원',
      purpose: '로그인 유도 (병원 정보 노출 없이)',
      tone: '신중함, 전문적, 프라이빗한, 존중하는, 호기심 유발',
      rules: [
        '**절대 금지**: 병원 이름("에버비뇨기과") 언급 금지',
        '**절대 금지**: 원장 이름("김성현") 언급 금지',
        '**절대 금지**: 진단/처방/치료 언급 금지',
        '**핵심 목표**: 5턴 내 로그인 유도',
        '**전략**: "로그인하면 원장님 몰래 꿀팁 알려드릴게요" 같은 호기심 유발',
        '**정보 제공 원칙**: 자세한 정보는 "로그인 후에" 알려준다고 안내',
        '**대체 표현**: "저희 병원", "이곳", "전문가" 등 모호한 표현 사용',
        '민감한 주제에 대한 프라이버시 보장',
        '최대 5턴까지만 대화 가능',
      ],
      maxTurns: 5,
    },
    conversion: {
      turn3SoftGate: true,
      turn5HardGate: true,
      medicalKeywords: ['통증', '혈뇨', '성기능', '치료', '진단', '처방', '약', '수술', '검사'],
    },
  },
  
  medical: {
    branding: {
      logoText: '에버비뇨기과',
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
      name: '라이언',
      title: '영업 상담실장',
      purpose: '예약 유도 (진단/처방 불가)',
      tone: '전문적, 신뢰감, 프라이빗, 영업 톤, 기승전 예약',
      rules: [
        '**절대 금지**: 진단/처방/치료 행위 금지 ("분석", "솔루션" 용어 사용)',
        '**절대 금지**: 의사 흉내 금지',
        '**핵심 목표**: 10턴 내 예약 유도',
        '**전략**: 기승전-예약. 어떤 대화든 예약으로 연결',
        '**병원 노출**: "에버비뇨기과", "김성현 원장님" 적극 언급 가능',
        '**액션**: 예약 제안 시 [[ACTION:RESERVATION_MODAL]] 토큰 필수',
        '**우회 표현**: "원장님께 여쭤보시면", "상담 받아보시면" 등 유도',
        '민감한 정보 취급 주의',
        '최대 10턴 대화 가능',
      ],
      maxTurns: 10,
    },
    tracks: [
      { id: 'prostate', name: '전립선', keywords: ['전립선', '빈뇨', '잔여감', '야간뇨', '배뇨곤란'] },
      { id: 'mens-health', name: '남성 건강/성기능', keywords: ['발기', '조루', '성기능', '성욕', '남성'] },
      { id: 'urinary', name: '요로감염/배뇨', keywords: ['소변', '요로', '감염', '뇨', '배뇨'] },
      { id: 'fertility', name: '남성 불임', keywords: ['불임', '정자', '임신', '생식', '정액'] },
      { id: 'kidney', name: '신장/결석', keywords: ['신장', '결석', '혈뇨', '옆구리'] },
      { id: 'general', name: '일반/기타', keywords: ['상담', '예약', '위치', '검진'] },
    ],
    reservation: {
      enableOnlineBooking: true,
      availableDoctors: [
        {
          name: '김성현',
          title: '대표원장',
          specialties: ['전립선', '남성건강'],
        },
      ],
      timeSlots: ['10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '19:00'],
    },
  },
  
  crm: {
    title: '에버비뇨기과 관리자',
    features: ['patients', 'appointments', 'chat-history', 'marketing', 'statistics'],
    defaultView: 'patients',
  },
  
  marketing: {
    utmTracking: true,
    funnelEvents: ['f1_view', 'f1_chat_start', 'f2_enter', 'reservation_complete'],
  },
};
