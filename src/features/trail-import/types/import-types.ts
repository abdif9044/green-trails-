
export interface ImportJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'error' | 'cancelled';
  trails_processed: number;
  trails_added: number;
  trails_failed: number;
  started_at: string;
  completed_at?: string;
  error_message?: string;
}

export interface BulkImportJob extends ImportJob {
  total_trails_requested: number;
  total_sources: number;
  trails_updated: number;
  config?: any;
  results?: any;
}

export interface ImportProgress {
  currentStep: string;
  progress: number;
  isActive: boolean;
  currentCount: number;
  targetCount: number;
}

export interface RecoveryStatus {
  phase: 'initialization' | 'testing' | 'scaling' | 'completed' | 'error';
  step: string;
  progress: number;
  error?: string;
  canProceed: boolean;
}
