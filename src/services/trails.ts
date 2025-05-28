
import { useApiQuery, useApiMutation } from '@/hooks/use-api-fetch';
import { Trail, TrailFilters } from '@/types/trails';

export interface TrailSearchParams extends TrailFilters {
  page?: number;
  limit?: number;
}

export interface TrailsResponse {
  data: Trail[];
  count: number;
  page: number;
  totalPages: number;
}

export const useTrails = () => {
  // Search trails with filters
  const useTrailsSearch = (params: TrailSearchParams = {}) => {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });

    return useApiQuery<TrailsResponse>(
      ['trails', 'search', params],
      `/api/trails/search?${searchParams.toString()}`
    );
  };

  // Get single trail by ID
  const useTrail = (trailId: string) => {
    return useApiQuery<Trail>(
      ['trails', trailId],
      `/api/trails/${trailId}`,
      {},
      { enabled: !!trailId }
    );
  };

  // Get nearby trails
  const useNearbyTrails = (lat: number, lng: number, radius: number = 25) => {
    return useApiQuery<Trail[]>(
      ['trails', 'nearby', lat, lng, radius],
      `/api/trails/nearby?lat=${lat}&lng=${lng}&radius=${radius}`,
      {},
      { enabled: !!(lat && lng) }
    );
  };

  // Create new trail (admin functionality)
  const useCreateTrail = () => {
    return useApiMutation<Trail, Partial<Trail>>('/api/trails', {
      method: 'POST'
    });
  };

  // Update trail
  const useUpdateTrail = (trailId: string) => {
    return useApiMutation<Trail, Partial<Trail>>(`/api/trails/${trailId}`, {
      method: 'PUT'
    });
  };

  return {
    useTrailsSearch,
    useTrail,
    useNearbyTrails,
    useCreateTrail,
    useUpdateTrail,
  };
};
