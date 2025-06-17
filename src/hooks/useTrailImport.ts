
import { useImportJobs } from './trail-import/useImportJobs';

// Re-export types for backward compatibility
export interface TrailDataSource {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  type: string;
  enabled: boolean;
  config?: any;
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

export const useTrailImport = () => {
  const importJobsQuery = useImportJobs();
  
  return {
    data: importJobsQuery.data || [],
    isLoading: importJobsQuery.isLoading,
    error: importJobsQuery.error,
    refetch: importJobsQuery.refetch,
    // Legacy compatibility properties
    importJobs: importJobsQuery.data || [],
    loading: importJobsQuery.isLoading,
    dataSources: [] as TrailDataSource[],
    bulkImportJobs: [] as BulkImportJob[],
    importLoading: false,
    bulkImportLoading: false,
    activeBulkJobId: null,
    bulkProgress: null,
    loadData: () => importJobsQuery.refetch(),
    handleImport: () => Promise.resolve(),
    handleBulkImport: () => Promise.resolve(),
    setActiveBulkJobId: () => {},
  };
};
