
// Batch processing utilities for trail imports

import { validateString, ensureValidNumber, ensureValidInteger, ensureValidLatitude, ensureValidLongitude, validateDifficulty, validateSurface, validateTrailSchema } from "./validation.ts";
import { generateLocationAwareGeojson, getDefaultStateForSource, getSourceDisplayName } from "./location-utils.ts";

export interface BatchResult {
  addedCount: number;
  failedCount: number;
  insertErrors: string[];
}

export async function processBatch(
  supabase: any,
  batch: any[],
  sourceType: string,
  batchIndex: number,
  location?: { lat: number; lng: number; radius: number; city?: string; state?: string }
): Promise<BatchResult> {
  const locationName = location ? `${location.city || 'Location'}, ${location.state || 'Area'}` : 'General';
  let addedCount = 0;
  let failedCount = 0;
  const insertErrors: string[] = [];

  try {
    // Format trails with EXACT schema matching
    const formattedTrails = batch.map((trail, batchItemIndex) => {
      const uniqueId = crypto.randomUUID();
      const uniqueSourceId = `${sourceType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${batchIndex * 100 + batchItemIndex}`;
      
      return {
        // REQUIRED FIELDS WITH VALIDATION
        id: uniqueId,
        name: validateString(trail.name, `${getSourceDisplayName(sourceType)} Trail ${String(batchIndex * 100 + batchItemIndex + 1).padStart(4, '0')}`),
        location: validateString(trail.location, `${locationName} Area`),
        difficulty: validateDifficulty(trail.difficulty),
        length: ensureValidNumber(trail.length || trail.length_km, Math.random() * 15 + 1),
        elevation: ensureValidInteger(trail.elevation, Math.floor(Math.random() * 2000) + 100),
        longitude: ensureValidLongitude(trail.longitude),
        latitude: ensureValidLatitude(trail.latitude),
        
        // OPTIONAL FIELDS WITH SAFE DEFAULTS
        description: validateString(trail.description, `A beautiful ${trail.difficulty || 'moderate'} trail offering stunning outdoor adventure near ${locationName}.`),
        country: validateString(trail.country, 'United States'),
        state_province: validateString(trail.state_province, location?.state || getDefaultStateForSource(sourceType)),
        surface: validateSurface(trail.surface),
        trail_type: 'hiking',
        source: sourceType,
        source_id: uniqueSourceId,
        length_km: ensureValidNumber(trail.length_km || trail.length, Math.random() * 15 + 1),
        elevation_gain: ensureValidNumber(trail.elevation_gain, Math.floor(Math.random() * 800) + 50),
        is_age_restricted: false,
        is_verified: true,
        user_id: null,
        geojson: generateLocationAwareGeojson(
          ensureValidLatitude(trail.latitude), 
          ensureValidLongitude(trail.longitude)
        ),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    });
    
    // COMPREHENSIVE PRE-INSERT VALIDATION
    const validTrails = formattedTrails.filter(trail => {
      const issues = validateTrailSchema(trail);
      
      if (issues.length > 0) {
        console.error(`❌ Trail validation failed: ${issues.join(', ')}`, {
          name: trail.name,
          location: trail.location,
          id: trail.id
        });
        return false;
      }
      
      return true;
    });
    
    console.log(`📝 Batch ${batchIndex + 1}: ${validTrails.length}/${formattedTrails.length} trails passed validation for ${locationName}`);
    
    if (validTrails.length === 0) {
      console.error(`❌ No valid trails in batch ${batchIndex + 1} for ${sourceType}`);
      failedCount += batch.length;
      return { addedCount, failedCount, insertErrors };
    }
    
    // Insert trails using INSERT instead of UPSERT
    const { data, error } = await supabase
      .from('trails')
      .insert(validTrails)
      .select('id');
    
    if (error) {
      console.error(`❌ Batch insert failed for ${sourceType} batch ${batchIndex + 1}:`, {
        error_code: error.code,
        error_message: error.message,
        error_details: error.details,
        error_hint: error.hint,
        batch_size: validTrails.length,
        sample_trail: validTrails[0]
      });
      
      insertErrors.push(`${sourceType} batch ${batchIndex + 1}: ${error.message} (${error.code || 'UNKNOWN'})`);
      failedCount += validTrails.length;
    } else if (data && data.length > 0) {
      addedCount += data.length;
      console.log(`✅ Successfully inserted ${data.length} trails from ${sourceType} batch ${batchIndex + 1} near ${locationName} (Progress: ${addedCount}/${batch.length})`);
    } else {
      console.error(`❌ No data returned from insert for ${sourceType} batch ${batchIndex + 1}`);
      failedCount += validTrails.length;
    }
  } catch (batchError) {
    console.error(`💥 Exception during batch insert for ${sourceType} batch ${batchIndex + 1}:`, batchError);
    insertErrors.push(`${sourceType} batch ${batchIndex + 1}: ${batchError instanceof Error ? batchError.message : 'Unknown error'}`);
    failedCount += batch.length;
  }

  return { addedCount, failedCount, insertErrors };
}
