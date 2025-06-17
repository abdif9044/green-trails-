// Trail generation utilities

import { getLocationAwareBaseData, getSourceDisplayName } from "./location-utils.ts";

export const createTestTrail = (location?: any) => {
  const testTrail = {
    id: crypto.randomUUID(),
    name: 'Recovery Test Trail',
    location: location ? `${location.lat}, ${location.lng}` : 'Test Location, USA',
    country: 'USA',
    state_province: 'Test State',
    difficulty: 'easy' as const,
    length: 1.0,
    elevation_gain: 50,
    elevation: 1000,
    latitude: location?.lat || 45.0,
    longitude: location?.lng || -93.0,
    trail_type: 'hiking',
    surface: 'dirt',
    is_age_restricted: false,
    is_verified: true,
    description: 'Test trail for recovery validation',
    user_id: null
  };

  console.log('🧪 Created test trail for recovery:', testTrail.name);
  return testTrail;
};

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
