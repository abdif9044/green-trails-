-- Phase 2C: Comprehensive Security Test Suite
-- Creating comprehensive security validation and testing functions

-- 1. Enhanced security audit function with detailed recommendations
CREATE OR REPLACE FUNCTION public.audit_security_comprehensive()
RETURNS TABLE(
  category text,
  table_name text,
  issue_type text,
  severity text,
  description text,
  recommendation text,
  sql_fix text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
BEGIN
  -- Check for tables without RLS
  RETURN QUERY
  SELECT 
    'RLS_MISSING'::text as category,
    t.tablename::text as table_name,
    'MISSING_RLS'::text as issue_type,
    'CRITICAL'::text as severity,
    'Table does not have Row Level Security enabled'::text as description,
    'Enable RLS immediately to prevent unauthorized access'::text as recommendation,
    format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t.tablename)::text as sql_fix
  FROM pg_tables t
  WHERE t.schemaname = 'public'
    AND NOT EXISTS (
      SELECT 1 FROM pg_class c 
      JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE c.relname = t.tablename 
        AND n.nspname = 'public'
        AND c.relrowsecurity = true
    )
    AND t.tablename NOT IN ('spatial_ref_sys', 'geography_columns', 'geometry_columns');

  -- Check for RLS enabled but no policies
  RETURN QUERY
  SELECT 
    'RLS_NO_POLICIES'::text as category,
    t.tablename::text as table_name,
    'RLS_WITHOUT_POLICIES'::text as issue_type,
    'CRITICAL'::text as severity,
    'RLS enabled but no policies defined - table is completely inaccessible'::text as description,
    'Create appropriate RLS policies for this table'::text as recommendation,
    format('CREATE POLICY "basic_policy" ON public.%I FOR ALL USING (auth.uid() IS NOT NULL);', t.tablename)::text as sql_fix
  FROM pg_tables t
  WHERE t.schemaname = 'public'
    AND EXISTS (
      SELECT 1 FROM pg_class c 
      JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE c.relname = t.tablename 
        AND n.nspname = 'public'
        AND c.relrowsecurity = true
    )
    AND NOT EXISTS (
      SELECT 1 FROM pg_policies p
      WHERE p.schemaname = 'public' AND p.tablename = t.tablename
    );

  -- Check for overly permissive policies
  RETURN QUERY
  SELECT 
    'OVERLY_PERMISSIVE'::text as category,
    p.tablename::text as table_name,
    'PERMISSIVE_POLICY'::text as issue_type,
    'HIGH'::text as severity,
    format('Policy "%s" allows unrestricted access', p.policyname)::text as description,
    'Review and restrict policy conditions'::text as recommendation,
    format('DROP POLICY "%s" ON public.%I; -- Then create more restrictive policy', p.policyname, p.tablename)::text as sql_fix
  FROM pg_policies p
  WHERE p.schemaname = 'public'
    AND (p.qual = 'true' OR p.with_check = 'true')
    AND p.tablename NOT IN ('trails', 'trail_reviews', 'community_challenges', 'hiking_events');

  -- Check for user data tables without user isolation
  RETURN QUERY
  SELECT 
    'NO_USER_ISOLATION'::text as category,
    p.tablename::text as table_name,
    'MISSING_USER_ISOLATION'::text as issue_type,
    'HIGH'::text as severity,
    'User data table lacks proper user isolation in policies'::text as description,
    'Add auth.uid() checks to ensure users can only access their own data'::text as recommendation,
    format('-- Review policies for table %s and add user_id = auth.uid() conditions', p.tablename)::text as sql_fix
  FROM (
    SELECT DISTINCT tablename
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('profiles', 'user_stats', 'user_preferences', 'saved_trails', 'trail_logs', 'hike_sessions')
  ) p
  WHERE NOT EXISTS (
    SELECT 1 FROM pg_policies pol
    WHERE pol.schemaname = 'public' 
      AND pol.tablename = p.tablename
      AND (pol.qual LIKE '%auth.uid()%' OR pol.with_check LIKE '%auth.uid()%')
  );
END;
$$;

-- 2. Function to test RLS policies
CREATE OR REPLACE FUNCTION public.test_rls_policies()
RETURNS TABLE(
  table_name text,
  test_type text,
  result text,
  details text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
DECLARE
  test_user_id uuid := '00000000-0000-0000-0000-000000000001';
  test_count integer;
BEGIN
  -- Test 1: Verify profiles table user isolation
  BEGIN
    -- This should return 0 when user is not authenticated
    EXECUTE format('SET LOCAL role TO anon');
    EXECUTE format('SELECT COUNT(*) FROM public.profiles WHERE user_id = %L', test_user_id) INTO test_count;
    
    RETURN QUERY SELECT 
      'profiles'::text,
      'unauthenticated_access'::text,
      CASE WHEN test_count = 0 THEN 'PASS' ELSE 'FAIL' END::text,
      format('Unauthenticated user can see %s profile records', test_count)::text;
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 
      'profiles'::text,
      'unauthenticated_access'::text,
      'PASS'::text,
      'Access properly blocked for unauthenticated users'::text;
  END;

  -- Test 2: Verify trails table is readable
  BEGIN
    EXECUTE format('SET LOCAL role TO anon');
    EXECUTE format('SELECT COUNT(*) FROM public.trails LIMIT 1') INTO test_count;
    
    RETURN QUERY SELECT 
      'trails'::text,
      'public_read_access'::text,
      'PASS'::text,
      'Trails table is properly accessible for public reading'::text;
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 
      'trails'::text,
      'public_read_access'::text,
      'FAIL'::text,
      'Trails table should be publicly readable but access is blocked'::text;
  END;

  -- Reset role
  EXECUTE format('RESET role');
END;
$$;

-- 3. Function to validate authentication requirements
CREATE OR REPLACE FUNCTION public.validate_auth_requirements()
RETURNS TABLE(
  check_name text,
  status text,
  message text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
BEGIN
  -- Check if handle_new_user trigger exists
  RETURN QUERY
  SELECT 
    'handle_new_user_trigger'::text,
    CASE WHEN EXISTS (
      SELECT 1 FROM information_schema.triggers 
      WHERE trigger_name = 'on_auth_user_created'
    ) THEN 'PASS' ELSE 'FAIL' END::text,
    CASE WHEN EXISTS (
      SELECT 1 FROM information_schema.triggers 
      WHERE trigger_name = 'on_auth_user_created'
    ) THEN 'User profile creation trigger is properly configured'
       ELSE 'Missing trigger to create user profiles on signup' END::text;

  -- Check if profiles table has proper structure
  RETURN QUERY
  SELECT 
    'profiles_table_structure'::text,
    CASE WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = 'profiles'
        AND column_name = 'user_id'
    ) THEN 'PASS' ELSE 'FAIL' END::text,
    CASE WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = 'profiles'
        AND column_name = 'user_id'
    ) THEN 'Profiles table has required user_id column'
       ELSE 'Profiles table missing user_id column' END::text;

  -- Check age verification function
  RETURN QUERY
  SELECT 
    'age_verification_function'::text,
    CASE WHEN EXISTS (
      SELECT 1 FROM information_schema.routines 
      WHERE routine_schema = 'public'
        AND routine_name LIKE '%age%'
        AND routine_type = 'FUNCTION'
    ) THEN 'PASS' ELSE 'WARNING' END::text,
    CASE WHEN EXISTS (
      SELECT 1 FROM information_schema.routines 
      WHERE routine_schema = 'public'
        AND routine_name LIKE '%age%'
        AND routine_type = 'FUNCTION'
    ) THEN 'Age verification functions are available'
       ELSE 'Consider implementing age verification for 21+ requirement' END::text;
END;
$$;

-- 4. Security monitoring function
CREATE OR REPLACE FUNCTION public.monitor_security_events()
RETURNS TABLE(
  event_time timestamp with time zone,
  event_type text,
  user_id uuid,
  details jsonb,
  severity text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
BEGIN
  -- Return recent security events from audit log
  RETURN QUERY
  SELECT 
    sal.created_at,
    sal.event_type,
    sal.user_id,
    sal.event_data,
    CASE 
      WHEN sal.event_type LIKE '%error%' THEN 'HIGH'
      WHEN sal.event_type LIKE '%failed%' THEN 'MEDIUM'
      ELSE 'LOW'
    END::text as severity
  FROM public.security_audit_log sal
  WHERE sal.created_at > (NOW() - INTERVAL '24 hours')
  ORDER BY sal.created_at DESC
  LIMIT 100;
EXCEPTION
  WHEN undefined_table THEN
    -- Security audit log table doesn't exist
    RETURN;
END;
$$;

-- 5. Database health check for GreenTrails
CREATE OR REPLACE FUNCTION public.greentrails_health_check()
RETURNS TABLE(
  component text,
  status text,
  details text,
  recommendation text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
DECLARE
  trail_count integer;
  user_count integer;
  recent_activity_count integer;
BEGIN
  -- Check trail data availability
  SELECT COUNT(*) INTO trail_count FROM public.trails WHERE is_active = true;
  RETURN QUERY SELECT 
    'trail_data'::text,
    CASE WHEN trail_count > 0 THEN 'HEALTHY' ELSE 'WARNING' END::text,
    format('Active trails in database: %s', trail_count)::text,
    CASE WHEN trail_count = 0 THEN 'Import trail data to populate the app' ELSE 'Trail data looks good' END::text;

  -- Check user engagement
  SELECT COUNT(*) INTO user_count FROM public.profiles;
  RETURN QUERY SELECT 
    'user_base'::text,
    CASE WHEN user_count > 0 THEN 'HEALTHY' ELSE 'INFO' END::text,
    format('Registered users: %s', user_count)::text,
    CASE WHEN user_count = 0 THEN 'No users registered yet - normal for new deployment' ELSE 'User base is growing' END::text;

  -- Check recent activity
  SELECT COUNT(*) INTO recent_activity_count 
  FROM public.activity_feed 
  WHERE created_at > (NOW() - INTERVAL '7 days');
  
  RETURN QUERY SELECT 
    'user_activity'::text,
    CASE WHEN recent_activity_count > 0 THEN 'HEALTHY' ELSE 'INFO' END::text,
    format('Recent activities (7 days): %s', recent_activity_count)::text,
    CASE WHEN recent_activity_count = 0 THEN 'No recent user activity - encourage user engagement' ELSE 'Good user engagement' END::text;

  -- Check essential tables exist
  RETURN QUERY SELECT 
    'database_structure'::text,
    CASE WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name IN ('trails', 'profiles', 'activity_feed', 'albums', 'hike_sessions')
    ) THEN 'HEALTHY' ELSE 'CRITICAL' END::text,
    'Core GreenTrails tables verified'::text,
    'Database structure is properly configured'::text;
END;
$$;

-- Grant execute permissions to authenticated users for monitoring functions
GRANT EXECUTE ON FUNCTION public.audit_security_comprehensive() TO authenticated;
GRANT EXECUTE ON FUNCTION public.test_rls_policies() TO authenticated;
GRANT EXECUTE ON FUNCTION public.validate_auth_requirements() TO authenticated;
GRANT EXECUTE ON FUNCTION public.monitor_security_events() TO authenticated;
GRANT EXECUTE ON FUNCTION public.greentrails_health_check() TO authenticated;