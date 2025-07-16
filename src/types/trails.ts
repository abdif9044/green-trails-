
// Core trail types for the GreenTrails application

export type TrailDifficulty = 'easy' | 'moderate' | 'hard' | 'expert';
export type TrailCategory = 'hiking' | 'biking' | 'offroad';
export type StrainTag = 'relaxed' | 'energetic' | 'creative' | 'focused' | 'social' | 'adventurous';

export interface Trail {
  id: string;
  name: string;
  location: string;
  description: string;
  imageUrl: string;
  difficulty: TrailDifficulty;
  length: number;
  elevation: number;
  elevation_gain: number;
  latitude: number;
  longitude: number;
  coordinates: [number, number];
  tags: string[];
  likes: number;
  category?: TrailCategory;
  country?: string;
  region?: string;
  state_province?: string;
  is_age_restricted?: boolean;
  is_verified?: boolean;
  created_at?: string;
  updated_at?: string;
  strain_tags?: StrainTag[];
  estimated_time?: string;
  trail_type?: string;
  geojson?: any;
  photos?: string[];
  features?: string[];
  surface_type?: string;
  permit_required?: boolean;
  dogs_allowed?: boolean;
  camping_available?: boolean;
  data_quality_score?: number;
  elevation_profile?: any[];
  waypoints?: Waypoint[];
}

export interface Waypoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  description?: string;
  waypoint_type: string;
  distance_from_start?: number;
  photos?: string[];
  coordinates_3d?: any;
  coordinates?: [number, number, number]; // Updated to support 3D coordinates for 3D viewer
  type?: string;
}

export interface NavigationState {
  currentPosition: [number, number];
  targetWaypoint?: Waypoint;
  isNavigating: boolean;
  route?: [number, number][];
  nextWaypoint?: Waypoint;
  distanceToNext?: number;
}

export interface TrailComment {
  id: string;
  user_id: string;
  trail_id: string;
  content: string;
  created_at: string;
  user: {
    id: string;
    username: string;
    avatar_url: string;
    full_name: string;
  };
}

export interface DatabaseTrail {
  id: string;
  name: string;
  location: string;
  description: string;
  difficulty: string;
  length: number;
  elevation_gain: number;
  latitude: number;
  longitude: number;
  lat: number;
  lon: number;
  source: string;
  status: string;
  created_at: string;
  updated_at: string;
  category: string;
  country: string;
  region: string;
  is_age_restricted: boolean;
  is_verified: boolean;
  geojson?: any;
  photos?: string[];
  tags?: string[];
  features?: string[];
  surface_type?: string;
  permit_required?: boolean;
  dogs_allowed?: boolean;
  camping_available?: boolean;
  data_quality_score?: number;
}

export interface TrailFilters {
  searchQuery?: string;
  difficulty?: TrailDifficulty | '';
  lengthRange?: [number, number];
  country?: string;
  stateProvince?: string;
  tags?: string[];
  category?: TrailCategory;
  isAgeRestricted?: boolean;
  nearbyCoordinates?: [number, number];
  radius?: number;
}

export interface TrailSearchParams {
  filters?: TrailFilters;
  page?: number;
  limit?: number;
}

export interface TrailStats {
  total_trails: number;
  active_trails: number;
  trails_by_difficulty: Record<string, number>;
  average_length: number;
  total_elevation_gain: number;
}
