-- =====================================================
-- 마케팅 트래킹 모듈 테이블 생성
-- 생성일: 2025-12-19
-- =====================================================

-- 1. marketing_events (이벤트 로그)
CREATE TABLE IF NOT EXISTS marketing_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  visitor_id text NOT NULL,
  session_id text NOT NULL,
  user_id uuid NULL,
  event_name text NOT NULL,
  page_url text NULL,
  landing_url text NULL,
  referrer text NULL,
  utm_source text NULL,
  utm_medium text NULL,
  utm_campaign text NULL,
  utm_content text NULL,
  utm_term text NULL,
  sub1 text NULL,
  sub2 text NULL,
  click_ids jsonb NULL,
  user_agent text NULL,
  device_type text NULL,
  login_source text NULL,
  prompt_version_id text NULL,
  flow_version_id text NULL,
  metadata jsonb NULL
);

-- 2. marketing_conversions (전환 확정)
CREATE TABLE IF NOT EXISTS marketing_conversions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  user_id uuid NULL,
  visitor_id text NULL,
  reservation_id text NOT NULL UNIQUE,
  attributed_event_id uuid NULL,
  last_touch jsonb NOT NULL,
  first_touch jsonb NULL,
  path_summary text NULL,
  conversion_time_seconds int NULL
);

-- 3. utm_links (UTM 생성 이력)
CREATE TABLE IF NOT EXISTS utm_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  created_by uuid NULL,
  channel text NOT NULL,
  landing_url text NOT NULL,
  final_url text NOT NULL,
  utm_source text NOT NULL,
  utm_medium text NOT NULL,
  utm_campaign text NOT NULL,
  utm_content text NOT NULL,
  utm_term text NULL,
  sub1 text NULL,
  sub2 text NULL,
  memo text NULL
);

-- =====================================================
-- 인덱스 생성
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_marketing_events_created ON marketing_events(created_at);
CREATE INDEX IF NOT EXISTS idx_marketing_events_name ON marketing_events(event_name, created_at);
CREATE INDEX IF NOT EXISTS idx_marketing_events_visitor ON marketing_events(visitor_id, created_at);
CREATE INDEX IF NOT EXISTS idx_marketing_events_user ON marketing_events(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_marketing_events_utm ON marketing_events(utm_source, utm_campaign, created_at);
CREATE INDEX IF NOT EXISTS idx_marketing_conversions_created ON marketing_conversions(created_at);
CREATE INDEX IF NOT EXISTS idx_marketing_conversions_user ON marketing_conversions(user_id, created_at);

-- =====================================================
-- RLS 정책
-- =====================================================
ALTER TABLE marketing_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE utm_links ENABLE ROW LEVEL SECURITY;

-- marketing_events: Public INSERT, Staff SELECT
DROP POLICY IF EXISTS "Allow public insert events" ON marketing_events;
CREATE POLICY "Allow public insert events" ON marketing_events 
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Staff can select events" ON marketing_events;
CREATE POLICY "Staff can select events" ON marketing_events 
  FOR SELECT USING (public.is_staff());

-- marketing_conversions: Public INSERT, Staff SELECT
DROP POLICY IF EXISTS "Allow public insert conversions" ON marketing_conversions;
CREATE POLICY "Allow public insert conversions" ON marketing_conversions 
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Staff can select conversions" ON marketing_conversions;
CREATE POLICY "Staff can select conversions" ON marketing_conversions 
  FOR SELECT USING (public.is_staff());

-- utm_links: Staff only
DROP POLICY IF EXISTS "Staff can manage utm_links" ON utm_links;
CREATE POLICY "Staff can manage utm_links" ON utm_links 
  FOR ALL USING (public.is_staff());
