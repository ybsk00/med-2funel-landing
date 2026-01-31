-- ============================================
-- 모듈 2: 사용자 관리 (Users & Profiles)
-- ============================================

-- 환자 프로필 테이블
CREATE TABLE public.patient_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.patient_profiles IS '환자 개인정보 (Supabase Auth 연동)';
COMMENT ON COLUMN public.patient_profiles.user_id IS 'Supabase Auth 사용자 ID';

-- 직원/의료진 테이블
CREATE TABLE public.staff_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('doctor', 'staff', 'admin')),
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.staff_users IS '병원 직원 및 의료진 정보';
COMMENT ON COLUMN public.staff_users.role IS '역할: doctor(의사), staff(직원), admin(관리자)';

-- RLS 활성화
ALTER TABLE public.patient_profiles ENABLE ROW LEVEL SECURITY;

-- 환자 프로필 정책
CREATE POLICY "Users can view own profile" 
  ON public.patient_profiles FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" 
  ON public.patient_profiles FOR UPDATE 
  USING (auth.uid() = user_id);

-- 직원 테이블 RLS
ALTER TABLE public.staff_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own staff role" 
  ON public.staff_users FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Staff can view all staff" 
  ON public.staff_users FOR SELECT 
  USING (public.is_staff());
