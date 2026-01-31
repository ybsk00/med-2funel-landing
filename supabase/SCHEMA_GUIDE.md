# 📊 모듈화된 데이터베이스 스키마 가이드

## 📁 파일 구조

```
supabase/
├── modules/                          # 모듈별 SQL 파일
│   ├── 01_extensions.sql            # 확장 기능
│   ├── 02_users.sql                 # 사용자 관리
│   ├── 03_visits.sql                # 방문/예약
│   ├── 04_chat.sql                  # 채팅/AI
│   ├── 05_intake.sql                # 문진/설문
│   ├── 06_clinical.sql              # 임상/의료
│   ├── 07_marketing.sql             # 마케팅/분석
│   ├── 08_audit.sql                 # 감사/보안
│   └── 09_functions.sql             # 헬퍼 함수
├── full_migration_schema.sql        # 전체 통합 파일
└── SCHEMA_GUIDE.md                  # 이 문서
```

---

## 🔧 모듈별 설명

### 01_extensions.sql
**용도**: PostgreSQL 확장 기능 활성화
- `uuid-ossp`: UUID 자동 생성
- 추가 확장: pgcrypto, citext 등

### 02_users.sql
**용도**: 사용자 및 직원 관리

| 테이블 | 설명 |
|--------|------|
| `patient_profiles` | 환자 개인정보 (Auth 연동) |
| `staff_users` | 의사/직원/관리자 계정 |

**함수**: `is_staff()`, `is_admin()`, `is_doctor()`

### 03_visits.sql
**용도**: 방문 및 예약 관리

| 테이블 | 설명 |
|--------|------|
| `visits` | 방문 이력 |
| `appointments` | 예약 상세 정보 |
| `patients` | CRM 환자 관리 |

### 04_chat.sql
**용도**: AI 채팅 시스템

| 테이블 | 설명 |
|--------|------|
| `chat_sessions` | 채팅 세션 |
| `chat_messages` | 메시지 이력 |
| `chat_summaries` | AI 요약 정보 |

### 05_intake.sql
**용도**: 문진 및 설문 데이터

| 테이블 | 설명 |
|--------|------|
| `health_topics` | 건강 주제/모듈 |
| `health_questions` | AI 문진 질문 |
| `intake_answers` | 환자 답변 |
| `intake_summaries` | 문진 결과 요약 |

### 06_clinical.sql
**용도**: 임상 및 의료 데이터

| 테이블 | 설명 |
|--------|------|
| `clinical_notes` | 임상 기록 (SOAP) |
| `treatment_plans` | 치료 계획/처방 |
| `reminders` | 환자 알림 |
| `clinical_images` | 임상 이미지 |

### 07_marketing.sql
**용도**: 마케팅 추적 및 분석

| 테이블 | 설명 |
|--------|------|
| `marketing_events` | 퍼널 이벤트 |
| `marketing_conversions` | 컨버전 기록 |
| `utm_links` | UTM 링크 관리 |
| `marketing_daily_stats` | 일별 집계 |

### 08_audit.sql
**용도**: 감사 로그

| 테이블 | 설명 |
|--------|------|
| `audit_logs` | 시스템 감사 로그 |

### 09_functions.sql
**용도**: 헬퍼 함수 및 트리거

| 함수 | 설명 |
|------|------|
| `is_staff()` | 직원 확인 |
| `is_admin()` | 관리자 확인 |
| `is_doctor()` | 의사 확인 |
| `update_updated_at_column()` | updated_at 자동 갱신 |

---

## 🚀 실행 방법

### 방법 1: 전체 파일 실행 (간단)

```bash
# Supabase 대시보드 SQL Editor에서 실행
\i full_migration_schema.sql
```

### 방법 2: 모듈별 실행 (선택적)

```bash
# 순서대로 실행 (의존성 있음)
\i modules/01_extensions.sql
\i modules/02_users.sql
\i modules/03_visits.sql
\i modules/04_chat.sql
\i modules/05_intake.sql
\i modules/06_clinical.sql
\i modules/07_marketing.sql
\i modules/08_audit.sql
\i modules/09_functions.sql
```

### 방법 3: 특정 모듈만 실행

```bash
# 예: 마케팅 기능만 추가
\i modules/01_extensions.sql
\i modules/02_users.sql  -- is_staff() 필요
\i modules/07_marketing.sql
```

---

## 📋 테이블 요약

| 모듈 | 테이블 수 | 주요 용도 |
|------|----------|----------|
| Users | 2 | 인증/권한 |
| Visits | 3 | 예약 관리 |
| Chat | 3 | AI 상담 |
| Intake | 4 | 문진 설문 |
| Clinical | 4 | 의료 기록 |
| Marketing | 4 | 마케팅 추적 |
| Audit | 1 | 로깅 |
| **총계** | **21** | - |

---

## 🔐 RLS 정책 요약

| 테이블 | 환자 접근 | 직원 접근 |
|--------|----------|----------|
| patient_profiles | 자신만 | X |
| appointments | 자신만 | 전체 관리 |
| chat_sessions | 자신만 | 전체 조회 |
| clinical_notes | X | 전체 관리 |
| marketing_events | X | 전체 조회 |

---

## 📝 마이그레이션 노트

### 기존 스키마 → 새 스키마 변경사항

1. **appointments 테이블** 추가 (예약 상세)
2. **patients 테이블** 확장 (CRM용)
3. **chat_summaries 테이블** 추가
4. **marketing 테이블** 4개 추가
5. **인덱스** 대폭 추가 (성능 최적화)
6. **audit_logs** 확장 (IP, UA 추가)

### 하위 호환성

- 기존 테이블 구조는 유지
- 새 테이블은 추가만 함
- 기존 데이터 영향 없음

---

## 🔄 유지보수

### 새 모듈 추가 시

1. `modules/XX_module_name.sql` 생성
2. `full_migration_schema.sql`에 통합
3. 이 문서에 설명 추가

### 스키마 버전 관리

```sql
-- 버전 기록 테이블
CREATE TABLE public.schema_versions (
  version INT PRIMARY KEY,
  description TEXT,
  applied_at TIMESTAMPTZ DEFAULT NOW()
);

-- 현재 버전 기록
INSERT INTO public.schema_versions (version, description) 
VALUES (2, 'Modular schema migration');
```
