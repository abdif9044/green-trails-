
import { TrailService } from '@/services/trails';
import { TrailFilters } from '@/types/trails';
import { useQuery } from '@tanstack/react-query';

export const useTrailsQuery = (filters: TrailFilters = {}) => {
  console.log('useTrailsQuery called with filters:', filters);
  
  const query = useQuery({
    queryKey: ['trails-query', filters],
    queryFn: async () => {
      console.log('useTrailsQuery: Executing query with filters:', filters);
      
      try {
        const result = await TrailService.searchTrails(filters, 50, 0);
        console.log(`useTrailsQuery: Found ${result.data.length} trails`);
        
        return {
          data: result.data,
          count: result.count
        };
      } catch (error) {
        console.error('useTrailsQuery: Error in query:', error);
        return { data: [], count: 0 };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
  
  return {
    data: query.data || { data: [], count: 0 },
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};
