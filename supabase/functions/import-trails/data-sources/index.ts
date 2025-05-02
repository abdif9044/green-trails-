
import { TrailData, TrailDataSource } from "../types.ts";
import { 
  randomDifficulty, 
  randomSurface, 
  randomTrailType, 
  generateTrailPath 
} from "../utils/generator-helpers.ts";

export { 
  enhancedFetchOverpassTrails,
  enhancedFetchUSGSTrails,
  enhancedFetchCanadaParksTrails,
  enhancedFetchMexicoTrails,
  enhancedFetchGenericTrails
};

async function enhancedFetchOverpassTrails(source: TrailDataSource, limit: number, offset: number): Promise<TrailData[]> {
  // Simulate a delay for API call
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const states = ['California', 'Oregon', 'Washington', 'Colorado', 'Utah', 'Montana', 'Wyoming', 'Idaho', 
                'New Mexico', 'Arizona', 'Nevada', 'Texas', 'Florida', 'North Carolina', 'Tennessee'];

  const cities: Record<string, string[]> = {
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
    const coordinates = generateTrailPath(lat, lng, pathLength);
    
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

async function enhancedFetchUSGSTrails(source: TrailDataSource, limit: number, offset: number): Promise<TrailData[]> {
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

async function enhancedFetchCanadaParksTrails(source: TrailDataSource, limit: number, offset: number): Promise<TrailData[]> {
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

async function enhancedFetchMexicoTrails(source: TrailDataSource, limit: number, offset: number): Promise<TrailData[]> {
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

async function enhancedFetchGenericTrails(source: TrailDataSource, limit: number, offset: number): Promise<TrailData[]> {
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
