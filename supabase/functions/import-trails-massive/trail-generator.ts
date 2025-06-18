
import type { TrailData } from "./types.ts";

export function createTestTrail(location?: any): any {
  const testId = crypto.randomUUID();
  return {
    id: testId,
    name: "Schema Test Trail",
    location: "Test Location, USA",
    difficulty: "moderate",
    length: 2.5,
    elevation_gain: 200,
    elevation: 1000,
    country: "United States",
    state_province: "California",
    latitude: location?.lat || 37.7749,
    longitude: location?.lng || -122.4194,
    description: "Test trail for schema validation",
    user_id: null,
    is_verified: true,
    is_age_restricted: false,
    terrain_type: "dirt",
    region: "test"
  };
}

export function generateTrailsForSource(
  sourceType: string, 
  maxTrails: number, 
  location?: any
): any[] {
  const trails = [];
  const baseNames = [
    "Eagle Peak Trail", "Pine Ridge Loop", "Sunset Vista Trail", "Canyon Creek Path",
    "Mountain View Trail", "Forest Walk", "River Bend Trail", "Summit Challenge",
    "Nature Loop", "Wilderness Trail", "Valley Path", "Ridge Runner",
    "Lake Shore Trail", "Desert Vista", "Meadow Walk", "Rock Formation Trail",
    "Waterfall Hike", "Scenic Overlook", "Hidden Valley", "Ancient Forest Path"
  ];
  
  const difficulties = ["easy", "moderate", "hard"];
  const terrainTypes = ["dirt", "gravel", "rock", "paved"];
  const stateProvinces = [
    "California", "Colorado", "Utah", "Arizona", "Washington", "Oregon",
    "Montana", "Idaho", "Wyoming", "New Mexico", "Nevada", "Alaska"
  ];
  
  for (let i = 0; i < maxTrails; i++) {
    const baseName = baseNames[i % baseNames.length];
    const stateProvince = stateProvinces[i % stateProvinces.length];
    
    // Generate realistic coordinates based on location or default to US bounds
    let lat, lng;
    if (location) {
      // Generate within 50 miles of specified location
      const radius = 0.8; // roughly 50 miles in degrees
      lat = location.lat + (Math.random() - 0.5) * radius;
      lng = location.lng + (Math.random() - 0.5) * radius;
    } else {
      // Generate within US bounds
      lat = 25 + Math.random() * 24; // 25°N to 49°N
      lng = -125 + Math.random() * 57; // -125°W to -68°W
    }
    
    const difficulty = difficulties[i % difficulties.length];
    const length = Math.round((1 + Math.random() * 15) * 10) / 10; // 1-16 miles, rounded to 1 decimal
    const elevationGain = Math.floor(Math.random() * 3000); // 0-3000 feet
    const elevation = Math.floor(1000 + Math.random() * 8000); // 1000-9000 feet base elevation
    
    const trail = {
      id: crypto.randomUUID(),
      name: `${baseName} - ${sourceType.toUpperCase()} ${i + 1}`,
      location: `${baseName.split(' ')[0]} Area, ${stateProvince}`,
      difficulty: difficulty,
      length: length,
      elevation_gain: elevationGain,
      elevation: elevation,
      country: "United States",
      state_province: stateProvince,
      latitude: Math.round(lat * 1000000) / 1000000, // 6 decimal places
      longitude: Math.round(lng * 1000000) / 1000000,
      description: `A ${difficulty} ${length}-mile trail in ${stateProvince} with ${elevationGain} feet of elevation gain. Perfect for ${difficulty === 'easy' ? 'families and beginners' : difficulty === 'moderate' ? 'intermediate hikers' : 'experienced adventurers'}.`,
      terrain_type: terrainTypes[i % terrainTypes.length],
      region: stateProvince.toLowerCase().replace(' ', '_'),
      user_id: null,
      is_verified: true,
      is_age_restricted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    trails.push(trail);
  }
  
  return trails;
}
