-- ============================================
-- 병원 AI 헬스케어 플랫폼 - 전체 데이터베이스 스키마
-- 모듈화 버전 (full_migration_schema.sql)
-- ============================================

-- 실행 순서 중요!
-- 01_extensions → 02_users → 03_visits → 04_chat → 05_intake 
-- → 06_clinical → 07_marketing → 08_audit → 09_functions

-- ============================================
-- 모듈 1: 확장 기능 (Extensions)
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 모듈 2: 사용자 관리 (Users & Profiles)
-- ============================================

CREATE TABLE public.patient_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.staff_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('doctor', 'staff', 'admin')),
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 모듈 3: 방문/예약 관리 (Visits & Appointments)
-- ============================================

CREATE TABLE public.visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  visit_type TEXT,
  status TEXT,
  scheduled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  doctor_name TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'scheduled',
  naver_user_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  naver_user_id TEXT,
  name TEXT,
  email TEXT,
  phone TEXT,
  time TEXT,
  type TEXT,
  complaint TEXT,
  keywords TEXT[],
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 모듈 4: 채팅/AI 시스템 (Chat & AI)
-- ============================================

CREATE TABLE public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  anonymous_id TEXT,
  mode TEXT,
  topic TEXT,
  visit_id UUID REFERENCES public.visits(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  sender TEXT,
  content TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.chat_summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  summary_text TEXT,
  main_concern TEXT,
  tags TEXT[],
  turn_count INT DEFAULT 0,
  require_login BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 모듈 5: 문진/설문 데이터 (Intake & Survey)
-- ============================================

CREATE TABLE public.health_topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  department TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.health_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID REFERENCES public.health_topics(id) ON DELETE CASCADE,
  question_key TEXT NOT NULL,
  text TEXT NOT NULL,
  input_type TEXT,
  options JSONB,
  mode TEXT DEFAULT 'healthcare',
  version INT DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.intake_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.health_questions(id) ON DELETE SET NULL,
  question_key TEXT,
  raw_answer TEXT,
  normalized JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.intake_summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE SET NULL,
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE SET NULL,
  main_concern TEXT,
  pattern_tags TEXT[],
  rhythm_score INT,
  rhythm_score_detail JSONB,
  summary_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 모듈 6: 임상/의료 데이터 (Clinical Data)
-- ============================================

CREATE TABLE public.clinical_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  note_type TEXT,
  title TEXT,
  body TEXT,
  created_by UUID REFERENCES public.staff_users(user_id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.treatment_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  plan_type TEXT,
  title TEXT,
  description TEXT,
  metadata JSONB,
  status TEXT DEFAULT 'active',
  created_by UUID REFERENCES public.staff_users(user_id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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

-- ============================================
-- 모듈 7: 마케팅/분석 (Marketing & Analytics)
-- ============================================

CREATE TABLE public.marketing_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_name TEXT NOT NULL,
  visitor_id TEXT,
  session_id TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  page_url TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.marketing_conversions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reservation_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  visitor_id TEXT,
  session_id TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  conversion_type TEXT DEFAULT 'reservation',
  page_url TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.utm_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  target_url TEXT,
  click_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.marketing_daily_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  event_name TEXT NOT NULL,
  count INT DEFAULT 0,
  unique_visitors INT DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(date, event_name)
);

-- ============================================
-- 모듈 8: 감사/보안 (Audit & Security)
-- ============================================

CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  entity_table TEXT,
  entity_id UUID,
  action TEXT,
  metadata JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 모듈 9: 헬퍼 함수 (Helper Functions)
-- ============================================

-- 직원 확인 함수
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.staff_users
    WHERE user_id = auth.uid()
    AND role IN ('doctor', 'staff', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.staff_users
    WHERE user_id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_doctor()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.staff_users
    WHERE user_id = auth.uid()
    AND role = 'doctor'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- RLS (Row Level Security) 활성화
-- ============================================

ALTER TABLE public.patient_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.utm_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS 정책 (Policies)
-- ============================================

-- 환자 프로필 정책
CREATE POLICY "Users can view own profile" ON public.patient_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.patient_profiles FOR UPDATE USING (auth.uid() = user_id);

-- 직원 정책
CREATE POLICY "Users can view own staff role" ON public.staff_users FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Staff can view all staff" ON public.staff_users FOR SELECT USING (public.is_staff());

-- 방문/예약 정책
CREATE POLICY "Users can view own visits" ON public.visits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own appointments" ON public.appointments FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Staff can manage all appointments" ON public.appointments FOR ALL USING (public.is_staff());
CREATE POLICY "Staff can manage patients" ON public.patients FOR ALL USING (public.is_staff());

-- 채팅 정책
CREATE POLICY "Users can view own sessions" ON public.chat_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own messages" ON public.chat_messages FOR SELECT USING (
  session_id IN (SELECT id FROM chat_sessions WHERE user_id = auth.uid() OR anonymous_id IS NOT NULL)
);
CREATE POLICY "Staff can view all chat sessions" ON public.chat_sessions FOR SELECT USING (public.is_staff());
CREATE POLICY "Staff can view all chat messages" ON public.chat_messages FOR SELECT USING (public.is_staff());

-- 문진 정책
CREATE POLICY "Anyone can view active health topics" ON public.health_topics FOR SELECT USING (true);
CREATE POLICY "Anyone can view active questions" ON public.health_questions FOR SELECT USING (is_active = true);
CREATE POLICY "Staff can manage health topics" ON public.health_topics FOR ALL USING (public.is_staff());
CREATE POLICY "Staff can manage questions" ON public.health_questions FOR ALL USING (public.is_staff());

-- 임상 데이터 정책
CREATE POLICY "Staff can manage clinical notes" ON public.clinical_notes FOR ALL USING (public.is_staff());
CREATE POLICY "Staff can manage treatment plans" ON public.treatment_plans FOR ALL USING (public.is_staff());
CREATE POLICY "Patients can view own treatment plans" ON public.treatment_plans FOR SELECT USING (
  visit_id IN (SELECT id FROM visits WHERE user_id = auth.uid())
);
CREATE POLICY "Users can view own reminders" ON public.reminders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Staff can manage reminders" ON public.reminders FOR ALL USING (public.is_staff());
CREATE POLICY "Users can view own clinical images" ON public.clinical_images FOR SELECT USING (auth.uid() = user_id);

-- 마케팅 정책
CREATE POLICY "Staff can view marketing events" ON public.marketing_events FOR SELECT USING (public.is_staff());
CREATE POLICY "Staff can view conversions" ON public.marketing_conversions FOR SELECT USING (public.is_staff());
CREATE POLICY "Staff can manage utm links" ON public.utm_links FOR ALL USING (public.is_staff());
CREATE POLICY "Staff can view daily stats" ON public.marketing_daily_stats FOR SELECT USING (public.is_staff());

-- 감사 로그 정책
CREATE POLICY "Staff can view audit logs" ON public.audit_logs FOR SELECT USING (public.is_staff());
CREATE POLICY "System can insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (true);

-- ============================================
-- 트리거 (Triggers)
-- ============================================

CREATE TRIGGER update_patient_profiles_updated_at
  BEFORE UPDATE ON public.patient_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at
  BEFORE UPDATE ON public.chat_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 인덱스 (Indexes)
-- ============================================

CREATE INDEX idx_visits_user_id ON public.visits(user_id);
CREATE INDEX idx_visits_scheduled_at ON public.visits(scheduled_at);
CREATE INDEX idx_appointments_patient_id ON public.appointments(patient_id);
CREATE INDEX idx_appointments_scheduled_at ON public.appointments(scheduled_at);
CREATE INDEX idx_patients_user_id ON public.patients(user_id);
CREATE INDEX idx_patients_naver_user_id ON public.patients(naver_user_id);
CREATE INDEX idx_chat_sessions_user_id ON public.chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_anonymous_id ON public.chat_sessions(anonymous_id);
CREATE INDEX idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX idx_chat_summaries_session_id ON public.chat_summaries(session_id);
CREATE INDEX idx_health_topics_topic_key ON public.health_topics(topic_key);
CREATE INDEX idx_health_questions_topic_id ON public.health_questions(topic_id);
CREATE INDEX idx_intake_answers_session_id ON public.intake_answers(session_id);
CREATE INDEX idx_clinical_notes_visit_id ON public.clinical_notes(visit_id);
CREATE INDEX idx_treatment_plans_visit_id ON public.treatment_plans(visit_id);
CREATE INDEX idx_reminders_user_id ON public.reminders(user_id);
CREATE INDEX idx_reminders_schedule_at ON public.reminders(schedule_at);
CREATE INDEX idx_clinical_images_user_id ON public.clinical_images(user_id);
CREATE INDEX idx_marketing_events_name ON public.marketing_events(event_name);
CREATE INDEX idx_marketing_events_created ON public.marketing_events(created_at);
CREATE INDEX idx_marketing_events_visitor ON public.marketing_events(visitor_id);
CREATE INDEX idx_marketing_conversions_user ON public.marketing_conversions(user_id);
CREATE INDEX idx_marketing_daily_stats_date ON public.marketing_daily_stats(date);
CREATE INDEX idx_audit_logs_actor ON public.audit_logs(actor_user_id);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs(entity_table, entity_id);
CREATE INDEX idx_audit_logs_created ON public.audit_logs(created_at);

-- ============================================
-- 완료
-- ============================================

COMMENT ON SCHEMA public IS '병원 AI 헬스케어 플랫폼 데이터베이스 스키마';
