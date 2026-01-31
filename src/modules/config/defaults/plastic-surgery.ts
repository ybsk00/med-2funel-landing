/**
 * 성형외과 기본 설정값
 */

import { HospitalConfig } from '../schema';

export const plasticSurgeryDefaults: Partial<HospitalConfig> = {
  hospital: {
    id: 'default-plastic-surgery',
    name: '에버성형외과',
    department: 'plastic-surgery',
    representative: {
      name: '서아름',
      title: '대표원장',
    },
    contact: {
      address: '서울특별시 강남구 압구정로 555',
      phone: '1899-1157',
      fax: '02-678-9012',
      businessNumber: '789-01-23456',
    },
    searchKeywords: ['성형외과', '강남 성형', '쌍커풀', '코성형'],
  },
  
  theme: {
    healthcare: {
      colors: {
        primary: '#D946EF',    // 퓨샤 500
        secondary: '#EC4899',  // 핑크 500
        accent: '#8B5CF6',     // 바이올렛 500
        background: '#0F0A1A', // 딥 퍼플 블랙
        text: '#FAF5FF',       // 퍼플 화이트
      },
      hero: {
        type: 'glow-effect',
        headline: '나만의 아름다움을\n깨우다',
        subheadline: '당신에게 맞는 맞춤 컨설팅, 지금 시작하세요.',
        media: {
          type: 'video',
          src: '/videos/plastic-hero.mp4',
          poster: '/images/plastic-hero-poster.jpg',
        },
      },
    },
    medical: {
      colors: {
        primary: '#D946EF',
        secondary: '#EC4899',
        accent: '#8B5CF6',
        background: '#FFFFFF',
        text: '#2E1065',
      },
    },
    admin: {
      theme: 'dark',
      primaryColor: 'grape',
    },
  },
  
  healthcare: {
    branding: {
      logoText: '에버뷰티',
      showHospitalName: false,
    },
    modules: [
      {
        id: 'eye-analysis',
        title: '눈 분석',
        description: '쌍커풀/눈매교정, 나에게 맞는 눈',
        icon: 'Eye',
        color: 'pink',
      },
      {
        id: 'nose-analysis',
        title: '코 분석',
        description: '코성형/콧볼, 조화로운 라인',
        icon: 'Triangle',
        color: 'purple',
      },
      {
        id: 'face-contour',
        title: '얼굴형 분석',
        description: '윤곽/안면윤곽, V라인 진단',
        icon: 'Hexagon',
        color: 'fuchsia',
      },
      {
        id: 'anti-aging',
        title: '동안 분석',
        description: '리프팅/지방이식, 젊음의 비결',
        icon: 'Sparkles',
        color: 'rose',
      },
      {
        id: 'body-contour',
        title: '바디 라인',
        description: '지방흡입/보형물, 몸매 교정',
        icon: 'Activity',
        color: 'teal',
      },
    ],
    persona: {
      name: '엘라',
      title: '영업사원',
      purpose: '로그인 유도 (병원 정보 노출 없이)',
      tone: '세련됨, 트렌디, 자신감, 격식있지만 친근함, 호기심 유발',
      rules: [
        '**절대 금지**: 병원 이름("에버성형외과") 언급 금지',
        '**절대 금지**: 원장 이름("서아름") 언급 금지',
        '**절대 금지**: 진단/처방/치료 언급 금지',
        '**핵심 목표**: 5턴 내 로그인 유도',
        '**전략**: "로그인하면 원장님 몰래 꿀팁 알려드릴게요" 같은 호기심 유발',
        '**정보 제공 원칙**: 자세한 정보는 "로그인 후에" 알려준다고 안내',
        '**대체 표현**: "저희 병원", "이곳", "전문가" 등 모호한 표현 사용',
        '심미적 조언 중심',
        '최대 5턴까지만 대화 가능',
      ],
      maxTurns: 5,
    },
    conversion: {
      turn3SoftGate: true,
      turn5HardGate: true,
      medicalKeywords: ['수술', '시술', '마취', '부작용', '입원', '치료', '진단', '처방', '약'],
    },
  },
  
  medical: {
    branding: {
      logoText: '에버성형외과',
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
      name: '엘라',
      title: '영업 상담실장',
      purpose: '예약 유도 (진단/처방 불가)',
      tone: '전문적, 세련됨, 트렌디, 심미적 감각, 영업 톤, 기승전 예약',
      rules: [
        '**절대 금지**: 진단/처방/치료 행위 금지 ("분석", "솔루션" 용어 사용)',
        '**절대 금지**: 의사 흉내 금지',
        '**핵심 목표**: 10턴 내 예약 유도',
        '**전략**: 기승전-예약. 어떤 대화든 예약으로 연결',
        '**병원 노출**: "에버성형외과", "서아름 원장님" 적극 언급 가능',
        '**액션**: 예약 제안 시 [[ACTION:RESERVATION_MODAL]] 토큰 필수',
        '**우회 표현**: "원장님께 여쭤보시면", "상담 받아보시면" 등 유도',
        '심미적 트렌드와 전문성 강조',
        '최대 10턴 대화 가능',
      ],
      maxTurns: 10,
    },
    tracks: [
      { id: 'eye', name: '눈성형', keywords: ['쌍커풀', '눈', '눈매', '뒤트임', '앞트임'] },
      { id: 'nose', name: '코성형', keywords: ['코', '콧볼', '코끝', '오똑', '鹰嘴'] },
      { id: 'face', name: '안면윤곽', keywords: ['윤곽', '사각턱', '광대', 'V라인'] },
      { id: 'lifting', name: '리프팅/동안', keywords: ['리프팅', '거상', '실리프팅', '울쎄라'] },
      { id: 'breast', name: '가슴성형', keywords: ['가슴', '보형물', '지방이식', '맘모'] },
      { id: 'body', name: '바디성형', keywords: ['지방흡입', '복부', '허벅지', '엉덩이'] },
      { id: 'minor', name: '시술/필러', keywords: ['필러', '보톡스', '쌍액', '지방'] },
      { id: 'general', name: '상담/기타', keywords: ['상담', '예약', '위치', '비용'] },
    ],
    reservation: {
      enableOnlineBooking: true,
      availableDoctors: [
        {
          name: '서아름',
          title: '대표원장',
          specialties: ['눈성형', '코성형'],
        },
      ],
      timeSlots: ['10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
    },
  },
  
  crm: {
    title: '에버성형외과 관리자',
    features: ['patients', 'appointments', 'chat-history', 'marketing', 'statistics'],
    defaultView: 'patients',
  },
  
  marketing: {
    utmTracking: true,
    funnelEvents: ['f1_view', 'f1_chat_start', 'f2_enter', 'reservation_complete'],
  },
};
