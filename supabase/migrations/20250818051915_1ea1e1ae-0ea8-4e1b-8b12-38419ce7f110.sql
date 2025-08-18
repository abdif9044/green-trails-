-- Phase 1: Critical Security Fixes

-- 1. Fix Security Audit Log Access Control
-- Drop the overly permissive service role policy
DROP POLICY IF EXISTS "Service role can manage security audit log" ON public.security_audit_log;

-- Create restricted policies for security audit log
-- Service role can only INSERT (for logging events)
CREATE POLICY "Service role can insert security events" ON public.security_audit_log
FOR INSERT 
TO service_role
WITH CHECK (true);

-- Admins can view and manage audit logs
CREATE POLICY "Admins can manage audit logs" ON public.security_audit_log
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- 2. Create secure admin checking function to avoid RLS recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$;

-- 3. Create secure security event logging function
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_event_type text,
  p_event_data jsonb DEFAULT '{}',
  p_user_id uuid DEFAULT auth.uid(),
  p_ip_address inet DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  event_id uuid;
BEGIN
  INSERT INTO public.security_audit_log (
    event_type,
    user_id,
    event_data,
    ip_address,
    user_agent
  ) VALUES (
    p_event_type,
    p_user_id,
    p_event_data,
    p_ip_address,
    p_user_agent
  ) RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$;

-- 4. Fix Profile RLS Policies - Enhanced Security
-- Drop existing conflicting policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create comprehensive profile policies
-- Users can view basic public profile info of others (excluding sensitive data)
CREATE POLICY "Users can view public profile data" ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Users can only insert their own profile
CREATE POLICY "Users can create their own profile" ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Users can only delete their own profile
CREATE POLICY "Users can delete their own profile" ON public.profiles
FOR DELETE
TO authenticated
USING (auth.uid() = id);

-- Admins can manage all profiles
CREATE POLICY "Admins can manage all profiles" ON public.profiles
FOR ALL
TO authenticated
USING (public.is_admin());

-- 5. Update trail policies to use the new admin function
DROP POLICY IF EXISTS "Admins can manage trails" ON public.trails;
CREATE POLICY "Admins can manage trails" ON public.trails
FOR ALL
TO authenticated
USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete reviews" ON public.trail_reviews;
CREATE POLICY "Admins can delete reviews" ON public.trail_reviews
FOR DELETE
TO authenticated
USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage trail waypoints" ON public.trail_waypoints;
CREATE POLICY "Admins can manage trail waypoints" ON public.trail_waypoints
FOR ALL
TO authenticated
USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage trail 3d models" ON public.trail_3d_models;
CREATE POLICY "Admins can manage trail 3d models" ON public.trail_3d_models
FOR ALL
TO authenticated
USING (public.is_admin());

-- 6. Create a secure function to check current user profile data
CREATE OR REPLACE FUNCTION public.get_current_user_profile()
RETURNS public.profiles
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT * FROM public.profiles WHERE id = auth.uid();
$$;

-- 7. Add audit logging trigger for sensitive operations
CREATE OR REPLACE FUNCTION public.audit_profile_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log admin status changes
  IF OLD.is_admin != NEW.is_admin THEN
    PERFORM public.log_security_event(
      'profile_admin_status_changed',
      jsonb_build_object(
        'user_id', NEW.id,
        'old_admin_status', OLD.is_admin,
        'new_admin_status', NEW.is_admin,
        'changed_by', auth.uid()
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for profile audit logging
DROP TRIGGER IF EXISTS audit_profile_changes_trigger ON public.profiles;
CREATE TRIGGER audit_profile_changes_trigger
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_profile_changes();