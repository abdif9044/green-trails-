
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "./cors.ts";
import { createTestTrail, generateTrailsForSource } from "./trail-generator.ts";
import { processBatch, type BatchResult } from "./batch-processor.ts";

interface ImportRequest {
  sources: string[];
  maxTrailsPerSource: number;
  batchSize?: number;
  concurrency?: number;
  priority?: string;
  target?: string;
  debug?: boolean;
  validation?: boolean;
  location?: {
    lat: number;
    lng: number;
    radius: number;
    city?: string;
    state?: string;
  };
}

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
    
    const { 
      sources, 
      maxTrailsPerSource, 
      batchSize = 15,
      concurrency = 1,
      priority = 'normal',
      target = '30K',
      debug = false,
      validation = false,
      location
    } = await req.json() as ImportRequest;
    
    const isLocationSpecific = !!location;
    const locationName = location ? `${location.city || 'Location'}, ${location.state || 'Area'}` : 'General';
    
    console.log(`🎯 Starting ${target} trail import${isLocationSpecific ? ` for ${locationName}` : ''} with validated schema`);
    console.log(`📊 Configuration: ${sources.length} sources, ${maxTrailsPerSource} trails per source, batch size: ${batchSize}`);
    
    if (location) {
      console.log(`📍 Location targeting: ${location.lat}, ${location.lng} within ${location.radius} miles`);
    }
    
    if (!sources || sources.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No sources specified for import' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Test single insert with proper schema validation
    console.log('🧪 Testing single trail insert with FIXED schema...');
    const testTrail = createTestTrail(location);
    
    const { data: testData, error: testError } = await supabase
      .from('trails')
      .insert([testTrail])
      .select('id');
    
    if (testError) {
      console.error('❌ Schema test FAILED:', {
        code: testError.code,
        message: testError.message,
        details: testError.details,
        hint: testError.hint,
        testTrail: testTrail
      });
      return new Response(
        JSON.stringify({ 
          error: 'Schema validation failed', 
          details: testError.message,
          code: testError.code,
          hint: testError.hint,
          schema_test: 'failed'
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
    
    console.log(`✅ Created bulk job ${bulkJob.id} for ${locationName} with FIXED SCHEMA`);
    
    // Process all sources
    let totalAdded = 0;
    let totalFailed = 0;
    let totalProcessed = 0;
    let allInsertErrors: string[] = [];
    
    const sourceResults = [];
    
    for (const sourceType of sources) {
      try {
        console.log(`🚀 Processing source: ${sourceType} for ${locationName}`);
        
        // Generate location-specific trails for this source
        const trails = generateTrailsForSource(sourceType, maxTrailsPerSource, location);
        totalProcessed += trails.length;
        
        console.log(`📋 Generated ${trails.length} trails for ${sourceType} near ${locationName}`);
        
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
            batchIndex,
            location
          );
          
          sourceAddedCount += result.addedCount;
          sourceFailedCount += result.failedCount;
          sourceInsertErrors.push(...result.insertErrors);
          
          // Small delay between batches
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        totalAdded += sourceAddedCount;
        totalFailed += sourceFailedCount;
        allInsertErrors.push(...sourceInsertErrors);
        
        sourceResults.push({
          source: sourceType,
          success: sourceAddedCount > 0,
          trails_added: sourceAddedCount,
          trails_failed: sourceFailedCount,
          trails_processed: trails.length,
          success_rate: trails.length > 0 ? Math.round((sourceAddedCount / trails.length) * 100) : 0,
          error_details: sourceFailedCount > 0 ? sourceInsertErrors.slice(-3) : [],
          location: locationName
        });
        
        console.log(`✅ ${sourceType} COMPLETE for ${locationName}: ${sourceAddedCount} added, ${sourceFailedCount} failed (${Math.round((sourceAddedCount/trails.length)*100)}% success)`);
        
      } catch (sourceError) {
        console.error(`💥 Source processing failed for ${sourceType}:`, sourceError);
        const errorMsg = sourceError instanceof Error ? sourceError.message : 'Unknown error';
        allInsertErrors.push(`${sourceType}: ${errorMsg}`);
        totalFailed += maxTrailsPerSource;
        
        sourceResults.push({
          source: sourceType,
          success: false,
          error: errorMsg,
          trails_added: 0,
          trails_failed: maxTrailsPerSource,
          trails_processed: 0,
          success_rate: 0,
          location: locationName
        });
      }
    }
    
    // Update bulk job with final results
    const finalStatus = totalAdded > 0 ? 'completed' : 'error';
    const successRate = totalProcessed > 0 ? Math.round((totalAdded / totalProcessed) * 100) : 0;
    
    const { error: updateError } = await supabase
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
      
    if (updateError) {
      console.error('Error updating bulk job:', updateError);
    }
    
    // Verify the final count in the database
    const { count: finalCount } = await supabase
      .from('trails')
      .select('*', { count: 'exact', head: true });
    
    console.log(`🎉 ${target} Import COMPLETE for ${locationName}!`);
    console.log(`📊 Final Results: ${totalAdded} added, ${totalFailed} failed, ${totalProcessed} processed`);
    console.log(`📈 Success rate: ${successRate}%`);
    console.log(`🗄️ Total trails now in database: ${finalCount}`);
    
    if (allInsertErrors.length > 0) {
      console.error(`💥 Insert errors encountered:`, allInsertErrors.slice(-5));
    }
    
    return new Response(
      JSON.stringify({
        job_id: bulkJob.id,
        status: finalStatus,
        target: target,
        location: locationName,
        total_processed: totalProcessed,
        total_added: totalAdded,
        total_updated: 0,
        total_failed: totalFailed,
        success_rate: successRate,
        source_results: sourceResults,
        service_role_used: true,
        insert_errors: allInsertErrors.slice(-5),
        final_database_count: finalCount,
        schema_fixes_applied: true,
        location_targeting: isLocationSpecific,
        message: `${target} import completed for ${locationName}: ${totalAdded} trails added with ${successRate}% success rate using LOCATION-AWARE SCHEMA`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('💥 Massive import error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Massive import failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        target: '30K',
        service_role_configured: !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
        schema_fixes_applied: true
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
