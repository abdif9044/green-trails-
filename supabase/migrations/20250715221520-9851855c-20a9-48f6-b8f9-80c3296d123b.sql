-- CRITICAL SECURITY FIXES - Phase 1
-- Fix #1: Enable RLS on trails table (CRITICAL VULNERABILITY)
ALTER TABLE public.trails ENABLE ROW LEVEL SECURITY;

-- Fix #2: Remove privacy-violating policies on activity_feed
DROP POLICY IF EXISTS "Users can view all activity" ON public.activity_feed;

-- Create proper privacy policy for activity_feed
CREATE POLICY "Users can view their own activity and followed users" 
ON public.activity_feed FOR SELECT 
USING (
  user_id = auth.uid() OR 
  target_user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.follows 
    WHERE follower_id = auth.uid() AND following_id = activity_feed.user_id
  )
);

-- Fix #3: Remove conflicting privacy-violating policy on user_stats
DROP POLICY IF EXISTS "Users can view all user stats" ON public.user_stats;

-- Fix #4: Add missing DELETE policies for user data protection

-- trail_logs DELETE policy
CREATE POLICY "Users can delete their own trail logs" 
ON public.trail_logs FOR DELETE 
USING (user_id = auth.uid());

-- profiles DELETE policy
CREATE POLICY "Users can delete their own profile" 
ON public.profiles FOR DELETE 
USING (id = auth.uid());

-- hike_sessions DELETE policy (already has policy, but ensuring it exists)
DROP POLICY IF EXISTS "Users can delete their own hike sessions" ON public.hike_sessions;
CREATE POLICY "Users can delete their own hike sessions" 
ON public.hike_sessions FOR DELETE 
USING (user_id = auth.uid());

-- Fix #5: Ensure user_preferences has proper DELETE policy
CREATE POLICY "Users can delete their own preferences" 
ON public.user_preferences FOR DELETE 
USING (user_id = auth.uid());

-- Fix #6: Ensure notifications has proper DELETE policy
CREATE POLICY "Users can delete their own notifications" 
ON public.notifications FOR DELETE 
USING (user_id = auth.uid());

-- Fix #7: Ensure stories has proper policies are correct (already exist but verify)
-- Users can delete their own stories - already exists

-- Fix #8: Ensure album_media has proper policies (already exist)
-- Users can delete their album media - already exists

-- Verification queries to ensure security
-- Create a security audit function for ongoing monitoring
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
      quals LIKE '%auth.uid()%' OR 
      with_check LIKE '%auth.uid()%'
    ) as has_user_isolation,
    CASE 
      WHEN (quals LIKE '%auth.uid()%' OR with_check LIKE '%auth.uid()%') 
      THEN 'SECURE: User isolation enforced'
      WHEN (quals = 'true' AND cmd = 'SELECT')
      THEN 'PUBLIC: Read access allowed'
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