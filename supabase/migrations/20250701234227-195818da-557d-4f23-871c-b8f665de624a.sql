-- Phase 1: Fix Authentication & Profile System

-- Create user_stats table to fix signup errors
CREATE TABLE IF NOT EXISTS public.user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  total_trails INTEGER DEFAULT 0,
  total_distance NUMERIC DEFAULT 0,
  total_elevation INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Modify profiles table structure if needed
ALTER TABLE public.profiles 
  DROP CONSTRAINT IF EXISTS profiles_id_fkey,
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update existing profiles to use user_id if they don't have it
UPDATE public.profiles SET user_id = id WHERE user_id IS NULL;

-- Make user_id NOT NULL after updating existing data
ALTER TABLE public.profiles ALTER COLUMN user_id SET NOT NULL;

-- Create trigger function to auto-create profiles when users sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile record
  INSERT INTO public.profiles (user_id, username, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'username', 'user_' || LEFT(NEW.id::text, 8)),
    NEW.raw_user_meta_data ->> 'full_name'
  );
  
  -- Insert user_stats record
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;

-- Create trigger to execute function on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Phase 2: Update Trails Schema for Minnesota Import

-- Add expert to the trail_difficulty enum if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'expert' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'trail_difficulty')) THEN
    ALTER TYPE trail_difficulty ADD VALUE 'expert';
  END IF;
END $$;

-- Add missing columns to trails table
ALTER TABLE public.trails 
  ADD COLUMN IF NOT EXISTS photos TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS length_miles NUMERIC,
  ADD COLUMN IF NOT EXISTS rating NUMERIC CHECK (rating >= 0 AND rating <= 5),
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS state TEXT;

-- Update existing length data to length_miles if length exists
UPDATE public.trails SET length_miles = length WHERE length_miles IS NULL AND length IS NOT NULL;

-- Add helpful indexes for performance
CREATE INDEX IF NOT EXISTS trails_state_idx ON public.trails(state);
CREATE INDEX IF NOT EXISTS trails_location_tsv_idx ON public.trails USING gin(to_tsvector('english', location));
CREATE INDEX IF NOT EXISTS trails_is_active_idx ON public.trails(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS trails_rating_idx ON public.trails(rating) WHERE rating IS NOT NULL;

-- Phase 3: Create Trail Preview System

-- Create trail preview view for fast trail previews
CREATE OR REPLACE VIEW public.v_trail_preview AS
SELECT
  id,
  name,
  length_miles,
  difficulty,
  rating,
  CASE 
    WHEN photos IS NOT NULL AND array_length(photos, 1) > 0 
    THEN photos[1] 
    ELSE NULL 
  END as cover_photo,
  LEFT(COALESCE(description, ''), 160) || CASE 
    WHEN LENGTH(COALESCE(description, '')) > 160 
    THEN '…' 
    ELSE '' 
  END as blurb,
  state,
  location
FROM public.trails
WHERE is_active = true;

-- Create function for single trail preview lookups
CREATE OR REPLACE FUNCTION public.get_trail_preview(p_id UUID)
RETURNS SETOF public.v_trail_preview
LANGUAGE sql
STABLE
AS $$
  SELECT * FROM public.v_trail_preview WHERE id = p_id;
$$;

-- RLS Policies
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own stats" ON public.user_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats" ON public.user_stats
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats" ON public.user_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Ensure trails can be read publicly
DROP POLICY IF EXISTS "Public read trails" ON public.trails;
CREATE POLICY "Public read trails" ON public.trails
  FOR SELECT USING (true);

-- Grant necessary permissions
GRANT SELECT ON public.v_trail_preview TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.get_trail_preview(UUID) TO authenticated, anon;