
import { useQuery } from '@tanstack/react-query';
import { TrailService } from '@/services/trails';
import { Trail } from '@/types/trails';

export const useTrail = (trailId: string) => {
  return useQuery({
    queryKey: ['trail', trailId],
    queryFn: async (): Promise<Trail | null> => {
      if (!trailId) return null;
      
      console.log('useTrail: Fetching trail with ID:', trailId);
      
      try {
        const trail = await TrailService.getTrailById(trailId);
        console.log('useTrail: Retrieved trail:', trail?.name || 'Not found');
        return trail;
      } catch (error) {
        console.error('useTrail: Error fetching trail:', error);
        return null;
      }
    },
    enabled: !!trailId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
