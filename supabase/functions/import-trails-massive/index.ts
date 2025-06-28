
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "./cors.ts";
import { createTestTrail, generateTrailsForSource } from "./trail-generator.ts";
import { processBatch, type BatchResult } from "./batch-processor.ts";
import { parseAndValidateRequest, validateImportRequest, getLocationInfo } from "./request-handler.ts";
import { createBulkImportJob, updateBulkImportJob } from "./job-manager.ts";
import { buildSuccessResponse, buildErrorResponse } from "./response-builder.ts";
import type { ImportRequest, SourceResult } from "./types.ts";

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
    
    // Parse and validate request
    const request = await parseAndValidateRequest(req);
    const validation = validateImportRequest(request);
    
    if (!validation.isValid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    const { 
      sources, 
      maxTrailsPerSource, 
      batchSize = 15,
      concurrency = 1,
      priority = 'normal',
      target = '30K',
      debug = false,
      validation: validationMode = false,
      location
    } = request;
    
    const { isLocationSpecific, locationName } = getLocationInfo(location);
    
    console.log(`🎯 Starting ${target} trail import${isLocationSpecific ? ` for ${locationName}` : ''} with validated schema`);
    console.log(`📊 Configuration: ${sources.length} sources, ${maxTrailsPerSource} trails per source, batch size: ${batchSize}`);
    
    if (location) {
      console.log(`📍 Location targeting: ${location.lat}, ${location.lng} within ${location.radius} miles`);
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
    const bulkJob = await createBulkImportJob(supabase, sources, maxTrailsPerSource, locationName);
    
    // Process all sources
    let totalAdded = 0;
    let totalFailed = 0;
    let totalProcessed = 0;
    let allInsertErrors: string[] = [];
    
    const sourceResults: SourceResult[] = [];
    
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
    const finalStatus = await updateBulkImportJob(supabase, bulkJob.id, totalProcessed, totalAdded, totalFailed);
    const successRate = totalProcessed > 0 ? Math.round((totalAdded / totalProcessed) * 100) : 0;
    
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
    
    const responseData = buildSuccessResponse(
      bulkJob,
      target,
      locationName,
      totalProcessed,
      totalAdded,
      totalFailed,
      sourceResults,
      allInsertErrors,
      finalCount,
      isLocationSpecific,
      finalStatus
    );
    
    return new Response(
      JSON.stringify(responseData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('💥 Massive import error:', error);
    
    const errorResponse = buildErrorResponse(error);
    
    return new Response(
      JSON.stringify(errorResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
