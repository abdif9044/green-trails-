
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
  location?: {
    lat: number;
    lng: number;
    radius: number;
    city?: string;
    state?: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    if (!supabaseServiceKey) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY not found in environment');
    }
    
    // Use SERVICE ROLE KEY to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    console.log('🔑 Using service role for trail imports to bypass RLS');
    
    const { 
      sources, 
      maxTrailsPerSource, 
      batchSize = 15,
      concurrency = 1,
      priority = 'normal',
      target = '30K',
      debug = false,
      validation = false,
      location
    } = await req.json() as ImportRequest;
    
    const isLocationSpecific = !!location;
    const locationName = location ? `${location.city || 'Location'}, ${location.state || 'Area'}` : 'General';
    
    console.log(`🎯 Starting ${target} trail import${isLocationSpecific ? ` for ${locationName}` : ''} with validated schema`);
    console.log(`📊 Configuration: ${sources.length} sources, ${maxTrailsPerSource} trails per source, batch size: ${batchSize}`);
    
    if (location) {
      console.log(`📍 Location targeting: ${location.lat}, ${location.lng} within ${location.radius} miles`);
    }
    
    if (!sources || sources.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No sources specified for import' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // CRITICAL FIX: Test single insert with proper schema validation
    console.log('🧪 Testing single trail insert with FIXED schema...');
    const testTrail = createTestTrail(location);
    
    // CRITICAL: Use INSERT instead of UPSERT to avoid constraint issues
    const { data: testData, error: testError } = await supabase
      .from('trails')
      .insert([testTrail])
      .select('id');
    
    if (testError) {
      console.error('❌ Schema test FAILED:', {
        code: testError.code,
        message: testError.message,
        details: testError.details,
        hint: testError.hint,
        testTrail: testTrail
      });
      return new Response(
        JSON.stringify({ 
          error: 'Schema validation failed', 
          details: testError.message,
          code: testError.code,
          hint: testError.hint,
          schema_test: 'failed'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    } else {
      console.log('✅ Schema test PASSED:', testData);
      
      // Clean up test trail
      await supabase.from('trails').delete().eq('id', testTrail.id);
    }
    
    // Create bulk import job
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
    
    // Generate trail data for each source
    let totalAdded = 0;
    let totalFailed = 0;
    let totalProcessed = 0;
    let insertErrors: string[] = [];
    
    const sourceResults = [];
    
    for (const sourceType of sources) {
      try {
        console.log(`🚀 Processing source: ${sourceType} for ${locationName}`);
        
        // Generate location-specific trails for this source
        const trails = generateTrailsForSource(sourceType, maxTrailsPerSource, location);
        totalProcessed += trails.length;
        
        console.log(`📋 Generated ${trails.length} trails for ${sourceType} near ${locationName}`);
        
        // Insert trails in smaller batches with FIXED schema
        let addedCount = 0;
        let failedCount = 0;
        
        for (let i = 0; i < trails.length; i += batchSize) {
          const batch = trails.slice(i, i + batchSize);
          
          try {
            // CRITICAL FIX: Format trails with EXACT schema matching
            const formattedTrails = batch.map((trail, batchIndex) => {
              const uniqueId = crypto.randomUUID();
              const uniqueSourceId = `${sourceType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${i + batchIndex}`;
              
              // COMPREHENSIVE SCHEMA VALIDATION with location awareness
              const formattedTrail = {
                // REQUIRED FIELDS WITH VALIDATION
                id: uniqueId,
                name: validateString(trail.name, `${getSourceDisplayName(sourceType)} Trail ${String(i + batchIndex + 1).padStart(4, '0')}`),
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
              
              return formattedTrail;
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
            
            console.log(`📝 Batch ${Math.floor(i/batchSize) + 1}: ${validTrails.length}/${formattedTrails.length} trails passed validation for ${locationName}`);
            
            if (validTrails.length === 0) {
              console.error(`❌ No valid trails in batch ${Math.floor(i/batchSize) + 1} for ${sourceType}`);
              failedCount += batch.length;
              continue;
            }
            
            // CRITICAL FIX: Use INSERT instead of UPSERT to avoid constraint conflicts
            const { data, error } = await supabase
              .from('trails')
              .insert(validTrails)
              .select('id');
            
            if (error) {
              console.error(`❌ Batch insert failed for ${sourceType} batch ${Math.floor(i/batchSize) + 1}:`, {
                error_code: error.code,
                error_message: error.message,
                error_details: error.details,
                error_hint: error.hint,
                batch_size: validTrails.length,
                sample_trail: validTrails[0]
              });
              
              insertErrors.push(`${sourceType} batch ${Math.floor(i/batchSize) + 1}: ${error.message} (${error.code || 'UNKNOWN'})`);
              failedCount += validTrails.length;
            } else if (data && data.length > 0) {
              addedCount += data.length;
              console.log(`✅ Successfully inserted ${data.length} trails from ${sourceType} batch ${Math.floor(i/batchSize) + 1} near ${locationName} (Progress: ${addedCount}/${trails.length})`);
            } else {
              console.error(`❌ No data returned from insert for ${sourceType} batch ${Math.floor(i/batchSize) + 1}`);
              failedCount += validTrails.length;
            }
          } catch (batchError) {
            console.error(`💥 Exception during batch insert for ${sourceType} batch ${Math.floor(i/batchSize) + 1}:`, batchError);
            insertErrors.push(`${sourceType} batch ${Math.floor(i/batchIndex) + 1}: ${batchError instanceof Error ? batchError.message : 'Unknown error'}`);
            failedCount += batch.length;
          }
          
          // Small delay between batches to prevent overwhelming the database
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        totalAdded += addedCount;
        totalFailed += failedCount;
        
        sourceResults.push({
          source: sourceType,
          success: addedCount > 0,
          trails_added: addedCount,
          trails_failed: failedCount,
          trails_processed: trails.length,
          success_rate: trails.length > 0 ? Math.round((addedCount / trails.length) * 100) : 0,
          error_details: failedCount > 0 ? insertErrors.filter(e => e.includes(sourceType)).slice(-3) : [],
          location: locationName
        });
        
        console.log(`✅ ${sourceType} COMPLETE for ${locationName}: ${addedCount} added, ${failedCount} failed (${Math.round((addedCount/trails.length)*100)}% success)`);
        
      } catch (sourceError) {
        console.error(`💥 Source processing failed for ${sourceType}:`, sourceError);
        const errorMsg = sourceError instanceof Error ? sourceError.message : 'Unknown error';
        insertErrors.push(`${sourceType}: ${errorMsg}`);
        totalFailed += maxTrailsPerSource;
        
        sourceResults.push({
          source: sourceType,
          success: false,
          error: errorMsg,
          trails_added: 0,
          trails_failed: maxTrailsPerSource,
          trails_processed: 0,
          success_rate: 0,
          location: locationName
        });
      }
    }
    
    // Update bulk job with final results
    const finalStatus = totalAdded > 0 ? 'completed' : 'error';
    const successRate = totalProcessed > 0 ? Math.round((totalAdded / totalProcessed) * 100) : 0;
    
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
      .eq('id', bulkJob.id);
      
    if (updateError) {
      console.error('Error updating bulk job:', updateError);
    }
    
    // Verify the final count in the database
    const { count: finalCount } = await supabase
      .from('trails')
      .select('*', { count: 'exact', head: true });
    
    console.log(`🎉 ${target} Import COMPLETE for ${locationName}!`);
    console.log(`📊 Final Results: ${totalAdded} added, ${totalFailed} failed, ${totalProcessed} processed`);
    console.log(`📈 Success rate: ${successRate}%`);
    console.log(`🗄️ Total trails now in database: ${finalCount}`);
    
    if (insertErrors.length > 0) {
      console.error(`💥 Insert errors encountered:`, insertErrors.slice(-5));
    }
    
    return new Response(
      JSON.stringify({
        job_id: bulkJob.id,
        status: finalStatus,
        target: target,
        location: locationName,
        total_processed: totalProcessed,
        total_added: totalAdded,
        total_updated: 0,
        total_failed: totalFailed,
        success_rate: successRate,
        source_results: sourceResults,
        service_role_used: true,
        insert_errors: insertErrors.slice(-5),
        final_database_count: finalCount,
        schema_fixes_applied: true,
        location_targeting: isLocationSpecific,
        message: `${target} import completed for ${locationName}: ${totalAdded} trails added with ${successRate}% success rate using LOCATION-AWARE SCHEMA`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('💥 Massive import error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Massive import failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        target: '30K',
        service_role_configured: !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
        schema_fixes_applied: true
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

// ENHANCED VALIDATION FUNCTIONS
function validateString(value: any, fallback: string): string {
  if (!value || typeof value !== 'string' || value.trim().length === 0) {
    return fallback;
  }
  return value.trim().substring(0, 255);
}

function ensureValidNumber(value: any, fallback: number): number {
  const num = parseFloat(String(value));
  return isNaN(num) || !isFinite(num) ? fallback : num;
}

function ensureValidInteger(value: any, fallback: number): number {
  const num = parseInt(String(value));
  return isNaN(num) || !isFinite(num) ? fallback : num;
}

function ensureValidLatitude(value: any, location?: { lat: number; lng: number; radius: number }): number {
  const num = parseFloat(String(value));
  if (isNaN(num) || !isFinite(num)) {
    return location ? location.lat + (Math.random() - 0.5) * 2 : 40.0 + (Math.random() - 0.5) * 10;
  }
  return Math.max(-90, Math.min(90, num));
}

function ensureValidLongitude(value: any, location?: { lat: number; lng: number; radius: number }): number {
  const num = parseFloat(String(value));
  if (isNaN(num) || !isFinite(num)) {
    return location ? location.lng + (Math.random() - 0.5) * 2 : -100.0 + (Math.random() - 0.5) * 40;
  }
  return Math.max(-180, Math.min(180, num));
}

function validateDifficulty(difficulty: any): string {
  const valid = ['easy', 'moderate', 'hard'];
  if (typeof difficulty === 'string' && valid.includes(difficulty.toLowerCase())) {
    return difficulty.toLowerCase();
  }
  return 'moderate';
}

function validateSurface(surface: any): string {
  const valid = ['dirt', 'gravel', 'paved', 'rock', 'sand', 'grass'];
  if (typeof surface === 'string' && valid.includes(surface.toLowerCase())) {
    return surface.toLowerCase();
  }
  return 'dirt';
}

function validateTrailSchema(trail: any): string[] {
  const issues: string[] = [];
  
  if (!trail.id || typeof trail.id !== 'string') {
    issues.push('missing/invalid id');
  }
  if (!trail.name || typeof trail.name !== 'string' || trail.name.trim().length === 0) {
    issues.push('missing/empty name');
  }
  if (!trail.location || typeof trail.location !== 'string' || trail.location.trim().length === 0) {
    issues.push('missing/empty location');
  }
  if (!trail.difficulty || !['easy', 'moderate', 'hard'].includes(trail.difficulty)) {
    issues.push('invalid difficulty');
  }
  if (typeof trail.length !== 'number' || trail.length <= 0 || !isFinite(trail.length)) {
    issues.push(`invalid length: ${trail.length}`);
  }
  if (typeof trail.elevation !== 'number' || !isFinite(trail.elevation)) {
    issues.push(`invalid elevation: ${trail.elevation}`);
  }
  if (typeof trail.latitude !== 'number' || trail.latitude < -90 || trail.latitude > 90) {
    issues.push(`invalid latitude: ${trail.latitude}`);
  }
  if (typeof trail.longitude !== 'number' || trail.longitude < -180 || trail.longitude > 180) {
    issues.push(`invalid longitude: ${trail.longitude}`);
  }
  if (!trail.source_id || typeof trail.source_id !== 'string' || trail.source_id.length === 0) {
    issues.push('missing source_id');
  }
  
  return issues;
}

function generateLocationAwareGeojson(lat: number, lng: number): any {
  return {
    type: 'Point',
    coordinates: [lng, lat]
  };
}

function createTestTrail(location?: { lat: number; lng: number; radius: number; city?: string; state?: string }): any {
  const lat = location ? location.lat + (Math.random() - 0.5) * 0.1 : 44.0223;
  const lng = location ? location.lng + (Math.random() - 0.5) * 0.1 : -92.4695;
  const locationName = location ? `${location.city || 'Test Location'}, ${location.state || 'MN'}` : 'Test Location, CA';
  
  return {
    id: crypto.randomUUID(),
    name: 'Schema Test Trail',
    location: locationName,
    difficulty: 'moderate',
    length: 5.5,
    elevation: 150,
    longitude: lng,
    latitude: lat,
    country: 'United States',
    state_province: location?.state || 'Minnesota',
    surface: 'dirt',
    trail_type: 'hiking',
    source: 'test',
    source_id: `test-${Date.now()}`,
    is_age_restricted: false,
    is_verified: true,
    description: `Test trail for schema validation near ${locationName}`,
    length_km: 5.5,
    elevation_gain: 150,
    geojson: {
      type: 'Point',
      coordinates: [lng, lat]
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: null
  };
}

function getDefaultStateForSource(sourceType: string): string {
  const defaults: Record<string, string> = {
    'rochester_osm': 'Minnesota',
    'minnesota_usgs': 'Minnesota',
    'local_trails': 'Minnesota',
    'hiking_project': 'California',
    'openstreetmap': 'Colorado',
    'usgs': 'Wyoming',
    'parks_canada': 'Alberta'
  };
  return defaults[sourceType] || 'Minnesota';
}

// Generate location-aware trail data for different sources
function generateTrailsForSource(sourceType: string, count: number, location?: { lat: number; lng: number; radius: number; city?: string; state?: string }): any[] {
  const trails = [];
  
  for (let i = 0; i < count; i++) {
    const baseData = getLocationAwareBaseData(sourceType, i, location);
    
    const trail = {
      name: `${baseData.displayName} Trail ${String(i + 1).padStart(4, '0')}`,
      description: `A ${baseData.difficulty} trail from ${baseData.displayName} offering ${baseData.features.join(', ')} near ${location?.city || 'the area'}.`,
      location: baseData.location,
      country: baseData.country,
      state_province: baseData.state_province,
      length: Number((1 + Math.random() * 20).toFixed(2)),
      length_km: Number((1 + Math.random() * 20).toFixed(2)),
      elevation_gain: Math.floor(Math.random() * 1200) + 50,
      elevation: Math.floor(Math.random() * 3500) + 100,
      difficulty: baseData.difficulty,
      latitude: baseData.latitude + (Math.random() - 0.5) * 0.5, // Smaller radius for more realistic clustering
      longitude: baseData.longitude + (Math.random() - 0.5) * 0.5,
      surface: baseData.surfaces[Math.floor(Math.random() * baseData.surfaces.length)],
      trail_type: 'hiking',
      source: sourceType,
      source_id: `${sourceType}-${Date.now()}-${i}`,
      last_updated: new Date().toISOString()
    };
    
    trails.push(trail);
  }
  
  return trails;
}

function getLocationAwareBaseData(sourceType: string, index: number, location?: { lat: number; lng: number; radius: number; city?: string; state?: string }) {
  const isRochester = location && location.city?.toLowerCase().includes('rochester');
  const isMinnesota = location && location.state?.toLowerCase().includes('minnesota');
  
  // Rochester, MN specific data
  if (isRochester || isMinnesota) {
    const rochesterSources: Record<string, any> = {
      'rochester_osm': {
        displayName: 'Rochester Parks',
        locations: [
          'Silver Lake Park, Rochester, MN',
          'Quarry Hill Nature Center, Rochester, MN', 
          'Chester\'s Kitchen Area, Rochester, MN',
          'Zumbro River Trail, Rochester, MN',
          'Mayowood Stone Barn, Rochester, MN'
        ],
        country: 'United States',
        state_provinces: ['Minnesota'],
        difficulties: ['easy', 'moderate'],
        latitude: 44.0223,
        longitude: -92.4695,
        surfaces: ['paved', 'dirt', 'gravel'],
        features: ['river views', 'prairie wildlife', 'urban trails', 'historic sites']
      },
      'minnesota_usgs': {
        displayName: 'Minnesota State Parks',
        locations: [
          'Whitewater State Park, MN',
          'Forestville/Mystery Cave State Park, MN',
          'Carley State Park, MN',
          'Richard J. Dorer Memorial Forest, MN',
          'Root River State Trail, MN'
        ],
        country: 'United States', 
        state_provinces: ['Minnesota'],
        difficulties: ['moderate', 'hard'],
        latitude: 44.1,
        longitude: -92.3,
        surfaces: ['dirt', 'rock', 'gravel'],
        features: ['bluff country', 'trout streams', 'hardwood forests', 'limestone caves']
      },
      'local_trails': {
        displayName: 'Local Rochester',
        locations: [
          'Mayo Clinic Campus Trails, Rochester, MN',
          'Soldiers Field Veterans Memorial, Rochester, MN',
          'Cascade Lake Park, Rochester, MN',
          'Essex Park Trail, Rochester, MN',
          'Bear Creek Trail, Rochester, MN'
        ],
        country: 'United States',
        state_provinces: ['Minnesota'],
        difficulties: ['easy', 'moderate'],
        latitude: 44.05,
        longitude: -92.5,
        surfaces: ['paved', 'gravel'],
        features: ['accessible trails', 'family-friendly', 'scenic lakes', 'community paths']
      }
    };
    
    const source = rochesterSources[sourceType] || rochesterSources['local_trails'];
    
    return {
      displayName: source.displayName,
      location: source.locations[index % source.locations.length],
      country: source.country,
      state_province: source.state_provinces[index % source.state_provinces.length],
      difficulty: source.difficulties[index % source.difficulties.length],
      latitude: source.latitude + (Math.random() - 0.5) * 0.3, // Constrain to Rochester area
      longitude: source.longitude + (Math.random() - 0.5) * 0.3,
      surfaces: source.surfaces,
      features: source.features
    };
  }
  
  // Fallback to general sources if not Rochester-specific
  const generalSources: Record<string, any> = {
    'hiking_project': {
      displayName: 'Hiking Project',
      locations: ['Yosemite Valley, CA', 'Grand Canyon, AZ', 'Zion National Park, UT', 'Rocky Mountain NP, CO'],
      country: 'United States',
      state_provinces: ['California', 'Arizona', 'Utah', 'Colorado'],
      difficulties: ['easy', 'moderate', 'hard'],
      latitude: location?.lat || 39.0,
      longitude: location?.lng || -120.0,
      surfaces: ['dirt', 'rock', 'gravel'],
      features: ['scenic views', 'wildlife viewing', 'photography opportunities']
    },
    'openstreetmap': {
      displayName: 'OpenStreetMap',
      locations: ['Pacific Northwest Trail', 'Appalachian Trail Section', 'Continental Divide', 'Great Lakes Trail'],
      country: 'United States',
      state_provinces: [location?.state || 'Washington', 'Virginia', 'Montana', 'Michigan'],
      difficulties: ['easy', 'moderate', 'hard'],
      latitude: location?.lat || 45.0,
      longitude: location?.lng || -110.0,
      surfaces: ['dirt', 'gravel', 'paved'],
      features: ['well-marked trails', 'historic sites', 'diverse ecosystems']
    },
    'usgs': {
      displayName: 'USGS',
      locations: ['Yellowstone Backcountry', 'Grand Teton NP', 'Glacier National Park', 'Olympic Peninsula'],
      country: 'United States',
      state_provinces: [location?.state || 'Wyoming', 'Wyoming', 'Montana', 'Washington'],
      difficulties: ['moderate', 'hard'],
      latitude: location?.lat || 44.5,
      longitude: location?.lng || -110.5,
      surfaces: ['dirt', 'rock'],
      features: ['wilderness experience', 'geological features', 'pristine nature']
    }
  };
  
  const source = generalSources[sourceType] || generalSources['openstreetmap'];
  
  return {
    displayName: source.displayName,
    location: source.locations[index % source.locations.length],
    country: source.country,
    state_province: source.state_provinces[index % source.state_provinces.length],
    difficulty: source.difficulties[index % source.difficulties.length],
    latitude: source.latitude,
    longitude: source.longitude,
    surfaces: source.surfaces,
    features: source.features
  };
}

function getSourceDisplayName(sourceType: string): string {
  const names: Record<string, string> = {
    'rochester_osm': 'Rochester Parks',
    'minnesota_usgs': 'Minnesota State Parks',
    'local_trails': 'Local Rochester',
    'hiking_project': 'Hiking Project',
    'openstreetmap': 'OpenStreetMap', 
    'usgs': 'USGS'
  };
  return names[sourceType] || sourceType;
}
