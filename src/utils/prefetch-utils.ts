
import { formatTrailFromDatabase } from '@/utils/trail-formatter';

// Define the database trail type
interface DatabaseTrail {
  country: string;
  created_at: string;
  description: string;
  difficulty: string;
  elevation: number;
  elevation_gain: number;
  geojson: any;
  id: string;
  is_age_restricted: boolean;
  is_verified: boolean;
  latitude: number;
  longitude: number;
  location: string;
  name: string;
  region: string;
  terrain_type: string;
  trail_length: number;
  trail_tags: Array<{ tag_name: string }>;
  updated_at: string;
  user_id: string;
}

export const prefetchTrailData = async (trailIds: string[]) => {
  // Mock function for prefetching trail data
  console.log('Prefetching trail data for:', trailIds);
  
  // This would normally make API calls to fetch trail data
  // For now, return mock data
  return trailIds.map(id => ({
    id,
    name: `Trail ${id}`,
    location: 'Sample Location',
    description: 'A sample trail',
    difficulty: 'moderate',
    elevation: 1000,
    elevation_gain: 500,
    trail_length: 3.0,
    latitude: 40.7128,
    longitude: -74.0060,
    country: 'US',
    region: 'Northeast',
    terrain_type: 'forest',
    is_age_restricted: false,
    is_verified: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: 'mock-user',
    geojson: null,
    trail_tags: [{ tag_name: 'hiking' }]
  }));
};

export const formatPrefetchedTrails = (dbTrails: DatabaseTrail[]) => {
  return dbTrails.map(formatTrailFromDatabase);
};

export const prefetchAndFormatTrails = async (trailIds: string[]) => {
  const dbTrails = await prefetchTrailData(trailIds);
  return formatPrefetchedTrails(dbTrails);
};
