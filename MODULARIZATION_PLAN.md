# 🏥 병원 AI 헬스케어 플랫폼 모듈화 계획

> **목표**: 하나의 코드베이스로 다양한 병원/과별로 빠르게 카피 생성 가능하도록 체계화

---

## 📋 현재 구조 분석

### 3개 영역 구분
```
┌─────────────────────────────────────────────────────────────────┐
│  [F1] 헬스케어 영역 (비로그인)                                    │
│  ├── URL: /, /healthcare/*                                       │
│  ├── 목적: 로그인 유도                                            │
│  ├── 특징: 병원명/원장명 노출 금지                                  │
│  └── 현재: 피부과 색감 (광채 효과)                                  │
├─────────────────────────────────────────────────────────────────┤
│  [F2] 메디컬 영역 (로그인 후)                                     │
│  ├── URL: /patient/*, /medical/*                                 │
│  ├── 목적: 예약 유도                                              │
│  ├── 특징: 병원/원장 정보 활용 가능                                 │
│  └── 현재: VIP 컨시어지 페르소나                                   │
├─────────────────────────────────────────────────────────────────┤
│  [CRM] 관리자 영역                                               │
│  ├── URL: /admin/*                                               │
│  ├── 목적: 환자 관리, 재방문 유도                                  │
│  └── 특징: 다크테마, 실시간 데이터                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 모듈화 목표

### 변경 가능해야 할 요소들

| 영역 | 변경 요소 | 현재 값 | 변경 방식 |
|------|----------|---------|----------|
| **헬스케어** | 로고 | "에버헬스케어" | `/config/assets/logo-healthcare.svg` |
| | 푸터 정보 | 주소, 전화 | `hospital-config.md` |
| | 챗봇 메뉴 | 5개 피부 모듈 | `landing.modules` 배열 |
| | 히어로 스타일 | 광채 효과 (핑크) | `theme.hero.type` |
| | 영상/이미지 | `/2.mp4`, `/1.mp4` | `theme.hero.media` |
| **메디컬** | 상단 로고 | 병원 로고 | `/config/assets/logo-medical.svg` |
| | 하단 푸터 | 병원 주소/연락처 | `hospital.basic` |
| | AI 페르소나 | "에밀리" | `personas.medical` |
| | 과별 트랙 | 피부과 8트랙 | `prompts.tracks` |
| **공통** | 색상 테마 | 핑크/틸/퍼플 | `theme.colors` |
| | 폰트 | Noto Sans KR | `theme.fonts` |

---

## 📁 제안하는 디렉토리 구조

```
config/                          # 🏥 병원별 설정 (Gitignore 추천)
├── hospital-config.yaml         # 메인 설정 파일 (단일 소스 오브 트루스)
├── assets/                      # 병원별 에셋
│   ├── logo-healthcare.svg      # 헬스케어 로고 (병원명 미노출)
│   ├── logo-medical.svg         # 메디컬 로고 (병원 로고)
│   ├── logo-admin.svg           # 관리자 로고
│   ├── hero-video.mp4           # 히어로 영상
│   ├── hero-poster.jpg          # 히어로 포스터
│   └── favicon.ico
└── prompts/                     # AI 프롬프트 오버라이드
    ├── healthcare.md            # 헬스케어 페르소나
    └── medical.md               # 메디컬 페르소나

src/
├── modules/                     # 🧩 모듈화된 컴포넌트
│   ├── config/                  # 설정 시스템
│   │   ├── loader.ts            # 설정 로더
│   │   ├── schema.ts            # 설정 스키마 (Zod)
│   │   └── defaults/            # 과별 기본값
│   │       ├── dermatology.ts   # 피부과 기본값
│   │       ├── dentistry.ts     # 치과 기본값
│   │       └── orthopedics.ts   # 정형외과 기본값
│   │
│   ├── healthcare/              # F1 헬스케어 모듈
│   │   ├── Hero/                # 히어로 섹션
│   │   │   ├── index.tsx        # Hero 메인
│   │   │   ├── GlowVariant.tsx  # 광채 효과 (피부과)
│   │   │   ├── SmileVariant.tsx # 미소 효과 (치과)
│   │   │   └── BoneVariant.tsx  # 뼈/관절 (정형외과)
│   │   ├── Modules/             # 챗봇 메뉴 모듈
│   │   │   ├── ModuleGrid.tsx   # 모듈 그리드
│   │   │   └── ModuleCard.tsx   # 개별 모듈 카드
│   │   ├── Layout/              # 헬스케어 레이아웃
│   │   │   ├── Header.tsx       # 상단 (로고만)
│   │   │   └── Footer.tsx       # 하단 (법적 정보)
│   │   └── Chat/                # 채팅 인터페이스
│   │       └── HealthcareChat.tsx
│   │
│   ├── medical/                 # F2 메디컬 모듈
│   │   ├── Layout/              # 메디컬 레이아웃
│   │   │   ├── Header.tsx       # 병원 로고 + 네비
│   │   │   └── Footer.tsx       # 병원 정보 푸터
│   │   ├── Chat/                # 메디컬 채팅
│   │   │   └── MedicalChat.tsx
│   │   └── Reservation/         # 예약 시스템
│   │       └── ReservationModal.tsx
│   │
│   ├── crm/                     # CRM 모듈
│   │   └── Dashboard/           # 관리자 대시보드
│   │
│   └── theme/                   # 🎨 테마 시스템
│       ├── ThemeProvider.tsx    # 테마 주입
│       ├── color-schemes/       # 과별 색상 팔레트
│       │   ├── dermatology.ts   # 핑크/틸/퍼플
│       │   ├── dentistry.ts     # 블루/화이트
│       │   └── orthopedics.ts   # 그린/네이비
│       └── generate-css.ts      # CSS 변수 생성
│
├── lib/
│   └── ai/
│       ├── prompts/
│       │   ├── templates/       # 과별 프롬프트 템플릿
│       │   │   ├── dermatology/ # 피부과 프롬프트
│       │   │   ├── dentistry/   # 치과 프롬프트
│       │   │   └── base/        # 기본 프롬프트
│       │   └── compiler.ts      # 프롬프트 컴파일러
│       └── client.ts
│
└── app/
    ├── (healthcare)/            # 그룹 라우트
    │   ├── page.tsx             # 랜딩 (자동 주입)
    │   ├── layout.tsx           # 헬스케어 레이아웃
    │   └── healthcare/
    │       └── chat/
    │
    ├── (medical)/               # 그룹 라우트
    │   ├── patient/
    │   └── medical/
    │
    └── (crm)/
        └── admin/
```

---

## ⚙️ 설정 파일 명세 (hospital-config.yaml)

```yaml
# ============================================
# 병원 AI 헬스케어 플랫폼 - 설정 파일
# 변경 후 빌드/배포 시 적용됨
# ============================================

version: "2.0"

# 1. 병원 기본 정보
hospital:
  id: "ever-derma"              # 고유 ID (영문, 소문자, 하이픈)
  name: "에버피부과"             # 병원명
  department: "dermatology"     # 과목: dermatology | dentistry | orthopedics | etc
  representative:
    name: "김지은"               # 대표원장명
    title: "대표원장"             # 직함
  contact:
    address: "서울특별시 강남구 압구정로 222"
    phone: "1899-1150"
    fax: "02-516-0514"
    businessNumber: "317-14-00846"
  searchKeywords: ["에버피부과", "강남 피부과", "압구정 피부과"]

# 2. 테마 설정 (CSS 변수 자동 생성)
theme:
  # 헬스케어 영역 (비로그인)
  healthcare:
    colors:
      primary: "#E91E8C"        # 메인 핑크
      secondary: "#14B8A6"      # 틸
      accent: "#C026D3"         # 퍼플
      background: "#0A1A2A"     # 다크 블루
      text: "#F8F9FA"           # 화이트
    hero:
      type: "glow-effect"       # glow-effect | smile-effect | motion-effect
      headline: "베이스가 달라지는\n광채 루틴 리셋"
      subheadline: "지금 내 상태를 빠르게 체크하고, 오늘부터 적용할 루틴 포인트를 정리해보세요."
      media: 
        type: "video"           # video | image
        src: "/videos/hero.mp4"
        poster: "/images/hero-poster.jpg"
    
  # 메디컬 영역 (로그인 후)
  medical:
    colors:
      primary: "#E91E8C"
      secondary: "#14B8A6"
      accent: "#C026D3"
      background: "#FFFFFF"      # 화이트 기반
      text: "#1F2937"
    
  # 관리자 영역
  admin:
    theme: "dark"
    primaryColor: "orange"

# 3. 헬스케어 영역 설정 (비로그인)
healthcare:
  # 로고 (병원명 노출 X)
  branding:
    logoText: "에버헬스케어"       # 텍스트 로고
    logoImage: "/assets/logo-healthcare.svg"
    showHospitalName: false      # 중요: false로 고정
  
  # 챗봇 메뉴 모듈 (5개 고정, 순서 변경 가능)
  modules:
    - id: "glow-booster"
      title: "광채 부스터"
      description: "칙칙한 피부톤이 고민이라면? 즉각적인 톤업 솔루션"
      icon: "Sparkles"           # Lucide 아이콘명
      color: "pink"              # pink | rose | teal | purple | fuchsia
      
    - id: "makeup-killer"
      title: "메이크업 킬러"
      description: "화장이 잘 안 먹고 들뜬다면? 각질/수분 밸런스 케어"
      icon: "Droplet"
      color: "rose"
      
    - id: "barrier-reset"
      title: "장벽 리셋"
      description: "예민하고 붉어지는 피부? 무너진 장벽부터 튼튼하게"
      icon: "Shield"
      color: "teal"
      
    - id: "lifting-check"
      title: "리프팅 체크"
      description: "처진 턱선과 탄력이 고민? V라인 긴급 점검"
      icon: "ArrowUpRight"
      color: "purple"
      
    - id: "skin-concierge"
      title: "스킨 컨시어지"
      description: "나에게 딱 맞는 시술이 궁금하다면? 1:1 맞춤 추천"
      icon: "Heart"
      color: "fuchsia"
  
  # AI 페르소나 (로그인 유도 목적)
  persona:
    name: "에밀리"
    title: "영업실장"
    purpose: "로그인 유도"
    tone: "능글맞음, 유머러스함, 약간의 과장 허용, 친근함"
    rules:
      - "병원 이름 노출 금지"
      - "원장 이름 노출 금지"
      - "진단/처방 금지"
      - "최대 5턴까지만 대화 가능"
    maxTurns: 5
    
  # 로그인 유도 트리거
  conversion:
    turn3SoftGate: true           # 3턴째 소프트 로그인 유도
    turn5HardGate: true           # 5턴째 강제 로그인
    medicalKeywords:              # 의료 키워드 시 즉시 로그인 유도
      - "통증"
      - "증상"
      - "치료"
      - "진단"
      - "처방"
      - "약"
      - "수술"
      - "시술"
      - "부작용"
      - "염증"

# 4. 메디컬 영역 설정 (로그인 후)
medical:
  # 로고 (병원명 노출 O)
  branding:
    logoText: "에버피부과"
    logoImage: "/assets/logo-medical.svg"
    showHospitalName: true
  
  # 푸터 정보
  footer:
    showHospitalInfo: true
    showBusinessNumber: true
    showAddress: true
    links:
      privacy: "/privacy"
      terms: "/terms"
  
  # AI 페르소나 (예약 유도 목적)
  persona:
    name: "에밀리"
    title: "수석 VIP 컨시어지"
    purpose: "예약 이끌어내기"
    tone: "전문적, 우아함, 신뢰감, 품격 있는 강남 실장 톤"
    rules:
      - "병원 및 원장 이름 노출 권장"
      - "예약 모달 적극 활용"
      - "최대 10턴 대화 가능"
    maxTurns: 10
    
  # 상담 트랙 (과별로 다름)
  tracks:
    - id: "acne"
      name: "여드름/트러블"
      keywords: ["여드름", "트러블", "뾰루지", "피지", "블랙헤드"]
    - id: "pigment"
      name: "색소/기미/잡티"
      keywords: ["기미", "잡티", "색소", "점", "주근깨"]
    - id: "aging"
      name: "노화/주름/탄력"
      keywords: ["주름", "탄력", "처짐", "노화", "팔자"]
    - id: "lifting"
      name: "리프팅/윤곽"
      keywords: ["리프팅", "윤곽", "턱선", "울쎄라", "슈링크"]
    - id: "laser"
      name: "레이저/광치료"
      keywords: ["레이저", "토닝", "프락셀"]
    - id: "skincare"
      name: "피부관리/클렌징"
      keywords: ["관리", "모공", "각질", "수분"]
    - id: "sensitivity"
      name: "민감성/장벽"
      keywords: ["민감", "홍조", "따가움", "뒤집어"]
    - id: "general"
      name: "일반상담/기타"
      keywords: ["상담", "예약", "위치", "비용"]
  
  # 예약 설정
  reservation:
    enableOnlineBooking: true
    availableDoctors:
      - name: "김지은"
        title: "대표원장"
        specialties: ["리프팅", "색소", "안티에이징"]
    timeSlots:
      - "10:00"
      - "11:00"
      - "14:00"
      - "15:00"
      - "16:00"

# 5. CRM 관리자 설정
crm:
  title: "에버피부과 관리자"
  features:
    - patients          # 환자 관리
    - appointments      # 예약 관리
    - chat-history      # 채팅 내역
    - marketing         # 마케팅 분석
    - statistics        # 통계
  defaultView: "patients"
  
# 6. 마케팅 설정
marketing:
  gaId: ""                    # Google Analytics ID
  pixelId: ""                 # Facebook Pixel ID
  naverAnalytics: ""          # 네이버 애널리틱스
  utmTracking: true           # UTM 파라미터 추적
  funnelEvents:               # 퍼널 이벤트
    - f1_view                # 랜딩 페이지 조회
    - f1_chat_start          # 챗 시작
    - f2_enter               # 로그인
    - reservation_complete   # 예약 완료
```

---

## 🧩 컴포넌트 모듈화 방안

### 1. Hero 섹션 (과별 전환)

```typescript
// src/modules/healthcare/Hero/index.tsx
interface HeroVariantProps {
  config: HealthcareConfig;
}

// 피부과 - 광채 효과
export function GlowVariant({ config }: HeroVariantProps) {
  return (
    <div className="relative overflow-hidden">
      <video className="absolute inset-0" src={config.hero.media.src} />
      <div className="bg-gradient-to-r from-pink-500/20 ...">
        <h1>{config.hero.headline}</h1>
      </div>
    </div>
  );
}

// 치과 - 미소 효과
export function SmileVariant({ config }: HeroVariantProps) {
  return (
    <div className="relative">
      <div className="bg-dental-gradient ...">
        {/* 미소/치아 관련 비주얼 */}
      </div>
    </div>
  );
}

// 정형외과 - 움직임/관절
export function MotionVariant({ config }: HeroVariantProps) {
  return (
    <div className="relative">
      {/* 관절/뼈 관련 비주얼 */}
    </div>
  );
}

// 메인 Hero (설정에 따라 자동 분기)
export default function Hero() {
  const { healthcare } = useHospitalConfig();
  
  const variants = {
    'glow-effect': GlowVariant,
    'smile-effect': SmileVariant,
    'motion-effect': MotionVariant,
  };
  
  const VariantComponent = variants[healthcare.hero.type] || GlowVariant;
  return <VariantComponent config={healthcare} />;
}
```

### 2. 챗봇 메뉴 모듈

```typescript
// src/modules/healthcare/Modules/ModuleGrid.tsx
// 설정 기반으로 동적 생성

export function ModuleGrid() {
  const { healthcare } = useHospitalConfig();
  
  return (
    <div className="grid grid-cols-5 gap-6">
      {healthcare.modules.map((module) => (
        <ModuleCard key={module.id} {...module} />
      ))}
    </div>
  );
}
```

### 3. AI 프롬프트 컴파일러

```typescript
// src/lib/ai/prompts/compiler.ts

interface PromptContext {
  hospital: HospitalConfig;
  mode: 'healthcare' | 'medical';
  track?: string;
  turnCount: number;
}

export function compilePrompt(context: PromptContext): string {
  const { hospital, mode } = context;
  
  // 기본 템플릿 선택
  const baseTemplate = getBaseTemplate(mode);
  
  // 페르소나 주입
  const persona = hospital[mode].persona;
  
  // 과별 특화 프롬프트 로드
  const departmentPrompt = getDepartmentPrompt(
    hospital.department, 
    mode
  );
  
  return `
[페르소나: ${persona.name} (${persona.title})]
- 역할: ${persona.purpose}
- 톤앤매너: ${persona.tone}
- 규칙: ${persona.rules.join(', ')}

${departmentPrompt}

${baseTemplate}
  `.trim();
}
```

---

## 🎨 테마 시스템

### CSS 변수 자동 생성

```typescript
// src/modules/theme/generate-css.ts

export function generateCSSVariables(config: HospitalConfig): string {
  const { healthcare, medical } = config.theme;
  
  return `
    /* 헬스케어 영역 */
    --skin-primary: ${healthcare.colors.primary};
    --skin-secondary: ${healthcare.colors.secondary};
    --skin-accent: ${healthcare.colors.accent};
    --skin-bg: ${healthcare.colors.background};
    --skin-text: ${healthcare.colors.text};
    
    /* 메디컬 영역 */
    --medical-primary: ${medical.colors.primary};
    --medical-bg: ${medical.colors.background};
    --medical-text: ${medical.colors.text};
  `;
}
```

### Tailwind 설정 자동화

```javascript
// tailwind.config.ts
import { loadHospitalConfig } from './src/modules/config/loader';

const config = loadHospitalConfig();

export default {
  theme: {
    extend: {
      colors: {
        skin: {
          primary: 'var(--skin-primary)',
          secondary: 'var(--skin-secondary)',
          // ...
        },
        medical: {
          primary: 'var(--medical-primary)',
          // ...
        },
      },
      // 과별 애니메이션
      animation: {
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'smile-float': 'smileFloat 3s ease-in-out infinite',
      },
    },
  },
};
```

---

## 🚀 새 병원 카피 생성 프로세스

### Step 1: 설정 파일 생성 (5분)
```bash
cp config/templates/dermatology.yaml config/hospital-config.yaml
# 병원 정보 수정
```

### Step 2: 에셋 교체 (10분)
```
config/assets/
├── logo-healthcare.svg   # 병원 노출 X 로고
├── logo-medical.svg      # 병원 로고
└── hero-video.mp4        # 히어로 영상
```

### Step 3: 프롬프트 커스터마이징 (선택)
```
config/prompts/healthcare.md
config/prompts/medical.md
```

### Step 4: 배포
```bash
npm run build
npm run deploy
```

---

## 📊 모듈화 후 기대 효과

| 항목 | Before | After |
|------|--------|-------|
**새 병원 설정 시간** | 2-3일 | 30분 |
**디자인 변경** | 코드 수정 필요 | YAML 변경만 |
**AI 페르소나 변경** | 프롬프트 파일 수정 | YAML 변경만 |
**신규 과목 추가** | 개발 필요 | 설정만으로 가능 |
**브랜딩 일관성** | 높은 위험 | 중앙화된 설정으로 관리 |

---

## 📝 구현 우선순위

### Phase 1: 설정 시스템 (1주)
- [ ] YAML 설정 스키마 정의 (Zod)
- [ ] 설정 로더 구현
- [ ] CSS 변수 자동 생성
- [ ] 기존 hard-coded 값 설정화

### Phase 2: 컴포넌트 모듈화 (2주)
- [ ] Hero 섹션 모듈화 (과별 variant)
- [ ] 챗봇 메뉴 동적 생성
- [ ] Header/Footer 모듈화
- [ ] 로고 시스템 분리

### Phase 3: AI 프롬프트 모듈화 (1주)
- [ ] 프롬프트 템플릿 시스템
- [ ] 과별 프롬프트 분리
- [ ] 페르소나 주입 시스템

### Phase 4: 과별 기본값 (1주)
- [ ] 피부과 기본값
- [ ] 치과 기본값
- [ ] 정형외과 기본값
- [ ] 템플릿 문서화

---

## ⚠️ 마이그레이션 주의사항

1. **기존 코드 변경 최소화**: 기존 동작은 유지하면서 설정 주입 방식으로 변경
2. **하위호환성**: `hospital-config.md` → `hospital-config.yaml` 마이그레이션 가이드 제공
3. **Git 관리**: `config/hospital-config.yaml`은 `.gitignore`에 추가 (병원별 민감정보)
4. **빌드 타임 검증**: 설정 파일 유효성 검사로 런타임 에러 방지

---

**다음 단계**: 위 계획을 바탕으로 Phase 1부터 순차적 구현 시작
