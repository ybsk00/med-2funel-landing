/**
 * 신경외과 기본 설정값
 */

import { HospitalConfig } from '../schema';

export const neurosurgeryDefaults: Partial<HospitalConfig> = {
  hospital: {
    id: 'default-neurosurgery',
    name: '에버신경외과',
    department: 'neurosurgery',
    representative: {
      name: '이두찬',
      title: '대표원장',
    },
    contact: {
      address: '서울특별시 강남구 역삼로 222',
      phone: '1899-1159',
      fax: '02-890-1234',
      businessNumber: '901-23-45678',
    },
    searchKeywords: ['신경외과', '강남 신경외과', '디스크', '뇌졸중'],
  },
  
  theme: {
    healthcare: {
      colors: {
        primary: '#818CF8',    // 인디고 400 (정밀 테크)
        secondary: '#06B6D4',  // 시안 (신경)
        accent: '#6366F1',     // 인디고 500
        background: '#080C18', // 딥 블루블랙 (고정밀)
        text: '#E0E7FF',       // 인디고 100
      },
      design: {
        texture: 'circuit',
        font: 'font-sans',
      },
      hero: {
        type: 'motion-effect',
        headline: '정밀한 증상 정리가\n치료의 시작입니다',
        subheadline: '두통/저림/어지럼 패턴을 정리해 진료 효율을 높이세요.',
        media: {
          type: 'video',
          src: '/videos/neuro-hero.mp4',
          poster: '/images/neuro-hero-poster.jpg',
        },
      },
    },
    medical: {
      colors: {
        primary: '#06B6D4',
        secondary: '#6366F1',
        accent: '#14B8A6',
        background: '#FFFFFF',
        text: '#0F172A',
      },
      design: {
        texture: 'glass',
        font: 'font-sans',
      },
    },
    admin: {
      theme: 'dark',
      primaryColor: 'cyan',
    },
  },
  
  healthcare: {
    branding: {
      logoText: '에버브레인',
      showHospitalName: false,
    },
    modules: [
      {
        id: 'spine-check',
        title: '척추 체크',
        description: '목/허리 디스크, 신경 압박 진단',
        icon: 'AlignCenter',
        color: 'teal',
      },
      {
        id: 'headache-check',
        title: '두통 체크',
        description: '편두통/군발두통, 뇌 신호 확인',
        icon: 'Brain',
        color: 'blue',
      },
      {
        id: 'numbness-check',
        title: '저림/마비',
        description: '손발 저림, 신경 손상 체크',
        icon: 'Activity',
        color: 'cyan',
      },
      {
        id: 'stroke-risk',
        title: '뇌졸중 리스크',
        description: '위험 요인, 예방 가이드',
        icon: 'AlertTriangle',
        color: 'orange',
      },
      {
        id: 'dizziness-check',
        title: '어지러움 체크',
        description: '현훈/메스꺼움, 평형 감각',
        icon: 'Compass',
        color: 'purple',
      },
    ],
    persona: {
      name: '닥터 제이',
      title: '영업사원',
      purpose: '로그인 유도 (병원 정보 노출 없이)',
      tone: '정확함, 차분함, 전문적, 신뢰감, 진지함, 호기심 유발',
      rules: [
        '**절대 금지**: 병원 이름("에버신경외과") 언급 금지',
        '**절대 금지**: 원장 이름("이두찬") 언급 금지',
        '**절대 금지**: 진단/처방/치료 언급 금지',
        '**핵심 목표**: 5턴 내 로그인 유도',
        '**전략**: "로그인하면 원장님 몰래 꿀팁 알려드릴게요" 같은 호기심 유발',
        '**정보 제공 원칙**: 자세한 정보는 "로그인 후에" 알려준다고 안내',
        '**대체 표현**: "저희 병원", "이곳", "전문가" 등 모호한 표현 사용',
        '응급 증상 시 즉시 병원 방문 권고',
        '신경학적 증상에 대한 정확한 정보 제공',
        '최대 5턴까지만 대화 가능',
      ],
      maxTurns: 5,
    },
    conversion: {
      turn3SoftGate: true,
      turn5HardGate: true,
      medicalKeywords: ['마비', '실어', '시력장애', '의식저하', '발작', '수술', '진단', '처방', '약', '입원', '응급', '뇌출혈'],
    },
  },
  
  medical: {
    branding: {
      logoText: '에버신경외과',
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
      name: '닥터 제이',
      title: '영업 상담실장',
      purpose: '예약 유도 (진단/처방 불가)',
      tone: '전문적, 신뢰감, 정확함, 영업 톤, 기승전 예약',
      rules: [
        '**절대 금지**: 진단/처방/치료 행위 금지 ("분석", "솔루션" 용어 사용)',
        '**절대 금지**: 의사 흉내 금지',
        '**핵심 목표**: 10턴 내 예약 유도',
        '**전략**: 기승전-예약. 어떤 대화든 예약으로 연결',
        '**병원 노출**: "에버신경외과", "이두찬 원장님" 적극 언급 가능',
        '**액션**: 예약 제안 시 [[ACTION:RESERVATION_MODAL]] 토큰 필수',
        '**우회 표현**: "원장님께 여쭤보시면", "상담 받아보시면" 등 유도',
        '정확한 신경학적 개념 사용',
        '수술/치료에 대한 신뢰감 전달',
        '최대 10턴 대화 가능',
      ],
      maxTurns: 10,
    },
    tracks: [
      { id: 'spine', name: '척추/디스크', keywords: ['디스크', '척추', '허리', '목', '협착증'] },
      { id: 'brain-tumor', name: '뇌종양', keywords: ['종양', '뇌', 'MRI', 'CT', '두통'] },
      { id: 'stroke', name: '뇌졸중/혈관', keywords: ['뇌졸중', '뇌경색', '뇌출혈', '혈관'] },
      { id: 'peripheral-nerve', name: '말초신경', keywords: ['손목터널', '저림', '마비', '신경'] },
      { id: 'headache', name: '두통/신경통', keywords: ['편두통', '군발두통', '신경통', '안면통'] },
      { id: 'dizziness', name: '어지러움/현훈', keywords: ['어지러움', '현훈', '메스꺼움', '평형'] },
      { id: 'trauma', name: '외상/골절', keywords: ['머리', '외상', '골절', '사고'] },
      { id: 'general', name: '상담/기타', keywords: ['상담', '예약', '위치', '검진'] },
    ],
    reservation: {
      enableOnlineBooking: true,
      availableDoctors: [
        {
          name: '이두찬',
          title: '대표원장',
          specialties: ['뇌종양', '척추수술'],
        },
      ],
      timeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
    },
  },
  
  crm: {
    title: '에버신경외과 관리자',
    features: ['patients', 'appointments', 'chat-history', 'marketing', 'statistics'],
    defaultView: 'patients',
  },
  
  marketing: {
    utmTracking: true,
    funnelEvents: ['f1_view', 'f1_chat_start', 'f2_enter', 'reservation_complete'],
  },
};
