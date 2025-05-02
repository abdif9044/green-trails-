
// Type definitions for the import trails function

export interface ImportRequest {
  sourceId: string;
  limit?: number;
  offset?: number;
  bulkJobId?: string;
}

export interface TrailData {
  id: string;
  name: string;
  description?: string;
  location: string;
  country: string;
  state_province: string;
  length?: number;
  length_km?: number;
  elevation?: number;
  elevation_gain?: number;
  difficulty: string;
  latitude?: number;
  longitude?: number;
  surface?: string;
  trail_type?: string;
  geojson?: any;
}

export interface StrainTag {
  name: string;
  type: string;
  effects: string[];
  description?: string;
}

export interface TrailDataSource {
  id: string;
  name: string;
  source_type: string;
  url?: string;
  country?: string;
  state_province?: string;
  region?: string;
  config?: any;
}
