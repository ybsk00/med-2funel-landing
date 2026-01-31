-- ============================================
-- 모듈 4: 채팅/AI 시스템 (Chat & AI)
-- ============================================

-- 채팅 세션 테이블
CREATE TABLE public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  anonymous_id TEXT, -- 비로그인 사용자용
  mode TEXT, -- 'healthcare', 'medical'
  topic TEXT, -- topic_key
  visit_id UUID REFERENCES public.visits(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.chat_sessions IS 'AI 채팅 세션';
COMMENT ON COLUMN public.chat_sessions.mode IS '모드: healthcare(비로그인), medical(로그인)';

-- 채팅 메시지 테이블
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  sender TEXT, -- 'user', 'ai', 'system'
  content TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.chat_messages IS '채팅 메시지 이력';

-- 채팅 요약 테이블
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

COMMENT ON TABLE public.chat_summaries IS 'AI 채팅 요약 정보';

-- RLS 활성화
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- 정책
CREATE POLICY "Users can view own sessions" 
  ON public.chat_sessions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own messages" 
  ON public.chat_messages FOR SELECT 
  USING (
    session_id IN (
      SELECT id FROM chat_sessions 
      WHERE user_id = auth.uid() OR anonymous_id IS NOT NULL
    )
  );

CREATE POLICY "Staff can view all chat sessions" 
  ON public.chat_sessions FOR SELECT 
  USING (public.is_staff());

CREATE POLICY "Staff can view all chat messages" 
  ON public.chat_messages FOR SELECT 
  USING (public.is_staff());

-- 인덱스
CREATE INDEX idx_chat_sessions_user_id ON public.chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_anonymous_id ON public.chat_sessions(anonymous_id);
CREATE INDEX idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX idx_chat_summaries_session_id ON public.chat_summaries(session_id);
