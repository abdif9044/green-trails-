
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ImportRequest {
  sourceId: string;
  limit?: number;
  offset?: number;
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
    const { sourceId, limit = 100, offset = 0 } = await req.json() as ImportRequest;
    
    if (!sourceId) {
      return new Response(
        JSON.stringify({ error: 'Source ID is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Get source information
    const { data: source, error: sourceError } = await supabase
      .from('trail_data_sources')
      .select('*')
      .eq('id', sourceId)
      .single();
      
    if (sourceError || !source) {
      console.error('Error fetching source:', sourceError);
      return new Response(
        JSON.stringify({ error: 'Source not found', details: sourceError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }
    
    // Create import job
    const { data: job, error: jobError } = await supabase
      .from('trail_import_jobs')
      .insert([{
        source_id: sourceId,
        status: 'processing',
        started_at: new Date().toISOString()
      }])
      .select('*')
      .single();
      
    if (jobError || !job) {
      console.error('Error creating import job:', jobError);
      return new Response(
        JSON.stringify({ error: 'Failed to create import job', details: jobError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    // This would normally be a background process, but for demo purposes we'll do it synchronously
    // Real implementation would use a queue system or scheduled tasks
    
    // Simulate fetching trail data based on source type
    let trails = [];
    let processedCount = 0;
    let addedCount = 0;
    let updatedCount = 0;
    let failedCount = 0;
    let errorMessage = null;
    
    try {
      // In a real implementation, this would call different data fetchers based on source.source_type
      console.log(`Importing from ${source.name} (${source.source_type})`);
      
      switch (source.source_type) {
        case 'overpass':
          // This is a simplified mock for demo purposes
          // In production you would make actual API calls to the Overpass API
          trails = await mockFetchOverpassTrails(source, limit, offset);
          break;
        case 'usgs':
          trails = await mockFetchUSGSTrails(source, limit, offset);
          break;
        default:
          trails = await mockFetchGenericTrails(source, limit, offset);
      }
      
      // Process trails (simplified for demo)
      processedCount = trails.length;
      
      // Insert/update trails in database
      for (const trail of trails) {
        const { data, error } = await supabase
          .from('trails')
          .upsert([{
            name: trail.name,
            description: trail.description || null,
            location: trail.location,
            country: trail.country,
            state_province: trail.state_province,
            length: trail.length || 0,
            length_km: trail.length_km || trail.length || 0,
            elevation: trail.elevation || 0,
            elevation_gain: trail.elevation_gain || 0,
            difficulty: trail.difficulty || 'moderate',
            geojson: trail.geojson,
            latitude: trail.latitude || null,
            longitude: trail.longitude || null,
            surface: trail.surface || null,
            trail_type: trail.trail_type || null,
            source: source.source_type,
            source_id: trail.id || null,
            last_updated: new Date().toISOString()
          }], {
            onConflict: 'source_id',
            ignoreDuplicates: false
          });
          
        if (error) {
          console.error('Error upserting trail:', error);
          failedCount++;
        } else if (data && data.length > 0) {
          // If the trail already existed and was updated
          if (data[0].id) {
            updatedCount++;
          } else {
            addedCount++;
          }
        }
      }
    } catch (error) {
      console.error('Error in import process:', error);
      errorMessage = error.message;
      failedCount = processedCount - addedCount - updatedCount;
    }
    
    // Update import job with results
    const { error: updateError } = await supabase
      .from('trail_import_jobs')
      .update({
        status: errorMessage ? 'error' : 'completed',
        completed_at: new Date().toISOString(),
        trails_processed: processedCount,
        trails_added: addedCount,
        trails_updated: updatedCount,
        trails_failed: failedCount,
        error_message: errorMessage,
        log: {
          source_type: source.source_type,
          timestamp: new Date().toISOString(),
          details: `Processed ${processedCount} trails: ${addedCount} added, ${updatedCount} updated, ${failedCount} failed`
        }
      })
      .eq('id', job.id);
      
    if (updateError) {
      console.error('Error updating import job:', updateError);
    }
    
    // Update source last_synced timestamp
    await supabase
      .from('trail_data_sources')
      .update({
        last_synced: new Date().toISOString(),
        next_sync: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)).toISOString() // 7 days from now
      })
      .eq('id', sourceId);
    
    // Return response
    return new Response(
      JSON.stringify({
        job_id: job.id,
        status: errorMessage ? 'error' : 'completed',
        processed: processedCount,
        added: addedCount,
        updated: updatedCount,
        failed: failedCount,
        error: errorMessage
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

// Mock functions to simulate fetching trails from various sources
// In a real implementation, these would make actual API calls

async function mockFetchOverpassTrails(source, limit, offset) {
  // Simulate a delay for API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock trails data
  return Array.from({ length: Math.min(limit, 10) }).map((_, i) => ({
    id: `osm-${source.country}-${offset + i}`,
    name: `${source.country} Trail ${offset + i}`,
    description: `A beautiful trail in ${source.country}`,
    location: `${source.country}`,
    country: source.country,
    state_province: ['California', 'Oregon', 'Washington', 'Colorado', 'Utah'][Math.floor(Math.random() * 5)],
    length: 1 + Math.random() * 10,
    length_km: 1 + Math.random() * 15,
    elevation: 100 + Math.floor(Math.random() * 1000),
    elevation_gain: 50 + Math.floor(Math.random() * 500),
    difficulty: ['easy', 'moderate', 'hard'][Math.floor(Math.random() * 3)],
    latitude: (Math.random() * 10) + 35,
    longitude: (Math.random() * -20) - 100,
    surface: ['dirt', 'gravel', 'paved'][Math.floor(Math.random() * 3)],
    trail_type: ['loop', 'out-and-back', 'point-to-point'][Math.floor(Math.random() * 3)],
    geojson: {
      type: "LineString",
      coordinates: [
        [(Math.random() * -20) - 100, (Math.random() * 10) + 35],
        [(Math.random() * -20) - 100, (Math.random() * 10) + 35],
        [(Math.random() * -20) - 100, (Math.random() * 10) + 35],
        [(Math.random() * -20) - 100, (Math.random() * 10) + 35]
      ]
    }
  }));
}

async function mockFetchUSGSTrails(source, limit, offset) {
  // Similar to the above but with USGS-specific attributes
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return Array.from({ length: Math.min(limit, 8) }).map((_, i) => ({
    id: `usgs-${offset + i}`,
    name: `USGS Trail ${offset + i}`,
    description: `A trail from USGS data`,
    location: `United States`,
    country: 'United States',
    state_province: ['California', 'Oregon', 'Washington', 'Colorado', 'Utah'][Math.floor(Math.random() * 5)],
    length: 1 + Math.random() * 15,
    length_km: 1 + Math.random() * 20,
    elevation: 100 + Math.floor(Math.random() * 2000),
    elevation_gain: 50 + Math.floor(Math.random() * 800),
    difficulty: ['easy', 'moderate', 'hard'][Math.floor(Math.random() * 3)],
    latitude: (Math.random() * 10) + 35,
    longitude: (Math.random() * -20) - 100,
    surface: ['dirt', 'gravel', 'paved'][Math.floor(Math.random() * 3)],
    trail_type: ['loop', 'out-and-back', 'point-to-point'][Math.floor(Math.random() * 3)],
    geojson: {
      type: "LineString",
      coordinates: [
        [(Math.random() * -20) - 100, (Math.random() * 10) + 35],
        [(Math.random() * -20) - 100, (Math.random() * 10) + 35],
        [(Math.random() * -20) - 100, (Math.random() * 10) + 35]
      ]
    }
  }));
}

async function mockFetchGenericTrails(source, limit, offset) {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return Array.from({ length: Math.min(limit, 5) }).map((_, i) => ({
    id: `${source.source_type}-${offset + i}`,
    name: `${source.source_type} Trail ${offset + i}`,
    description: `Generic trail from ${source.name}`,
    location: source.country || 'Unknown',
    country: source.country || 'Unknown',
    state_province: source.state_province || 'Unknown',
    length: 1 + Math.random() * 8,
    length_km: 1 + Math.random() * 12,
    elevation: 100 + Math.floor(Math.random() * 500),
    elevation_gain: 50 + Math.floor(Math.random() * 300),
    difficulty: ['easy', 'moderate', 'hard'][Math.floor(Math.random() * 3)],
    latitude: (Math.random() * 10) + 35,
    longitude: (Math.random() * -20) - 100,
    geojson: {
      type: "LineString",
      coordinates: [
        [(Math.random() * -20) - 100, (Math.random() * 10) + 35],
        [(Math.random() * -20) - 100, (Math.random() * 10) + 35]
      ]
    }
  }));
}
