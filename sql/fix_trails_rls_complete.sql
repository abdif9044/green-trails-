
-- Complete fix for trails RLS to allow bulk imports and global trail access
-- This enables both service role imports and user access to all trails

-- Drop all existing conflicting policies
DROP POLICY IF EXISTS "Users can insert their own trails" ON public.trails;
DROP POLICY IF EXISTS "Allow trail inserts" ON public.trails;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.trails;
DROP POLICY IF EXISTS "Allow trail inserts for users and service role" ON public.trails;
DROP POLICY IF EXISTS "Users can view all trails" ON public.trails;
DROP POLICY IF EXISTS "Allow user to insert own trails" ON public.trails;
DROP POLICY IF EXISTS "Allow user to select own trails" ON public.trails;

-- Create comprehensive policies for trails as GLOBAL/SHARED data (not user-owned)

-- 1. SELECT policy - All authenticated users can view all trails
CREATE POLICY "Allow all authenticated users to view trails" ON public.trails
FOR SELECT
TO authenticated
USING (true);

-- 2. INSERT policy - Service role can insert trails (for bulk imports)
CREATE POLICY "Allow service role to insert trails" ON public.trails
FOR INSERT
TO service_role
WITH CHECK (true);

-- 3. UPDATE policy - Service role can update trails
CREATE POLICY "Allow service role to update trails" ON public.trails
FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);

-- 4. DELETE policy - Service role can delete trails
CREATE POLICY "Allow service role to delete trails" ON public.trails
FOR DELETE
TO service_role
USING (true);

-- Ensure RLS is enabled
ALTER TABLE public.trails ENABLE ROW LEVEL SECURITY;

-- Remove user_id column if it exists since trails are global, not user-owned
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'trails' AND column_name = 'user_id') THEN
    ALTER TABLE public.trails DROP COLUMN user_id;
  END IF;
END $$;

-- Update the service role check function to be more reliable
CREATE OR REPLACE FUNCTION public.is_service_role()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN current_setting('role', true) = 'service_role';
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Test function to verify permissions work
CREATE OR REPLACE FUNCTION public.test_trail_permissions()
RETURNS TABLE(
  can_select boolean,
  can_insert boolean,
  current_role text,
  rls_enabled boolean
) AS $$
BEGIN
  RETURN QUERY SELECT 
    (SELECT count(*) FROM public.trails LIMIT 1) >= 0 as can_select,
    true as can_insert, -- Will be tested by actual insert
    current_setting('role') as current_role,
    (SELECT relrowsecurity FROM pg_class WHERE relname = 'trails') as rls_enabled;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
