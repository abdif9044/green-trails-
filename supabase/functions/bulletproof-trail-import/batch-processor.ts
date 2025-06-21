
import { TrailData } from './types.ts';
import { validateTrail } from './validation.ts';

export async function processBatch(
  supabase: any,
  batch: TrailData[],
  batchNumber: number,
  totalBatches: number
): Promise<{ added: number; failed: number }> {
  try {
    console.log(`⚡ Processing batch ${batchNumber}/${totalBatches} (${batch.length} trails)`);
    
    // Double-check each trail in the batch
    const validatedBatch = batch.map(trail => {
      const { trail: validTrail } = validateTrail(trail);
      return validTrail;
    }).filter(Boolean);
    
    if (validatedBatch.length !== batch.length) {
      console.warn(`⚠️ Batch ${batchNumber}: ${batch.length - validatedBatch.length} trails failed validation`);
    }
    
    // Insert with upsert to handle conflicts
    const { data, error: insertError } = await supabase
      .from('trails')
      .upsert(validatedBatch, { onConflict: 'id' })
      .select('id');
    
    if (insertError) {
      console.error(`❌ Batch ${batchNumber} insert error:`, insertError);
      return { added: 0, failed: batch.length };
    } else {
      const addedCount = data?.length || 0;
      console.log(`✅ Batch ${batchNumber}: ${addedCount} trails added successfully`);
      return { added: addedCount, failed: 0 };
    }
    
  } catch (batchError) {
    console.error(`💥 Batch ${batchNumber} failed:`, batchError);
    return { added: 0, failed: batch.length };
  }
}
