
import { useQuery } from '@tanstack/react-query';
import { TrailService } from '@/services/trails';
import { Trail, TrailFilters } from '@/types/trails';

export const useTrails = (filters: TrailFilters = {}) => {
  return useQuery({
    queryKey: ['trails', filters],
    queryFn: async (): Promise<Trail[]> => {
      console.log('useTrails: Fetching trails with filters:', filters);
      
      try {
        const result = await TrailService.searchTrails(filters, 50, 0);
        console.log(`useTrails: Retrieved ${result.data.length} trails from database`);
        return result.data;
      } catch (error) {
        console.error('useTrails: Error fetching trails:', error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
