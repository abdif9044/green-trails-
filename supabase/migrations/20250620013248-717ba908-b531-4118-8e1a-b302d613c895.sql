
-- First, let's check what the current difficulty constraint allows and fix it
-- Drop the existing constraint if it's too restrictive
ALTER TABLE public.trails DROP CONSTRAINT IF EXISTS trails_difficulty_check;

-- Add a proper constraint that allows the standard difficulty levels
ALTER TABLE public.trails ADD CONSTRAINT trails_difficulty_check 
CHECK (difficulty IS NULL OR difficulty IN ('easy', 'moderate', 'hard', 'expert'));

-- Also ensure the trail generation functions use consistent difficulty values
-- Add an index for better performance on difficulty queries
CREATE INDEX IF NOT EXISTS idx_trails_difficulty ON public.trails(difficulty) WHERE difficulty IS NOT NULL;
