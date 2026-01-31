/**
 * 정형외과 기본 설정값
 */

import { HospitalConfig } from '../schema';

export const orthopedicsDefaults: Partial<HospitalConfig> = {
  hospital: {
    id: 'default-orthopedics',
    name: '에버정형외과',
    department: 'orthopedics',
    representative: {
      name: '박준호',
      title: '대표원장',
    },
    contact: {
      address: '서울특별시 강남구 선릉로 456',
      phone: '1899-1152',
      fax: '02-234-5678',
      businessNumber: '234-56-78901',
    },
    searchKeywords: ['정형외과', '강남 정형외과', '도수치료', '재활의학'],
  },
  
  theme: {
    healthcare: {
      colors: {
        primary: '#10B981',    // 에메랄드
        secondary: '#3B82F6',  // 블루
        accent: '#F59E0B',     // 앰버
        background: '#0F172A', // 슬레이트 900
        text: '#F8FAFC',       // 슬레이트 50
      },
      hero: {
        type: 'motion-effect',
        headline: '움직임의 자유를 되찾다\n건강한 관절 라이프',
        subheadline: '지금 내 관절/근육 상태를 체크하고, 통증 없는 일상을 준비하세요.',
        media: {
          type: 'video',
          src: '/videos/ortho-hero.mp4',
          poster: '/images/ortho-hero-poster.jpg',
        },
      },
    },
    medical: {
      colors: {
        primary: '#10B981',
        secondary: '#3B82F6',
        accent: '#F59E0B',
        background: '#FFFFFF',
        text: '#1E293B',
      },
    },
    admin: {
      theme: 'dark',
      primaryColor: 'green',
    },
  },
  
  healthcare: {
    branding: {
      logoText: '에버핏',
      showHospitalName: false,
    },
    modules: [
      {
        id: 'neck-shoulder',
        title: '목/어깨 체크',
        description: '뻐근한 목과 어깨? 거북목/오십검 진단',
        icon: 'ArrowUp',
        color: 'green',
      },
      {
        id: 'back-pain',
        title: '허리 진단',
        description: '아픈 허리? 디스크/근육통 체크',
        icon: 'AlignCenter',
        color: 'blue',
      },
      {
        id: 'knee-check',
        title: '무릎 점검',
        description: '뻣뻣한 무릎? 관절염/퇴행성 진단',
        icon: 'Activity',
        color: 'orange',
      },
      {
        id: 'sports-injury',
        title: '스포츠 손상',
        description: '욱신거리는 통증? 스포츠 재활 체크',
        icon: 'Zap',
        color: 'purple',
      },
      {
        id: 'posture-check',
        title: '자세 분석',
        description: '구부정한 자세? 체형 분석 및 교정',
        icon: 'PersonStanding',
        color: 'teal',
      },
    ],
    persona: {
      name: '맥스',
      title: '영업사원',
      purpose: '로그인 유도 (병원 정보 노출 없이)',
      tone: '활동적, 격려하는, 전문적이지만 친근함, 호기심 유발',
      rules: [
        '**절대 금지**: 병원 이름("에버정형외과") 언급 금지',
        '**절대 금지**: 원장 이름("박준호") 언급 금지',
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
      medicalKeywords: ['통증', '염증', '마비', '치료', '진단', '처방', '약', '수술', '주사', 'MRI', 'X-ray'],
    },
  },
  
  medical: {
    branding: {
      logoText: '에버정형외과',
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
      name: '맥스',
      title: '영업 상담실장',
      purpose: '예약 유도 (진단/처방 불가)',
      tone: '전문적, 신뢰감, 격려하는, 영업 톤, 기승전 예약',
      rules: [
        '**절대 금지**: 진단/처방/치료 행위 금지 ("분석", "솔루션" 용어 사용)',
        '**절대 금지**: 의사 흉내 금지',
        '**핵심 목표**: 10턴 내 예약 유도',
        '**전략**: 기승전-예약. 어떤 대화든 예약으로 연결',
        '**병원 노출**: "에버정형외과", "박준호 원장님" 적극 언급 가능',
        '**액션**: 예약 제안 시 [[ACTION:RESERVATION_MODAL]] 토큰 필수',
        '**우회 표현**: "원장님께 여쭤보시면", "상담 받아보시면" 등 유도',
        '최대 10턴 대화 가능',
      ],
      maxTurns: 10,
    },
    tracks: [
      { id: 'neck-shoulder', name: '목/어깨', keywords: ['목', '어깨', '거북목', '오십검', '경추'] },
      { id: 'back', name: '허리/척추', keywords: ['허리', '디스크', '요통', '척추', '좌골신경'] },
      { id: 'knee', name: '무릎/관절', keywords: ['무릎', '관절', '연골', '퇴행성', '반월상'] },
      { id: 'sports', name: '스포츠 손상', keywords: ['스포츠', '염좌', '파열', '건염', '인대'] },
      { id: 'fracture', name: '골절/외상', keywords: ['골절', '부러짐', '외상', '탈골'] },
      { id: 'rehab', name: '재활/도수', keywords: ['재활', '도수', '물리', '욕동'] },
      { id: 'general', name: '일반/기타', keywords: ['상담', '예약', '위치', '비용'] },
    ],
    reservation: {
      enableOnlineBooking: true,
      availableDoctors: [
        {
          name: '박준호',
          title: '대표원장',
          specialties: ['스포츠의학', '관절치료'],
        },
      ],
      timeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
    },
  },
  
  crm: {
    title: '에버정형외과 관리자',
    features: ['patients', 'appointments', 'chat-history', 'marketing', 'statistics'],
    defaultView: 'patients',
  },
  
  marketing: {
    utmTracking: true,
    funnelEvents: ['f1_view', 'f1_chat_start', 'f2_enter', 'reservation_complete'],
  },
};
