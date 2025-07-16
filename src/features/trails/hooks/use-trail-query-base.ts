
import { useQuery } from '@tanstack/react-query';
import { TrailService } from '@/services/trails';
import { Trail } from '@/types/trails';

export const useTrailQueryBase = (trailId: string) => {
  return useQuery({
    queryKey: ['trail-detail', trailId],
    queryFn: async (): Promise<Trail | null> => {
      if (!trailId) {
        console.log('useTrailQueryBase: No trail ID provided');
        return null;
      }
      
      console.log('useTrailQueryBase: Fetching trail details for ID:', trailId);
      
      try {
        const trail = await TrailService.getTrailById(trailId);
        console.log('useTrailQueryBase: Retrieved trail:', trail?.name || 'Not found');
        return trail;
      } catch (error) {
        console.error('useTrailQueryBase: Error fetching trail:', error);
        return null;
      }
    },
    enabled: !!trailId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
