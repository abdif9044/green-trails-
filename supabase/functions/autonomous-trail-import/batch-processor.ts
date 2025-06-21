
import { TrailTemplate } from './types.ts';

export interface BatchResult {
  totalProcessed: number;
  totalAdded: number;
  totalFailed: number;
  errors: string[];
}

export class BatchProcessor {
  private supabase: any;
  
  constructor(supabase: any) {
    this.supabase = supabase;
  }
  
  async processBatches(trails: TrailTemplate[], batchSize: number, concurrency: number): Promise<BatchResult> {
    console.log(`📦 Processing ${trails.length} trails in batches of ${batchSize} with concurrency ${concurrency}`);
    
    const result: BatchResult = {
      totalProcessed: 0,
      totalAdded: 0,
      totalFailed: 0,
      errors: []
    };
    
    // Split trails into batches
    const batches: TrailTemplate[][] = [];
    for (let i = 0; i < trails.length; i += batchSize) {
      batches.push(trails.slice(i, i + batchSize));
    }
    
    // Process batches with controlled concurrency
    for (let i = 0; i < batches.length; i += concurrency) {
      const batchGroup = batches.slice(i, i + concurrency);
      const batchPromises = batchGroup.map((batch, index) => 
        this.processBatch(batch, i + index + 1, batches.length)
      );
      
      const batchResults = await Promise.allSettled(batchPromises);
      
      // Aggregate results
      batchResults.forEach((batchResult, index) => {
        if (batchResult.status === 'fulfilled') {
          const batchData = batchResult.value;
          result.totalProcessed += batchData.processed;
          result.totalAdded += batchData.added;
          result.totalFailed += batchData.failed;
        } else {
          const batchSize = batchGroup[index].length;
          result.totalProcessed += batchSize;
          result.totalFailed += batchSize;
          result.errors.push(`Batch ${i + index + 1} failed: ${batchResult.reason}`);
        }
      });
      
      // Brief pause between batch groups
      if (i + concurrency < batches.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    console.log(`✅ Batch processing complete: ${result.totalAdded} added, ${result.totalFailed} failed`);
    return result;
  }
  
  private async processBatch(
    batch: TrailTemplate[], 
    batchNumber: number, 
    totalBatches: number
  ): Promise<{ processed: number; added: number; failed: number }> {
    
    try {
      console.log(`⚡ Processing batch ${batchNumber}/${totalBatches} (${batch.length} trails)`);
      
      // Prepare trails for insertion
      const trailsToInsert = batch.map(trail => ({
        id: trail.id,
        name: trail.name,
        location: trail.location,
        description: trail.description,
        difficulty: trail.difficulty,
        terrain_type: trail.terrain_type,
        length: trail.length,
        elevation: trail.elevation,
        elevation_gain: trail.elevation_gain,
        latitude: trail.latitude,
        longitude: trail.longitude,
        country: trail.country,
        state_province: trail.state_province,
        region: trail.region,
        is_verified: trail.is_verified,
        is_age_restricted: trail.is_age_restricted,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
      
      // Insert with upsert to handle conflicts
      const { data, error } = await this.supabase
        .from('trails')
        .upsert(trailsToInsert, { onConflict: 'id' })
        .select('id');
      
      if (error) {
        console.error(`❌ Batch ${batchNumber} insert error:`, error);
        return { processed: batch.length, added: 0, failed: batch.length };
      }
      
      const addedCount = data?.length || 0;
      console.log(`✅ Batch ${batchNumber}: ${addedCount} trails added successfully`);
      
      return { processed: batch.length, added: addedCount, failed: 0 };
      
    } catch (error) {
      console.error(`💥 Batch ${batchNumber} failed:`, error);
      return { processed: batch.length, added: 0, failed: batch.length };
    }
  }
}
