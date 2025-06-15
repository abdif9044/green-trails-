
-- 1. Notifications table for all social notifications (follow, like, comment, system, weather, trail, etc.)
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL, -- references profiles.id, NOT auth.users (by project best practice)
  type TEXT NOT NULL CHECK (type IN ('social', 'weather', 'trail', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Stories table for live story/photo sharing
CREATE TABLE IF NOT EXISTS public.stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL, -- references profiles.id
  media_url TEXT NOT NULL,
  caption TEXT,
  location_name TEXT,
  expires_at TIMESTAMPTZ NOT NULL,           -- 24h from created_at
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Storage Bucket Creation (instruct UI/console for manual, but prepping policies)
-- Buckets: avatars, stories-media, album-media

-- 4. Groups and group_members tables for community features
CREATE TABLE IF NOT EXISTS public.groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  owner_id UUID NOT NULL, -- references profiles.id
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.group_members (
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL, -- references profiles.id
  role TEXT NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (group_id, user_id)
);

-- 5. user_sessions for optional session management
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  session_token TEXT NOT NULL,
  device_info TEXT,
  last_active TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. RLS: Enable and protect all new tables!
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Notifications RLS: Only the owner can SELECT, UPDATE, or DELETE; anyone can INSERT for their own row
CREATE POLICY "Own notifications only" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Insert own notifications" ON public.notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Delete own notifications" ON public.notifications
  FOR DELETE USING (auth.uid() = user_id);

-- Stories RLS
CREATE POLICY "View own and public stories" ON public.stories
  FOR SELECT USING (auth.uid() = user_id OR expires_at > now());
CREATE POLICY "Insert own stories" ON public.stories
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Update own stories" ON public.stories
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Delete own stories" ON public.stories
  FOR DELETE USING (auth.uid() = user_id);

-- Groups RLS
CREATE POLICY "View all groups" ON public.groups
  FOR SELECT USING (true);
CREATE POLICY "Create group as self" ON public.groups
  FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Update/delete group as owner" ON public.groups
  FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Delete group as owner" ON public.groups
  FOR DELETE USING (auth.uid() = owner_id);

-- Group Members RLS
CREATE POLICY "Members see their groups" ON public.group_members
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Add self as member" ON public.group_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Remove self from group" ON public.group_members
  FOR DELETE USING (auth.uid() = user_id);

-- Session management RLS (can expand later)
CREATE POLICY "User manages own sessions" ON public.user_sessions
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- INDEXES for large tables (performance)
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_stories_user_id_expires_at ON public.stories(user_id, expires_at);
CREATE INDEX IF NOT EXISTS idx_groups_owner_id ON public.groups(owner_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON public.group_members(user_id);

-- (Reminder) Manually create the following storage buckets from Supabase dashboard Storage UI:
--   - avatars (for profile images)
--   - stories-media (for stories uploads)
--   - album-media (for album photos)
-- Set each bucket to "private" by default and apply policies if needed.

