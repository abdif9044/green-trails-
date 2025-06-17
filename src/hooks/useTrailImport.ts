
import { useImportJobs } from './trail-import/useImportJobs';

export const useTrailImport = () => {
  const importJobsQuery = useImportJobs();
  
  return {
    data: importJobsQuery.data || [],
    isLoading: importJobsQuery.isLoading,
    error: importJobsQuery.error,
    refetch: importJobsQuery.refetch,
  };
};
