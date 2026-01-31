-- ============================================
-- 모듈 8: 감사/보안 (Audit & Security)
-- ============================================

-- 감사 로그 테이블
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  entity_table TEXT,
  entity_id UUID,
  action TEXT, -- 'view', 'create', 'update', 'delete', 'login', 'logout'
  metadata JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.audit_logs IS '시스템 감사 로그';

-- RLS 활성화
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 정책
CREATE POLICY "Staff can view audit logs" 
  ON public.audit_logs FOR SELECT 
  USING (public.is_staff());

CREATE POLICY "System can insert audit logs" 
  ON public.audit_logs FOR INSERT 
  WITH CHECK (true);

-- 인덱스
CREATE INDEX idx_audit_logs_actor ON public.audit_logs(actor_user_id);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs(entity_table, entity_id);
CREATE INDEX idx_audit_logs_created ON public.audit_logs(created_at);
