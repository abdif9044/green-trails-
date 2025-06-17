
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export interface BatchResult {
  addedCount: number;
  failedCount: number;
  insertErrors: string[];
}

export const processBatch = async (
  supabase: any,
  batch: any[],
  sourceType: string,
  batchIndex: number,
  location?: any
): Promise<BatchResult> => {
  let addedCount = 0;
  let failedCount = 0;
  let insertErrors: string[] = [];

  console.log(`🔄 Processing batch ${batchIndex + 1} with ${batch.length} trails for ${sourceType}`);

  try {
    // Process each trail individually to capture specific errors
    for (const trail of batch) {
      try {
        // Ensure required fields are properly set
        const trailData = {
          ...trail,
          user_id: null, // Explicitly set to null for bulk imports
          is_verified: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
          .from('trails')
          .insert([trailData])
          .select('id');

        if (error) {
          console.error(`❌ Trail insert failed:`, {
            trail: trail.name,
            error: error.message,
            code: error.code,
            details: error.details
          });
          insertErrors.push(`${trail.name}: ${error.message}`);
          failedCount++;
        } else if (data && data.length > 0) {
          addedCount++;
          console.log(`✅ Trail added: ${trail.name} (${data[0].id})`);
        } else {
          console.warn(`⚠️ Trail insert returned no data: ${trail.name}`);
          failedCount++;
        }
      } catch (individualError) {
        console.error(`💥 Individual trail processing failed:`, individualError);
        insertErrors.push(`${trail.name}: ${individualError instanceof Error ? individualError.message : 'Unknown error'}`);
        failedCount++;
      }
    }

  } catch (batchError) {
    console.error(`💥 Batch processing failed for ${sourceType}:`, batchError);
    insertErrors.push(`Batch error: ${batchError instanceof Error ? batchError.message : 'Unknown error'}`);
    failedCount = batch.length;
  }

  console.log(`📊 Batch ${batchIndex + 1} results: ${addedCount} added, ${failedCount} failed`);

  return {
    addedCount,
    failedCount,
    insertErrors
  };
};
