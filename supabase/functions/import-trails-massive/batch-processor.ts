
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
    // Process each trail individually for better error isolation
    for (const trail of batch) {
      try {
        // Clean and validate trail data before insertion
        const cleanTrail = {
          id: trail.id,
          name: trail.name || 'Unnamed Trail',
          location: trail.location || 'Unknown Location',
          difficulty: trail.difficulty || 'moderate',
          length: trail.length || 0,
          elevation_gain: trail.elevation_gain || 0,
          elevation: trail.elevation || 0,
          country: trail.country || 'United States',
          state_province: trail.state_province || null,
          latitude: trail.latitude || null,
          longitude: trail.longitude || null,
          description: trail.description || null,
          terrain_type: trail.terrain_type || null,
          region: trail.region || null,
          user_id: null, // Critical: must be null for bulk imports
          is_verified: true,
          is_age_restricted: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
          .from('trails')
          .insert([cleanTrail])
          .select('id');

        if (error) {
          console.error(`❌ Trail insert failed for "${trail.name}":`, {
            error: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
          });
          insertErrors.push(`${trail.name}: ${error.message}`);
          failedCount++;
        } else if (data && data.length > 0) {
          addedCount++;
          if (addedCount % 10 === 0) {
            console.log(`✅ Progress: ${addedCount} trails added so far...`);
          }
        } else {
          console.warn(`⚠️ Trail insert returned no data: ${trail.name}`);
          insertErrors.push(`${trail.name}: Insert returned no data`);
          failedCount++;
        }
      } catch (individualError) {
        console.error(`💥 Individual trail processing failed for "${trail.name}":`, individualError);
        insertErrors.push(`${trail.name}: ${individualError instanceof Error ? individualError.message : 'Unknown processing error'}`);
        failedCount++;
      }
      
      // Small delay to prevent overwhelming the database
      if (addedCount % 5 === 0) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }

  } catch (batchError) {
    console.error(`💥 Batch processing failed for ${sourceType}:`, batchError);
    insertErrors.push(`Batch error: ${batchError instanceof Error ? batchError.message : 'Unknown batch error'}`);
    failedCount = batch.length;
  }

  console.log(`📊 Batch ${batchIndex + 1} completed: ${addedCount} added, ${failedCount} failed`);

  return {
    addedCount,
    failedCount,
    insertErrors
  };
};
