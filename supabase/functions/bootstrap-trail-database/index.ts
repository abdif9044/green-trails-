
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
    
    console.log('🔍 Checking trail database status for immediate 10K trail import...');
    
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
    
    // Target: 10,000 trails immediately (reduced for quick success)
    const TARGET_TRAILS = 10000;
    
    if (currentTrailCount >= TARGET_TRAILS) {
      console.log('✅ Database already has sufficient trails for 10K target');
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Database already populated with 10K+ trails',
          current_count: currentTrailCount,
          target_count: TARGET_TRAILS,
          action: 'none'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('🚀 Starting immediate 10K trail import...');
    
    // Check for active jobs
    const { data: activeJobs, error: jobError } = await supabase
      .from('bulk_import_jobs')
      .select('*')
      .eq('status', 'processing')
      .order('started_at', { ascending: false })
      .limit(1);
      
    if (jobError) {
      console.error('Error checking active jobs:', jobError);
    }
    
    if (activeJobs && activeJobs.length > 0) {
      console.log('⏳ Import already in progress');
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Import already in progress',
          current_count: currentTrailCount,
          target_count: TARGET_TRAILS,
          action: 'existing_import',
          job_id: activeJobs[0].id
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Start focused 10K import with implemented sources only
    console.log('📥 Starting 10K trail import with verified sources...');
    
    const { data: importResult, error: importError } = await supabase.functions.invoke('import-trails-massive', {
      body: {
        sources: ['hiking_project', 'openstreetmap', 'usgs'], // Only implemented sources
        maxTrailsPerSource: 3334, // ~10K total across 3 sources
        batchSize: 50, // Smaller batches for reliability
        concurrency: 1, // Single thread for debugging
        priority: 'immediate',
        target: '10K',
        debug: true,
        validation: true // Enable extra validation
      }
    });
    
    if (importError) {
      console.error('Error starting 10K trail import:', importError);
      throw importError;
    }
    
    console.log('✅ 10K trail import started successfully:', importResult);
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Immediate 10K trail import started',
        current_count: currentTrailCount,
        target_count: TARGET_TRAILS,
        action: 'import_started',
        job_id: importResult.job_id,
        estimated_completion: '10-15 minutes',
        debug_enabled: true,
        sources_used: 3,
        strategy: 'immediate_10k'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Bootstrap function error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Bootstrap failed', 
        details: error.message,
        strategy: 'immediate_10k_failed'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
