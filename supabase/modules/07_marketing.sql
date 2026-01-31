-- ============================================
-- 모듈 7: 마케팅/분석 (Marketing & Analytics)
-- ============================================

-- 마케팅 이벤트 테이블
CREATE TABLE public.marketing_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_name TEXT NOT NULL, -- 'f1_view', 'f1_chat_start', 'f2_enter', 'reservation_complete'
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

COMMENT ON TABLE public.marketing_events IS '마케팅 퍼널 이벤트 추적';

-- 마케팅 컨버전 테이블
CREATE TABLE public.marketing_conversions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reservation_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  visitor_id TEXT,
  session_id TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  conversion_type TEXT DEFAULT 'reservation', -- 'reservation', 'signup', 'login'
  page_url TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.marketing_conversions IS '마케팅 컨버전 기록';

-- UTM 링크 테이블
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

COMMENT ON TABLE public.utm_links IS 'UTM 추적 링크 관리';

-- 일별 마케팅 집계 테이블
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

COMMENT ON TABLE public.marketing_daily_stats IS '일별 마케팅 이벤트 집계';

-- RLS 활성화
ALTER TABLE public.marketing_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.utm_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_daily_stats ENABLE ROW LEVEL SECURITY;

-- 정책
CREATE POLICY "Staff can view marketing events" 
  ON public.marketing_events FOR SELECT 
  USING (public.is_staff());

CREATE POLICY "Staff can view conversions" 
  ON public.marketing_conversions FOR SELECT 
  USING (public.is_staff());

CREATE POLICY "Staff can manage utm links" 
  ON public.utm_links FOR ALL 
  USING (public.is_staff());

CREATE POLICY "Staff can view daily stats" 
  ON public.marketing_daily_stats FOR SELECT 
  USING (public.is_staff());

-- 인덱스
CREATE INDEX idx_marketing_events_name ON public.marketing_events(event_name);
CREATE INDEX idx_marketing_events_created ON public.marketing_events(created_at);
CREATE INDEX idx_marketing_events_visitor ON public.marketing_events(visitor_id);
CREATE INDEX idx_marketing_conversions_user ON public.marketing_conversions(user_id);
CREATE INDEX idx_marketing_daily_stats_date ON public.marketing_daily_stats(date);
