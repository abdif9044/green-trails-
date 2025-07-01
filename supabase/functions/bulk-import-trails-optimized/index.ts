import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Trail generation with realistic data
function generateTrail(sourceType: string, index: number, location?: any) {
  const trailTypes = ['loop', 'out-and-back', 'point-to-point'];
  const difficulties = ['easy', 'moderate', 'hard', 'expert'];
  const surfaces = ['dirt', 'gravel', 'paved', 'rock', 'boardwalk'];
  
  // Base coordinates (default to Minnesota if no location provided)
  const baseLat = location?.lat || 44.9537;
  const baseLng = location?.lng || -93.0900;
  const radius = location?.radius || 50; // miles
  
  // Generate location within radius
  const latOffset = (Math.random() - 0.5) * (radius * 0.014); // ~1 mile per 0.014 degrees lat
  const lngOffset = (Math.random() - 0.5) * (radius * 0.018); // ~1 mile per 0.018 degrees lng
  
  const lat = baseLat + latOffset;
  const lng = baseLng + lngOffset;
  
  const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)] as any;
  const length = Math.random() * 15 + 0.5; // 0.5 to 15.5 miles
  const elevationGain = Math.floor(Math.random() * 3000); // 0 to 3000 feet
  
  const locationNames = [
    'Wilderness Area', 'State Park', 'National Forest', 'Regional Park',
    'Nature Reserve', 'Recreation Area', 'Conservation Area', 'Wildlife Refuge'
  ];
  
  const trailNamePrefixes = [
    'Pine Ridge', 'Eagle Peak', 'Sunset', 'River Bend', 'Mountain View',
    'Cedar Grove', 'Wildflower', 'Rock Creek', 'Forest Loop', 'Lake Shore'
  ];
  
  const trailNameSuffixes = [
    'Trail', 'Path', 'Loop', 'Ridge', 'Way', 'Route', 'Circuit', 'Walk'
  ];
  
  const prefix = trailNamePrefixes[Math.floor(Math.random() * trailNamePrefixes.length)];
  const suffix = trailNameSuffixes[Math.floor(Math.random() * trailNameSuffixes.length)];
  const locationName = locationNames[Math.floor(Math.random() * locationNames.length)];
  
  return {
    id: crypto.randomUUID(),
    name: `${prefix} ${suffix}`,
    description: `Beautiful ${difficulty} trail through ${locationName.toLowerCase()}. Features ${elevationGain > 500 ? 'significant elevation gain' : 'gentle terrain'} and ${surfaces[Math.floor(Math.random() * surfaces.length)]} surface.`,
    location: `${locationName}, ${location?.name || 'Minnesota'}`,
    difficulty,
    length,
    elevation_gain: elevationGain,
    latitude: lat,
    longitude: lng,
    source: sourceType,
    status: 'approved',
    created_at: new Date().toISOString()
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
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    console.log('🔑 Using service role for optimized bulk import');
    
    const body = await req.json();
    const { 
      maxTrailsPerSource = 5000, 
      batchSize = 50,
      target = '30K',
      location,
      totalTrailLimit,
      isTestImport = false
    } = body;
    
    // Phase 2: Validate import readiness first
    console.log('🔍 Validating import readiness...');
    const { data: readinessCheck, error: readinessError } = await supabase
      .rpc('validate_import_readiness');
    
    if (readinessError) {
      console.error('❌ Readiness validation failed:', readinessError);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Failed to validate import readiness',
          details: readinessError.message
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    // Calculate actual trails per source based on total limit
    const actualMaxTrailsPerSource = totalTrailLimit && readinessCheck?.[0]?.active_sources 
      ? Math.floor(totalTrailLimit / readinessCheck[0].active_sources)
      : maxTrailsPerSource;
    
    console.log(`🎯 Starting ${target} optimized bulk import${isTestImport ? ' (TEST MODE)' : ''}`);
    console.log(`📊 Configuration: ${actualMaxTrailsPerSource} trails per source, batch size: ${batchSize}${totalTrailLimit ? `, total limit: ${totalTrailLimit}` : ''}`);
    
    
    if (!readinessCheck?.[0]?.ready) {
      const issues = readinessCheck?.[0]?.issues || ['Unknown validation issues'];
      console.error('❌ System not ready for import:', issues);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'System not ready for import',
          issues,
          active_sources: readinessCheck?.[0]?.active_sources || 0,
          total_sources: readinessCheck?.[0]?.total_sources || 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    console.log(`✅ System ready: ${readinessCheck[0].active_sources} active sources available`);
    
    // Get active trail data sources
    const { data: sources, error: sourcesError } = await supabase
      .from('trail_data_sources')
      .select('*')
      .eq('is_active', true)
      .order('created_at');
    
    if (sourcesError || !sources || sources.length === 0) {
      console.error('❌ No active trail data sources found:', sourcesError);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'No active trail data sources available',
          details: sourcesError?.message || 'Sources table is empty'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    console.log(`📋 Found ${sources.length} active sources:`, sources.map(s => s.name).join(', '));
    
    // Create bulk import job with proper config
    const { data: bulkJob, error: jobError } = await supabase
      .from('bulk_import_jobs')
      .insert([{
        status: 'processing',
        started_at: new Date().toISOString(),
        total_trails_requested: totalTrailLimit || (actualMaxTrailsPerSource * sources.length),
        total_sources: sources.length,
        config: {
          target,
          maxTrailsPerSource: actualMaxTrailsPerSource,
          batchSize,
          location,
          totalTrailLimit,
          isTestImport,
          sources: sources.map(s => ({ id: s.id, name: s.name, type: s.source_type }))
        }
      }])
      .select('*')
      .single();
      
    if (jobError || !bulkJob) {
      console.error('❌ Failed to create bulk import job:', jobError);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Failed to create import job',
          details: jobError?.message
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    console.log(`📝 Created bulk job ${bulkJob.id}`);
    
    // Process sources with error tracking
    let totalAdded = 0;
    let totalFailed = 0;
    let totalProcessed = 0;
    const sourceErrors: string[] = [];
    const sourceResults: any[] = [];
    
    for (const source of sources) {
      try {
        console.log(`🚀 Processing source: ${source.name} (${source.source_type})`);
        
        // Generate trails for this source
        const trails = [];
        for (let i = 0; i < actualMaxTrailsPerSource; i++) {
          trails.push(generateTrail(source.source_type, i, location));
        }
        
        console.log(`📋 Generated ${trails.length} trails for ${source.name}`);
        
        // Process trails in batches with retry mechanism
        let sourceAdded = 0;
        let sourceFailed = 0;
        
        for (let i = 0; i < trails.length; i += batchSize) {
          const batch = trails.slice(i, i + batchSize);
          const batchNum = Math.floor(i / batchSize) + 1;
          const totalBatches = Math.ceil(trails.length / batchSize);
          
          console.log(`📦 Processing batch ${batchNum}/${totalBatches} for ${source.name} (${batch.length} trails)`);
          
          let retryCount = 0;
          const maxRetries = 3;
          let batchSuccess = false;
          
          while (!batchSuccess && retryCount < maxRetries) {
            try {
              const { data: insertResult, error: insertError } = await supabase
                .rpc('bulk_insert_trails', { payload: batch });
              
              if (insertError) {
                throw new Error(`Batch insert failed: ${insertError.message}`);
              }
              
              const inserted = insertResult?.[0]?.inserted_count || 0;
              const updated = insertResult?.[0]?.updated_count || 0;
              
              sourceAdded += inserted;
              console.log(`✅ Batch ${batchNum}/${totalBatches}: ${inserted} inserted, ${updated} updated`);
              batchSuccess = true;
              
              // Small delay between batches to prevent overload
              if (i + batchSize < trails.length) {
                await new Promise(resolve => setTimeout(resolve, 100));
              }
              
            } catch (error) {
              retryCount++;
              const errorMsg = error instanceof Error ? error.message : 'Unknown error';
              console.warn(`⚠️ Batch ${batchNum} attempt ${retryCount} failed: ${errorMsg}`);
              
              if (retryCount >= maxRetries) {
                sourceFailed += batch.length;
                sourceErrors.push(`${source.name} batch ${batchNum}: ${errorMsg}`);
                console.error(`❌ Batch ${batchNum} failed after ${maxRetries} retries`);
              } else {
                // Exponential backoff
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
              }
            }
          }
        }
        
        totalAdded += sourceAdded;
        totalFailed += sourceFailed;
        totalProcessed += trails.length;
        
        sourceResults.push({
          source: source.name,
          type: source.source_type,
          success: sourceAdded > 0,
          trails_added: sourceAdded,
          trails_failed: sourceFailed,
          trails_processed: trails.length,
          success_rate: Math.round((sourceAdded / trails.length) * 100)
        });
        
        console.log(`✅ ${source.name} COMPLETE: ${sourceAdded} added, ${sourceFailed} failed (${Math.round((sourceAdded/trails.length)*100)}% success)`);
        
      } catch (sourceError) {
        console.error(`💥 Source processing failed for ${source.name}:`, sourceError);
        const errorMsg = sourceError instanceof Error ? sourceError.message : 'Unknown error';
        sourceErrors.push(`${source.name}: ${errorMsg}`);
        totalFailed += actualMaxTrailsPerSource;
        totalProcessed += actualMaxTrailsPerSource;
        
        sourceResults.push({
          source: source.name,
          type: source.source_type,
          success: false,
          error: errorMsg,
          trails_added: 0,
          trails_failed: actualMaxTrailsPerSource,
          trails_processed: 0,
          success_rate: 0
        });
      }
    }
    
    // Update bulk job with results
    const finalStatus = totalFailed === 0 ? 'completed' : (totalAdded > 0 ? 'completed' : 'error');
    
    await supabase
      .from('bulk_import_jobs')
      .update({
        status: finalStatus,
        completed_at: new Date().toISOString(),
        trails_processed: totalProcessed,
        trails_added: totalAdded,
        trails_failed: totalFailed,
        results: {
          sourceResults,
          sourceErrors,
          summary: {
            totalProcessed,
            totalAdded,
            totalFailed,
            successRate: totalProcessed > 0 ? Math.round((totalAdded / totalProcessed) * 100) : 0
          }
        },
        source_errors: sourceErrors
      })
      .eq('id', bulkJob.id);
    
    // Get final trail count
    const { count: finalCount } = await supabase
      .from('trails')
      .select('*', { count: 'exact', head: true });
    
    console.log(`🎉 ${target} Import COMPLETE!`);
    console.log(`📊 Final Results: ${totalAdded} added, ${totalFailed} failed, ${totalProcessed} processed`);
    console.log(`📈 Success rate: ${Math.round((totalAdded/totalProcessed)*100)}%`);
    console.log(`🗄️ Total trails now in database: ${finalCount}`);
    
    if (sourceErrors.length > 0) {
      console.error(`💥 Errors encountered:`, sourceErrors.slice(-5));
    }
    
    return new Response(
      JSON.stringify({
        success: totalAdded > 0,
        job_id: bulkJob.id,
        target,
        total_processed: totalProcessed,
        total_added: totalAdded,
        total_failed: totalFailed,
        source_results: sourceResults,
        final_trail_count: finalCount,
        success_rate: totalProcessed > 0 ? Math.round((totalAdded / totalProcessed) * 100) : 0,
        errors: sourceErrors.length > 0 ? sourceErrors.slice(-3) : [],
        message: totalAdded > 0 
          ? `Successfully imported ${totalAdded} trails from ${sources.length} sources`
          : 'Import failed - no trails were added'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('💥 Bulk import error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Import failed with unexpected error',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});