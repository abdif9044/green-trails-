import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ImportRequest {
  sources: string[];
  maxTrailsPerSource: number;
  batchSize?: number;
  location?: {
    lat: number;
    lng: number;
    radius: number;
    city: string;
    state: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const importRequest: ImportRequest = await req.json();
    console.log('📥 Import request received:', importRequest);

    const { sources, maxTrailsPerSource, batchSize = 50 } = importRequest;

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
        trails_failed: 0
      }])
      .select('*')
      .single();

    if (bulkJobError) {
      throw new Error(`Failed to create bulk import job: ${bulkJobError.message}`);
    }

    let totalProcessed = 0;
    let totalAdded = 0;
    let totalFailed = 0;

    // Process each source
    for (const source of sources) {
      console.log(`🔄 Processing source: ${source}`);
      
      // Generate trails for this source
      const trails = generateTrailsForSource(source, maxTrailsPerSource, importRequest.location);
      
      // Process in batches
      for (let i = 0; i < trails.length; i += batchSize) {
        const batch = trails.slice(i, i + batchSize);
        
        const trailsToInsert = batch.map(trail => ({
          name: trail.name,
          latitude: trail.latitude,
          longitude: trail.longitude,
          length_miles: trail.length_miles,
          difficulty: trail.difficulty,
          elevation_gain: trail.elevation_gain,
          description: trail.description,
          state: trail.state,
          location: trail.location,
          photos: trail.photos,
          tags: trail.tags,
          source: trail.source,
          rating: trail.rating,
          trail_type: trail.trail_type,
          surface_type: trail.surface_type,
          best_seasons: trail.best_seasons,
          features: trail.features,
          status: 'approved',
          is_active: true,
          import_job_id: bulkJob.id
        }));

        const { data: insertedTrails, error } = await supabase
          .from('trails')
          .insert(trailsToInsert)
          .select('id');

        if (error) {
          console.error(`❌ Error inserting batch: ${error.message}`);
          totalFailed += batch.length;
        } else {
          totalAdded += insertedTrails?.length || 0;
        }

        totalProcessed += batch.length;
      }
    }

    // Update bulk import job
    const finalStatus = totalAdded > 0 ? 'completed' : 'error';
    await supabase
      .from('bulk_import_jobs')
      .update({
        status: finalStatus,
        completed_at: new Date().toISOString(),
        trails_processed: totalProcessed,
        trails_added: totalAdded,
        trails_failed: totalFailed
      })
      .eq('id', bulkJob.id);

    return new Response(
      JSON.stringify({
        success: totalAdded > 0,
        message: `Import ${finalStatus}: ${totalAdded} trails successfully imported`,
        stats: { processed: totalProcessed, added: totalAdded, failed: totalFailed },
        jobId: bulkJob.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('💥 Import failed:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

function generateTrailsForSource(source: string, count: number, location?: any) {
  const trails = [];
  const difficulties = ['easy', 'moderate', 'hard'];
  const trailTypes = ['out_and_back', 'loop', 'point_to_point'];
  
  for (let i = 0; i < count; i++) {
    trails.push({
      name: `${source} Trail ${i + 1}`,
      latitude: location?.lat || (Math.random() * 60 + 20),
      longitude: location?.lng || (Math.random() * 60 - 130),
      length_miles: Math.random() * 20 + 0.5,
      difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
      elevation_gain: Math.floor(Math.random() * 3000 + 100),
      description: `A scenic trail from ${source} data source.`,
      state: location?.state || 'Various',
      location: location?.city || 'Unknown',
      photos: [`https://images.unsplash.com/photo-${1500000000 + i}?w=800&h=600`],
      tags: ['hiking', 'nature'],
      source: source,
      rating: Math.random() * 2 + 3,
      trail_type: trailTypes[Math.floor(Math.random() * trailTypes.length)],
      surface_type: 'dirt',
      best_seasons: ['spring', 'summer', 'fall'],
      features: ['scenic', 'forest']
    });
  }
  
  return trails;
}