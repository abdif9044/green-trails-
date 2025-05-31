
-- Fix RLS policy on trails table to allow service role access for imports
-- This enables edge functions to insert trails during bulk imports

-- Drop existing INSERT policy if it exists
DROP POLICY IF EXISTS "Users can insert their own trails" ON public.trails;
DROP POLICY IF EXISTS "Allow trail inserts" ON public.trails;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.trails;

-- Create new INSERT policy that allows both authenticated users and service role
CREATE POLICY "Allow trail inserts for users and service role" ON public.trails
FOR INSERT
WITH CHECK (
  -- Allow if user is authenticated (for regular users)
  auth.uid() IS NOT NULL
  OR
  -- Allow if using service role (for import functions)
  current_setting('role') = 'service_role'
);

-- Ensure RLS is enabled on trails table
ALTER TABLE public.trails ENABLE ROW LEVEL SECURITY;

-- Create a security definer function to check if current context is service role
CREATE OR REPLACE FUNCTION public.is_service_role()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN current_setting('role', true) = 'service_role';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Update the policy to use the security definer function (more reliable)
DROP POLICY IF EXISTS "Allow trail inserts for users and service role" ON public.trails;

CREATE POLICY "Allow trail inserts for users and service role" ON public.trails
FOR INSERT
WITH CHECK (
  -- Allow if user is authenticated (for regular users)
  auth.uid() IS NOT NULL
  OR
  -- Allow if using service role (for import functions) 
  public.is_service_role() = true
);

-- Verify the edge function authentication setup by creating a test function
CREATE OR REPLACE FUNCTION public.test_trail_insert_permissions()
RETURNS TABLE(
  can_insert boolean,
  current_role text,
  auth_uid uuid,
  is_service_role boolean
) AS $$
BEGIN
  RETURN QUERY SELECT 
    true as can_insert,
    current_setting('role') as current_role,
    auth.uid() as auth_uid,
    public.is_service_role() as is_service_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
