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
  bulkJobId?: string;
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
    
    // This would normally be a background process, but for demo purposes we'll do it synchronously
    // Real implementation would use a queue system or scheduled tasks
    
    // Fetch trail data based on source type
    let trails = [];
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
            difficulty: trail.difficulty || randomDifficulty(),
            geojson: trail.geojson,
            latitude: trail.latitude || null,
            longitude: trail.longitude || null,
            surface: trail.surface || randomSurface(),
            trail_type: trail.trail_type || randomTrailType(),
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

// Enhanced trail data generators with more variety and realism
async function enhancedFetchOverpassTrails(source, limit, offset) {
  // Simulate a delay for API call
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const states = ['California', 'Oregon', 'Washington', 'Colorado', 'Utah', 'Montana', 'Wyoming', 'Idaho', 
                  'New Mexico', 'Arizona', 'Nevada', 'Texas', 'Florida', 'North Carolina', 'Tennessee'];
  
  const cities = {
    'California': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'Yosemite', 'Lake Tahoe'],
    'Oregon': ['Portland', 'Eugene', 'Bend', 'Crater Lake', 'Hood River'],
    'Washington': ['Seattle', 'Olympia', 'Spokane', 'Tacoma', 'Mount Rainier'],
    'Colorado': ['Denver', 'Boulder', 'Colorado Springs', 'Aspen', 'Vail'],
    'Utah': ['Salt Lake City', 'Moab', 'Park City', 'Zion', 'Bryce Canyon'],
    'Montana': ['Bozeman', 'Missoula', 'Helena', 'Glacier National Park', 'Yellowstone'],
    'Wyoming': ['Jackson', 'Yellowstone', 'Grand Teton', 'Cody', 'Laramie'],
    'Idaho': ['Boise', 'Sun Valley', 'Coeur d\'Alene', 'Idaho Falls', 'Sandpoint'],
    'New Mexico': ['Santa Fe', 'Albuquerque', 'Taos', 'Roswell', 'Las Cruces'],
    'Arizona': ['Phoenix', 'Tucson', 'Sedona', 'Flagstaff', 'Grand Canyon'],
    'Nevada': ['Las Vegas', 'Reno', 'Lake Tahoe', 'Carson City', 'Red Rock Canyon'],
    'Texas': ['Austin', 'San Antonio', 'Houston', 'Dallas', 'Big Bend'],
    'Florida': ['Miami', 'Orlando', 'Tampa', 'Everglades', 'Key West'],
    'North Carolina': ['Asheville', 'Charlotte', 'Raleigh', 'Blue Ridge Mountains', 'Outer Banks'],
    'Tennessee': ['Nashville', 'Knoxville', 'Chattanooga', 'Great Smoky Mountains', 'Memphis']
  };
  
  const trailNames = [
    'Ridge Trail', 'Valley Path', 'Mountain Loop', 'Creek Crossing', 'Summit Route',
    'Forest Way', 'Lakeview Trail', 'River Run', 'Scenic Byway', 'Wilderness Path',
    'Overlook Circuit', 'Canyon Edge', 'Highland Trek', 'Meadow Walk', 'Waterfall Route',
    'Redwood Path', 'Coastal Trail', 'Desert Journey', 'Ancient Forest Trail', 'Glacier View',
    'Alpine Loop', 'Ridgeline Traverse', 'Wildflower Path', 'Eagle\'s Nest Trail', 'Sunset Ridge'
  ];
  
  const trailDescriptions = [
    'A beautiful trail with stunning views of the surrounding mountains and valleys.',
    'This moderately difficult trail takes you through lush forests and along a scenic creek.',
    'A challenging hike that rewards with panoramic views from the summit.',
    'An easy, family-friendly trail perfect for spotting local wildlife and plant species.',
    'This trail features a mix of terrain with several creek crossings and rocky outcroppings.',
    'A popular route for mountain bikers and hikers alike, offering technical sections and scenic vistas.',
    'This trail passes through old-growth forest with several spots to rest and enjoy the natural beauty.',
    'A loop trail that circles a pristine alpine lake with opportunities for swimming and fishing.',
    'This trail follows an ancient trading route used by indigenous peoples for centuries.',
    'A diverse ecosystem awaits on this trail, from desert scrub to riparian woodland.'
  ];
  
  // Return mock trails data with enhanced variety
  return Array.from({ length: Math.min(limit, 1000) }).map((_, i) => {
    const stateIndex = (offset + i) % states.length;
    const state = states[stateIndex];
    const city = cities[state][(offset + i) % cities[state].length];
    const trailNameIndex = (offset + i) % trailNames.length;
    const trailName = `${city} ${trailNames[trailNameIndex]}`;
    const descIndex = (offset + i) % trailDescriptions.length;
    
    const length = 1 + Math.random() * 15;
    const elevation = 100 + Math.floor(Math.random() * 1500);
    const elevationGain = Math.round(elevation * (0.2 + Math.random() * 0.4));
    
    const difficulty = randomDifficulty();
    const surface = randomSurface();
    const trailType = randomTrailType();
    
    // More varied coordinates across the US
    const lat = 34 + (Math.random() * 14 - 7);  // Roughly covers continental US
    const lng = -105 + (Math.random() * 30 - 15);
    
    // Generate more complex, realistic GeoJSON for trail paths
    const pathLength = 5 + Math.floor(Math.random() * 20); // More path points
    const startLat = lat;
    const startLng = lng;
    let coordinates = [[startLng, startLat]];
    
    // Create a somewhat realistic path that meanders
    let currentLat = startLat;
    let currentLng = startLng;
    const latScale = 0.01;
    const lngScale = 0.01;
    
    for (let p = 0; p < pathLength; p++) {
      // Add some randomness but keep a general direction
      const latChange = (Math.random() * 2 - 1) * latScale;
      const lngChange = (Math.random() * 2 - 1) * lngScale;
      currentLat += latChange;
      currentLng += lngChange;
      coordinates.push([currentLng, currentLat]);
    }
    
    return {
      id: `osm-${source.country}-${offset + i}`,
      name: trailName,
      description: trailDescriptions[descIndex],
      location: `${city}, ${state}`,
      country: source.country || 'United States',
      state_province: state,
      length: length,
      length_km: length * 1.60934,
      elevation: elevation,
      elevation_gain: elevationGain,
      difficulty: difficulty,
      latitude: lat,
      longitude: lng,
      surface: surface,
      trail_type: trailType,
      geojson: {
        type: "LineString",
        coordinates: coordinates
      }
    };
  });
}

async function enhancedFetchUSGSTrails(source, limit, offset) {
  // Similar to the above but with USGS-specific attributes
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const states = ['Alaska', 'Hawaii', 'Michigan', 'Minnesota', 'Wisconsin', 'Maine', 'Vermont', 
                 'New Hampshire', 'New York', 'Pennsylvania', 'Ohio', 'Indiana', 'Illinois'];
  
  const parkTypes = ['National Park', 'State Park', 'Wilderness Area', 'National Forest', 
                    'Recreation Area', 'National Monument', 'Wildlife Refuge'];
                    
  const parkNames = [
    'Yellowstone', 'Yosemite', 'Grand Canyon', 'Zion', 'Olympic',
    'Acadia', 'Glacier', 'Everglades', 'Sequoia', 'Shenandoah',
    'Joshua Tree', 'Death Valley', 'Arches', 'Badlands', 'Capitol Reef',
    'Great Smoky Mountains', 'Rocky Mountain', 'Grand Teton', 'Bryce Canyon', 'Canyonlands'
  ];
  
  return Array.from({ length: Math.min(limit, 1000) }).map((_, i) => {
    const stateIndex = (offset + i) % states.length;
    const state = states[stateIndex];
    
    const parkTypeIndex = (offset + i) % parkTypes.length;
    const parkType = parkTypes[parkTypeIndex];
    
    const parkNameIndex = (offset + i) % parkNames.length;
    const parkName = parkNames[parkNameIndex];
    
    const trailNum = offset + i + 1;
    const trailName = `${parkName} Trail #${trailNum}`;
    
    const length = 1.5 + Math.random() * 20;
    const elevation = 150 + Math.floor(Math.random() * 2500);
    const elevationGain = Math.round(elevation * (0.15 + Math.random() * 0.45));
    
    // Coordinates that roughly match the state
    let lat, lng;
    switch(state) {
      case 'Alaska':
        lat = 61 + Math.random() * 5;
        lng = -149 - Math.random() * 5;
        break;
      case 'Hawaii':
        lat = 20 + Math.random() * 2;
        lng = -156 - Math.random() * 2;
        break;
      default:
        lat = 38 + Math.random() * 10;
        lng = -95 - Math.random() * 20;
    }
    
    // Generate more complex, realistic GeoJSON for trail paths
    const pathLength = 8 + Math.floor(Math.random() * 25);
    const coordinates = generateTrailPath(lat, lng, pathLength);
    
    return {
      id: `usgs-${state.toLowerCase().replace(' ', '_')}-${offset + i}`,
      name: trailName,
      description: `A scenic trail in ${parkName} ${parkType}, offering spectacular views and wildlife spotting opportunities.`,
      location: `${parkName} ${parkType}, ${state}`,
      country: 'United States',
      state_province: state,
      length: length,
      length_km: length * 1.60934,
      elevation: elevation,
      elevation_gain: elevationGain,
      difficulty: randomDifficulty(),
      latitude: lat,
      longitude: lng,
      surface: randomSurface(),
      trail_type: randomTrailType(),
      geojson: {
        type: "LineString",
        coordinates: coordinates
      }
    };
  });
}

async function enhancedFetchCanadaParksTrails(source, limit, offset) {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const provinces = ['British Columbia', 'Alberta', 'Ontario', 'Quebec', 'Nova Scotia', 
                    'Yukon', 'Northwest Territories', 'Manitoba', 'Saskatchewan', 'Newfoundland'];
                    
  const parkNames = [
    'Banff', 'Jasper', 'Pacific Rim', 'Waterton Lakes', 'Yoho',
    'Kootenay', 'Fundy', 'Gros Morne', 'Bruce Peninsula', 'La Mauricie',
    'Kejimkujik', 'Riding Mountain', 'Wapusk', 'Elk Island', 'Mount Revelstoke'
  ];
  
  const trailFeatures = ['Lake', 'River', 'Falls', 'Mountain', 'Ridge', 'Glacier', 'Creek', 'Valley'];
  
  return Array.from({ length: Math.min(limit, 1000) }).map((_, i) => {
    const provinceIndex = (offset + i) % provinces.length;
    const province = provinces[provinceIndex];
    
    const parkNameIndex = (offset + i) % parkNames.length;
    const parkName = parkNames[parkNameIndex];
    
    const featureIndex = (offset + i) % trailFeatures.length;
    const feature = trailFeatures[featureIndex];
    
    const trailName = `${parkName} ${feature} Trail`;
    
    // Canadian trails tend to use km
    const lengthKm = 2 + Math.random() * 25;
    
    const elevation = 200 + Math.floor(Math.random() * 2000);
    const elevationGain = Math.round(elevation * (0.2 + Math.random() * 0.4));
    
    // Coordinates that roughly match the province
    let lat = 50 + Math.random() * 10;
    let lng = -110 - Math.random() * 20;
    
    // Generate realistic trail path
    const pathLength = 10 + Math.floor(Math.random() * 30);
    const coordinates = generateTrailPath(lat, lng, pathLength);
    
    return {
      id: `parks-canada-${province.toLowerCase().replace(' ', '_')}-${offset + i}`,
      name: trailName,
      description: `Experience the beauty of Canadian wilderness on this ${randomDifficulty()} trail in ${parkName} National Park.`,
      location: `${parkName} National Park, ${province}`,
      country: 'Canada',
      state_province: province,
      length_km: lengthKm,
      length: lengthKm * 0.621371,  // Convert to miles
      elevation: elevation,
      elevation_gain: elevationGain,
      difficulty: randomDifficulty(),
      latitude: lat,
      longitude: lng,
      surface: randomSurface(),
      trail_type: randomTrailType(),
      geojson: {
        type: "LineString",
        coordinates: coordinates
      }
    };
  });
}

async function enhancedFetchMexicoTrails(source, limit, offset) {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const states = ['Baja California', 'Chihuahua', 'Oaxaca', 'Jalisco', 'Yucatán', 
                 'Quintana Roo', 'Michoacán', 'Veracruz', 'Puebla', 'Nuevo León'];
                 
  const landmarks = [
    'Sierra Madre', 'Copper Canyon', 'Pico de Orizaba', 'Tulum', 'Chichen Itza',
    'Teotihuacan', 'Palenque', 'Monarch Butterfly Reserve', 'Sumidero Canyon', 'Huasteca Potosina'
  ];
  
  const trailTypes = ['Sendero', 'Ruta', 'Camino', 'Vereda', 'Paso'];
  
  return Array.from({ length: Math.min(limit, 1000) }).map((_, i) => {
    const stateIndex = (offset + i) % states.length;
    const state = states[stateIndex];
    
    const landmarkIndex = (offset + i) % landmarks.length;
    const landmark = landmarks[landmarkIndex];
    
    const trailTypeIndex = (offset + i) % trailTypes.length;
    const trailType = trailTypes[trailTypeIndex];
    
    const trailName = `${trailType} ${landmark}`;
    
    const lengthKm = 1.5 + Math.random() * 18;
    const elevation = 100 + Math.floor(Math.random() * 1800);
    const elevationGain = Math.round(elevation * (0.15 + Math.random() * 0.4));
    
    // Coordinates in Mexico
    const lat = 19 + Math.random() * 6;
    const lng = -99 - Math.random() * 10;
    
    // Generate trail path
    const pathLength = 7 + Math.floor(Math.random() * 20);
    const coordinates = generateTrailPath(lat, lng, pathLength);
    
    return {
      id: `inegi-mx-${state.toLowerCase().replace(' ', '_')}-${offset + i}`,
      name: trailName,
      description: `Explore the natural beauty of Mexico on this trail through ${landmark}.`,
      location: `${landmark}, ${state}`,
      country: 'Mexico',
      state_province: state,
      length_km: lengthKm,
      length: lengthKm * 0.621371,
      elevation: elevation,
      elevation_gain: elevationGain,
      difficulty: randomDifficulty(),
      latitude: lat,
      longitude: lng,
      surface: randomSurface(),
      trail_type: randomTrailType(),
      geojson: {
        type: "LineString",
        coordinates: coordinates
      }
    };
  });
}

async function enhancedFetchGenericTrails(source, limit, offset) {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const regions = source.state_province 
    ? [`${source.state_province}, ${source.country}`] 
    : [`North Region, ${source.country}`, `South Region, ${source.country}`, 
       `East Region, ${source.country}`, `West Region, ${source.country}`, 
       `Central Region, ${source.country}`];
  
  return Array.from({ length: Math.min(limit, 1000) }).map((_, i) => {
    const regionIndex = (offset + i) % regions.length;
    const region = regions[regionIndex];
    
    const trailNum = offset + i + 1;
    const trailName = `${source.country} Trail ${trailNum}`;
    
    const length = 1 + Math.random() * 12;
    const elevation = 100 + Math.floor(Math.random() * 1000);
    const elevationGain = Math.round(elevation * (0.2 + Math.random() * 0.3));
    
    // Generate somewhat realistic coordinates based on country
    let lat, lng;
    switch(source.country) {
      case 'Australia':
        lat = -25 + Math.random() * 10;
        lng = 135 + Math.random() * 10;
        break;
      case 'New Zealand':
        lat = -40 + Math.random() * 5;
        lng = 175 + Math.random() * 5;
        break;
      case 'United Kingdom':
        lat = 55 + Math.random() * 5;
        lng = -3 + Math.random() * 5;
        break;
      default:
        lat = (Math.random() * 60) - 30;  // Default range
        lng = (Math.random() * 360) - 180;
    }
    
    // Generate trail path
    const pathLength = 5 + Math.floor(Math.random() * 15);
    const coordinates = generateTrailPath(lat, lng, pathLength);
    
    return {
      id: `${source.source_type}-${source.country.toLowerCase().replace(' ', '_')}-${offset + i}`,
      name: trailName,
      description: `A ${randomDifficulty()} trail in the beautiful ${region} region.`,
      location: region,
      country: source.country || 'Unknown',
      state_province: source.state_province || region.split(',')[0].trim(),
      length: length,
      length_km: length * 1.60934,
      elevation: elevation,
      elevation_gain: elevationGain,
      difficulty: randomDifficulty(),
      latitude: lat,
      longitude: lng,
      surface: randomSurface(),
      trail_type: randomTrailType(),
      geojson: {
        type: "LineString",
        coordinates: coordinates
      }
    };
  });
}

// Helper functions for generating realistic trail data
function randomDifficulty() {
  const difficulties = ['easy', 'moderate', 'hard', 'expert'];
  const weights = [0.3, 0.4, 0.2, 0.1]; // 30% easy, 40% moderate, 20% hard, 10% expert
  
  const random = Math.random();
  let cumulativeWeight = 0;
  
  for (let i = 0; i < difficulties.length; i++) {
    cumulativeWeight += weights[i];
    if (random < cumulativeWeight) {
      return difficulties[i];
    }
  }
  
  return 'moderate'; // Default fallback
}

function randomSurface() {
  const surfaces = ['dirt', 'gravel', 'paved', 'rocky', 'sand', 'mixed', 'boardwalk'];
  const weights = [0.4, 0.25, 0.1, 0.15, 0.05, 0.03, 0.02];
  
  const random = Math.random();
  let cumulativeWeight = 0;
  
  for (let i = 0; i < surfaces.length; i++) {
    cumulativeWeight += weights[i];
    if (random < cumulativeWeight) {
      return surfaces[i];
    }
  }
  
  return 'dirt'; // Default fallback
}

function randomTrailType() {
  const trailTypes = ['loop', 'out-and-back', 'point-to-point', 'network', 'lollipop'];
  const weights = [0.35, 0.4, 0.15, 0.05, 0.05];
  
  const random = Math.random();
  let cumulativeWeight = 0;
  
  for (let i = 0; i < trailTypes.length; i++) {
    cumulativeWeight += weights[i];
    if (random < cumulativeWeight) {
      return trailTypes[i];
    }
  }
  
  return 'out-and-back'; // Default fallback
}

function generateTrailPath(startLat, startLng, numPoints) {
  const coordinates = [[startLng, startLat]];
  let currentLat = startLat;
  let currentLng = startLng;
  
  // Create a more natural path by maintaining a general direction with some variance
  const latScale = 0.005 + (Math.random() * 0.01);
  const lngScale = 0.005 + (Math.random() * 0.01);
  
  // Determine if this is a loop trail (45% chance)
  const isLoop = Math.random() < 0.45;
  
  // For loops, we'll plan a route that eventually returns near the start
  let generalLatDir = Math.random() > 0.5 ? 1 : -1;
  let generalLngDir = Math.random() > 0.5 ? 1 : -1;
  let directionChanges = 0;
  
  for (let p = 0; p < numPoints; p++) {
    // Occasionally adjust the general direction to create curves
    if (Math.random() < 0.2) {
      generalLatDir *= (Math.random() > 0.7 ? -1 : 1);
      directionChanges++;
    }
    if (Math.random() < 0.2) {
      generalLngDir *= (Math.random() > 0.7 ? -1 : 1);
      directionChanges++;
    }
    
    // For loops, start heading back to the origin after halfway
    if (isLoop && p > numPoints * 0.6) {
      // Calculate direction to return to start
      const latDiff = startLat - currentLat;
      const lngDiff = startLng - currentLng;
      
      generalLatDir = latDiff > 0 ? 1 : -1;
      generalLngDir = lngDiff > 0 ? 1 : -1;
    }
    
    // Add some randomness but keep the general direction
    const latChange = ((Math.random() * 0.8) + 0.2) * generalLatDir * latScale;
    const lngChange = ((Math.random() * 0.8) + 0.2) * generalLngDir * lngScale;
    
    currentLat += latChange;
    currentLng += lngChange;
    
    coordinates.push([currentLng, currentLat]);
  }
  
  return coordinates;
}

async function addStrainTagsToTrail(supabase, trailId, strainTags) {
  for (const tag of strainTags) {
    try {
      // First ensure the strain tag exists in the tags table
      const { data: tagData, error: tagError } = await supabase
        .from('tags')
        .upsert({
          name: tag.name,
          tag_type: 'strain',
          details: {
            type: tag.type,
            effects: tag.effects,
            description: tag.description
          }
        }, { onConflict: 'name', returning: true })
        .select('id')
        .single();
      
      if (tagError || !tagData) {
        console.error('Error upserting strain tag:', tagError);
        continue;
      }
      
      // Then add the tag to the trail
      await supabase
        .from('trail_tags')
        .upsert({
          trail_id: trailId,
          tag_id: tagData.id,
          is_strain_tag: true
        }, { onConflict: ['trail_id', 'tag_id'] });
        
    } catch (error) {
      console.error('Error adding strain tag to trail:', error);
    }
  }
}

async function addTagsToTrail(supabase, trailId, tags) {
  for (const tagName of tags) {
    try {
      // First ensure the tag exists in the tags table
      const { data: tagData, error: tagError } = await supabase
        .from('tags')
        .upsert({
          name: tagName,
          tag_type: 'regular'
        }, { onConflict: 'name', returning: true })
        .select('id')
        .single();
      
      if (tagError || !tagData) {
        console.error('Error upserting tag:', tagError);
        continue;
      }
      
      // Then add the tag to the trail
      await supabase
        .from('trail_tags')
        .upsert({
          trail_id: trailId,
          tag_id: tagData.id,
          is_strain_tag: false
        }, { onConflict: ['trail_id', 'tag_id'] });
        
    } catch (error) {
      console.error('Error adding tag to trail:', error);
    }
  }
}

function generateRandomTags(trail) {
  const allTags = [
    'Hiking', 'Walking', 'Mountain Biking', 'Kid Friendly', 'Dog Friendly',
    'Scenic Views', 'Waterfall', 'Lake', 'River', 'Wildlife',
    'Wildflowers', 'Fall Colors', 'Forest', 'Mountain', 'Desert',
    'Beach', 'Rocky', 'Bird Watching', 'Camping', 'Backpacking',
    'Fishing', 'Horseback Riding', 'ADA Accessible', 'Historical', 'Cave',
    'Hot Springs', 'Photography', 'Stargazing', 'Snow', 'Waterfront'
  ];
  
  // Select 2-6 random tags
  const numTags = 2 + Math.floor(Math.random() * 5);
  const tags = [];
  
  // Always add tags based on trail properties
  if (trail.surface) tags.push(trail.surface.charAt(0).toUpperCase() + trail.surface.slice(1));
  if (trail.trail_type) {
    const formattedType = trail.trail_type
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    tags.push(formattedType);
  }
  
  // Add random tags from the pool
  while (tags.length < numTags) {
    const randomTag = allTags[Math.floor(Math.random() * allTags.length)];
    if (!tags.includes(randomTag)) {
      tags.push(randomTag);
    }
  }
  
  return tags;
}

function generateRandomStrainTags() {
  // Common cannabis strain names
  const strainNames = [
    'Blue Dream', 'OG Kush', 'Green Crack', 'Sour Diesel', 'Purple Haze',
    'White Widow', 'Jack Herer', 'Pineapple Express', 'Girl Scout Cookies', 'Northern Lights',
    'Granddaddy Purple', 'Durban Poison', 'AK-47', 'Strawberry Cough', 'Bubba Kush',
    'Trainwreck', 'Amnesia Haze', 'Cherry Pie', 'Blueberry', 'Gorilla Glue',
    'Skywalker OG', 'Tangie', 'G13', 'Super Lemon Haze', 'Golden Goat'
  ];
  
  // Strain types
  const strainTypes = ['sativa', 'indica', 'hybrid'];
  
  // Possible effects
  const effects = [
    'Relaxed', 'Happy', 'Euphoric', 'Uplifted', 'Creative',
    'Energetic', 'Focused', 'Tingly', 'Giggly', 'Hungry',
    'Sleepy', 'Talkative', 'Pain Relief', 'Stress Relief', 'Anxiety Relief'
  ];
  
  // Generate 1-3 strain tags
  const numStrains = 1 + Math.floor(Math.random() * 2);
  const strains = [];
  
  for (let i = 0; i < numStrains; i++) {
    const nameIndex = Math.floor(Math.random() * strainNames.length);
    const name = strainNames[nameIndex];
    
    // Don't duplicate strain names
    if (strains.some(s => s.name === name)) continue;
    
    const typeIndex = Math.floor(Math.random() * strainTypes.length);
    const type = strainTypes[typeIndex];
    
    // Generate 2-4 random effects
    const numEffects = 2 + Math.floor(Math.random() * 3);
    const strainEffects = [];
    while (strainEffects.length < numEffects) {
      const effectIndex = Math.floor(Math.random() * effects.length);
      const effect = effects[effectIndex];
      if (!strainEffects.includes(effect)) {
        strainEffects.push(effect);
      }
    }
    
    const descriptions = [
      `A ${type} strain known for its ${strainEffects.join(' and ')} effects.`,
      `This popular ${type} offers a balance of ${strainEffects.join(', ')}.`,
      `${name} is a classic ${type} strain that provides ${strainEffects.join(' and ')}.`
    ];
    
    strains.push({
      name,
      type,
      effects: strainEffects,
      description: descriptions[Math.floor(Math.random() * descriptions.length)]
    });
  }
  
  return strains;
}
