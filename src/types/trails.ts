
export interface Trail {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  difficulty: 'easy' | 'moderate' | 'hard';
  length: number;
  elevation: number;
  elevation_gain: number;
  tags: string[];
  likes: number;
  coordinates?: [number, number];
  description?: string;
  country?: string;
  state_province?: string;
  surface?: string;
  trail_type?: string;
  source?: string;
  source_id?: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  is_verified?: boolean;
  geojson?: any;
  length_km?: number;
  last_updated?: string;
  latitude?: number;
  longitude?: number;
}

export interface TrailFilters {
  searchQuery?: string;
  difficulty?: string;
  lengthRange?: [number, number];
  tags?: string[];
  country?: string;
  stateProvince?: string;
  nearbyCoordinates?: [number, number];
  radius?: number;
  showAgeRestricted?: boolean;
  filters?: any;
}

export interface TrailComment {
  id: string;
  user_id: string;
  trail_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user?: {
    username?: string;
    full_name?: string;
    avatar_url?: string;
  };
}

export interface TrailRating {
  id: string;
  user_id: string;
  trail_id: string;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface TrailWeather {
  id: string;
  trail_id: string;
  temperature?: number;
  high?: number;
  low?: number;
  condition?: string;
  precipitation?: string;
  wind_speed?: string;
  wind_direction?: string;
  sunrise?: string;
  sunset?: string;
  updated_at: string;
}

export interface ParkingSpot {
  id: string;
  trail_id: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  is_free: boolean;
  capacity?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type TrailDifficulty = 'easy' | 'moderate' | 'hard';

export interface StrainTag {
  id: string;
  name: string;
  type: 'sativa' | 'indica' | 'hybrid';
  effects: string[];
  description?: string;
}
