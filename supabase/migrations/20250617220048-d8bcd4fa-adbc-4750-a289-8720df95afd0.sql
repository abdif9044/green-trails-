
-- Phase 1: Critical RLS Policy Implementation (URGENT) - Fixed Version
-- Drop existing policies first to avoid conflicts

-- Drop existing policies on stories table
DROP POLICY IF EXISTS "Users can create their own stories" ON public.stories;
DROP POLICY IF EXISTS "Users can view active stories" ON public.stories;
DROP POLICY IF EXISTS "Users can update their own stories" ON public.stories;
DROP POLICY IF EXISTS "Users can delete their own stories" ON public.stories;

-- Drop any other existing policies that might conflict
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public can view non-age-restricted trails" ON public.trails;
DROP POLICY IF EXISTS "Authenticated users can create trails" ON public.trails;
DROP POLICY IF EXISTS "Users can update their own trails" ON public.trails;
DROP POLICY IF EXISTS "Users can delete their own trails" ON public.trails;

-- Enable RLS on all tables (idempotent operation)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trail_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trail_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trail_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hiking_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hiking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parking_spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Create user roles system first (needed for admin policies)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Now create all the RLS policies

-- User Profiles: Users can only see and modify their own profile
CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

-- Trails: Public read access with age restrictions, only authenticated users can add trails
CREATE POLICY "Public can view non-age-restricted trails" ON public.trails
FOR SELECT USING (
  NOT is_age_restricted OR 
  (auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_age_verified = true
  ))
);

CREATE POLICY "Authenticated users can create trails" ON public.trails
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own trails" ON public.trails
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trails" ON public.trails
FOR DELETE USING (auth.uid() = user_id);

-- Service role can also insert trails (for bulk imports)
CREATE POLICY "Service role can manage trails" ON public.trails
FOR ALL USING (current_setting('role') = 'service_role');

-- Notifications: Users can only see their own notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON public.notifications
FOR INSERT WITH CHECK (true);

-- Stories: Users can see their own stories and non-expired public stories
CREATE POLICY "Users can view active stories" ON public.stories
FOR SELECT USING (
  auth.uid() = user_id OR 
  (expires_at > now() AND auth.uid() IS NOT NULL)
);

CREATE POLICY "Users can create their own stories" ON public.stories
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stories" ON public.stories
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stories" ON public.stories
FOR DELETE USING (auth.uid() = user_id);

-- Fix trails difficulty constraint issue (from logs)
ALTER TABLE public.trails DROP CONSTRAINT IF EXISTS trails_difficulty_check;
ALTER TABLE public.trails ADD CONSTRAINT trails_difficulty_check 
CHECK (difficulty IN ('easy', 'moderate', 'hard'));

-- Add policies for user_roles table
CREATE POLICY "Users can view their own roles" ON public.user_roles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Security Audit Log: Restrict access to admin only
CREATE POLICY "Admins can access audit log" ON public.security_audit_log
FOR ALL USING (public.has_role(auth.uid(), 'admin'));
