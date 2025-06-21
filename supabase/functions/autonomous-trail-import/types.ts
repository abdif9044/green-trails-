
export interface AutonomousImportConfig {
  targetTrails: number;
  maxRetries: number;
  batchSize: number;
  concurrency: number;
  phases: ImportPhase[];
  autoHeal: boolean;
  monitoringInterval: number;
}

export interface ImportPhase {
  name: string;
  trailCount: number;
  batchSize: number;
  concurrency: number;
  successThreshold: number; // Minimum success rate to continue
  autoRetry: boolean;
}

export interface ImportResult {
  success: boolean;
  message: string;
  jobId?: string;
  trailsImported: number;
  timeElapsed: number;
  phases: PhaseResult[];
}

export interface PhaseResult {
  phase: string;
  success: boolean;
  trailsProcessed: number;
  trailsAdded: number;
  trailsFailed: number;
  duration: number;
  errors: string[];
}

export interface GeographicDistribution {
  us: number;
  canada: number;
  mexico: number;
  global: number;
}

export interface TrailTemplate {
  id: string;
  name: string;
  location: string;
  difficulty: 'easy' | 'moderate' | 'hard' | 'expert';
  length: number;
  elevation: number;
  elevation_gain: number;
  latitude: number;
  longitude: number;
  description: string;
  terrain_type: string;
  country: string;
  state_province: string;
  region: string;
  is_verified: boolean;
  is_age_restricted: boolean;
}
