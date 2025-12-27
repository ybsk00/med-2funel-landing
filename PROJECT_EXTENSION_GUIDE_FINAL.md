# 🏥 병원 확장 완벽 가이드 (최종 통합본)

> **목적**: 기존 템플릿(아이니의원/피부과)을 **다른 병원으로 오류 없이 확장**할 때, 반드시 수정해야 하는 모든 파일과 세부 사항을 정리한 완벽 가이드  
> **버전**: v3.0 (2025-12-27)  
> **참고 문서**: PROJECT_EXTENSION_GUIDE.md, PROJECT_EXTENSION_GUIDE_PYEONGCHON_DENTAL.md, PROJECT_EXTENSION_GUIDE_PYEONGCHON_DENTAL_v2.md

---

## 📋 목차

1. [시작 전 준비사항](#1-시작-전-준비사항)
2. [데이터베이스 설정 (Supabase)](#2-데이터베이스-설정-supabase)
3. [환경변수 설정](#3-환경변수-설정)
4. [AI 프롬프트 수정](#4-ai-프롬프트-수정)
5. [디자인/테마 시스템](#5-디자인테마-시스템)
6. [환자 포털 수정](#6-환자-포털-수정)
7. [의료 대시보드 수정](#7-의료-대시보드-수정)
8. [공통 컴포넌트 수정](#8-공통-컴포넌트-수정)
9. [API 라우트 확인](#9-api-라우트-확인)
10. [검색/치환 가이드](#10-검색치환-가이드)
11. [체크리스트 (우선순위별)](#11-체크리스트-우선순위별)
12. [검증 가이드](#12-검증-가이드)

---

## 1. 시작 전 준비사항

### 1.1 필수 수집 정보

새 병원 확장 전에 다음 정보를 **반드시** 수집하세요:

| 항목 | 예시 | 필수여부 |
|------|------|---------|
| 병원명 (국문) | 아이니의원, 평촌이생각치과 | ⭐ 필수 |
| 병원명 (영문) | Aine Clinic, Pyeongchon Dental | 선택 |
| 주소 | 서울시 강남구 ... | ⭐ 필수 |
| 전화번호 | 02-XXX-XXXX | ⭐ 필수 |
| 운영시간 | 평일 10:00-19:00 | ⭐ 필수 |
| 진료과목 | 피부과, 치과, 한방 등 | ⭐ 필수 |
| 의료진 정보 | 이름, 직책, 학력, 전문분야 | ⭐ 필수 |
| 로고 이미지 | logo.svg, logo.png | ⭐ 필수 |
| 의사 프로필 사진 | doctor-avatar.jpg (각 의사별) | ⭐ 필수 |
| 병원 좌표 | 위도/경도 (지도 표시용) | ⭐ 필수 |
| 색상 테마 | 메인색상, 보조색상 | 권장 |
| SCI/학술 논문 정보 | 논문 제목, 저자, 저널명 | 선택 |

### 1.2 이미지 에셋 준비

```
public/
├── logo.svg                    # 랜딩 페이지 로고 (필수)
├── logo.png                    # 대체 로고
├── doctor-avatar.jpg           # 기본 의사 아바타 (필수)
├── doctors/
│   ├── doctor1.jpg            # 개별 의사 프로필
│   ├── doctor2.jpg
│   └── ...
├── images/
│   └── hero-bg.png            # 히어로 배경 이미지 (선택)
└── 5.mp4                       # 대시보드 배경 영상 (선택)
```

---

## 2. 데이터베이스 설정 (Supabase)

### 2.1 새 Supabase 프로젝트 생성

1. [Supabase](https://supabase.com) 접속 → New Project 생성
2. 프로젝트명, 비밀번호 설정
3. Region: Northeast Asia (Seoul) 권장

### 2.2 통합 스키마 실행

**파일 경로**: `supabase/migrations/00_unified_full_schema.sql`

SQL Editor에서 전체 스키마를 실행합니다:

```sql
-- 주요 테이블 (22개)
-- 1. patient_profiles    - 환자 프로필
-- 2. staff_users         - 의료진/스태프
-- 3. patients            - 환자 (CRM용)
-- 4. doctors             - 의사 정보 ⭐ (예약/소개용)
-- 5. appointment_slots   - 예약 슬롯
-- 6. appointments        - 예약
-- 7. visits              - 방문 기록
-- 8. health_topics       - 건강 토픽
-- 9. health_questions    - 건강 질문
-- 10. chat_sessions      - 채팅 세션
-- 11. chat_messages      - 채팅 메시지
-- 12. intake_sessions    - 문진 세션
-- 13. intake_messages    - 문진 메시지
-- 14. intake_evidence    - 문진 근거자료
-- 15. intake_answers     - 문진 답변
-- 16. intake_summaries   - 문진 요약
-- 17. clinical_notes     - 진료 노트
-- 18. treatment_plans    - 치료 계획
-- 19. clinical_images    - 임상 이미지
-- 20. reminders          - 알림
-- 21. consents           - 동의서
-- 22. marketing_events   - 마케팅 이벤트
```

### 2.3 의사 데이터 삽입

**스키마 실행 후 별도로 의사 데이터를 삽입합니다:**

```sql
-- doctors 테이블 데이터 삽입 예시
INSERT INTO public.doctors (name, title, display_name, education, specialty, tracks, is_active, sort_order)
VALUES
  ('홍길동', '대표원장', '홍길동 대표원장', 
   '서울대학교 의과대학 박사', 
   ARRAY['임플란트', '잇몸치료'], 
   ARRAY['implant', 'gum'], 
   TRUE, 1),
  ('김철수', '원장', '김철수 원장', 
   '연세대학교 치의학 석사', 
   ARRAY['교정', '미백'], 
   ARRAY['ortho', 'whitening'], 
   TRUE, 2);
```

### 2.4 분야별 트랙 정의

#### 피부과 (8트랙)
```
acne       - 여드름/트러블
pigment    - 색소/기미/잡티
aging      - 노화/주름/탄력
lifting    - 리프팅/윤곽
laser      - 레이저/광치료
skincare   - 피부관리/클렌징
sensitivity - 민감/홍조
general    - 일반 상담
```

#### 치과 (8트랙)
```
implant     - 임플란트/상실치아
ortho       - 치아교정/투명교정
aesthetic   - 심미(라미네이트/미백)
gum         - 잇몸/치주/출혈·구취
endo        - 신경치료(근관)/치통
restorative - 충치/수복
tmj         - 턱관절/이갈이
general     - 일반진료/검진
```

#### 한방병원 (예시 6트랙)
```
acupuncture - 침/뜸
herbal      - 한약
chuna       - 추나요법
pain        - 통증치료
diet        - 다이어트/비만
general     - 일반 상담
```

---

## 3. 환경변수 설정

### 3.1 `.env.local` 파일 수정

```bash
# =============================================
# Supabase 설정 (반드시 새 프로젝트 값으로 변경)
# =============================================
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR_SERVICE_ROLE_KEY]

# =============================================
# NextAuth 설정
# =============================================
NEXTAUTH_URL=https://[YOUR_DOMAIN].vercel.app
NEXTAUTH_SECRET=[GENERATE_NEW_SECRET]

# =============================================
# 네이버 로그인 (새 앱 등록 필요)
# =============================================
NAVER_CLIENT_ID=[YOUR_NAVER_CLIENT_ID]
NAVER_CLIENT_SECRET=[YOUR_NAVER_CLIENT_SECRET]

# =============================================
# OpenAI API (공유 가능)
# =============================================
OPENAI_API_KEY=[YOUR_API_KEY]

# =============================================
# Google Analytics (선택)
# =============================================
NEXT_PUBLIC_GA_ID=[YOUR_GA_ID]
```

> ⚠️ **중요**: NEXTAUTH_SECRET은 `openssl rand -base64 32`로 새로 생성하세요

---

## 4. AI 프롬프트 수정

### 4.1 핵심 파일: `src/lib/ai/prompts.ts` ⭐⭐⭐

이 파일은 AI 응답의 핵심을 담당합니다. **반드시 수정해야 합니다.**

#### 4.1.1 의료진 데이터 (DOCTORS)

```typescript
// 병원별로 완전히 새로 정의
export const DOCTORS = [
  {
    name: "홍길동",
    title: "대표원장",
    education: "OO대학교 의과대학 박사, △△ 전문의 자격",
    specialty: ["전문분야1", "전문분야2", "전문분야3"],
    tracks: ["track1", "track2", "track3"],
  },
  {
    name: "김철수",
    title: "원장",
    education: "□□대학교 석사, ○○ 전문의",
    specialty: ["전문분야A", "전문분야B"],
    tracks: ["trackA", "trackB"],
  },
  // ... 추가 의료진
];
```

#### 4.1.2 트랙별 의료진 매핑 (DOCTOR_TRACK_MAPPING)

```typescript
// 각 트랙(진료 분야)에 해당하는 의사 이름 배열
export const DOCTOR_TRACK_MAPPING: Record<string, string[]> = {
  track1: ["홍길동", "김철수"],      // 해당 트랙 담당 의사
  track2: ["홍길동"],
  trackA: ["김철수"],
  general: ["홍길동", "김철수"],     // 일반 상담은 모든 의사
};
```

#### 4.1.3 메디컬 트랙 정의 (MEDICAL_TRACKS)

```typescript
// 분야별 트랙 라벨 + 키워드
export const MEDICAL_TRACKS = {
  track1: "트랙1 한글명",
  track2: "트랙2 한글명",
  // ...
};

export const TRACK_KEYWORDS: Record<string, string[]> = {
  track1: ["키워드1", "키워드2", "키워드3"],
  track2: ["키워드A", "키워드B"],
  // ...
};
```

#### 4.1.4 SCI/학술 근거 데이터 (선택)

```typescript
export const SCI_EVIDENCE = {
  journal: "저널명 (예: SCIE, SCI, KCI 등)",
  title: "논문 제목",
  date: "2025.01",
  authors: "저자명 (제1저자) 외",
  link: "논문 링크 (선택)",
};
```

#### 4.1.5 메디컬 시스템 프롬프트 수정

`getMedicalSystemPrompt()` 함수 내 다음 항목 수정:

- 병원명 언급 부분
- 진료 분야 설명
- 의료법 컴플라이언스 문구 (분야별 조정)
- 응급 상황 안내 키워드

```typescript
// getMedicalSystemPrompt() 내부
const prompt = `
당신은 [새병원명]의 AI 상담 도우미입니다.
진료 분야: [새 진료 분야 설명]

[의료법 컴플라이언스 - 분야별 조정 필요]
- 진단/처방이 아닌 참고용 안내입니다
- 정확한 판단은 의료진 대면 진료가 필요합니다
...
`;
```

---

### 4.2 헬스케어 토픽: `src/lib/constants/topics.ts`

비로그인 사용자를 위한 헬스케어 모듈 토픽을 정의합니다.

```typescript
// 분야별 맞춤 토픽 정의 (5개 권장)
export const VALID_TOPICS = [
    'topic1-key',    // 토픽1 설명
    'topic2-key',    // 토픽2 설명
    'topic3-key',    // 토픽3 설명
    'topic4-key',    // 토픽4 설명
    'topic5-key',    // 토픽5 설명
] as const;

export type Topic = typeof VALID_TOPICS[number];

export const TOPIC_LABELS: Record<Topic, string> = {
    'topic1-key': '토픽1 한글명',
    'topic2-key': '토픽2 한글명',
    // ...
};

export const TOPIC_DESCRIPTIONS: Record<Topic, string> = {
    'topic1-key': '토픽1 설명',
    'topic2-key': '토픽2 설명',
    // ...
};
```

#### 분야별 토픽 예시

**피부과**:
- `glow-booster`: D-7 광채 부스터
- `makeup-killer`: 메이크업 무너짐 원인
- `barrier-reset`: 피부장벽 72시간
- `lifting-check`: 리프팅 체크포인트
- `skin-concierge`: 맞춤 스킨 컨시어지

**치과**:
- `stain-csi`: 착색 CSI
- `cold-detect`: 시림 탐정
- `gum-radar`: 잇몸 레이더
- `smile-balance`: 스마일 밸런스
- `implant-ready`: 임플란트 준비도

---

### 4.3 헬스케어 질문 풀: `src/lib/ai/healthcare_questions.ts`

각 토픽에 대한 대화형 질문 풀을 정의합니다. 새 분야에 맞게 전체 재작성 필요.

---

## 5. 디자인/테마 시스템

### 5.1 색상 테마: `tailwind.config.js`

```javascript
// 현재 피부과 테마 (예시)
colors: {
  aine: {
    bg: '#0a1628',        // 메인 배경색
    primary: '#4f9a94',   // 주요 버튼/강조색
    accent: '#3d7a75',    // 호버/액센트
    text: '#1a2e35',      // 텍스트
    subtext: '#64748b',   // 보조 텍스트
    muted: '#94a3b8',     // 비활성화
  },
}

// 새 병원 테마로 변경
colors: {
  [newTheme]: {
    bg: '#새배경색',
    primary: '#새주요색',
    accent: '#새액센트색',
    text: '#새텍스트색',
    subtext: '#새보조색',
    muted: '#새비활성색',
  },
}
```

### 5.2 색상 팔레트 참고

| 분야 | 추천 메인색상 | 분위기 |
|------|-------------|-------|
| 피부과 | 청록, 민트 | 청결, 신선함 |
| 치과 | 네이비, 티파니 | 전문성, 신뢰 |
| 한방 | 베이지, 갈색 | 전통, 자연 |
| 정형외과 | 블루, 화이트 | 의료, 안정 |
| 성형외과 | 골드, 핑크 | 고급, 아름다움 |

### 5.3 전체 색상 클래스 치환

모든 파일에서 다음 패턴을 검색/치환합니다:

```
# VS Code에서 Ctrl+Shift+H (전체 검색/치환)

# 배경
"bg-aine-bg" → "bg-[새테마]-bg"
"bg-dental-bg" → "bg-[새테마]-bg"

# 주요 색상
"aine-primary" → "[새테마]-primary"
"dental-primary" → "[새테마]-primary"

# 액센트
"aine-accent" → "[새테마]-accent"

# 텍스트
"aine-subtext" → "[새테마]-subtext"
"aine-muted" → "[새테마]-muted"

# 하드코딩된 색상
"#1a2332" → "#새카드색"
"#0d1420" → "#새입력창색"
```

---

## 6. 환자 포털 수정 (상세 구현 가이드) ⭐⭐⭐

> **중요**: 이 섹션은 `/patient` 경로의 모든 페이지를 새 병원으로 리브랜딩하는 **완전한 구현 가이드**입니다.  
> 각 파일별 **수정 라인, 현재 값, 변경 값**을 명시하여 오류 없이 적용할 수 있습니다.

### 6.1 디렉토리 구조

```
src/app/patient/
├── layout.tsx           # 공통 레이아웃 (하단 네비게이션)
├── page.tsx             # ⭐⭐⭐ 메인 대시보드 (로그인 필수)
├── home/
│   └── page.tsx         # ⭐⭐ 비로그인 랜딩 페이지
├── login/
│   ├── page.tsx         # ⭐⭐ 로그인/회원가입
│   └── actions.ts       # 로그인 액션 (수정 불필요)
├── chat/
│   └── page.tsx         # ⭐⭐⭐ AI 예진 상담 (핵심!)
├── hospitals/
│   └── page.tsx         # ⭐⭐ 병원 조회 (검색 쿼리 수정)
├── appointments/
│   ├── page.tsx         # 예약 목록
│   ├── AppointmentsClient.tsx
│   ├── new/
│   │   └── page.tsx     # ⭐⭐ 새 예약 (의사 목록 수정)
│   └── [id]/
│       └── AppointmentDetailClient.tsx  # ⭐ 예약 상세
├── history/             # 예약 기록 (수정 불필요)
├── medications/         # 복약 관리 (선택)
└── profile/             # 마이페이지 (선택)
```

---

### 6.2 파일별 상세 수정 가이드

---

#### 📄 6.2.1 `src/app/patient/page.tsx` (메인 대시보드) ⭐⭐⭐

메인 대시보드는 환자가 로그인 후 처음 보는 화면입니다. **브랜딩 핵심 파일**입니다.

| 라인 | 현재 값 | 변경 값 |
|------|--------|--------|
| 94 | `평촌이생각치과` / `리원피부과` | `[새병원명]` |
| 104 | `치아 상태는` / `피부 고민이` | `[분야] 상태는` |
| 128 | `치아 불편 정리` / `피부 고민 정리` | `[분야] 고민 정리` |
| 235 | `평촌이생각치과` / `리원피부과` | `[새병원명]` |
| 267 | `정기 스케일링 안내` / `피부 관리 안내` | `[분야별 안내]` |
| 268 | `6개월마다 스케일링으로 치아 건강을` / `정기적인 피부 관리로` | `[분야별 안내 문구]` |

**코드 예시 (치과 → 피부과 변환)**:

```typescript
// 변경 전 (치과)
<h1 className="text-2xl font-bold">평촌이생각치과</h1>
<p>치아 상태는 어떠신가요?</p>
<span>치아 불편 정리</span>

// 변경 후 (피부과)
<h1 className="text-2xl font-bold">리원피부과</h1>
<p>피부 고민이 있으신가요?</p>
<span>피부 고민 정리</span>
```

---

#### 📄 6.2.2 `src/app/patient/home/page.tsx` (비로그인 랜딩) ⭐⭐

로그인하지 않은 사용자가 처음 보는 환자 포털 소개 페이지입니다.

| 라인 | 현재 값 | 변경 값 |
|------|--------|--------|
| 19 | `평촌이생각치과` | `[새병원명]` |
| 41 | `평촌이생각치과 환자 포털` | `[새병원명] 환자 포털` |
| 110 | `© 2025 평촌이생각치과` | `© 2025 [새병원명]` |

**코드 예시**:

```typescript
// 변경 전
<title>평촌이생각치과 환자 포털</title>
<footer>© 2025 평촌이생각치과. All rights reserved.</footer>

// 변경 후
<title>리원피부과 환자 포털</title>
<footer>© 2025 리원피부과. All rights reserved.</footer>
```

---

#### 📄 6.2.3 `src/app/patient/login/page.tsx` (로그인) ⭐⭐

소셜 로그인(네이버) 페이지입니다. 브랜딩 요소를 수정합니다.

| 라인 | 현재 값 | 변경 값 |
|------|--------|--------|
| 67 | `평촌이생각치과` | `[새병원명]` |

**추가 수정 포인트**:
- 배경색: `bg-dental-bg` → `bg-[새테마]-bg`
- 로고 이모지: `🦷` → `✨` (분야별)
- 환영 문구: 분야에 맞게 조정

**코드 예시**:

```typescript
// 변경 전
<div className="bg-dental-bg">
  <span className="text-3xl">🦷</span>
  <h1>평촌이생각치과</h1>
  <p>치아 건강을 위한 첫 걸음</p>
</div>

// 변경 후 (피부과)
<div className="bg-aine-bg">
  <span className="text-3xl">✨</span>
  <h1>리원피부과</h1>
  <p>건강한 피부를 위한 첫 걸음</p>
</div>
```

---

#### 📄 6.2.4 `src/app/patient/chat/page.tsx` (AI 예진 상담) ⭐⭐⭐

**가장 중요한 파일!** AI 상담 초기 메시지와 UI 텍스트를 분야에 맞게 수정합니다.

| 라인 | 현재 값 | 변경 값 |
|------|--------|--------|
| 15 | `quickReplies (치과 증상)` | `[분야 증상 목록]` |
| 23 | `평촌이생각치과 AI 예진` | `[새병원명] AI 예진` |
| 23 | `🦷 치아가 어디 불편하신가요?` | `✨ [분야] 고민이 무엇인가요?` |
| 172 | `평촌이생각치과 AI 예진` | `[새병원명] AI 예진` |
| 202 | `🦷 (치아 아이콘)` | `✨ (분야별 아이콘)` |
| 205 | `평촌이생각치과` | `[새병원명]` |
| 403 | `평촌이생각치과 예약` | `[새병원명] 예약` |
| 415 | `전문 치과 의료진` | `전문 [분야] 의료진` |
| 420 | `전문 치과 의료진` | `전문 [분야] 의료진` |

**Quick Replies 분야별 예시**:

```typescript
// 치과 Quick Replies (변경 전)
const quickReplies = [
  "치아가 시려요",
  "잇몸에서 피가 나요", 
  "충치 치료가 필요해요",
  "임플란트 상담",
  "교정 상담",
];

// 피부과 Quick Replies (변경 후)
const quickReplies = [
  "여드름이 심해요",
  "기미/잡티가 고민이에요",
  "주름/탄력이 걱정돼요",
  "피부가 예민해요",
  "리프팅 상담",
];

// 한방 Quick Replies (예시)
const quickReplies = [
  "허리가 아파요",
  "목/어깨가 결려요",
  "소화가 잘 안돼요",
  "다이어트 상담",
  "수면 문제가 있어요",
];
```

**AI 초기 메시지 수정**:

```typescript
// 치과 (변경 전)
const initialMessage = {
  role: 'ai',
  content: "안녕하세요! 평촌이생각치과 AI 예진입니다 🦷\n\n치아가 어디 불편하신가요?",
};

// 피부과 (변경 후)
const initialMessage = {
  role: 'ai', 
  content: "안녕하세요! 리원피부과 AI 예진입니다 ✨\n\n피부 고민이 무엇인가요?",
};
```

> ⚠️ **중요**: AI 응답 로직은 `/api/chat/route.ts`가 `src/lib/ai/prompts.ts`의 `getMedicalSystemPrompt()`를 사용합니다.  
> `prompts.ts`가 이미 새 병원으로 수정되어 있다면, AI 응답은 자동으로 새 병원 기준으로 생성됩니다.  
> 이 파일에서는 **클라이언트 측 UI 텍스트만** 수정하면 됩니다.

---

#### 📄 6.2.5 `src/app/patient/hospitals/page.tsx` (병원 조회) ⭐⭐

네이버 지도 API를 사용한 병원 검색 페이지입니다. **검색 쿼리와 추천 병원 정보**를 수정해야 합니다.

| 라인 | 현재 값 | 변경 값 |
|------|--------|--------|
| 30-39 | `RECOMMENDED_CLINIC (평촌이생각치과 정보)` | `[새병원 정보]` |
| 71 | `qn: "치과"` | `qn: "[새 진료과목]"` |
| 177 | `평촌이생각치과 추천 카드` | `[새병원명] 추천 카드` |

> ⚠️ **병원 조회 오류 주의**: 검색 쿼리 `qn` 값이 잘못되면 병원이 검색되지 않습니다!

**코드 예시**:

```typescript
// 치과 (변경 전)
const RECOMMENDED_CLINIC = {
  name: "평촌이생각치과",
  address: "경기도 안양시 동안구 평촌대로 ...",
  phone: "031-XXX-XXXX",
  category: "치과",
};

const searchQuery = {
  qn: "치과",  // ← 반드시 분야에 맞게 수정!
  // ...
};

// 피부과 (변경 후)
const RECOMMENDED_CLINIC = {
  name: "리원피부과",
  address: "서울시 강남구 ...",
  phone: "02-XXX-XXXX",
  category: "피부과",
};

const searchQuery = {
  qn: "피부과",  // ← 피부과로 변경
  // ...
};
```

---

#### 📄 6.2.6 `src/app/patient/appointments/new/page.tsx` (새 예약) ⭐⭐

새 예약 생성 페이지입니다. **의사 목록**을 새 병원 의료진으로 변경해야 합니다.

| 라인 | 현재 값 | 변경 값 |
|------|--------|--------|
| 25 | `doctors (치과 의사 목록)` | `[새 의사 목록]` |
| 105 | `평촌이생각치과 진료` | `[새병원명] 진료` |

**의사 목록 수정 예시**:

```typescript
// 치과 (변경 전)
const doctors = ['전체', '김기영 대표원장', '전민제 원장', '이혜정 교정원장', '김유진 원장'];

// 피부과 (변경 후) - prompts.ts의 DOCTORS 배열 기준
const doctors = ['전체', '문정윤 대표원장', '김도영 원장', '이미혜 원장'];

// 또는 API에서 동적 로드 (권장)
const { data: doctors } = await fetch('/api/doctors').then(r => r.json());
```

> 💡 **권장**: 의사 목록을 하드코딩하지 않고 `/api/doctors` API에서 동적으로 로드하면,  
> `prompts.ts`나 DB의 doctors 테이블만 수정해도 자동 반영됩니다.

---

#### 📄 6.2.7 `src/app/patient/appointments/[id]/AppointmentDetailClient.tsx` (예약 상세) ⭐

예약 상세 조회 페이지입니다.

| 라인 | 현재 값 | 변경 값 |
|------|--------|--------|
| 142 | `평촌이생각치과` | `[새병원명]` |

**코드 예시**:

```typescript
// 변경 전
<div className="text-sm text-gray-500">
  위치: 평촌이생각치과
</div>

// 변경 후
<div className="text-sm text-gray-500">
  위치: 리원피부과
</div>
```

---

### 6.3 분야별 텍스트 변환 매핑표

환자 포털 전체에서 사용되는 텍스트를 분야별로 일괄 변환할 때 참고하세요.

#### 치과 → 피부과 변환

| 치과 (현재) | 피부과 (변경) |
|------------|--------------|
| 치아 | 피부 |
| 치아 상태 | 피부 상태 |
| 치아 불편 | 피부 고민 |
| 치아가 어디 | 피부 고민이 |
| 불편하신가요 | 있으신가요 |
| 치과 의료진 | 피부과 의료진 |
| 스케일링 | 피부 관리 |
| 충치 | 여드름 |
| 임플란트 | 리프팅 |
| 교정 | 미백 |
| 잇몸 | 모공 |
| 🦷 | ✨ |

#### 치과 → 한방 변환

| 치과 (현재) | 한방 (변경) |
|------------|------------|
| 치아 | 몸 / 건강 |
| 치아 상태 | 건강 상태 |
| 치아 불편 | 불편한 곳 |
| 치과 의료진 | 한의사 |
| 스케일링 | 보양/관리 |
| 🦷 | 🌿 |

---

### 6.4 환자 포털 검색/치환 명령어

VS Code에서 **Ctrl+Shift+H** (전체 검색/치환)로 일괄 변경:

```
# 1단계: 병원명 변경
"평촌이생각치과" → "[새병원명]"
"리원피부과" → "[새병원명]"

# 2단계: 분야 키워드 변경 (치과 → 피부과 예시)
"치아 상태는" → "피부 고민이"
"치아 불편" → "피부 고민"
"치아가 어디" → "피부 고민이"
"불편하신가요" → "있으신가요"
"전문 치과" → "전문 피부과"
"치과 의료진" → "피부과 의료진"

# 3단계: 아이콘 변경
"🦷" → "✨"

# 4단계: 검색 쿼리 변경
"qn: \"치과\"" → "qn: \"피부과\""
```

---

### 6.5 환자 포털 수정 체크리스트

| 우선순위 | 파일 | 수정 내용 | 완료 |
|---------|------|----------|------|
| ⭐⭐⭐ | `patient/page.tsx` | 병원명(94,235행), AI카드 문구(104,128행), 알림(267-268행) | [ ] |
| ⭐⭐⭐ | `patient/chat/page.tsx` | Quick Replies(15행), AI인사말(23행), 아이콘(202행), 병원명(172,205,403행) | [ ] |
| ⭐⭐ | `patient/home/page.tsx` | 타이틀(41행), 병원명(19행), 푸터(110행) | [ ] |
| ⭐⭐ | `patient/login/page.tsx` | 병원명(67행), 배경색, 로고 이모지 | [ ] |
| ⭐⭐ | `patient/hospitals/page.tsx` | 검색쿼리 qn(71행), 추천병원 정보(30-39행) | [ ] |
| ⭐⭐ | `patient/appointments/new/page.tsx` | 의사 목록(25행), 병원명(105행) | [ ] |
| ⭐ | `patient/appointments/[id]/...` | 위치 병원명(142행) | [ ] |
| ⭐ | `patient/layout.tsx` | 하단 네비 라벨/아이콘 (필요시) | [ ] |

---

### 6.6 환자 포털 검증 체크리스트

수정 완료 후 반드시 다음 페이지들을 **직접 테스트**하세요:

| 페이지 | URL | 확인 사항 |
|-------|-----|----------|
| 비로그인 랜딩 | `/patient/home` | 병원명, 푸터 브랜딩 |
| 로그인 | `/patient/login` | 병원명, 로고, 배경색 |
| 메인 대시보드 | `/patient` | 병원명, AI카드 문구, 퀵메뉴 |
| AI 상담 | `/patient/chat` | 초기 메시지, Quick Replies, 아이콘 |
| 병원 조회 | `/patient/hospitals` | 검색 결과 (피부과/치과 등 올바르게 표시) |
| 새 예약 | `/patient/appointments/new` | 의사 목록 정상 표시 |

---

## 7. 의료 대시보드 수정

### 7.1 주요 파일

#### `src/app/medical/patient-dashboard/PatientDashboardClient.tsx` ⭐⭐

```typescript
// 수정 포인트:
// 1. 배경: bg-[테마]-bg → 새 테마
// 2. 예약 카드: 색상, 병원명
// 3. 퀵액션 버튼 (6개): 예약/상담요약/증상체크/업로드/후기/위치
// 4. 영상 배경: /5.mp4 → 새 영상 (선택)
// 5. 탭 하이라이트 (후기/위치)
```

#### `src/components/medical/PatientHeader.tsx` ⭐⭐

```typescript
// 헤더 컴포넌트
// 수정 포인트:
// 1. 배경색: bg-[테마]-bg/80
// 2. 로고 이모지: 🦷 → 🏥 또는 새 이모지
// 3. 병원명: "아이니의원" → "새병원명"
// 4. 사용자 뱃지 색상

// 예시 코드
<header className="bg-[테마]-bg/80 backdrop-blur-md ...">
    <div className="rounded-full bg-[테마]-primary/20">
        <span className="text-xl">🏥</span>  {/* 분야별 이모지 */}
    </div>
    <span className="text-xl font-bold">새병원명</span>
</header>
```

#### `src/components/medical/MedicalChatInterface.tsx` ⭐⭐

```typescript
// 채팅 인터페이스
// 수정 포인트:
// 1. 헤더 색상, 병원명
// 2. AI 아바타: /doctor-avatar.jpg → 새 이미지
// 3. AI 인사말: "안녕하세요, [새병원명] AI 상담입니다..."
// 4. 메시지 버블 색상
// 5. 입력창 배경색
// 6. 예약 모달 버튼 색상
```

---

## 8. 공통 컴포넌트 수정

### 8.1 모달 컴포넌트

#### `src/components/medical/ReservationModal.tsx` ⭐⭐

예약 모달:
- 병원명 (모달 타이틀)
- 의사 목록 (API에서 자동 로드)
- 진료 시간 안내
- 확인 버튼 색상

#### `src/components/medical/DoctorIntroModal.tsx` ⭐⭐

의료진 소개 모달:
```typescript
// doctorImages 객체 수정
const doctorImages: Record<string, string> = {
  "홍길동": "/doctors/doctor1.jpg",
  "김철수": "/doctors/doctor2.jpg",
  // ...
};
```

#### `src/components/medical/MapModal.tsx` ⭐

지도 모달:
```typescript
// 수정 필수
const HOSPITAL_NAME = "새병원명";
const HOSPITAL_ADDRESS = "새 주소";
const HOSPITAL_COORDS = {
  lat: 37.XXXXX,  // 위도
  lng: 127.XXXXX  // 경도
};
```

#### `src/components/medical/EvidenceModal.tsx`

학술 근거 모달 - SCI_EVIDENCE 데이터 연동 확인

### 8.2 채팅 인터페이스

#### `src/components/chat/ChatInterface.tsx` ⭐⭐⭐

```typescript
// 수정 포인트:

// 1. 모듈 탭 (헬스케어 모드)
const modules = [
    { id: "topic1", label: "토픽1", desc: "설명1", icon: Icon1 },
    { id: "topic2", label: "토픽2", desc: "설명2", icon: Icon2 },
    // ...
];

// 2. AI 인사말
content: "안녕하세요, [새병원명] AI 상담입니다.\n\n..."

// 3. 헤더 (비로그인 모드)
<헤더>
    <span>🏥</span>  {/* 분야별 이모지 */}
    <span>[새병원명]</span>
</헤더>

// 4. 아바타
src="/doctor-avatar.jpg" → "/새-아바타.jpg"

// 5. 색상
"bg-[테마]-bg", "#1a2332", "[테마]-primary", "[테마]-subtext"
```

### 8.3 공통 UI

#### `src/components/common/Footer.tsx`

푸터:
- 병원명/회사명
- 주소
- 전화번호
- 사업자등록번호

---

## 9. API 라우트 확인

### 9.1 주요 API 파일

API 라우트는 대부분 **수정 불필요**하지만, 다음 사항을 확인하세요:

| 파일 | 확인 사항 |
|------|----------|
| `src/app/api/chat/route.ts` | prompts.ts 연동 확인 |
| `src/app/api/healthcare/chat/route.ts` | 헬스케어 프롬프트 연동 |
| `src/app/api/doctors/route.ts` | 의사 API 정상 동작 |
| `src/app/api/appointments/*` | 예약 API 정상 동작 |

### 9.2 API 응답 구조 확인

```typescript
// 채팅 API 응답 구조 (변경 불필요)
{
  role: "ai",
  content: string,
  action: "RESERVATION_MODAL" | "DOCTOR_INTRO_MODAL" | "EVIDENCE_MODAL" | null,
  highlightTabs: ("review" | "map")[],
  track: string,
  askedQuestionCount: number,
  doctorsData?: Doctor[],
  evidenceData?: SciEvidence
}
```

---

## 10. 검색/치환 가이드

### 10.1 전체 검색/치환 (VS Code: Ctrl+Shift+H)

1단계 - 병원명:
```
"아이니의원" → "새병원명"
"리원피부과" → "새병원명"
"평촌이생각치과" → "새병원명"
"위담한방병원" → "새병원명"
```

2단계 - 색상 테마:
```
"aine-bg" → "[새테마]-bg"
"aine-primary" → "[새테마]-primary"
"aine-accent" → "[새테마]-accent"
"aine-subtext" → "[새테마]-subtext"
"dental-bg" → "[새테마]-bg"
"dental-primary" → "[새테마]-primary"
```

3단계 - 하드코딩된 색상:
```
"#1a2332" → "#새카드색"
"#0d1420" → "#새입력창색"
"#0a1628" → "#새배경색"
```

4단계 - 이미지/아이콘:
```
"/doctor-avatar.jpg" → "/새-아바타.jpg"
"🦷" → "🏥" (또는 분야별 이모지)
"🌿" → "새 이모지"
```

### 10.2 분야별 이모지 추천

| 분야 | 권장 이모지 |
|------|-----------|
| 피부과 | 🌟, ✨, 💆‍♀️ |
| 치과 | 🦷, 😁 |
| 한방 | 🌿, 🍵, 🧘 |
| 정형외과 | 🦴, 💪 |
| 성형외과 | 💎, ✨ |
| 안과 | 👁️, 👓 |
| 일반 | 🏥, ⚕️ |

---

## 11. 체크리스트 (우선순위별)

### 🔴 1순위: 필수 (빌드 필수)

- [ ] **Supabase 프로젝트 생성**
- [ ] **`00_unified_full_schema.sql` 실행**
- [ ] **doctors 테이블 데이터 삽입**
- [ ] **`.env.local` 환경변수 설정**
  - [ ] NEXT_PUBLIC_SUPABASE_URL
  - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
  - [ ] SUPABASE_SERVICE_ROLE_KEY
  - [ ] NEXTAUTH_URL
  - [ ] NEXTAUTH_SECRET
  - [ ] NAVER_CLIENT_ID/SECRET
- [ ] **`prompts.ts` 완전 수정**
  - [ ] DOCTORS 배열
  - [ ] DOCTOR_TRACK_MAPPING
  - [ ] MEDICAL_TRACKS
  - [ ] TRACK_KEYWORDS
  - [ ] getMedicalSystemPrompt() 병원명
- [ ] **`topics.ts` 수정** (헬스케어 토픽)
- [ ] **`tailwind.config.js` 색상 테마**
- [ ] **`/public/logo.svg` 로고 교체**
- [ ] **`/public/doctor-avatar.jpg` 의사 아바타**
- [ ] **`layout.tsx` 메타데이터**
  - [ ] title
  - [ ] description
  - [ ] openGraph

### 🟠 2순위: 중요 (UI 동작)

- [ ] `PatientHeader.tsx` - 헤더 로고, 병원명
- [ ] `MedicalChatInterface.tsx` - AI 인사말, 아바타
- [ ] `ChatInterface.tsx` - 모듈 탭, 인사말
- [ ] `ReservationModal.tsx` - 병원명, 의사 목록
- [ ] `MapModal.tsx` - 지도 좌표, 주소
- [ ] `DoctorIntroModal.tsx` - doctorImages 매핑
- [ ] `patient/page.tsx` - 홈 화면 브랜딩
- [ ] `patient/login/page.tsx` - 로그인 페이지
- [ ] `patient/home/page.tsx` - 인트로 페이지
- [ ] `patient/appointments/*` - 예약 시스템

### 🟡 3순위: 디자인 (선택)

- [ ] 전체 색상 치환 (검색/치환)
- [ ] `PatientDashboardClient.tsx` - 영상, 퀵액션
- [ ] `Footer.tsx` - 푸터 정보
- [ ] 배경 이미지/영상 교체
- [ ] 커스텀 폰트 적용
- [ ] 복약 관리 페이지 수정
- [ ] 마케팅 페이지 수정

---

## 12. 검증 가이드

### 12.1 빌드 확인

```bash
# 빌드 테스트
npm run build

# 개발 서버 실행
npm run dev
```

### 12.2 페이지별 테스트

| 페이지 | URL | 확인 사항 |
|-------|-----|----------|
| 랜딩 | `/` | 로고, 병원명, 모듈 탭 |
| 헬스케어 채팅 | `/healthcare/chat` | 토픽 선택, AI 응답 |
| 로그인 | `/patient/login` | 소셜 로그인 동작 |
| 환자 홈 | `/patient` | 브랜딩, 퀵메뉴 |
| 예약 | `/patient/appointments` | 의사 목록, 예약 생성 |
| AI 상담 | `/patient/chat` | 프롬프트 응답, 모달 |
| 관리자 | `/admin` | 대시보드 접근 |

### 12.3 기능 테스트

- [ ] 네이버 로그인 → 회원가입 → 로그인 성공
- [ ] AI 채팅 → 응답 정상 (병원명, 의사명 포함)
- [ ] 예약 생성 → DB 저장 확인
- [ ] 예약 목록 조회 → 정상 표시
- [ ] 모달 동작 (예약/의료진/지도/논문)
- [ ] 로그아웃 → 리다이렉션

### 12.4 데이터 확인 (Supabase)

```sql
-- 의사 데이터 확인
SELECT * FROM doctors WHERE is_active = true ORDER BY sort_order;

-- 예약 데이터 확인
SELECT * FROM appointments ORDER BY created_at DESC LIMIT 10;

-- 환자 프로필 확인
SELECT * FROM patient_profiles LIMIT 10;
```

---

## 📝 부록: 파일 경로 빠른 참조

```
프로젝트루트/
├── .env.local                   ⭐⭐ 환경변수
├── tailwind.config.js           ⭐⭐⭐ 색상 테마
├── public/
│   ├── logo.svg                 ⭐ 로고
│   ├── doctor-avatar.jpg        ⭐ 의사 아바타
│   └── doctors/                 개별 의사 사진
├── supabase/migrations/
│   └── 00_unified_full_schema.sql  ⭐⭐⭐ DB 스키마
└── src/
    ├── lib/
    │   ├── ai/
    │   │   ├── prompts.ts       ⭐⭐⭐ AI 프롬프트 + 의료진 데이터
    │   │   └── healthcare_questions.ts  헬스케어 질문 풀
    │   └── constants/
    │       └── topics.ts        ⭐⭐ 헬스케어 토픽
    ├── app/
    │   ├── layout.tsx           ⭐⭐ 메타데이터
    │   ├── page.tsx             ⭐ 랜딩 페이지
    │   ├── patient/             ⭐⭐ 환자 포털
    │   │   ├── page.tsx         메인 홈
    │   │   ├── login/           로그인
    │   │   ├── home/            인트로
    │   │   ├── chat/            AI 상담
    │   │   └── appointments/    예약 관리
    │   ├── medical/
    │   │   └── patient-dashboard/
    │   │       └── PatientDashboardClient.tsx  ⭐⭐
    │   └── healthcare/
    │       └── chat/            헬스케어 채팅
    └── components/
        ├── chat/
        │   └── ChatInterface.tsx     ⭐⭐⭐ 채팅 UI
        ├── medical/
        │   ├── PatientHeader.tsx     ⭐⭐ 헤더
        │   ├── MedicalChatInterface.tsx ⭐⭐
        │   ├── ReservationModal.tsx  ⭐⭐ 예약 모달
        │   ├── DoctorIntroModal.tsx  ⭐⭐ 의료진 모달
        │   ├── MapModal.tsx          ⭐ 지도 모달
        │   └── EvidenceModal.tsx     논문 모달
        └── common/
            └── Footer.tsx            ⭐ 푸터
```

---

## 📝 업데이트 이력

### v3.0 (2025-12-27) - 최종 통합본
- 기존 3개 가이드 문서 통합 (PROJECT_EXTENSION_GUIDE, _PYEONGCHON_DENTAL, _PYEONGCHON_DENTAL_v2)
- DB 스키마 `00_unified_full_schema.sql` 기반 테이블 정보 반영
- 환자 포털 (`/patient`) 전체 파일 구조 포함
- 분야별 트랙 정의 (피부과/치과/한방 예시)
- 검색/치환 가이드 상세화
- 검증 가이드 추가
- 체크리스트 우선순위 재정리

---

> **⚠️ 중요 안내**:  
> 이 가이드는 **오류 없이 확장**하기 위한 완벽 가이드입니다.  
> 체크리스트를 순서대로 따라가면서 모든 항목을 확인하세요.  
> 빌드 후 반드시 **모든 페이지와 기능을 테스트**하세요.

---

*이 문서는 프로젝트 복제 후 새 병원으로 확장 시 참고용입니다.*
