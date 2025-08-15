-- Fix SECURITY DEFINER functions without proper search_path settings
-- This addresses the security linter warnings about functions vulnerable to search path attacks

-- Update functions that use SECURITY DEFINER but don't have proper search_path
-- The search_path should be set to prevent malicious schema injection attacks

-- Fix is_admin function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE 
SET search_path = 'public', 'auth';

-- Fix is_service_role function  
CREATE OR REPLACE FUNCTION public.is_service_role()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN current_setting('role', true) = 'service_role';
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE
SET search_path = 'public';

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path = 'public';

-- Fix test_trail_insert_permissions function
CREATE OR REPLACE FUNCTION public.test_trail_insert_permissions()
RETURNS TABLE(
  can_insert boolean,
  current_user_role text,
  auth_uid uuid,
  is_service_role boolean
) AS $$
BEGIN
  RETURN QUERY SELECT 
    true as can_insert,
    current_setting('role') as current_user_role,
    auth.uid() as auth_uid,
    public.is_service_role() as is_service_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = 'public', 'auth';

-- Fix handle_new_user function (if it exists)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = 'public', 'auth';