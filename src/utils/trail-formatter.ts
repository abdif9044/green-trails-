
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
  const mockStrainTags: StrainTag[] = [
    {
      id: '1',
      name: 'Blue Dream',
      type: 'hybrid',
      effects: ['relaxed', 'creative'],
      description: 'A balanced hybrid strain'
    }
  ];

  return {
    id: dbTrail.id,
    name: dbTrail.name,
    location: dbTrail.location,
    imageUrl: '/placeholder.svg',
    difficulty: dbTrail.difficulty as 'easy' | 'moderate' | 'hard',
    length: dbTrail.trail_length,
    elevation: dbTrail.elevation,
    elevation_gain: dbTrail.elevation_gain,
    tags: dbTrail.trail_tags.map(tag => tag.tag_name),
    likes: 45,
    coordinates: [dbTrail.latitude, dbTrail.longitude],
    description: dbTrail.description,
    strainTags: mockStrainTags
  };
};

export const formatTrailData = (trailId: string): Trail => {
  const mockStrainTags: StrainTag[] = [
    {
      id: '1',
      name: 'Blue Dream',
      type: 'hybrid',
      effects: ['relaxed', 'creative'],
      description: 'A balanced hybrid strain'
    }
  ];

  return {
    id: trailId,
    name: 'Sample Trail',
    location: 'Sample Location',
    imageUrl: '/placeholder.svg',
    difficulty: 'moderate',
    length: 5.2,
    elevation: 1200,
    elevation_gain: 800,
    tags: ['hiking', 'scenic'],
    likes: 45,
    coordinates: [40.7128, -74.0060],
    description: 'A beautiful trail with stunning views',
    strainTags: mockStrainTags
  };
};
