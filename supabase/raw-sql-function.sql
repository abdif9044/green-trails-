
-- This is a helper function to execute raw SQL queries since type definitions
-- aren't updated with our new tables yet
CREATE OR REPLACE FUNCTION execute_sql(sql_query TEXT)
RETURNS SETOF json AS $$
BEGIN
  RETURN QUERY EXECUTE sql_query;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
