/**
 * 피부과 기본 설정값
 * 새 피부과 병원 생성 시 이 값들이 기본으로 적용됨
 */

import { HospitalConfig } from '../schema';

export const dermatologyDefaults: Partial<HospitalConfig> = {
  hospital: {
    id: 'default-dermatology',
    name: '에버피부과',
    department: 'dermatology',
    representative: {
      name: '김지은',
      title: '대표원장',
    },
    contact: {
      address: '서울특별시 강남구 압구정로 222',
      phone: '1899-1150',
      fax: '02-516-0514',
      businessNumber: '317-14-00846',
    },
    searchKeywords: ['피부과', '강남 피부과', '압구정 피부과'],
  },
  
  theme: {
    healthcare: {
      colors: {
        primary: '#F0A0C8',    // 펄 핑크 (글로우 스킨)
        secondary: '#B8D8E8',  // 펄 틸 (진주 톤)
        accent: '#D8A0E0',     // 소프트 라벤더
        background: '#0A1220', // 다크 블루
        text: '#F8F0FA',       // 펄 화이트
      },
      design: {
        texture: 'hologram',
        font: 'font-sans',
        sound: '/sounds/dermatology-ambient.mp3',
      },
      hero: {
        type: 'glow-effect',
        headline: '피부는 \'관리\'가 아니라\n\'시스템\'입니다',
        subheadline: '톤·결·탄력을 한 번에 점검하고, 내 피부 루틴을 설계하세요.',
        media: {
          type: 'video',
          src: '/videos/hero.mp4',
          poster: '/images/hero-poster.jpg',
        },
      },
    },
    medical: {
      colors: {
        primary: '#E91E8C',
        secondary: '#14B8A6',
        accent: '#C026D3',
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
      primaryColor: 'orange',
    },
  },
  
  healthcare: {
    branding: {
      logoText: '에버헬스케어',
      showHospitalName: false,
    },
    modules: [
      {
        id: 'glow-booster',
        title: '광채 부스터',
        description: '칙칙한 피부톤이 고민이라면? 즉각적인 톤업 솔루션',
        icon: 'Sparkles',
        color: 'pink',
      },
      {
        id: 'makeup-killer',
        title: '메이크업 킬러',
        description: '화장이 잘 안 먹고 들뜬다면? 각질/수분 밸런스 케어',
        icon: 'Droplet',
        color: 'rose',
      },
      {
        id: 'barrier-reset',
        title: '장벽 리셋',
        description: '예민하고 붉어지는 피부? 물거진 장벽부터 튼튼하게',
        icon: 'Shield',
        color: 'teal',
      },
      {
        id: 'lifting-check',
        title: '리프팅 체크',
        description: '처진 턱선과 탄력이 고민? V라인 긴급 점검',
        icon: 'ArrowUpRight',
        color: 'purple',
      },
      {
        id: 'skin-concierge',
        title: '스킨 컨시어지',
        description: '나에게 딱 맞는 시술이 궁금하다면? 1:1 맞춤 추천',
        icon: 'Heart',
        color: 'fuchsia',
      },
    ],
    persona: {
      name: '에밀리',
      title: '영업사원',
      purpose: '로그인 유도 (병원 정보 노출 없이)',
      tone: '능글맞음, 유머러스함, 약간의 과장 허용, 친근함, 호기심 유발',
      rules: [
        '**절대 금지**: 병원 이름("에버피부과") 언급 금지',
        '**절대 금지**: 원장 이름("김지은") 언급 금지',
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
      medicalKeywords: ['통증', '증상', '치료', '진단', '처방', '약', '수술', '시술', '부작용', '염증'],
    },
  },
  
  medical: {
    branding: {
      logoText: '에버피부과',
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
      name: '에밀리',
      title: '영업 상담실장',
      purpose: '예약 유도 (진단/처방 불가)',
      tone: '전문적, 우아함, 신뢰감, 품격 있는 영업 톤, 기승전 예약',
      rules: [
        '**절대 금지**: 진단/처방/치료 행위 금지 ("분석", "솔루션" 용어 사용)',
        '**절대 금지**: 의사 흉내 금지',
        '**핵심 목표**: 10턴 내 예약 유도',
        '**전략**: 기승전-예약. 어떤 대화든 예약으로 연결',
        '**병원 노출**: "에버피부과", "김지은 원장님" 적극 언급 가능',
        '**액션**: 예약 제안 시 [[ACTION:RESERVATION_MODAL]] 토큰 필수',
        '**우회 표현**: "원장님께 여쭤보시면", "상담 받아보시면" 등 유도',
        '최대 10턴 대화 가능',
      ],
      maxTurns: 10,
    },
    tracks: [
      { id: 'acne', name: '여드름/트러블', keywords: ['여드름', '트러블', '뾰루지', '피지', '블랙헤드'] },
      { id: 'pigment', name: '색소/기미/잡티', keywords: ['기미', '잡티', '색소', '점', '주근깨'] },
      { id: 'aging', name: '노화/주름/탄력', keywords: ['주름', '탄력', '처짐', '노화', '팔자'] },
      { id: 'lifting', name: '리프팅/윤곽', keywords: ['리프팅', '윤곽', '턱선', '울쎄라', '슈링크'] },
      { id: 'laser', name: '레이저/광치료', keywords: ['레이저', '토닝', '프락셀'] },
      { id: 'skincare', name: '피부관리/클린징', keywords: ['관리', '모공', '각질', '수분'] },
      { id: 'sensitivity', name: '민감성/장벽', keywords: ['민감', '홍조', '따가움', '뒤집어'] },
      { id: 'general', name: '일반상담/기타', keywords: ['상담', '예약', '위치', '비용'] },
    ],
    reservation: {
      enableOnlineBooking: true,
      availableDoctors: [
        {
          name: '김지은',
          title: '대표원장',
          specialties: ['리프팅', '색소', '안티에이징'],
        },
      ],
      timeSlots: ['10:00', '11:00', '14:00', '15:00', '16:00'],
    },
  },
  
  crm: {
    title: '에버피부과 관리자',
    features: ['patients', 'appointments', 'chat-history', 'marketing', 'statistics'],
    defaultView: 'patients',
  },
  
  marketing: {
    utmTracking: true,
    funnelEvents: ['f1_view', 'f1_chat_start', 'f2_enter', 'reservation_complete'],
  },
};
