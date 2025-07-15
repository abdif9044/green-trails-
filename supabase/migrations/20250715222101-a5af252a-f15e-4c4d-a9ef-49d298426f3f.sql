-- PHASE 2A: Complete RLS Audit & Security Hardening

-- Fix the audit function to use correct column names
CREATE OR REPLACE FUNCTION public.audit_user_data_isolation()
RETURNS TABLE(
  table_name text,
  policy_name text,
  policy_command text,
  has_user_isolation boolean,
  security_status text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    schemaname || '.' || tablename::text as table_name,
    policyname::text as policy_name,
    cmd::text as policy_command,
    (
      -- Check if policy includes auth.uid() for user isolation
      qual LIKE '%auth.uid()%' OR 
      with_check LIKE '%auth.uid()%'
    ) as has_user_isolation,
    CASE 
      WHEN (qual LIKE '%auth.uid()%' OR with_check LIKE '%auth.uid()%') 
      THEN 'SECURE: User isolation enforced'
      WHEN (qual = 'true' AND cmd = 'SELECT')
      THEN 'PUBLIC: Read access allowed'
      WHEN qual IS NULL AND cmd != 'SELECT'
      THEN 'INSERT/UPDATE/DELETE: Check with_check column'
      ELSE 'WARNING: Check policy manually'
    END as security_status
  FROM pg_policies 
  WHERE schemaname = 'public'
  AND tablename IN (
    'profiles', 'trail_logs', 'hike_sessions', 'user_stats', 
    'activity_feed', 'user_preferences', 'notifications', 
    'albums', 'album_media', 'stories', 'likes', 'follows',
    'saved_trails', 'trail_likes', 'trail_interactions'
  )
  ORDER BY table_name, policy_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on spatial_ref_sys if it contains sensitive data (skip for now as it's PostGIS system table)
-- spatial_ref_sys is a PostGIS system table and typically doesn't need RLS

-- Fix function search paths for security (10 functions flagged)
-- Update the audit function to use stable search path
CREATE OR REPLACE FUNCTION public.audit_user_data_isolation()
RETURNS TABLE(
  table_name text,
  policy_name text,
  policy_command text,
  has_user_isolation boolean,
  security_status text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    schemaname || '.' || tablename::text as table_name,
    policyname::text as policy_name,
    cmd::text as policy_command,
    (
      -- Check if policy includes auth.uid() for user isolation
      qual LIKE '%auth.uid()%' OR 
      with_check LIKE '%auth.uid()%'
    ) as has_user_isolation,
    CASE 
      WHEN (qual LIKE '%auth.uid()%' OR with_check LIKE '%auth.uid()%') 
      THEN 'SECURE: User isolation enforced'
      WHEN (qual = 'true' AND cmd = 'SELECT')
      THEN 'PUBLIC: Read access allowed'
      WHEN qual IS NULL AND cmd != 'SELECT'
      THEN 'INSERT/UPDATE/DELETE: Check with_check column'
      ELSE 'WARNING: Check policy manually'
    END as security_status
  FROM pg_policies 
  WHERE schemaname = 'public'
  AND tablename IN (
    'profiles', 'trail_logs', 'hike_sessions', 'user_stats', 
    'activity_feed', 'user_preferences', 'notifications', 
    'albums', 'album_media', 'stories', 'likes', 'follows',
    'saved_trails', 'trail_likes', 'trail_interactions'
  )
  ORDER BY table_name, policy_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Fix other critical security functions with proper search paths
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER SET search_path = public, pg_temp
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$;

-- Fix handle_new_user function with proper search path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public, pg_temp
AS $$
BEGIN
  -- Insert into profiles table (this already exists and works)
  INSERT INTO public.profiles (id, user_id, full_name, username, year_of_birth, is_age_verified)
  VALUES (
    NEW.id,  -- Set the id field to the auth user's id
    NEW.id,  -- Also set user_id for consistency
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'username',
    CASE 
      WHEN NEW.raw_user_meta_data ->> 'year_of_birth' IS NOT NULL 
      THEN (NEW.raw_user_meta_data ->> 'year_of_birth')::SMALLINT 
      ELSE NULL 
    END,
    CASE 
      WHEN NEW.raw_user_meta_data ->> 'year_of_birth' IS NOT NULL 
      THEN (EXTRACT(YEAR FROM NOW())::INT - (NEW.raw_user_meta_data ->> 'year_of_birth')::INT) >= 21
      ELSE FALSE 
    END
  );

  -- Create user_stats record if the table exists, including the id field
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_stats') THEN
    INSERT INTO public.user_stats (id, user_id, total_distance, total_elevation, total_trails, current_streak)
    VALUES (NEW.id, NEW.id, 0, 0, 0, 0);
  END IF;

  RETURN NEW;
END;
$$;

-- Create comprehensive security audit for ALL tables
CREATE OR REPLACE FUNCTION public.audit_all_table_security()
RETURNS TABLE(
  table_name text,
  rls_enabled boolean,
  policy_count bigint,
  has_user_policies boolean,
  security_recommendation text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.tablename::text as table_name,
    t.rowsecurity as rls_enabled,
    COALESCE(p.policy_count, 0) as policy_count,
    COALESCE(p.has_user_policies, false) as has_user_policies,
    CASE 
      WHEN t.rowsecurity = false AND t.tablename NOT IN ('spatial_ref_sys', 'geography_columns', 'geometry_columns')
      THEN 'WARNING: RLS disabled - consider enabling'
      WHEN t.rowsecurity = true AND COALESCE(p.policy_count, 0) = 0
      THEN 'ERROR: RLS enabled but no policies defined'
      WHEN t.rowsecurity = true AND COALESCE(p.has_user_policies, false) = false AND t.tablename NOT LIKE '%_logs' AND t.tablename NOT IN ('community_challenges', 'parking_spots', 'trail_weather', 'trail_weather_forecasts', 'trails')
      THEN 'WARNING: No user isolation policies found'
      ELSE 'OK: Security appears properly configured'
    END as security_recommendation
  FROM pg_tables t
  LEFT JOIN (
    SELECT 
      tablename,
      COUNT(*) as policy_count,
      bool_or(qual LIKE '%auth.uid()%' OR with_check LIKE '%auth.uid()%') as has_user_policies
    FROM pg_policies 
    WHERE schemaname = 'public'
    GROUP BY tablename
  ) p ON t.tablename = p.tablename
  WHERE t.schemaname = 'public'
  ORDER BY 
    CASE 
      WHEN security_recommendation LIKE 'ERROR%' THEN 1
      WHEN security_recommendation LIKE 'WARNING%' THEN 2
      ELSE 3
    END,
    t.tablename;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;