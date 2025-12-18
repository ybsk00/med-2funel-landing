-- Add naver_user_id column to appointments table for NextAuth (Naver login) user lookup
-- Naver does not provide email, so we use user ID instead

ALTER TABLE appointments ADD COLUMN IF NOT EXISTS naver_user_id TEXT;

-- Create index for efficient naver_user_id-based lookups
CREATE INDEX IF NOT EXISTS idx_appointments_naver_user_id ON appointments(naver_user_id);

-- Add comment
COMMENT ON COLUMN appointments.naver_user_id IS 'Naver user ID for NextAuth users who do not have a Supabase auth user_id';
