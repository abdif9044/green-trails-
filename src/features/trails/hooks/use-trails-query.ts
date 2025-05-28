
import { useTrails } from '@/services/trails';
import { TrailFilters } from '@/types/trails';

export const useTrailsQuery = (filters: TrailFilters = {}) => {
  const { useTrailsSearch } = useTrails();
  
  // Convert filters to search params format
  const searchParams = {
    ...filters,
    page: 1,
    limit: 50, // Reasonable default for initial load
  };
  
  const query = useTrailsSearch(searchParams);
  
  return {
    data: query.data?.data ? {
      data: query.data.data,
      count: query.data.count
    } : { data: [], count: 0 },
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};
