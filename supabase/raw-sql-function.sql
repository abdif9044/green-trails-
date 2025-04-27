
-- This is a helper function to execute raw SQL queries since type definitions
-- aren't updated with our new tables yet
CREATE OR REPLACE FUNCTION execute_sql(sql_query TEXT, params JSONB DEFAULT '[]')
RETURNS SETOF json AS $$
DECLARE
  param_value TEXT;
  i INTEGER := 0;
  modified_query TEXT := sql_query;
BEGIN
  -- Replace $1, $2, etc. with actual values from params
  IF params IS NOT NULL AND jsonb_array_length(params) > 0 THEN
    FOR i IN 0..jsonb_array_length(params) - 1 LOOP
      param_value := params->i;
      modified_query := regexp_replace(modified_query, 
                                      '\$' || (i + 1)::text, 
                                      quote_literal(param_value::text), 
                                      'g');
    END LOOP;
  END IF;
  
  -- Execute the modified query
  RETURN QUERY EXECUTE modified_query;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
