
import { useTrail } from '@/services/trails';

export const useTrailQueryBase = (trailId: string) => {
  const query = useTrail(trailId);
  
  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};
