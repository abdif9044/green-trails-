
export type TrailDifficulty = 'easy' | 'moderate' | 'hard' | 'expert';

export interface Trail {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  difficulty: TrailDifficulty;
  length: number;
  elevation: number;
  elevation_gain: number;
  tags: string[];
  likes: number;
  coordinates?: [number, number]; // [longitude, latitude]
  description?: string;
  country?: string;
  state_province?: string;
  surface?: string;
  trail_type?: string;
  geojson?: any; // GeoJSON data for trail path
  source?: string;
  source_id?: string;
}

export interface TrailFilters {
  searchQuery?: string;
  difficulty?: string | null;
  lengthRange?: [number, number];
  tags?: string[];
  country?: string;
  stateProvince?: string;
  nearbyCoordinates?: [number, number]; // [longitude, latitude]
  radius?: number; // Search radius in miles
}
