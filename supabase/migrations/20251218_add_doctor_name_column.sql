-- Add doctor_name column to appointments table
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS doctor_name VARCHAR(100);

-- Create index for efficient duplicate checking
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_date 
ON public.appointments (doctor_name, scheduled_at) 
WHERE status != 'cancelled';

-- Optional: Migrate existing data from notes to doctor_name
-- UPDATE public.appointments 
-- SET doctor_name = 
--   CASE 
--     WHEN notes LIKE '%노기환 원장%' THEN '노기환 원장'
--     WHEN notes LIKE '%최서형 이사장%' THEN '최서형 이사장'
--     WHEN notes LIKE '%나병조 원장%' THEN '나병조 원장'
--     ELSE '전체'
--   END
-- WHERE doctor_name IS NULL;
