
export interface ImportRequest {
  sources: string[];
  maxTrailsPerSource: number;
  batchSize?: number;
  concurrency?: number;
  priority?: string;
  target?: string;
  debug?: boolean;
  validation?: boolean;
  location?: {
    lat: number;
    lng: number;
    radius: number;
    city?: string;
    state?: string;
  };
}

export interface SourceResult {
  source: string;
  success: boolean;
  trails_added: number;
  trails_failed: number;
  trails_processed: number;
  success_rate: number;
  error_details?: string[];
  location: string;
  error?: string;
}
