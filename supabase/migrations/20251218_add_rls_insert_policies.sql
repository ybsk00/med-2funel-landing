-- Add INSERT policies for NextAuth users (e.g., Naver login)
-- These users are authenticated via NextAuth but not Supabase Auth, so auth.uid() is null

-- ============================================
-- PATIENTS TABLE
-- ============================================

-- Allow INSERT for all users (API validates authentication via NextAuth or Supabase Auth)
CREATE POLICY "Enable insert for API access" ON public.patients 
FOR INSERT 
WITH CHECK (true);

-- ============================================
-- APPOINTMENTS TABLE
-- ============================================

-- First, ensure RLS is enabled
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Allow SELECT for all authenticated users (both Supabase Auth and NextAuth)
CREATE POLICY "Enable read access for appointments" ON public.appointments 
FOR SELECT 
USING (true);

-- Allow INSERT for all users (API validates authentication)
CREATE POLICY "Enable insert for appointments" ON public.appointments 
FOR INSERT 
WITH CHECK (true);

-- Allow UPDATE for all users (API validates authorization)
CREATE POLICY "Enable update for appointments" ON public.appointments 
FOR UPDATE 
USING (true);

-- Note: Security is enforced at the API level:
-- 1. API routes check for valid NextAuth session OR Supabase Auth session
-- 2. Only authenticated users can create appointments
-- 3. Users can only see their own appointments (filtered by user_id or naver_user_id in queries)
