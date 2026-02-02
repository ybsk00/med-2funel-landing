/**
 * 내과 기본 설정값
 */

import { HospitalConfig } from '../schema';

export const internalMedicineDefaults: Partial<HospitalConfig> = {
  hospital: {
    id: 'default-internal-medicine',
    name: '에버내과',
    department: 'internal-medicine',
    representative: {
      name: '최민석',
      title: '대표원장',
    },
    contact: {
      address: '서울특별시 강남구 도곡로 321',
      phone: '1899-1154',
      fax: '02-456-7890',
      businessNumber: '456-78-90123',
    },
    searchKeywords: ['내과', '강남 내과', '건강검진', '만성질환'],
  },
  
  theme: {
    healthcare: {
      colors: {
        primary: '#0EA5E9',    // 스카이블루
        secondary: '#10B981',  // 에메랄드
        accent: '#F59E0B',     // 앰버
        background: '#0F172A', // 딥 네이비
        text: '#F8FAFC',       // 화이트
      },
      design: {
        texture: 'botanic',
        font: 'font-sans',
      },
      hero: {
        type: 'clean-effect',
        headline: '건강의 시작은\n정확한 체크업에서',
        subheadline: '지금 내 몸 상태를 점검하고, 맞춤형 건강 관리를 시작하세요.',
        media: {
          type: 'video',
          src: '/videos/internal-hero.mp4',
          poster: '/images/internal-hero-poster.jpg',
        },
      },
    },
    medical: {
      colors: {
        primary: '#0EA5E9',
        secondary: '#10B981',
        accent: '#F59E0B',
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
      primaryColor: 'cyan',
    },
  },
  
  healthcare: {
    branding: {
      logoText: '에버헬스체크',
      showHospitalName: false,
    },
    modules: [
      {
        id: 'diabetes-check',
        title: '당뇨 체크',
        description: '피로/갈증? 혈당 관리 진단',
        icon: 'Activity',
        color: 'blue',
      },
      {
        id: 'hypertension-check',
        title: '혈압 체크',
        description: '두통/어지러움? 고혈압 확인',
        icon: 'HeartPulse',
        color: 'red',
      },
      {
        id: 'thyroid-check',
        title: '갑상선 체크',
        description: '무기력/체중변화? 갑상선 건강',
        icon: 'Sparkles',
        color: 'teal',
      },
      {
        id: 'liver-check',
        title: '간 건강',
        description: '피로/소화불량? 간기능 점검',
        icon: 'Shield',
        color: 'green',
      },
      {
        id: 'checkup-guide',
        title: '검진 가이드',
        description: '나이별 권장 검진, 맞춤 가이드',
        icon: 'ClipboardList',
        color: 'purple',
      },
    ],
    persona: {
      name: '앨리스',
      title: '영업사원',
      purpose: '로그인 유도 (병원 정보 노출 없이)',
      tone: '친절함, 전문적, 건강정보 제공에 능숙, 차분함, 호기심 유발',
      rules: [
        '**절대 금지**: 병원 이름("에버내과") 언급 금지',
        '**절대 금지**: 원장 이름("최민석") 언급 금지',
        '**절대 금지**: 진단/처방/치료 언급 금지',
        '**핵심 목표**: 5턴 내 로그인 유도',
        '**전략**: "로그인하면 원장님 몰래 꿀팁 알려드릴게요" 같은 호기심 유발',
        '**정보 제공 원칙**: 자세한 정보는 "로그인 후에" 알려준다고 안내',
        '**대체 표현**: "저희 병원", "이곳", "전문가" 등 모호한 표현 사용',
        '의학적 조언 대신 생활 습관 개선 권장',
        '최대 5턴까지만 대화 가능',
      ],
      maxTurns: 5,
    },
    conversion: {
      turn3SoftGate: true,
      turn5HardGate: true,
      medicalKeywords: ['통증', '혈압', '혈당', '치료', '진단', '처방', '약', '수술', '입원', '응급'],
    },
  },
  
  medical: {
    branding: {
      logoText: '에버내과',
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
      name: '앨리스',
      title: '영업 상담실장',
      purpose: '예약 유도 (진단/처방 불가)',
      tone: '전문적, 신뢰감, 따뜻함, 영업 톤, 기승전 예약',
      rules: [
        '**절대 금지**: 진단/처방/치료 행위 금지 ("분석", "솔루션" 용어 사용)',
        '**절대 금지**: 의사 흉내 금지',
        '**핵심 목표**: 10턴 내 예약 유도',
        '**전략**: 기승전-예약. 어떤 대화든 예약으로 연결',
        '**병원 노출**: "에버내과", "최민석 원장님" 적극 언급 가능',
        '**액션**: 예약 제안 시 [[ACTION:RESERVATION_MODAL]] 토큰 필수',
        '**우회 표현**: "원장님께 여쭤보시면", "상담 받아보시면" 등 유도',
        '만성질환 관리의 중요성 강조',
        '최대 10턴 대화 가능',
      ],
      maxTurns: 10,
    },
    tracks: [
      { id: 'diabetes', name: '당뇨/대사', keywords: ['당뇨', '혈당', '인슐린', '갈증', '다뇨'] },
      { id: 'hypertension', name: '고혈압/심혈관', keywords: ['혈압', '고혈압', '심장', '두통', '어지러움'] },
      { id: 'thyroid', name: '갑상선/남낭', keywords: ['갑상선', '무기력', '체중', '흥분'] },
      { id: 'liver', name: '간/소화기', keywords: ['간', '지방간', '소화', '복부'] },
      { id: 'respiratory', name: '호흡기/알레르기', keywords: ['기침', '천식', '알레르기', '코'] },
      { id: 'checkup', name: '건강검진', keywords: ['검진', '건강', '종합', '암'] },
      { id: 'general', name: '일반/기타', keywords: ['상담', '예약', '위치', '증상'] },
    ],
    reservation: {
      enableOnlineBooking: true,
      availableDoctors: [
        {
          name: '최민석',
          title: '대표원장',
          specialties: ['당뇨', '고혈압'],
        },
      ],
      timeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
    },
  },
  
  crm: {
    title: '에버내과 관리자',
    features: ['patients', 'appointments', 'chat-history', 'marketing', 'statistics'],
    defaultView: 'patients',
  },
  
  marketing: {
    utmTracking: true,
    funnelEvents: ['f1_view', 'f1_chat_start', 'f2_enter', 'reservation_complete'],
  },
};
