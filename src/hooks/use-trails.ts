
import { useQuery } from '@tanstack/react-query';
import { Trail, TrailFilters } from '@/types/trails';
import { mockTrails } from '@/data/mock-trails';
import { useTrailFilters } from './use-trail-filters';

export const useTrails = (filters?: TrailFilters) => {
  const { data: trails = [], ...rest } = useQuery({
    queryKey: ['trails'],
    queryFn: async () => {
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockTrails;
    }
  });

  const filteredTrails = useTrailFilters(trails, filters);
  return { data: filteredTrails, ...rest };
};

export const useTrail = (trailId: string | undefined) => {
  return useQuery({
    queryKey: ['trail', trailId],
    queryFn: async () => {
      if (!trailId) return null;
      
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockTrails.find(trail => trail.id === trailId) || null;
    },
    enabled: !!trailId,
  });
};

// Re-export types from the types file for components that import from this file
export type { Trail, TrailFilters, TrailDifficulty } from '@/types/trails';
