
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "./utils/cors.ts";
import { ImportRequest, TrailData } from "./types.ts";
import { 
  enhancedFetchOverpassTrails, 
  enhancedFetchUSGSTrails,
  enhancedFetchCanadaParksTrails,
  enhancedFetchMexicoTrails,
  enhancedFetchGenericTrails
} from "./data-sources/index.ts";
import { 
  addStrainTagsToTrail, 
  addTagsToTrail, 
  generateRandomStrainTags, 
  generateRandomTags 
} from "./utils/tag-helpers.ts";

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
    const { sourceId, limit = 100, offset = 0, bulkJobId } = await req.json() as ImportRequest;
    
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
        started_at: new Date().toISOString(),
        bulk_job_id: bulkJobId
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
    
    // Fetch trail data based on source type
    let trails: TrailData[] = [];
    let processedCount = 0;
    let addedCount = 0;
    let updatedCount = 0;
    let failedCount = 0;
    let errorMessage = null;
    
    try {
      // Generate more realistic, varied trail data
      console.log(`Importing from ${source.name} (${source.source_type})`);
      
      switch (source.source_type) {
        case 'overpass':
          trails = await enhancedFetchOverpassTrails(source, limit, offset);
          break;
        case 'usgs':
          trails = await enhancedFetchUSGSTrails(source, limit, offset);
          break;
        case 'canada_parks':
          trails = await enhancedFetchCanadaParksTrails(source, limit, offset);
          break;
        case 'inegi_mx':
          trails = await enhancedFetchMexicoTrails(source, limit, offset);
          break;
        default:
          trails = await enhancedFetchGenericTrails(source, limit, offset);
      }
      
      processedCount = trails.length;
      
      // Insert/update trails in database with more complete data
      for (const trail of trails) {
        // Generate strain tags for certain trails (about 20%)
        let strainTags = [];
        if (Math.random() < 0.2) {
          strainTags = generateRandomStrainTags();
        }
        
        const isAgeRestricted = strainTags.length > 0;
        
        const { data, error } = await supabase
          .from('trails')
          .upsert([{
            name: trail.name,
            description: trail.description || null,
            location: trail.location,
            country: trail.country,
            state_province: trail.state_province,
            length_km: trail.length_km || trail.length || 0,
            length: trail.length || trail.length_km || 0,
            elevation_gain: trail.elevation_gain || Math.floor(Math.random() * 800),
            elevation: trail.elevation || Math.floor(Math.random() * 2000),
            difficulty: trail.difficulty,
            geojson: trail.geojson,
            latitude: trail.latitude || null,
            longitude: trail.longitude || null,
            surface: trail.surface,
            trail_type: trail.trail_type,
            is_age_restricted: isAgeRestricted,
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
            
            // Handle strain tags if present
            if (strainTags.length > 0) {
              await addStrainTagsToTrail(supabase, data[0].id, strainTags);
            }
            
            // Add regular tags
            await addTagsToTrail(supabase, data[0].id, generateRandomTags(trail));
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
        source_id: sourceId,
        status: errorMessage ? 'error' : 'completed',
        trails_processed: processedCount,
        trails_added: addedCount,
        trails_updated: updatedCount,
        trails_failed: failedCount,
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
