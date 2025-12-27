-- =====================================================
-- Face Style 기능 테이블 (v2.0)
-- 생성일: 2025-12-27
-- =====================================================

-- ===========================================
-- 1. consents 테이블에 UNIQUE 제약 추가
-- ===========================================
-- 기존 consents 테이블에 (user_id, type) 조합 UNIQUE 제약 추가
-- face_style 동의는 type='face_style'로 관리
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'consents_user_type_unique'
  ) THEN
    ALTER TABLE public.consents 
    ADD CONSTRAINT consents_user_type_unique UNIQUE (user_id, type);
  END IF;
END $$;

-- ===========================================
-- 2. face_style_sessions 테이블
-- ===========================================
-- 사용자의 Face Style 세션 관리
CREATE TABLE IF NOT EXISTS public.face_style_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('created', 'uploaded', 'generating', 'ready', 'failed')) 
    DEFAULT 'created',
  original_image_path TEXT,
  original_uploaded_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_face_style_sessions_user 
  ON public.face_style_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_face_style_sessions_status 
  ON public.face_style_sessions(status);

-- ===========================================
-- 3. face_style_variants 테이블
-- ===========================================
-- 각 세션의 변환 결과 (natural, makeup, bright)
CREATE TABLE IF NOT EXISTS public.face_style_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES public.face_style_sessions(id) ON DELETE CASCADE,
  variant_key TEXT CHECK (variant_key IN ('natural', 'makeup', 'bright')) NOT NULL,
  status TEXT CHECK (status IN ('queued', 'done', 'failed')) DEFAULT 'queued',
  image_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- 중복 방지: 세션당 variant_key는 하나씩만
  CONSTRAINT face_style_variants_session_key_unique UNIQUE (session_id, variant_key)
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_face_style_variants_session 
  ON public.face_style_variants(session_id);

-- ===========================================
-- 4. RLS 정책 (Row Level Security)
-- ===========================================

-- face_style_sessions RLS
ALTER TABLE public.face_style_sessions ENABLE ROW LEVEL SECURITY;

-- 본인 세션만 조회 가능
DROP POLICY IF EXISTS "Users can view own sessions" ON public.face_style_sessions;
CREATE POLICY "Users can view own sessions" ON public.face_style_sessions
  FOR SELECT USING (auth.uid() = user_id);

-- 본인 세션만 생성 가능
DROP POLICY IF EXISTS "Users can insert own sessions" ON public.face_style_sessions;
CREATE POLICY "Users can insert own sessions" ON public.face_style_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 본인 세션만 수정 가능
DROP POLICY IF EXISTS "Users can update own sessions" ON public.face_style_sessions;
CREATE POLICY "Users can update own sessions" ON public.face_style_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- 본인 세션만 삭제 가능
DROP POLICY IF EXISTS "Users can delete own sessions" ON public.face_style_sessions;
CREATE POLICY "Users can delete own sessions" ON public.face_style_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- face_style_variants RLS
ALTER TABLE public.face_style_variants ENABLE ROW LEVEL SECURITY;

-- variants는 SELECT만 허용 (INSERT/UPDATE는 서버에서 service_role로)
DROP POLICY IF EXISTS "Users can view own variants" ON public.face_style_variants;
CREATE POLICY "Users can view own variants" ON public.face_style_variants
  FOR SELECT USING (
    session_id IN (SELECT id FROM face_style_sessions WHERE user_id = auth.uid())
  );

-- ===========================================
-- 5. updated_at 자동 갱신 트리거
-- ===========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- face_style_sessions 트리거
DROP TRIGGER IF EXISTS update_face_style_sessions_updated_at ON public.face_style_sessions;
CREATE TRIGGER update_face_style_sessions_updated_at
  BEFORE UPDATE ON public.face_style_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- face_style_variants 트리거
DROP TRIGGER IF EXISTS update_face_style_variants_updated_at ON public.face_style_variants;
CREATE TRIGGER update_face_style_variants_updated_at
  BEFORE UPDATE ON public.face_style_variants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- 6. 스키마 리프레시 (PostgREST)
-- ===========================================
NOTIFY pgrst, 'reload schema';

-- ===========================================
-- 완료 메시지
-- ===========================================
-- 실행 완료: face_style_sessions, face_style_variants 테이블 생성
-- consents 테이블에 UNIQUE(user_id, type) 제약 추가
-- RLS 정책 및 updated_at 자동 갱신 트리거 설정 완료
