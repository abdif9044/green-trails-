
// Trail generation utilities

import { getLocationAwareBaseData, getSourceDisplayName } from "./location-utils.ts";

export function createTestTrail(location?: { lat: number; lng: number; radius: number; city?: string; state?: string }): any {
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

export function generateTrailsForSource(sourceType: string, count: number, location?: { lat: number; lng: number; radius: number; city?: string; state?: string }): any[] {
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
      latitude: baseData.latitude + (Math.random() - 0.5) * 0.5,
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
