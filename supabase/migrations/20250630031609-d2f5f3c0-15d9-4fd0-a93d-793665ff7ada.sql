
-- Add the year_of_birth column if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS year_of_birth SMALLINT;

-- Add the is_age_verified column if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_age_verified BOOLEAN DEFAULT FALSE;

-- Drop the constraint if it exists and recreate it
DO $$ 
BEGIN
    -- Try to drop the constraint if it exists
    BEGIN
        ALTER TABLE public.profiles DROP CONSTRAINT profiles_year_of_birth_check;
    EXCEPTION
        WHEN undefined_object THEN NULL;
    END;
    
    -- Add the constraint
    ALTER TABLE public.profiles 
    ADD CONSTRAINT profiles_year_of_birth_check 
    CHECK (year_of_birth IS NULL OR (year_of_birth BETWEEN 1900 AND EXTRACT(YEAR FROM NOW())::INT));
END $$;
