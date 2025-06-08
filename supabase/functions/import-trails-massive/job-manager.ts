
export async function createBulkImportJob(
  supabase: any,
  sources: string[],
  maxTrailsPerSource: number,
  locationName: string
) {
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
  return bulkJob;
}

export async function updateBulkImportJob(
  supabase: any,
  jobId: string,
  totalProcessed: number,
  totalAdded: number,
  totalFailed: number
) {
  const finalStatus = totalAdded > 0 ? 'completed' : 'error';
  
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
    .eq('id', jobId);
    
  if (updateError) {
    console.error('Error updating bulk job:', updateError);
  }
  
  return finalStatus;
}
