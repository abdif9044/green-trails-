-- Fix the handle_new_user trigger function to properly set the id field
-- This resolves the "null value in column 'id' of relation 'profiles' violates not-null constraint" error

DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
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
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();