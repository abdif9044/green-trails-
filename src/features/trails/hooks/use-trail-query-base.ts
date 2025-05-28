
import { useTrails } from '@/services/trails';

export const useTrailQueryBase = (trailId: string) => {
  const { useTrail } = useTrails();
  
  const query = useTrail(trailId);
  
  return {
    data: query.data?.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};
