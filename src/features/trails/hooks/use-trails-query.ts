
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Trail, TrailFilters } from '@/types/trails';

const TRAILS_QUERY_KEY = 'trails';

interface UseTrailsQueryOptions {
  filters?: TrailFilters;
  limit?: number;
  offset?: number;
  enabled?: boolean;
}

export const useTrailsQuery = (options: UseTrailsQueryOptions = {}) => {
  const { filters = {}, limit = 20, offset = 0, enabled = true } = options;

  return useQuery({
    queryKey: [TRAILS_QUERY_KEY, filters, limit, offset],
    queryFn: async (): Promise<{ data: Trail[]; count: number }> => {
      console.log('Fetching trails with filters:', filters);
      
      let query = supabase
        .from('trails')
        .select('*', { count: 'exact' })
        .range(offset, offset + limit - 1);

      // Apply filters
      if (filters.searchQuery) {
        query = query.or(`name.ilike.%${filters.searchQuery}%,location.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`);
      }

      if (filters.difficulty) {
        query = query.eq('difficulty', filters.difficulty);
      }

      if (filters.lengthRange) {
        const [minLength, maxLength] = filters.lengthRange;
        query = query.gte('length', minLength).lte('length', maxLength);
      }

      if (filters.country) {
        query = query.eq('country', filters.country);
      }

      if (filters.stateProvince) {
        query = query.eq('state_province', filters.stateProvince);
      }

      if (filters.tags && filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags);
      }

      if (filters.nearbyCoordinates && filters.radius) {
        const [lng, lat] = filters.nearbyCoordinates;
        // Using a simple bounding box for now - could be improved with PostGIS
        const latDelta = filters.radius / 69;
        const lngDelta = filters.radius / (69 * Math.cos(lat * Math.PI / 180));
        
        query = query
          .gte('coordinates->1', lat - latDelta)
          .lte('coordinates->1', lat + latDelta)
          .gte('coordinates->0', lng - lngDelta)
          .lte('coordinates->0', lng + lngDelta);
      }

      // Order by likes descending by default
      query = query.order('likes', { ascending: false });

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching trails:', error);
        throw new Error(error.message);
      }

      console.log(`Fetched ${data?.length || 0} trails out of ${count || 0} total`);
      
      return {
        data: (data as Trail[]) || [],
        count: count || 0
      };
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
