
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('🔍 Checking trail database status...');
    
    // Check current trail count
    const { count, error: countError } = await supabase
      .from('trails')
      .select('*', { count: 'exact', head: true });
      
    if (countError) {
      console.error('Error checking trail count:', countError);
      throw countError;
    }
    
    const currentTrailCount = count || 0;
    console.log(`📊 Current trail count: ${currentTrailCount}`);
    
    // Only trigger import if we have fewer than 1000 trails
    if (currentTrailCount >= 1000) {
      console.log('✅ Database already has sufficient trails, skipping import');
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Database already populated',
          current_count: currentTrailCount,
          action: 'none'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('🚀 Trail count below threshold, starting automatic import...');
    
    // Check if there's already an active bulk import job
    const { data: activeJobs, error: jobError } = await supabase
      .from('bulk_import_jobs')
      .select('*')
      .eq('status', 'processing')
      .order('started_at', { ascending: false })
      .limit(1);
      
    if (jobError) {
      console.error('Error checking active jobs:', jobError);
    }
    
    // If there's already an active job, don't start another
    if (activeJobs && activeJobs.length > 0) {
      console.log('⏳ Import already in progress, skipping new import');
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Import already in progress',
          current_count: currentTrailCount,
          action: 'existing_import',
          job_id: activeJobs[0].id
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Start the massive import by calling the existing import function
    console.log('📥 Invoking massive trail import...');
    
    const { data: importResult, error: importError } = await supabase.functions.invoke('import-trails-massive', {
      body: {
        sources: ['hiking_project', 'openstreetmap', 'usgs', 'parks_canada', 'inegi_mexico', 'trails_bc'],
        maxTrailsPerSource: 2500, // 15,000 total across 6 sources
        batchSize: 200,
        concurrency: 3,
        priority: 'bootstrap'
      }
    });
    
    if (importError) {
      console.error('Error starting massive import:', importError);
      throw importError;
    }
    
    console.log('✅ Bootstrap import started successfully:', importResult);
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Automatic trail import started',
        current_count: currentTrailCount,
        action: 'import_started',
        job_id: importResult.job_id,
        target_trails: 15000
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Bootstrap function error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Bootstrap failed', 
        details: error.message 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
