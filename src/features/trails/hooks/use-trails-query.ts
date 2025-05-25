
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Trail, TrailFilters } from '@/types/trails';
import { mockTrails } from '@/features/trails/data/mock-trails';

const TRAILS_QUERY_KEY = 'trails';

interface UseTrailsQueryOptions {
  filters?: TrailFilters;
  limit?: number;
  offset?: number;
  enabled?: boolean;
}

const transformDatabaseTrail = (dbTrail: any): Trail => {
  return {
    id: dbTrail.id,
    name: dbTrail.name,
    location: dbTrail.location,
    imageUrl: '/placeholder.svg',
    difficulty: dbTrail.difficulty,
    length: dbTrail.length,
    elevation: dbTrail.elevation,
    elevation_gain: dbTrail.elevation_gain || 0,
    tags: [], // Tags will be fetched separately if needed
    likes: 0, // Likes will be calculated separately if needed
    coordinates: dbTrail.latitude && dbTrail.longitude ? [dbTrail.longitude, dbTrail.latitude] : undefined,
    description: dbTrail.description,
    country: dbTrail.country,
    state_province: dbTrail.state_province,
    surface: dbTrail.surface,
    trail_type: dbTrail.trail_type,
    source: dbTrail.source,
    source_id: dbTrail.source_id,
    created_at: dbTrail.created_at,
    updated_at: dbTrail.updated_at,
    user_id: dbTrail.user_id,
    is_verified: dbTrail.is_verified,
    geojson: dbTrail.geojson,
    length_km: dbTrail.length_km,
    last_updated: dbTrail.last_updated,
    latitude: dbTrail.latitude,
    longitude: dbTrail.longitude,
  };
};

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

      // Order by created_at descending by default
      query = query.order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching trails from database:', error);
        // Fall back to mock data on error
        console.log('Falling back to mock data');
        
        let filteredMockTrails = [...mockTrails];
        
        if (filters.searchQuery) {
          const searchLower = filters.searchQuery.toLowerCase();
          filteredMockTrails = filteredMockTrails.filter(trail =>
            trail.name.toLowerCase().includes(searchLower) ||
            trail.location.toLowerCase().includes(searchLower) ||
            trail.description?.toLowerCase().includes(searchLower)
          );
        }
        
        if (filters.difficulty) {
          filteredMockTrails = filteredMockTrails.filter(trail =>
            trail.difficulty === filters.difficulty
          );
        }
        
        if (filters.lengthRange) {
          const [minLength, maxLength] = filters.lengthRange;
          filteredMockTrails = filteredMockTrails.filter(trail =>
            trail.length >= minLength && trail.length <= maxLength
          );
        }
        
        const paginatedData = filteredMockTrails.slice(offset, offset + limit);
        
        return {
          data: paginatedData,
          count: filteredMockTrails.length
        };
      }

      if (!data || data.length === 0) {
        console.log('No trails found in database, using mock data');
        let filteredMockTrails = [...mockTrails];
        
        if (filters.searchQuery) {
          const searchLower = filters.searchQuery.toLowerCase();
          filteredMockTrails = filteredMockTrails.filter(trail =>
            trail.name.toLowerCase().includes(searchLower) ||
            trail.location.toLowerCase().includes(searchLower) ||
            trail.description?.toLowerCase().includes(searchLower)
          );
        }
        
        if (filters.difficulty) {
          filteredMockTrails = filteredMockTrails.filter(trail =>
            trail.difficulty === filters.difficulty
          );
        }
        
        if (filters.lengthRange) {
          const [minLength, maxLength] = filters.lengthRange;
          filteredMockTrails = filteredMockTrails.filter(trail =>
            trail.length >= minLength && trail.length <= maxLength
          );
        }
        
        const paginatedData = filteredMockTrails.slice(offset, offset + limit);
        
        return {
          data: paginatedData,
          count: filteredMockTrails.length
        };
      }

      console.log(`Fetched ${data.length} trails out of ${count || 0} total`);
      
      return {
        data: data.map(transformDatabaseTrail),
        count: count || 0
      };
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
