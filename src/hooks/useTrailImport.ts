
import { useImportJobs } from './trail-import/useImportJobs';
import type { TrailDataSource, ImportJob, BulkImportJob } from '../services/trail-import/types';

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

// Re-export types for backward compatibility
export type { TrailDataSource, ImportJob, BulkImportJob };
