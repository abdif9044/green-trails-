
export interface TrailDataSource {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  type: string;
  enabled: boolean;
  source_type: string;
  url: string;
  country: string;
  state_province: string | null;
  region: string;
  last_synced: string | null;
  next_sync: string | null;
  is_active: boolean;
  config: any;
  created_at: string;
  updated_at: string;
}

export interface ImportJob {
  id: string;
  source_id: string;
  status: string;
  started_at: string;
  completed_at?: string;
  trails_processed: number;
  trails_added: number;
  trails_updated: number;
  error_message?: string;
  bulk_job_id?: string;
}

export interface BulkImportJob {
  id: string;
  total_trails_requested: number;
  total_sources: number;
  trails_processed: number;
  trails_added: number;
  trails_updated: number;
  trails_failed: number;
  status: string;
  started_at: string;
  completed_at?: string;
  last_updated: string;
  config?: any;
  results?: any;
}

export interface ImportProgress {
  currentSource?: string;
  processedSources: number;
  totalSources: number;
  processedTrails: number;
  totalTrails: number;
  errors: string[];
  status: 'idle' | 'processing' | 'completed' | 'error';
}

export interface TrailImportResult {
  success: boolean;
  message: string;
  data?: {
    processed: number;
    added: number;
    updated: number;
    failed: number;
  };
}
