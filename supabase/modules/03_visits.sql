-- ============================================
-- 모듈 3: 방문/예약 관리 (Visits & Appointments)
-- ============================================

-- 방문/예약 테이블
CREATE TABLE public.visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  visit_type TEXT, -- 'first', 'revisit', 'online'
  status TEXT, -- 'scheduled', 'completed', 'canceled'
  scheduled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.visits IS '환자 방문 및 예약 정보';
COMMENT ON COLUMN public.visits.visit_type IS '방문 유형: first(초진), revisit(재진), online(온라인)';
COMMENT ON COLUMN public.visits.status IS '상태: scheduled(예약), completed(완료), canceled(취소)';

-- 예약 상세 정보 테이블 (추가 모듈)
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  doctor_name TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'scheduled', -- 'scheduled', 'confirmed', 'completed', 'cancelled'
  naver_user_id TEXT, -- NextAuth 네이버 로그인 연동
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.appointments IS '예약 상세 정보';

-- 환자 테이블 (CRM용)
CREATE TABLE public.patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  naver_user_id TEXT,
  name TEXT,
  email TEXT,
  phone TEXT,
  time TEXT,
  type TEXT, -- '초진', '재진', '온라인'
  complaint TEXT,
  keywords TEXT[],
  status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'cancelled'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.patients IS 'CRM 환자 관리 테이블';

-- RLS 활성화
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- 정책
CREATE POLICY "Users can view own visits" 
  ON public.visits FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own appointments" 
  ON public.appointments FOR SELECT 
  USING (auth.uid() = patient_id);

CREATE POLICY "Staff can manage all appointments" 
  ON public.appointments FOR ALL 
  USING (public.is_staff());

CREATE POLICY "Staff can manage patients" 
  ON public.patients FOR ALL 
  USING (public.is_staff());

-- 인덱스
CREATE INDEX idx_visits_user_id ON public.visits(user_id);
CREATE INDEX idx_visits_scheduled_at ON public.visits(scheduled_at);
CREATE INDEX idx_appointments_patient_id ON public.appointments(patient_id);
CREATE INDEX idx_appointments_scheduled_at ON public.appointments(scheduled_at);
CREATE INDEX idx_patients_user_id ON public.patients(user_id);
CREATE INDEX idx_patients_naver_user_id ON public.patients(naver_user_id);
