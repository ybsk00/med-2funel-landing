-- ================================================
-- Add patient_id column to appointments table
-- 오프라인 환자(플랫폼 미가입)도 예약할 수 있도록 수정
-- ================================================

-- 1. appointments 테이블에 patient_id 컬럼 추가
-- patients 테이블의 id는 bigint이므로 동일하게 설정
ALTER TABLE public.appointments 
  ADD COLUMN IF NOT EXISTS patient_id BIGINT REFERENCES public.patients(id) ON DELETE SET NULL;

-- 2. 기존 user_id와 매핑된 환자가 있다면 patient_id 채우기
-- (user_id로 연결된 환자가 있으면 해당 patient_id를 설정)
UPDATE public.appointments a
SET patient_id = (
  SELECT p.id FROM public.patients p 
  WHERE p.user_id = a.user_id
)
WHERE a.user_id IS NOT NULL AND a.patient_id IS NULL;

-- 3. intake_sessions 테이블에도 patient_id 추가 (필요한 경우)
ALTER TABLE public.intake_sessions 
  ADD COLUMN IF NOT EXISTS patient_id BIGINT REFERENCES public.patients(id) ON DELETE SET NULL;

-- 4. RLS 정책 업데이트 - 스태프는 모든 예약 관리 가능
DROP POLICY IF EXISTS "Staff can manage all appointments" ON public.appointments;
CREATE POLICY "Staff can manage all appointments" ON public.appointments 
  FOR ALL USING (public.is_staff());

-- 5. appointments에서 patient 정보 조회를 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON public.appointments(patient_id);

-- 6. 스키마 캐시 갱신
NOTIFY pgrst, 'reload schema';

-- 완료 메시지
DO $$
BEGIN
  RAISE NOTICE 'Migration completed: patient_id column added to appointments and intake_sessions tables';
END $$;
