
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "./cors.ts";
import { createTestTrail, generateTrailsForSource } from "./trail-generator.ts";
import { processBatch, type BatchResult } from "./batch-processor.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    if (!supabaseServiceKey) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY not found in environment');
    }
    
    // Use SERVICE ROLE KEY to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    console.log('🔑 Using service role for trail imports to bypass RLS');
    
    // Parse request with defaults for immediate execution
    let requestBody;
    try {
      requestBody = await req.json();
    } catch {
      requestBody = {};
    }
    
    const { 
      sources = ['hiking_project', 'openstreetmap'], 
      maxTrailsPerSource = 2500,
      batchSize = 25,
      target = '5K Trails Quick Start'
    } = requestBody;
    
    console.log(`🎯 Starting ${target} import with FIXED SCHEMA`);
    console.log(`📊 Configuration: ${sources.length} sources, ${maxTrailsPerSource} trails per source, batch size: ${batchSize}`);
    
    // Test single insert with proper schema validation
    console.log('🧪 Testing single trail insert with FIXED schema...');
    const testTrail = createTestTrail();
    
    const { data: testData, error: testError } = await supabase
      .from('trails')
      .insert([testTrail])
      .select('id');
    
    if (testError) {
      console.error('❌ Schema test FAILED:', {
        code: testError.code,
        message: testError.message,
        details: testError.details,
        hint: testError.hint
      });
      return new Response(
        JSON.stringify({ 
          error: 'Schema validation failed', 
          details: testError.message,
          code: testError.code,
          hint: testError.hint
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    } else {
      console.log('✅ Schema test PASSED:', testData);
      
      // Clean up test trail
      await supabase.from('trails').delete().eq('id', testTrail.id);
    }
    
    // Create bulk import job
    const { data: bulkJob, error: bulkJobError } = await supabase
      .from('bulk_import_jobs')
      .insert([{
        status: 'processing',
        started_at: new Date().toISOString(),
        total_trails_requested: sources.length * maxTrailsPerSource,
        total_sources: sources.length,
        trails_processed: 0,
        trails_added: 0,
        trails_updated: 0,
        trails_failed: 0
      }])
      .select('*')
      .single();
    
    if (bulkJobError) {
      console.error('Failed to create bulk import job:', bulkJobError);
      throw new Error(`Failed to create bulk import job: ${bulkJobError.message}`);
    }
    
    console.log(`✅ Created bulk job ${bulkJob.id} with FIXED SCHEMA`);
    
    // Process all sources
    let totalAdded = 0;
    let totalFailed = 0;
    let totalProcessed = 0;
    let allInsertErrors: string[] = [];
    
    for (const sourceType of sources) {
      try {
        console.log(`🚀 Processing source: ${sourceType}`);
        
        // Generate trails for this source
        const trails = generateTrailsForSource(sourceType, maxTrailsPerSource);
        totalProcessed += trails.length;
        
        console.log(`📋 Generated ${trails.length} trails for ${sourceType}`);
        
        // Process trails in batches
        let sourceAddedCount = 0;
        let sourceFailedCount = 0;
        let sourceInsertErrors: string[] = [];
        
        for (let i = 0; i < trails.length; i += batchSize) {
          const batch = trails.slice(i, i + batchSize);
          const batchIndex = Math.floor(i / batchSize);
          
          const result: BatchResult = await processBatch(
            supabase,
            batch,
            sourceType,
            batchIndex
          );
          
          sourceAddedCount += result.addedCount;
          sourceFailedCount += result.failedCount;
          sourceInsertErrors.push(...result.insertErrors);
          
          // Small delay between batches to prevent overwhelming DB
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        totalAdded += sourceAddedCount;
        totalFailed += sourceFailedCount;
        allInsertErrors.push(...sourceInsertErrors);
        
        console.log(`✅ ${sourceType} COMPLETE: ${sourceAddedCount} added, ${sourceFailedCount} failed (${Math.round((sourceAddedCount/trails.length)*100)}% success)`);
        
      } catch (sourceError) {
        console.error(`💥 Source processing failed for ${sourceType}:`, sourceError);
        const errorMsg = sourceError instanceof Error ? sourceError.message : 'Unknown error';
        allInsertErrors.push(`${sourceType}: ${errorMsg}`);
        totalFailed += maxTrailsPerSource;
      }
    }
    
    // Update bulk job with final results
    const finalStatus = totalAdded > 0 ? 'completed' : 'error';
    await supabase
      .from('bulk_import_jobs')
      .update({
        status: finalStatus,
        completed_at: new Date().toISOString(),
        trails_processed: totalProcessed,
        trails_added: totalAdded,
        trails_updated: 0,
        trails_failed: totalFailed
      })
      .eq('id', bulkJob.id);
    
    // Verify the final count in the database
    const { count: finalCount } = await supabase
      .from('trails')
      .select('*', { count: 'exact', head: true });
    
    console.log(`🎉 ${target} Import COMPLETE!`);
    console.log(`📊 Final Results: ${totalAdded} added, ${totalFailed} failed, ${totalProcessed} processed`);
    console.log(`📈 Success rate: ${totalProcessed > 0 ? Math.round((totalAdded / totalProcessed) * 100) : 0}%`);
    console.log(`🗄️ Total trails now in database: ${finalCount}`);
    
    if (allInsertErrors.length > 0) {
      console.error(`💥 Insert errors encountered:`, allInsertErrors.slice(-10));
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        job_id: bulkJob.id,
        trails_added: totalAdded,
        trails_failed: totalFailed,
        trails_processed: totalProcessed,
        success_rate: totalProcessed > 0 ? Math.round((totalAdded / totalProcessed) * 100) : 0,
        total_trails_in_db: finalCount,
        target: target,
        status: finalStatus,
        errors: allInsertErrors.slice(-5) // Include last 5 errors for debugging
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('💥 Massive import error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Internal Server Error', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
