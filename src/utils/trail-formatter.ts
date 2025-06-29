
import { Trail, StrainTag } from '@/types/trails';

// Define the database trail type based on the error message
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

export const formatTrailFromDatabase = (dbTrail: DatabaseTrail): Trail => {
  const mockStrainTags: StrainTag[] = ['creative', 'relaxed'];

  return {
    id: dbTrail.id,
    name: dbTrail.name,
    location: dbTrail.location,
    description: dbTrail.description,
    imageUrl: '/placeholder.svg',
    difficulty: dbTrail.difficulty as 'easy' | 'moderate' | 'hard' | 'expert',
    length: dbTrail.trail_length,
    elevation: dbTrail.elevation,
    elevation_gain: dbTrail.elevation_gain,
    latitude: dbTrail.latitude,
    longitude: dbTrail.longitude,
    tags: dbTrail.trail_tags.map(tag => tag.tag_name),
    likes: 45,
    coordinates: [dbTrail.longitude, dbTrail.latitude] as [number, number],
    strain_tags: mockStrainTags
  };
};

export const formatTrailData = (trailId: string): Trail => {
  const mockStrainTags: StrainTag[] = ['creative', 'relaxed'];

  return {
    id: trailId,
    name: 'Sample Trail',
    location: 'Sample Location',
    description: 'A beautiful trail with stunning views',
    imageUrl: '/placeholder.svg',
    difficulty: 'moderate' as const,
    length: 5.2,
    elevation: 1200,
    elevation_gain: 800,
    latitude: 40.7128,
    longitude: -74.0060,
    tags: ['hiking', 'scenic'],
    likes: 45,
    coordinates: [-74.0060, 40.7128] as [number, number],
    strain_tags: mockStrainTags
  };
};
