/**
 * 치과 기본 설정값
 */

import { HospitalConfig } from '../schema';

export const dentistryDefaults: Partial<HospitalConfig> = {
  hospital: {
    id: 'default-dentistry',
    name: '에버치과',
    department: 'dentistry',
    representative: {
      name: '이현우',
      title: '대표원장',
    },
    contact: {
      address: '서울특별시 강남구 테헤란로 123',
      phone: '1899-1151',
      fax: '02-123-4567',
      businessNumber: '123-45-67890',
    },
    searchKeywords: ['치과', '강남 치과', '임플란트', '교정'],
  },
  
  theme: {
    healthcare: {
      colors: {
        primary: '#60A5FA',    // 블루 400 (클린 블루)
        secondary: '#93C5FD',  // 블루 300 (위생감)
        accent: '#38BDF8',     // 스카이 400 (깨끗함)
        background: '#0A1220', // 딥 네이비 (차분함)
        text: '#F0F6FF',       // 블루 화이트 (오프화이트)
      },
      design: {
        texture: 'glass',
        font: 'font-sans',
      },
      hero: {
        type: 'smile-effect',
        headline: '치아 인상은 \'밝기\'보다\n\'균형\'입니다',
        subheadline: '쉐이드를 측정하고, 자연스러운 미백 방향을 확인하세요.',
        media: {
          type: 'video',
          src: '/히어로세션/치과.mp4',
          poster: '/히어로세션/dentistry_hero.jpg',
        },
      },
    },
    medical: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        accent: '#06B6D4',
        background: '#FFFFFF',
        text: '#1F2937',
      },
      design: {
        texture: 'glass',
        font: 'font-sans',
      },
    },
    admin: {
      theme: 'dark',
      primaryColor: 'blue',
    },
  },
  
  healthcare: {
    branding: {
      logoText: '에버스마일',
      showHospitalName: false,
    },
    modules: [
      {
        id: 'whitening-check',
        title: '미백 체크',
        description: '노란 치아가 고민? 화이트닝 가능성 진단',
        icon: 'Sparkles',
        color: 'blue',
      },
      {
        id: 'alignment-check',
        title: '교정 체크',
        description: '삐뚤어진 치열? 교정 필요성 확인',
        icon: 'AlignCenter',
        color: 'teal',
      },
      {
        id: 'implant-guide',
        title: '임플란트 가이드',
        description: '缺치 고민? 임플란트 적합성 체크',
        icon: 'CircleDot',
        color: 'green',
      },
      {
        id: 'gum-care',
        title: '잇몸 케어',
        description: '출혈/붓는 잇몸? 잇몸 건강 점검',
        icon: 'Shield',
        color: 'purple',
      },
      {
        id: 'cavity-check',
        title: '충치 체크',
        description: '시린 치아? 충치 위험도 테스트',
        icon: 'AlertCircle',
        color: 'orange',
      },
    ],
    persona: {
      name: '소피',
      title: '영업사원',
      purpose: '로그인 유도 (병원 정보 노출 없이)',
      tone: '밝음, 친절함, 긍정적, 에너지 넘침, 호기심 유발',
      rules: [
        '**절대 금지**: 병원 이름("에버치과") 언급 금지',
        '**절대 금지**: 원장 이름("이현우") 언급 금지',
        '**절대 금지**: 진단/처방/치료 언급 금지',
        '**핵심 목표**: 5턴 내 로그인 유도',
        '**전략**: "로그인하면 원장님 몰래 꿀팁 알려드릴게요" 같은 호기심 유발',
        '**정보 제공 원칙**: 자세한 정보는 "로그인 후에" 알려준다고 안내',
        '**대체 표현**: "저희 병원", "이곳", "전문가" 등 모호한 표현 사용',
        '최대 5턴까지만 대화 가능',
      ],
      maxTurns: 5,
    },
    conversion: {
      turn3SoftGate: true,
      turn5HardGate: true,
      medicalKeywords: ['통증', '염증', '출혈', '치료', '진단', '처방', '약', '수술', '부작용'],
    },
  },
  
  medical: {
    branding: {
      logoText: '에버치과',
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
      name: '소피',
      title: '영업 상담실장',
      purpose: '예약 유도 (진단/처방 불가)',
      tone: '전문적, 친근함, 신뢰감, 영업 톤, 기승전 예약',
      rules: [
        '**절대 금지**: 진단/처방/치료 행위 금지 ("분석", "솔루션" 용어 사용)',
        '**절대 금지**: 의사 흉내 금지',
        '**핵심 목표**: 10턴 내 예약 유도',
        '**전략**: 기승전-예약. 어떤 대화든 예약으로 연결',
        '**병원 노출**: "에버치과", "이현우 원장님" 적극 언급 가능',
        '**액션**: 예약 제안 시 [[ACTION:RESERVATION_MODAL]] 토큰 필수',
        '**우회 표현**: "원장님께 여쭤보시면", "상담 받아보시면" 등 유도',
        '최대 10턴 대화 가능',
      ],
      maxTurns: 10,
    },
    tracks: [
      { id: 'whitening', name: '미백/성형', keywords: ['미백', '화이트닝', '라미네이트', '성형'] },
      { id: 'orthodontics', name: '교정', keywords: ['교정', '치열', '덧니', '돌출입', '비열'] },
      { id: 'implant', name: '임플란트', keywords: ['임플란트', '틀니', '缺치', '치아缺失'] },
      { id: 'periodontal', name: '잇몸/치주', keywords: ['잇몸', '치주', '출혈', '치석', '스케일링'] },
      { id: 'cavity', name: '충치/신경', keywords: ['충치', '신경', '시림', '우식'] },
      { id: 'general', name: '일반/기타', keywords: ['검진', '상담', '예약', '위치'] },
    ],
    reservation: {
      enableOnlineBooking: true,
      availableDoctors: [
        {
          name: '이현우',
          title: '대표원장',
          specialties: ['임플란트', '치아성형'],
        },
      ],
      timeSlots: ['10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
    },
  },
  
  crm: {
    title: '에버치과 관리자',
    features: ['patients', 'appointments', 'chat-history', 'marketing', 'statistics'],
    defaultView: 'patients',
  },
  
  marketing: {
    utmTracking: true,
    funnelEvents: ['f1_view', 'f1_chat_start', 'f2_enter', 'reservation_complete'],
  },
};
