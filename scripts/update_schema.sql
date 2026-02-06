-- Add department column to patients and appointments tables
ALTER TABLE patients ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS department TEXT;

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_patients_department ON patients(department);
CREATE INDEX IF NOT EXISTS idx_appointments_department ON appointments(department);
