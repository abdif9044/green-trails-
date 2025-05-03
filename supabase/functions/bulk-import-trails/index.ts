
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BulkImportRequest {
  sourceIds: string[];
  totalTrails: number;
  batchSize?: number;
  concurrency?: number;
}

interface ImportResult {
  job_id: string;
  source_id: string;
  trails_processed: number;
  trails_added: number;
  trails_updated: number;
  trails_failed: number;
  status: string;
}

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
    
    // Parse request
    const { sourceIds, totalTrails, batchSize = 1000, concurrency = 3 } = await req.json() as BulkImportRequest;
    
    if (!sourceIds || sourceIds.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Source IDs are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Create bulk import job
    const { data: bulkJob, error: bulkJobError } = await supabase
      .from('bulk_import_jobs')
      .insert([{
        status: 'processing',
        started_at: new Date().toISOString(),
        total_trails_requested: totalTrails,
        total_sources: sourceIds.length,
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
        JSON.stringify({ error: 'Failed to create bulk import job', details: bulkJobError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Track job progress
    let totalProcessed = 0;
    let totalAdded = 0;
    let totalUpdated = 0;
    let totalFailed = 0;
    
    const results: ImportResult[] = [];
    const totalPerSource = Math.ceil(totalTrails / sourceIds.length);

    // Process source IDs in batches based on concurrency
    for (let i = 0; i < sourceIds.length; i += concurrency) {
      const batch = sourceIds.slice(i, i + concurrency);
      const promises = batch.map(async (sourceId) => {
        try {
          // Calculate how many trails to import from this source
          let remainingForThisSource = totalPerSource;
          let offset = 0;
          const sourceResults: ImportResult[] = [];
          
          // Get source information
          const { data: source } = await supabase
            .from('trail_data_sources')
            .select('*')
            .eq('id', sourceId)
            .single();
            
          if (!source) {
            console.error(`Source ${sourceId} not found`);
            return null;
          }
          
          // Import in batches until we reach the target or run out of data
          while (remainingForThisSource > 0) {
            const currentBatchSize = Math.min(remainingForThisSource, batchSize);
            
            // Call the regular import-trails function with a batch
            const response = await supabase.functions.invoke('import-trails', {
              body: { 
                sourceId, 
                limit: currentBatchSize, 
                offset,
                bulkJobId: bulkJob.id
              }
            });
            
            if (response.error) {
              console.error(`Error importing from source ${sourceId}:`, response.error);
              totalFailed += currentBatchSize;
              break;
            }
            
            const result = response.data as ImportResult;
            sourceResults.push(result);
            
            // Update counters
            totalProcessed += result.trails_processed;
            totalAdded += result.trails_added;
            totalUpdated += result.trails_updated;
            totalFailed += result.trails_failed;
            
            // Update the bulk job with current progress
            await supabase
              .from('bulk_import_jobs')
              .update({
                trails_processed: totalProcessed,
                trails_added: totalAdded,
                trails_updated: totalUpdated,
                trails_failed: totalFailed,
                last_updated: new Date().toISOString()
              })
              .eq('id', bulkJob.id);
            
            // Prepare for next batch
            remainingForThisSource -= currentBatchSize;
            offset += currentBatchSize;
            
            // If we didn't get as many trails as requested, we're out of data
            if (result.trails_processed < currentBatchSize) {
              break;
            }
            
            // Simple backoff to avoid overwhelming the database
            await new Promise(r => setTimeout(r, 300));
          }
          
          // Aggregate results for this source
          const sourceResult: ImportResult = {
            job_id: bulkJob.id,
            source_id: sourceId,
            trails_processed: sourceResults.reduce((sum, r) => sum + r.trails_processed, 0),
            trails_added: sourceResults.reduce((sum, r) => sum + r.trails_added, 0),
            trails_updated: sourceResults.reduce((sum, r) => sum + r.trails_updated, 0),
            trails_failed: sourceResults.reduce((sum, r) => sum + r.trails_failed, 0),
            status: 'completed'
          };
          
          return sourceResult;
        } catch (error) {
          console.error(`Error processing source ${sourceId}:`, error);
          return {
            job_id: bulkJob.id,
            source_id: sourceId,
            trails_processed: 0,
            trails_added: 0,
            trails_updated: 0,
            trails_failed: totalPerSource,
            status: 'error'
          };
        }
      });
      
      // Wait for this batch of sources to complete
      const batchResults = await Promise.all(promises);
      results.push(...batchResults.filter(Boolean) as ImportResult[]);
    }
    
    // Mark bulk job as completed
    await supabase
      .from('bulk_import_jobs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        trails_processed: totalProcessed,
        trails_added: totalAdded,
        trails_updated: totalUpdated,
        trails_failed: totalFailed
      })
      .eq('id', bulkJob.id);
    
    return new Response(
      JSON.stringify({
        job_id: bulkJob.id,
        status: 'completed',
        trails_processed: totalProcessed,
        trails_added: totalAdded,
        trails_updated: totalUpdated,
        trails_failed: totalFailed,
        results
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
