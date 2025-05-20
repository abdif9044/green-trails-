
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
    const { sourceIds, totalTrails, batchSize = 2500, concurrency = 5 } = await req.json() as BulkImportRequest;
    
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

    console.log(`Starting bulk import job ${bulkJob.id} for ${totalTrails} trails from ${sourceIds.length} sources`);

    // Process source IDs in parallel to maximize throughput
    const sourcePromises = sourceIds.map(async (sourceId) => {
      console.log(`Processing source ${sourceId}: targeting ${Math.ceil(totalTrails / sourceIds.length)} trails`);
      
      // Get source information
      const { data: source } = await supabase
        .from('trail_data_sources')
        .select('*')
        .eq('id', sourceId)
        .single();
        
      if (!source) {
        console.error(`Source ${sourceId} not found`);
        return {
          source_id: sourceId,
          success: false,
          error: 'Source not found'
        };
      }

      // Calculate trails per source evenly
      const trailsPerSource = Math.ceil(totalTrails / sourceIds.length);
      let remainingToProcess = trailsPerSource;
      let currentOffset = 0;
      let totalProcessed = 0;
      let totalAdded = 0;
      let totalUpdated = 0;
      let totalFailed = 0;
      
      // Process in batches for better memory management
      while (remainingToProcess > 0) {
        const currentBatchSize = Math.min(remainingToProcess, batchSize);
        
        try {
          // Call import-trails function for this batch
          const response = await supabase.functions.invoke('import-trails', {
            body: { 
              sourceId, 
              limit: currentBatchSize, 
              offset: currentOffset,
              bulkJobId: bulkJob.id
            }
          });
          
          if (response.error) {
            console.error(`Error importing batch from source ${sourceId}:`, response.error);
            totalFailed += currentBatchSize;
            
            // Update bulk job with progress
            await updateBulkJobProgress(supabase, bulkJob.id, {
              processed: currentBatchSize,
              failed: currentBatchSize
            });
            
            break;
          }
          
          // Update counters
          totalProcessed += response.data.trails_processed || 0;
          totalAdded += response.data.trails_added || 0;
          totalUpdated += response.data.trails_updated || 0;
          totalFailed += response.data.trails_failed || 0;
          
          // Update bulk job with progress
          await updateBulkJobProgress(supabase, bulkJob.id, {
            processed: response.data.trails_processed || 0,
            added: response.data.trails_added || 0,
            updated: response.data.trails_updated || 0,
            failed: response.data.trails_failed || 0
          });
          
          // Check if we reached the end of available data
          if (response.data.trails_processed < currentBatchSize) {
            console.log(`Source ${sourceId} has no more data after ${totalProcessed} trails`);
            break;
          }
          
          // Prepare for next batch
          remainingToProcess -= currentBatchSize;
          currentOffset += currentBatchSize;
          
          // Small pause to avoid overwhelming the system
          await new Promise(r => setTimeout(r, 100));
        } catch (error) {
          console.error(`Error processing batch for source ${sourceId}:`, error);
          break;
        }
      }
      
      return {
        source_id: sourceId,
        success: true,
        trails_processed: totalProcessed,
        trails_added: totalAdded,
        trails_updated: totalUpdated, 
        trails_failed: totalFailed
      };
    });
    
    // Process all sources in parallel up to the concurrency limit
    const sourceResults = await Promise.all(sourcePromises);
    
    // Mark bulk job as completed
    await supabase
      .from('bulk_import_jobs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', bulkJob.id);
    
    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        job_id: bulkJob.id,
        results: sourceResults
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Unexpected error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Internal Server Error', 
        details: error.message 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

// Helper function to update bulk job progress
async function updateBulkJobProgress(
  supabase: any,
  jobId: string, 
  progress: { processed?: number, added?: number, updated?: number, failed?: number }
) {
  try {
    // Get current job status
    const { data: job } = await supabase
      .from('bulk_import_jobs')
      .select('trails_processed, trails_added, trails_updated, trails_failed')
      .eq('id', jobId)
      .single();
      
    if (!job) return;
    
    // Update with incremental progress
    await supabase
      .from('bulk_import_jobs')
      .update({
        trails_processed: job.trails_processed + (progress.processed || 0),
        trails_added: job.trails_added + (progress.added || 0),
        trails_updated: job.trails_updated + (progress.updated || 0),
        trails_failed: job.trails_failed + (progress.failed || 0),
        last_updated: new Date().toISOString()
      })
      .eq('id', jobId);
  } catch (e) {
    console.error('Error updating job progress:', e);
  }
}
