
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, handleCorsOptions } from './cors.ts';
import { ImportConfig } from './types.ts';
import { validateTrail } from './validation.ts';
import { generateTrails } from './trail-generator.ts';
import { createBulkJob, updateJobProgress, finalizeJob } from './job-manager.ts';
import { processBatch } from './batch-processor.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return handleCorsOptions();
  }
  
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    if (!supabaseServiceKey) {
      throw new Error('Service role key not configured');
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });
    
    console.log('🛡️ BULLETPROOF TRAIL IMPORT - Starting with service role');
    
    const requestBody = await req.json();
    const config: ImportConfig = { 
      testMode: requestBody.testMode || false, 
      maxTrails: requestBody.maxTrails || 1000, 
      batchSize: requestBody.batchSize || 50,
      parallelWorkers: requestBody.parallelWorkers || 1,
      validateFirst: requestBody.validateFirst || true
    };
    
    console.log(`🎯 Configuration: testMode=${config.testMode}, maxTrails=${config.maxTrails}, batchSize=${config.batchSize}`);
    
    // Create bulk import job
    const bulkJob = await createBulkJob(supabase, config);
    console.log(`✅ Created bulletproof job: ${bulkJob.id}`);
    
    // Generate bulletproof trail data
    const trails = generateTrails(config.maxTrails);
    console.log(`📋 Generated ${trails.length} bulletproof trails`);
    
    // Validate all trails first if requested
    if (config.validateFirst) {
      console.log('🔍 Pre-validating all trail data...');
      for (const trail of trails) {
        const validation = validateTrail(trail);
        if (!validation.isValid) {
          throw new Error(`Validation failed for trail ${trail.name}: ${validation.errors.join(', ')}`);
        }
      }
      console.log('✅ All trails passed pre-validation');
    }
    
    // Process in batches with bulletproof error handling
    let totalAdded = 0;
    let totalFailed = 0;
    
    for (let i = 0; i < trails.length; i += config.batchSize) {
      const batch = trails.slice(i, i + config.batchSize);
      const batchNumber = Math.floor(i / config.batchSize) + 1;
      const totalBatches = Math.ceil(trails.length / config.batchSize);
      
      const result = await processBatch(supabase, batch, batchNumber, totalBatches);
      totalAdded += result.added;
      totalFailed += result.failed;
      
      // Update progress
      await updateJobProgress(
        supabase, 
        bulkJob.id, 
        Math.min(i + config.batchSize, trails.length),
        totalAdded,
        totalFailed
      );
      
      // Small delay to prevent overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Final job update
    await finalizeJob(supabase, bulkJob.id, trails.length, totalAdded, totalFailed, config.testMode);
    
    // Verify final count
    const { count: finalCount } = await supabase
      .from('trails')
      .select('*', { count: 'exact', head: true });
    
    console.log(`🎉 BULLETPROOF IMPORT COMPLETE!`);
    console.log(`📊 Results: ${totalAdded} added, ${totalFailed} failed, ${trails.length} processed`);
    console.log(`🗄️ Total trails in database: ${finalCount}`);
    
    return new Response(
      JSON.stringify({
        success: true,
        job_id: bulkJob.id,
        trails_added: totalAdded,
        trails_failed: totalFailed,
        trails_processed: trails.length,
        total_in_database: finalCount,
        test_mode: config.testMode,
        bulletproof: true
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('💥 Bulletproof import error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Bulletproof import failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        bulletproof: false
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
