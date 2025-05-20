
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Define CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Parse request parameters
    const { maxSources = 5, daysToRefresh = 7, secretKey } = await req.json();
    
    // Verify the secret key to ensure this is only called by authorized systems
    const expectedKey = Deno.env.get('SCHEDULER_SECRET_KEY');
    if (secretKey !== expectedKey) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized access' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }
    
    console.log(`Looking for sources to refresh that are older than ${daysToRefresh} days`);
    
    // Calculate cutoff date for refresh
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToRefresh);
    
    // Find sources that need refreshing (haven't been updated in daysToRefresh days)
    const { data: sourcesToRefresh, error: sourcesError } = await supabase
      .from('trail_data_sources')
      .select('id, name, source_type')
      .or(`last_synced.is.null,last_synced.lt.${cutoffDate.toISOString()}`)
      .eq('is_active', true)
      .order('last_synced', { ascending: true })
      .limit(maxSources);
      
    if (sourcesError) {
      console.error('Error fetching sources to refresh:', sourcesError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch sources', details: sourcesError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    if (!sourcesToRefresh || sourcesToRefresh.length === 0) {
      console.log('No sources need refreshing at this time');
      return new Response(
        JSON.stringify({ message: 'No sources need refreshing' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Found ${sourcesToRefresh.length} sources to refresh`);
    
    // Create a new bulk import job
    const { data: bulkJob, error: bulkJobError } = await supabase
      .from('bulk_import_jobs')
      .insert([{
        status: 'queued',
        started_at: new Date().toISOString(),
        total_trails_requested: 10000, // Default number of trails to request
        total_sources: sourcesToRefresh.length,
        trails_processed: 0,
        trails_added: 0,
        trails_updated: 0,
        trails_failed: 0
      }])
      .select('*')
      .single();
      
    if (bulkJobError || !bulkJob) {
      console.error('Error creating bulk import job:', bulkJobError);
      return new Response(
        JSON.stringify({ error: 'Failed to create bulk job', details: bulkJobError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    // Start the bulk import process
    const sourceIds = sourcesToRefresh.map(source => source.id);
    
    const response = await supabase.functions.invoke('bulk-import-trails-optimized', {
      body: { 
        sourceIds,
        totalTrails: 10000,
        batchSize: 2500,
        concurrency: 3,
        isScheduled: true
      }
    });
    
    if (response.error) {
      console.error('Error starting bulk import:', response.error);
      return new Response(
        JSON.stringify({ error: 'Failed to start bulk import', details: response.error }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    return new Response(
      JSON.stringify({
        message: 'Scheduled refresh started successfully',
        refreshed_sources: sourcesToRefresh.map(s => s.name),
        job_id: bulkJob.id,
        details: response.data
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Unexpected error:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
