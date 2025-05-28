
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
    
    console.log('🔍 Checking trail database status for 30K trail system...');
    
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
    
    // Trigger import if we have fewer than 5000 trails (updated threshold for 30K system)
    if (currentTrailCount >= 5000) {
      console.log('✅ Database already has sufficient trails for 30K system, skipping import');
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Database already populated for 30K system',
          current_count: currentTrailCount,
          target_count: 30000,
          action: 'none'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('🚀 Trail count below threshold, starting automatic 30K trail import...');
    
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
          target_count: 30000,
          action: 'existing_import',
          job_id: activeJobs[0].id
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Start the massive 30K import with only available sources
    console.log('📥 Invoking massive 30K trail import with debug mode...');
    
    const { data: importResult, error: importError } = await supabase.functions.invoke('import-trails-massive', {
      body: {
        sources: ['hiking_project', 'openstreetmap', 'usgs'], // Only use implemented sources
        maxTrailsPerSource: 10000, // 30,000 total across 3 sources
        batchSize: 500, // Smaller batches for better error tracking
        concurrency: 2, // Reduced concurrency for stability
        priority: 'bootstrap',
        debug: true // Enable debug mode
      }
    });
    
    if (importError) {
      console.error('Error starting massive 30K import:', importError);
      throw importError;
    }
    
    console.log('✅ Bootstrap 30K import started successfully:', importResult);
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Automatic 30K trail import started with debug mode',
        current_count: currentTrailCount,
        target_count: 30000,
        action: 'import_started',
        job_id: importResult.job_id,
        estimated_completion: '30-45 minutes',
        debug_enabled: true
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
