-- ============================================
-- 모듈 6: 임상/의료 데이터 (Clinical Data)
-- ============================================

-- 임상 기록 테이블
CREATE TABLE public.clinical_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  note_type TEXT, -- 'soap', 'memo', 'prescription'
  title TEXT,
  body TEXT, -- 실제 운영시 암호화 권장
  created_by UUID REFERENCES public.staff_users(user_id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.clinical_notes IS '의료진 임상 기록 (SOAP 등)';

-- 치료 계획 테이블
CREATE TABLE public.treatment_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  plan_type TEXT, -- 'herbal', 'acupuncture', 'lifestyle', 'procedure', 'medication'
  title TEXT,
  description TEXT,
  metadata JSONB,
  status TEXT DEFAULT 'active', -- 'active', 'completed', 'cancelled'
  created_by UUID REFERENCES public.staff_users(user_id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.treatment_plans IS '치료 계획 및 처방';

-- 알림/리마인더 테이블
CREATE TABLE public.reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  visit_id UUID REFERENCES public.visits(id) ON DELETE SET NULL,
  title TEXT,
  description TEXT,
  schedule_at TIMESTAMPTZ,
  is_sent BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.reminders IS '환자 알림 및 리마인더';

-- 임상 이미지 테이블
CREATE TABLE public.clinical_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  visit_id UUID REFERENCES public.visits(id) ON DELETE SET NULL,
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE SET NULL,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  body_part TEXT,
  description TEXT,
  ai_summary TEXT,
  ai_metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.clinical_images IS '임상 이미지 및 AI 분석 결과';

-- RLS 활성화
ALTER TABLE public.clinical_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_images ENABLE ROW LEVEL SECURITY;

-- 정책
CREATE POLICY "Staff can manage clinical notes" 
  ON public.clinical_notes FOR ALL 
  USING (public.is_staff());

CREATE POLICY "Staff can manage treatment plans" 
  ON public.treatment_plans FOR ALL 
  USING (public.is_staff());

CREATE POLICY "Patients can view own treatment plans" 
  ON public.treatment_plans FOR SELECT 
  USING (
    visit_id IN (SELECT id FROM visits WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can view own reminders" 
  ON public.reminders FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Staff can manage reminders" 
  ON public.reminders FOR ALL 
  USING (public.is_staff());

CREATE POLICY "Users can view own clinical images" 
  ON public.clinical_images FOR SELECT 
  USING (auth.uid() = user_id);

-- 인덱스
CREATE INDEX idx_clinical_notes_visit_id ON public.clinical_notes(visit_id);
CREATE INDEX idx_treatment_plans_visit_id ON public.treatment_plans(visit_id);
CREATE INDEX idx_reminders_user_id ON public.reminders(user_id);
CREATE INDEX idx_reminders_schedule_at ON public.reminders(schedule_at);
CREATE INDEX idx_clinical_images_user_id ON public.clinical_images(user_id);
