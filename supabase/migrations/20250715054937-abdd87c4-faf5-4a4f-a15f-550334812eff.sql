
-- Fix the handle_new_user trigger to properly include id field for user_stats
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
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
$function$;
