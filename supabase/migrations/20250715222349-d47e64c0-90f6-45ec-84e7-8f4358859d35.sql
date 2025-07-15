-- PHASE 2B: Function Security Hardening & Error Handling

-- Fix remaining security functions with proper search paths
CREATE OR REPLACE FUNCTION public.bulk_insert_trails(payload jsonb)
RETURNS TABLE(inserted_count integer, updated_count integer)
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
    trail_record JSONB;
    inserted_cnt INTEGER := 0;
    updated_cnt INTEGER := 0;
    trail_id UUID;
    existing_id UUID;
    error_context TEXT;
BEGIN
    -- Validate input
    IF payload IS NULL OR jsonb_array_length(payload) = 0 THEN
        RAISE EXCEPTION 'Invalid payload: must be a non-empty JSON array';
    END IF;

    -- Loop through each trail in the payload
    FOR trail_record IN SELECT * FROM jsonb_array_elements(payload)
    LOOP
        BEGIN
            -- Extract or generate trail ID
            trail_id := COALESCE(
                (trail_record->>'id')::UUID,
                gen_random_uuid()
            );
            
            -- Check if trail already exists by source and name
            SELECT id INTO existing_id 
            FROM public.trails 
            WHERE source = (trail_record->>'source') 
            AND name = (trail_record->>'name')
            LIMIT 1;
            
            IF existing_id IS NOT NULL THEN
                -- Update existing trail
                UPDATE public.trails SET
                    location = COALESCE(trail_record->>'location', location),
                    difficulty = COALESCE((trail_record->>'difficulty')::trail_difficulty, difficulty),
                    length = COALESCE((trail_record->>'length')::NUMERIC, length),
                    elevation_gain = COALESCE((trail_record->>'elevation_gain')::INTEGER, elevation_gain),
                    lat = COALESCE((trail_record->>'latitude')::DOUBLE PRECISION, lat),
                    lon = COALESCE((trail_record->>'longitude')::DOUBLE PRECISION, lon),
                    latitude = COALESCE((trail_record->>'latitude')::DOUBLE PRECISION, latitude),
                    longitude = COALESCE((trail_record->>'longitude')::DOUBLE PRECISION, longitude),
                    route_geojson = COALESCE((trail_record->>'geojson')::JSONB, route_geojson),
                    description = COALESCE(trail_record->>'description', description),
                    geom = CASE 
                        WHEN trail_record->>'geojson' IS NOT NULL 
                        THEN ST_GeomFromGeoJSON(trail_record->>'geojson')
                        WHEN (trail_record->>'latitude') IS NOT NULL AND (trail_record->>'longitude') IS NOT NULL
                        THEN ST_MakePoint((trail_record->>'longitude')::DOUBLE PRECISION, (trail_record->>'latitude')::DOUBLE PRECISION)::geometry
                        ELSE geom
                    END
                WHERE id = existing_id;
                
                updated_cnt := updated_cnt + 1;
            ELSE
                -- Insert new trail
                INSERT INTO public.trails (
                    id, name, location, difficulty, length, elevation_gain,
                    lat, lon, latitude, longitude, route_geojson, description, source, status,
                    geom, created_at
                ) VALUES (
                    trail_id,
                    trail_record->>'name',
                    trail_record->>'location',
                    (trail_record->>'difficulty')::trail_difficulty,
                    (trail_record->>'length')::NUMERIC,
                    (trail_record->>'elevation_gain')::INTEGER,
                    (trail_record->>'latitude')::DOUBLE PRECISION,
                    (trail_record->>'longitude')::DOUBLE PRECISION,
                    (trail_record->>'latitude')::DOUBLE PRECISION,
                    (trail_record->>'longitude')::DOUBLE PRECISION,
                    (trail_record->>'geojson')::JSONB,
                    trail_record->>'description',
                    trail_record->>'source',
                    COALESCE(trail_record->>'status', 'approved'),
                    CASE 
                        WHEN trail_record->>'geojson' IS NOT NULL 
                        THEN ST_GeomFromGeoJSON(trail_record->>'geojson')
                        WHEN (trail_record->>'latitude') IS NOT NULL AND (trail_record->>'longitude') IS NOT NULL
                        THEN ST_MakePoint((trail_record->>'longitude')::DOUBLE PRECISION, (trail_record->>'latitude')::DOUBLE PRECISION)::geometry
                        ELSE NULL
                    END,
                    NOW()
                );
                
                inserted_cnt := inserted_cnt + 1;
            END IF;
        EXCEPTION 
            WHEN OTHERS THEN
                error_context := format('Error processing trail: %s. Error: %s', 
                    COALESCE(trail_record->>'name', 'Unknown'), SQLERRM);
                RAISE WARNING '%', error_context;
                -- Continue processing other trails
                CONTINUE;
        END;
    END LOOP;
    
    RETURN QUERY SELECT inserted_cnt, updated_cnt;
EXCEPTION 
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Bulk insert failed: %', SQLERRM;
END;
$$;

-- Fix validate_import_readiness function with proper search path and error handling
CREATE OR REPLACE FUNCTION public.validate_import_readiness()
RETURNS TABLE(ready boolean, active_sources integer, total_sources integer, issues text[])
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
  source_count integer := 0;
  active_count integer := 0;
  issue_list text[] := '{}';
BEGIN
  BEGIN
    -- Count total and active sources
    SELECT COUNT(*) INTO source_count FROM public.trail_data_sources;
    SELECT COUNT(*) INTO active_count FROM public.trail_data_sources WHERE is_active = true;
  EXCEPTION
    WHEN undefined_table THEN
      issue_list := array_append(issue_list, 'Trail data sources table does not exist');
      RETURN QUERY SELECT 
        false,
        0,
        0,
        issue_list;
      RETURN;
  END;
  
  -- Check for issues
  IF source_count = 0 THEN
    issue_list := array_append(issue_list, 'No trail data sources configured');
  END IF;
  
  IF active_count = 0 THEN
    issue_list := array_append(issue_list, 'No active trail data sources available');
  END IF;
  
  IF active_count < 3 THEN
    issue_list := array_append(issue_list, 'Fewer than 3 active sources may result in limited trail variety');
  END IF;
  
  -- Check if bulk insert function exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.routines 
    WHERE routine_name = 'bulk_insert_trails' 
    AND routine_schema = 'public'
  ) THEN
    issue_list := array_append(issue_list, 'Bulk insert function not available');
  END IF;
  
  RETURN QUERY SELECT 
    array_length(issue_list, 1) IS NULL OR array_length(issue_list, 1) = 0,
    active_count,
    source_count,
    issue_list;
EXCEPTION
  WHEN OTHERS THEN
    issue_list := array_append(issue_list, 'Error validating import readiness: ' || SQLERRM);
    RETURN QUERY SELECT 
      false,
      0,
      0,
      issue_list;
END;
$$;

-- Fix calculate_trail_quality_score with proper search path and error handling
CREATE OR REPLACE FUNCTION public.calculate_trail_quality_score(
  trail_name text, 
  trail_description text, 
  trail_length numeric, 
  trail_elevation integer, 
  trail_lat double precision, 
  trail_lon double precision
)
RETURNS numeric
LANGUAGE plpgsql
IMMUTABLE SET search_path = public, pg_temp
AS $$
DECLARE
  score NUMERIC := 1.00;
BEGIN
  -- Validate inputs
  IF trail_name IS NULL THEN
    RETURN 0.00;
  END IF;
  
  -- Deduct points for missing or poor quality data
  IF LENGTH(trail_name) < 3 THEN
    score := score - 0.20;
  END IF;
  
  IF trail_description IS NULL OR LENGTH(trail_description) < 10 THEN
    score := score - 0.15;
  END IF;
  
  IF trail_length IS NULL OR trail_length <= 0 THEN
    score := score - 0.25;
  END IF;
  
  IF trail_elevation IS NULL THEN
    score := score - 0.10;
  END IF;
  
  IF trail_lat IS NULL OR trail_lon IS NULL OR 
     trail_lat = 0 OR trail_lon = 0 OR
     ABS(trail_lat) > 90 OR ABS(trail_lon) > 180 THEN
    score := score - 0.30;
  END IF;
  
  -- Ensure score doesn't go below 0
  RETURN GREATEST(score, 0.00);
EXCEPTION
  WHEN OTHERS THEN
    -- Log error and return minimal score
    RAISE WARNING 'Error calculating trail quality score for %: %', trail_name, SQLERRM;
    RETURN 0.00;
END;
$$;

-- Fix get_trail_preview with proper search path
CREATE OR REPLACE FUNCTION public.get_trail_preview(p_id uuid)
RETURNS SETOF v_trail_preview
LANGUAGE sql
STABLE SET search_path = public, pg_temp
AS $$
  SELECT * FROM public.v_trail_preview WHERE id = p_id;
$$;

-- Create comprehensive error logging function
CREATE OR REPLACE FUNCTION public.log_security_error(
  error_type text,
  error_message text,
  context_data jsonb DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public, pg_temp
AS $$
BEGIN
  -- Insert into security audit log if it exists
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'security_audit_log'
  ) THEN
    INSERT INTO public.security_audit_log (
      event_type,
      event_data,
      user_id,
      created_at
    ) VALUES (
      'security_error',
      jsonb_build_object(
        'error_type', error_type,
        'error_message', error_message,
        'context', context_data,
        'timestamp', NOW()
      ),
      auth.uid(),
      NOW()
    );
  END IF;
  
  -- Always log to PostgreSQL log as well
  RAISE WARNING 'Security Error [%]: % Context: %', 
    error_type, error_message, COALESCE(context_data::text, 'none');
EXCEPTION
  WHEN OTHERS THEN
    -- Fallback logging - don't let logging errors break the application
    RAISE WARNING 'Failed to log security error: %', SQLERRM;
END;
$$;

-- Create function to validate user permissions safely
CREATE OR REPLACE FUNCTION public.check_user_permission(
  required_permission text,
  resource_id uuid DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
  current_user_id uuid;
  user_is_admin boolean := false;
BEGIN
  -- Get current user ID
  current_user_id := auth.uid();
  
  -- Check if user is authenticated
  IF current_user_id IS NULL THEN
    PERFORM public.log_security_error(
      'authentication_required',
      'User not authenticated for permission check',
      jsonb_build_object('permission', required_permission, 'resource_id', resource_id)
    );
    RETURN false;
  END IF;
  
  -- Check if user is admin (covers all permissions)
  SELECT public.is_admin() INTO user_is_admin;
  
  IF user_is_admin THEN
    RETURN true;
  END IF;
  
  -- Check specific permissions based on type
  CASE required_permission
    WHEN 'admin' THEN
      RETURN false; -- Already checked above
    WHEN 'authenticated' THEN
      RETURN true; -- Already checked above
    WHEN 'own_data' THEN
      -- Additional logic for own data access could go here
      RETURN current_user_id IS NOT NULL;
    ELSE
      PERFORM public.log_security_error(
        'unknown_permission',
        'Unknown permission type requested',
        jsonb_build_object('permission', required_permission, 'user_id', current_user_id)
      );
      RETURN false;
  END CASE;
  
EXCEPTION
  WHEN OTHERS THEN
    PERFORM public.log_security_error(
      'permission_check_error',
      SQLERRM,
      jsonb_build_object(
        'permission', required_permission, 
        'resource_id', resource_id,
        'user_id', current_user_id
      )
    );
    RETURN false;
END;
$$;