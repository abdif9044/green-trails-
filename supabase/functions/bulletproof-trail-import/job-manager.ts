
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { ImportConfig } from './types.ts';

export async function createBulkJob(supabase: any, config: ImportConfig) {
  const { data: bulkJob, error: jobError } = await supabase
    .from('bulk_import_jobs')
    .insert({
      total_trails_requested: config.maxTrails,
      total_sources: 1,
      status: 'processing',
      trails_processed: 0,
      trails_added: 0,
      trails_updated: 0,
      trails_failed: 0,
      config: { testMode: config.testMode, validateFirst: config.validateFirst, bulletproof: true }
    })
    .select()
    .single();
  
  if (jobError) {
    throw new Error(`Failed to create job: ${jobError.message}`);
  }
  
  return bulkJob;
}

export async function updateJobProgress(
  supabase: any, 
  jobId: string, 
  processed: number, 
  added: number, 
  failed: number
) {
  await supabase
    .from('bulk_import_jobs')
    .update({
      trails_processed: processed,
      trails_added: added,
      trails_failed: failed
    })
    .eq('id', jobId);
}

export async function finalizeJob(
  supabase: any,
  jobId: string,
  totalProcessed: number,
  totalAdded: number,
  totalFailed: number,
  testMode: boolean
) {
  const finalStatus = totalAdded > 0 ? 'completed' : 'error';
  
  await supabase
    .from('bulk_import_jobs')
    .update({
      status: finalStatus,
      completed_at: new Date().toISOString(),
      trails_processed: totalProcessed,
      trails_added: totalAdded,
      trails_failed: totalFailed,
      results: {
        success: totalAdded > 0,
        total_generated: totalProcessed,
        bulletproof: true,
        test_mode: testMode
      }
    })
    .eq('id', jobId);
}
