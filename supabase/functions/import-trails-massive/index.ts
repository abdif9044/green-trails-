
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "./cors.ts";

interface ImportRequest {
  sources: string[];
  maxTrailsPerSource: number;
  batchSize?: number;
  concurrency?: number;
  priority?: string;
  target?: string;
  debug?: boolean;
  validation?: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { 
      sources, 
      maxTrailsPerSource, 
      batchSize = 50, 
      concurrency = 1,
      priority = 'normal',
      target = '10K',
      debug = false,
      validation = false
    } = await req.json() as ImportRequest;
    
    console.log(`🎯 Starting ${target} trail import with enhanced validation`);
    console.log(`📊 Configuration: ${sources.length} sources, ${maxTrailsPerSource} trails per source`);
    
    if (!sources || sources.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No sources specified for import' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Create bulk import job with enhanced tracking
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
        trails_failed: 0,
        config: {
          sources,
          maxTrailsPerSource,
          batchSize,
          concurrency,
          priority,
          target,
          debug,
          validation
        }
      }])
      .select('*')
      .single();
      
    if (bulkJobError || !bulkJob) {
      console.error('Failed to create bulk import job:', bulkJobError);
      throw new Error('Failed to create bulk import job');
    }
    
    console.log(`✅ Created bulk job ${bulkJob.id} for ${target} import`);
    
    // Validate data sources exist and are active
    const { data: dataSources, error: sourceError } = await supabase
      .from('trail_data_sources')
      .select('*')
      .in('source_type', sources)
      .eq('is_active', true);
      
    if (sourceError) {
      console.error('Error fetching data sources:', sourceError);
      throw sourceError;
    }
    
    if (!dataSources || dataSources.length === 0) {
      console.error('No active data sources found for specified sources');
      throw new Error('No active data sources available');
    }
    
    console.log(`📋 Found ${dataSources.length} active data sources`);
    
    // Start import jobs for each source with enhanced error handling
    const importPromises = dataSources.map(async (source) => {
      try {
        console.log(`🚀 Starting import from ${source.name} (${source.source_type})`);
        
        const { data: importResult, error: importError } = await supabase.functions.invoke('import-trails', {
          body: {
            sourceId: source.id,
            limit: maxTrailsPerSource,
            offset: 0,
            bulkJobId: bulkJob.id,
            validation: validation,
            debug: debug,
            target: target
          }
        });
        
        if (importError) {
          console.error(`❌ Import failed for ${source.name}:`, importError);
          return {
            source: source.source_type,
            success: false,
            error: importError.message,
            trails_added: 0,
            trails_failed: maxTrailsPerSource
          };
        }
        
        console.log(`✅ Import completed for ${source.name}:`, importResult);
        return {
          source: source.source_type,
          success: true,
          trails_added: importResult.trails_added || 0,
          trails_updated: importResult.trails_updated || 0,
          trails_failed: importResult.trails_failed || 0,
          trails_processed: importResult.trails_processed || 0
        };
        
      } catch (error) {
        console.error(`💥 Exception during import for ${source.name}:`, error);
        return {
          source: source.source_type,
          success: false,
          error: error.message,
          trails_added: 0,
          trails_failed: maxTrailsPerSource
        };
      }
    });
    
    // Wait for all imports to complete
    console.log('⏳ Waiting for all import jobs to complete...');
    const results = await Promise.allSettled(importPromises);
    
    // Calculate totals
    let totalAdded = 0;
    let totalUpdated = 0;
    let totalFailed = 0;
    let totalProcessed = 0;
    const sourceResults = [];
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const data = result.value;
        totalAdded += data.trails_added || 0;
        totalUpdated += data.trails_updated || 0;
        totalFailed += data.trails_failed || 0;
        totalProcessed += data.trails_processed || 0;
        sourceResults.push(data);
      } else {
        console.error(`Import ${index} rejected:`, result.reason);
        totalFailed += maxTrailsPerSource;
        sourceResults.push({
          source: `source_${index}`,
          success: false,
          error: result.reason?.message || 'Unknown error',
          trails_added: 0,
          trails_failed: maxTrailsPerSource
        });
      }
    });
    
    // Update bulk job with final results
    const finalStatus = totalAdded > 0 ? 'completed' : 'error';
    const { error: updateError } = await supabase
      .from('bulk_import_jobs')
      .update({
        status: finalStatus,
        completed_at: new Date().toISOString(),
        trails_processed: totalProcessed,
        trails_added: totalAdded,
        trails_updated: totalUpdated,
        trails_failed: totalFailed,
        results: {
          target: target,
          source_results: sourceResults,
          success_rate: totalProcessed > 0 ? (totalAdded / totalProcessed * 100) : 0,
          total_requested: sources.length * maxTrailsPerSource
        }
      })
      .eq('id', bulkJob.id);
      
    if (updateError) {
      console.error('Error updating bulk job:', updateError);
    }
    
    const successRate = totalProcessed > 0 ? Math.round((totalAdded / totalProcessed) * 100) : 0;
    
    console.log(`🎉 ${target} Import Complete!`);
    console.log(`📊 Results: ${totalAdded} added, ${totalUpdated} updated, ${totalFailed} failed`);
    console.log(`📈 Success rate: ${successRate}%`);
    
    return new Response(
      JSON.stringify({
        job_id: bulkJob.id,
        status: finalStatus,
        target: target,
        total_processed: totalProcessed,
        total_added: totalAdded,
        total_updated: totalUpdated,
        total_failed: totalFailed,
        success_rate: successRate,
        source_results: sourceResults,
        message: `${target} import completed: ${totalAdded} trails added with ${successRate}% success rate`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('💥 Massive import error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Massive import failed', 
        details: error.message,
        target: 'immediate_10k'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
