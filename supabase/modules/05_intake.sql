-- ============================================
-- 모듈 5: 문진/설문 데이터 (Intake & Survey)
-- ============================================

-- 건강 주제 테이블
CREATE TABLE public.health_topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_key TEXT UNIQUE NOT NULL, -- 'resilience', 'women', 'pain', 'digestion', 'pregnancy'
  title TEXT NOT NULL,
  department TEXT, -- 과목별 분류
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.health_topics IS '건강 주제/모듈 카테고리';

-- 건강 질문 테이블
CREATE TABLE public.health_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID REFERENCES public.health_topics(id) ON DELETE CASCADE,
  question_key TEXT NOT NULL,
  text TEXT NOT NULL,
  input_type TEXT, -- 'text', 'choice', 'scale'
  options JSONB, -- 선택지
  mode TEXT DEFAULT 'healthcare', -- 'healthcare', 'medical'
  version INT DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.health_questions IS 'AI 문진 질문 목록';

-- 문진 답변 테이블
CREATE TABLE public.intake_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.health_questions(id) ON DELETE SET NULL,
  question_key TEXT,
  raw_answer TEXT,
  normalized JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.intake_answers IS '환자 문진 답변';

-- 문진 요약 테이블
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

COMMENT ON TABLE public.intake_summaries IS '문진 결과 요약';

-- RLS 활성화
ALTER TABLE public.health_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_questions ENABLE ROW LEVEL SECURITY;

-- 정책
CREATE POLICY "Anyone can view active health topics" 
  ON public.health_topics FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can view active questions" 
  ON public.health_questions FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Staff can manage health topics" 
  ON public.health_topics FOR ALL 
  USING (public.is_staff());

CREATE POLICY "Staff can manage questions" 
  ON public.health_questions FOR ALL 
  USING (public.is_staff());

-- 인덱스
CREATE INDEX idx_health_topics_topic_key ON public.health_topics(topic_key);
CREATE INDEX idx_health_questions_topic_id ON public.health_questions(topic_id);
CREATE INDEX idx_intake_answers_session_id ON public.intake_answers(session_id);
