
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'
import { corsHeaders } from './utils/cors.ts'
import { Database } from '../import-trails/types.ts'

// Create a Supabase client with the Auth context of the logged in user.
const createServiceClient = () => {
  return createClient<Database>(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the action from the request body
    const { action } = await req.json()
    
    if (action !== 'create') {
      return new Response(
        JSON.stringify({ error: 'Invalid action specified' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Create the indexes using SQL
    const supabase = createServiceClient()
    
    // SQL statements from the create_database_indexes.sql file
    const indexCreationSQL = `
      -- Create optimization indexes for large-scale trail data
      -- These will improve query performance for filtering and searching with 50,000+ trails

      -- Primary geographic index for trails
      CREATE INDEX IF NOT EXISTS idx_trails_location ON public.trails USING gist (
        ST_Transform(
          ST_SetSRID(
            ST_MakePoint(longitude, latitude),
            4326
          ),
          3857
        )
      ) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

      -- Indexes for common filter combinations
      CREATE INDEX IF NOT EXISTS idx_trails_country_state ON public.trails(country, state_province);
      CREATE INDEX IF NOT EXISTS idx_trails_difficulty ON public.trails(difficulty);
      CREATE INDEX IF NOT EXISTS idx_trails_length ON public.trails(length);
      CREATE INDEX IF NOT EXISTS idx_trails_is_age_restricted ON public.trails(is_age_restricted);

      -- Full text search index for trail names and descriptions
      CREATE EXTENSION IF NOT EXISTS pg_trgm;

      CREATE INDEX IF NOT EXISTS idx_trails_name_trgm ON public.trails USING gin (name gin_trgm_ops);
      CREATE INDEX IF NOT EXISTS idx_trails_description_trgm ON public.trails USING gin (description gin_trgm_ops) 
      WHERE description IS NOT NULL;

      -- Optimization for source-based queries
      CREATE INDEX IF NOT EXISTS idx_trails_source_source_id ON public.trails(source, source_id);
      CREATE INDEX IF NOT EXISTS idx_trails_last_updated ON public.trails(last_updated);

      -- Indexes for trail tags and relationships
      CREATE INDEX IF NOT EXISTS idx_trail_tags_is_strain_tag ON public.trail_tags(is_strain_tag);
      CREATE INDEX IF NOT EXISTS idx_tags_tag_type ON public.tags(tag_type);
      CREATE INDEX IF NOT EXISTS idx_tags_name_trgm ON public.tags USING gin (name gin_trgm_ops);

      -- Indexes for performance with large data for import jobs
      CREATE INDEX IF NOT EXISTS idx_import_jobs_source_id ON public.trail_import_jobs(source_id);
      CREATE INDEX IF NOT EXISTS idx_import_jobs_status ON public.trail_import_jobs(status);
      CREATE INDEX IF NOT EXISTS idx_import_jobs_bulk_job_id ON public.trail_import_jobs(bulk_job_id) 
      WHERE bulk_job_id IS NOT NULL;

      -- Indexes for improved bulk job queries
      CREATE INDEX IF NOT EXISTS idx_bulk_import_jobs_status ON public.bulk_import_jobs(status);
      CREATE INDEX IF NOT EXISTS idx_bulk_import_jobs_started_at ON public.bulk_import_jobs(started_at);
    `
    
    // Execute the SQL as a postgres function
    const { error } = await supabase.rpc('execute_sql', { sql_query: indexCreationSQL })
    
    if (error) {
      console.error('Error creating database indexes:', error)
      throw error
    }

    return new Response(
      JSON.stringify({ message: 'Database indexes created successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
