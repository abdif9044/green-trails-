
export interface TrailDataSource {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  type: string;
  enabled: boolean;
  config?: any;
  source_type: string;
  url: string | null;
  country: string | null;
  state_province: string | null;
  region: string | null;
  last_synced: string | null;
  next_sync: string | null;
  is_active: boolean;
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
  trails_failed: number;
  error_message?: string;
  bulk_job_id?: string;
}

export interface BulkImportJob {
  id: string;
  total_trails_requested: number;
  total_sources: number;
  status: string;
  started_at: string;
  completed_at?: string;
  trails_processed: number;
  trails_added: number;
  trails_updated: number;
  trails_failed: number;
  config?: any;
  results?: any;
}

export interface BatchResult {
  addedCount: number;
  failedCount: number;
  insertErrors: string[];
}

export interface SourceResult {
  source: string;
  success: boolean;
  trails_added: number;
  trails_failed: number;
  trails_processed: number;
  success_rate: number;
  error_details?: string[];
  location?: string;
  error?: string;
}
