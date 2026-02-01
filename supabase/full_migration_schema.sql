-- ============================================
-- 병원 AI 헬스케어 플랫폼 - 전체 데이터베이스 스키마 (Finalized)
-- 모듈화 버전 (full_migration_schema.sql)
-- ============================================

-- 실행 순서 중요!
-- 01_extensions → 02_users → 03_visits → 04_chat → 05_intake 
-- → 06_clinical → 07_marketing → 08_audit → 09_functions → 10_seed

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
-- 모듈 2.5: 진료과 및 기능 (Departments & Features)
-- ============================================

CREATE TABLE public.departments (
  id TEXT PRIMARY KEY, -- e.g., 'plastic-surgery', 'dermatology'
  name_ko TEXT NOT NULL,
  
  -- 테마 설정 (Phase 2: Visual Design)
  -- Fields: primary, secondary, accent, background, text, concept, texture, font, sound
  theme_config JSONB DEFAULT '{}'::JSONB, 
  
  -- 에셋 및 히어로 설정 (Phase 1: Assets)
  -- Fields: video, hero { title, subtitle }
  assets_config JSONB DEFAULT '{}'::JSONB,
  
  -- 브랜딩 및 카피라이팅 (Phase 1: Copywriting)
  -- Fields: catchphrase, virtualName, subtext
  copywriting JSONB DEFAULT '{}'::JSONB,

  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.department_features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department_id TEXT REFERENCES public.departments(id) ON DELETE CASCADE,
  
  -- 기능 식별자 (ID from modules list)
  key TEXT NOT NULL, -- e.g., 'glow-booster', 'virtual-plastic'
  
  -- 기능 명칭
  title TEXT NOT NULL,
  description TEXT,
  
  -- UI 설정
  -- Fields: icon, color, displayOrder
  ui_config JSONB DEFAULT '{}'::JSONB,
  
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(department_id, key)
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
  department_id TEXT REFERENCES public.departments(id) ON DELETE SET NULL,
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
-- SECURITY DEFINER is critical here to check staff table even if invoking user has restrictive RLS
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
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.department_features ENABLE ROW LEVEL SECURITY;
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

-- 진료과 정책
CREATE POLICY "Anyone can view active departments" ON public.departments FOR SELECT USING (is_active = true);
CREATE POLICY "Staff can manage departments" ON public.departments FOR ALL USING (public.is_staff());
CREATE POLICY "Anyone can view active features" ON public.department_features FOR SELECT USING (is_active = true);
CREATE POLICY "Staff can manage features" ON public.department_features FOR ALL USING (public.is_staff());

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
CREATE POLICY "Staff can manage clinical images" ON public.clinical_images FOR ALL USING (public.is_staff());
CREATE POLICY "Patients can view own images" ON public.clinical_images FOR SELECT USING (auth.uid() = user_id);

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

CREATE TRIGGER update_patient_profiles_updated_at BEFORE UPDATE ON public.patient_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON public.departments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 인덱스 (Indexes)
-- ============================================

CREATE INDEX idx_visits_user_id ON public.visits(user_id);
CREATE INDEX idx_department_features_dept_id ON public.department_features(department_id);
CREATE INDEX idx_chat_sessions_user_id ON public.chat_sessions(user_id);

-- ============================================
-- 모듈 10: 초기 데이터 (Seed Data)
-- ============================================

-- 11개 진료과 초기 데이터 삽입 (Update on Conflict)
INSERT INTO public.departments (id, name_ko, copywriting, theme_config, assets_config, is_active) VALUES
('plastic-surgery', '성형외과', 
 '{"virtualName": "The Line", "catchphrase": "당신만의 선을 재정의하다"}'::JSONB,
 '{"primary": "#000000", "secondary": "#B76E79", "accent": "#D4AF37", "background": "#121212", "text": "#FFFFFF", "concept": "High-End Luxury", "texture": "silk", "font": "serif", "sound": "/sounds/tick.mp3"}'::JSONB,
 '{"video": "/히어로세션/성형외과.mp4"}'::JSONB, true),

('dermatology', '피부과', 
 '{"virtualName": "Blanc de Skin", "catchphrase": "홀로그램처럼 빛나는 피부 본연의 광채"}'::JSONB,
 '{"primary": "#FFC0CB", "secondary": "#E0E0E0", "accent": "#FF69B4", "background": "#F5F5F5", "text": "#333333", "concept": "Holographic Gloss", "texture": "hologram", "font": "sans", "sound": "/sounds/sparkle.mp3"}'::JSONB,
 '{"video": "/히어로세션/피부과.mp4"}'::JSONB, true),

('korean-medicine', '한의원', 
 '{"virtualName": "Bon Cho", "catchphrase": "자연의 기운으로 근본을 다스리다"}'::JSONB,
 '{"primary": "#4A5D23", "secondary": "#8D8D8D", "accent": "#8B4513", "background": "#F0F0F0", "text": "#2F4F4F", "concept": "Modern Tradition", "texture": "hanji", "font": "serif", "sound": "/sounds/gong.mp3"}'::JSONB,
 '{"video": "/히어로세션/한방병원.mp4"}'::JSONB, true),

('dentistry', '치과', 
 '{"virtualName": "Denti Crew", "catchphrase": "0.1mm 오차 없는 정밀한 미소 설계"}'::JSONB,
 '{"primary": "#00FFFF", "secondary": "#FFFFFF", "accent": "#00CED1", "background": "#FFFFFF", "text": "#000000", "concept": "Super Clean Lab", "texture": "glass", "font": "sans", "sound": "/sounds/crystal.mp3"}'::JSONB,
 '{"video": "/히어로세션/치과.mp4"}'::JSONB, true),

('orthopedics', '정형외과', 
 '{"virtualName": "Bone Balance", "catchphrase": "무너진 중심을 바로 세우는 공학적 리셋"}'::JSONB,
 '{"primary": "#000080", "secondary": "#FF4500", "accent": "#1E90FF", "background": "#E6E6FA", "text": "#000080", "concept": "Engineering Blueprint", "texture": "blueprint", "font": "mono", "sound": "/sounds/ruler.mp3"}'::JSONB,
 '{"video": "/히어로세션/정형외과.mp4"}'::JSONB, true),

('urology', '비뇨기과', 
 '{"virtualName": "Men''s Private", "catchphrase": "완벽한 익명 속에서 되찾는 강력한 활력"}'::JSONB,
 '{"primary": "#4B0082", "secondary": "#ADFF2F", "accent": "#9400D3", "background": "#000000", "text": "#FFFFFF", "concept": "Cyber Night", "texture": "carbon", "font": "sans", "sound": "/sounds/engine.mp3"}'::JSONB,
 '{"video": "/히어로세션/비뇨기과.mp4"}'::JSONB, true),

('pediatrics', '소아과', 
 '{"virtualName": "Kids Doctor", "catchphrase": "우리 아이 성장의 모든 순간을 기록하다"}'::JSONB,
 '{"primary": "#FFD700", "secondary": "#87CEEB", "accent": "#FFA500", "background": "#FFFFE0", "text": "#4B0082", "concept": "Soft Playroom", "texture": "jelly", "font": "round", "sound": "/sounds/jelly.mp3"}'::JSONB,
 '{"video": "/히어로세션/소아과.mp4"}'::JSONB, true),

('obgyn', '산부인과', 
 '{"virtualName": "Maman Care", "catchphrase": "따뜻한 물결처럼 흐르는 당신만의 리듬"}'::JSONB,
 '{"primary": "#FF7F50", "secondary": "#FFDAB9", "accent": "#FA8072", "background": "#FFF5EE", "text": "#8B4513", "concept": "Organic Flow", "texture": "flower", "font": "serif", "sound": "/sounds/water.mp3"}'::JSONB,
 '{"video": "/히어로세션/산부인과.mp4"}'::JSONB, true),

('internal-medicine', '내과', 
 '{"virtualName": "Inner Wellness", "catchphrase": "몸속 정원을 가꾸는 내면의 활력 케어"}'::JSONB,
 '{"primary": "#8FBC8F", "secondary": "#D2B48C", "accent": "#556B2F", "background": "#F0FFF0", "text": "#2F4F4F", "concept": "Botanic Garden", "texture": "botanic", "font": "sans", "sound": "/sounds/nature.mp3"}'::JSONB,
 '{"video": "/히어로세션/내과.mp4"}'::JSONB, true),

('oncology', '암요양병원', 
 '{"virtualName": "Care For You", "catchphrase": "면역의 요새를 쌓는 희망의 아침 햇살"}'::JSONB,
 '{"primary": "#FFBF00", "secondary": "#FAF0E6", "accent": "#DAA520", "background": "#FDF5E6", "text": "#8B4513", "concept": "Morning Sun", "texture": "linen", "font": "serif", "sound": "/sounds/morning.mp3"}'::JSONB,
 '{"video": "/히어로세션/암요양병원.mp4"}'::JSONB, true),

('neurosurgery', '신경외과', 
 '{"virtualName": "Neuro Scan", "catchphrase": "뇌 신경망의 안개를 걷어내는 정밀 디코딩"}'::JSONB,
 '{"primary": "#4B0082", "secondary": "#7B68EE", "accent": "#8A2BE2", "background": "#0F172A", "text": "#E0FFFF", "concept": "Neuro Scan", "texture": "hologram", "font": "mono", "sound": "/sounds/scan.mp3"}'::JSONB,
 '{"video": "/히어로세션/신경외과.mp4"}'::JSONB, true)
ON CONFLICT (id) DO UPDATE SET
  name_ko = EXCLUDED.name_ko,
  copywriting = EXCLUDED.copywriting,
  theme_config = EXCLUDED.theme_config,
  assets_config = EXCLUDED.assets_config,
  is_active = TRUE;
