
export interface TrailData {
  id?: string;
  name: string;
  location: string;
  difficulty: 'easy' | 'moderate' | 'hard' | 'expert';
  length?: number;
  elevation?: number;
  elevation_gain?: number;
  latitude?: number;
  longitude?: number;
  description?: string;
  terrain_type?: string;
  country?: string;
  state_province?: string;
  region?: string;
  is_verified?: boolean;
  is_age_restricted?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ImportConfig {
  testMode: boolean;
  maxTrails: number;
  batchSize: number;
  parallelWorkers: number;
  validateFirst: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  trail: TrailData | null;
}
