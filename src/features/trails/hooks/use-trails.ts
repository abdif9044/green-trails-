
import { useQuery } from '@tanstack/react-query';
import { Trail, TrailFilters } from '@/types/trails';
import { useTrailFilters } from './use-trail-filters';
import { formatTrailData, queryTrailsWithFilters } from './use-trail-query-base';

export const useTrails = (filters?: TrailFilters) => {
  const { data: trails = [], ...rest } = useQuery({
    queryKey: ['trails', filters],
    queryFn: async () => {
      try {
        const query = queryTrailsWithFilters(filters);
        const { data, error } = await query;

        if (error) {
          console.error('Error fetching trails:', error);
          throw error;
        }

        // Transform the data to match our Trail type
        const formattedTrails: Trail[] = data.map(trail => formatTrailData(trail));

        return formattedTrails;
      } catch (error) {
        console.error('Error in useTrails:', error);
        return [];
      }
    }
  });

  const filteredTrails = useTrailFilters(trails, filters);
  return { data: filteredTrails, ...rest };
};

// Re-export types from the types file for components that import from this file
export type { Trail, TrailFilters, TrailDifficulty } from '@/types/trails';
