
export interface Trail {
  id: string;
  name: string;
  location: string;
  description: string;
  difficulty: 'easy' | 'moderate' | 'hard';
  length: number;
  elevation_gain: number;
  latitude: number;
  longitude: number;
  tags: string[];
  likes: number;
  coordinates: [number, number]; // [longitude, latitude] for map compatibility
  imageUrl?: string;
  category?: 'hiking' | 'biking' | 'offroad';
  country?: string;
  region?: string;
  is_age_restricted?: boolean;
  is_verified?: boolean;
  created_at?: string;
  updated_at?: string;
  // Additional properties for compatibility
  elevation?: number; // Alias for elevation_gain
  geojson?: any; // GeoJSON data for trail paths
  state_province?: string;
  strain_tags?: StrainTag[];
}

export interface DatabaseTrail {
  id: string;
  name: string;
  location: string;
  description: string;
  difficulty: 'easy' | 'moderate' | 'hard';
  length: number;
  elevation_gain: number;
  latitude: number;
  longitude: number;
  lat: number; // legacy column
  lon: number; // legacy column
  category: 'hiking' | 'biking' | 'offroad';
  country?: string;
  region?: string;
  source?: string;
  status: string;
  is_age_restricted?: boolean;
  is_verified?: boolean;
  created_at: string;
  updated_at?: string;
  route_geojson?: any;
  elevation?: number;
  geojson?: any;
  terrain_type?: string;
  user_id?: string;
  trail_tags?: any;
}

export interface TrailFilters {
  searchQuery?: string;
  difficulty?: '' | 'easy' | 'moderate' | 'hard';
  lengthRange?: [number, number];
  tags?: string[];
  country?: string;
  stateProvince?: string;
  nearbyCoordinates?: [number, number];
  radius?: number;
  strainTags?: StrainTag[];
  isAgeRestricted?: boolean;
  location?: {
    lat: number;
    lng: number;
    radius: number;
  };
}

export interface TrailInteraction {
  id: string;
  user_id: string;
  trail_id: string;
  interaction_type: 'view' | 'like' | 'comment' | 'share' | 'save';
  metadata?: any;
  created_at: string;
}

export interface TrailLike {
  id: string;
  user_id: string;
  trail_id: string;
  created_at: string;
}

export interface HikeSession {
  id: string;
  user_id: string;
  trail_id?: string;
  start_time: string;
  end_time?: string;
  duration?: number;
  total_distance?: number;
  total_elevation_gain?: number;
  status: 'active' | 'paused' | 'completed';
  positions?: any;
  created_at: string;
  updated_at: string;
}

export interface TrailComment {
  id: string;
  user_id: string;
  trail_id: string;
  content: string;
  created_at: string;
  updated_at?: string;
}

// Export missing types
export type TrailDifficulty = 'easy' | 'moderate' | 'hard';

export type StrainTag = 
  | 'creative'
  | 'energetic' 
  | 'focused'
  | 'relaxed'
  | 'sleepy'
  | 'uplifted';
