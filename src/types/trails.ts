
export type TrailDifficulty = 'easy' | 'moderate' | 'hard' | 'expert';

export interface StrainTag {
  name: string;
  type: 'sativa' | 'indica' | 'hybrid';
  effects: string[];
  description?: string;
}

export interface Trail {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  difficulty: TrailDifficulty;
  length: number;
  elevation: number;
  tags: string[];
  likes: number;
  coordinates?: [number, number]; // [longitude, latitude]
  strainTags?: string[] | StrainTag[];
  isAgeRestricted: boolean;
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
  strainTypes?: ('sativa' | 'indica' | 'hybrid')[];
  showAgeRestricted?: boolean;
  country?: string;
  stateProvince?: string;
  nearbyCoordinates?: [number, number]; // [longitude, latitude]
  radius?: number; // Search radius in miles
}
