
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Trail, TrailFilters } from '@/types/trails';
import { formatTrailFromDatabase } from '@/utils/trail-formatter';

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
  // Search trails with filters using Supabase - NO MOCK DATA
  const useTrailsSearch = (params: TrailSearchParams = {}) => {
    return useQuery({
      queryKey: ['trails', 'search', params],
      queryFn: async (): Promise<TrailsResponse> => {
        const {
          searchQuery,
          difficulty,
          lengthRange,
          country,
          stateProvince,
          nearbyCoordinates,
          radius = 25,
          page = 1,
          limit = 50
        } = params;

        // Handle nearby search with PostGIS function
        if (nearbyCoordinates && nearbyCoordinates.length === 2) {
          const [lat, lng] = nearbyCoordinates;
          
          const { data, error } = await supabase
            .rpc('trails_within_radius', {
              center_lat: lat,
              center_lng: lng,
              radius_meters: radius * 1000 // Convert km to meters
            });

          if (error) {
            console.error('Error fetching nearby trails:', error);
            throw error;
          }

          const formattedTrails = (data || []).map(formatTrailFromDatabase);
          
          return {
            data: formattedTrails,
            count: formattedTrails.length,
            page,
            totalPages: Math.ceil(formattedTrails.length / limit)
          };
        }

        // Regular search without PostGIS - ONLY REAL DATABASE TRAILS
        let query = supabase
          .from('trails')
          .select(`
            *,
            trail_tags (
              tag_name
            )
          `, { count: 'exact' });

        // Apply search filters
        if (searchQuery) {
          query = query.or(`name.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`);
        }

        if (difficulty) {
          query = query.eq('difficulty', difficulty);
        }

        if (lengthRange && lengthRange.length === 2) {
          query = query.gte('length_km', lengthRange[0]).lte('length_km', lengthRange[1]);
        }

        if (country) {
          query = query.eq('country', country);
        }

        if (stateProvince) {
          query = query.eq('state_province', stateProvince);
        }

        // Pagination
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        query = query.range(from, to);

        // Order by creation date to show newest real trails first
        query = query.order('created_at', { ascending: false });

        const { data, error, count } = await query;

        if (error) {
          console.error('Error fetching trails:', error);
          throw error;
        }

        const formattedTrails = (data || []).map(formatTrailFromDatabase);
        
        return {
          data: formattedTrails,
          count: count || 0,
          page,
          totalPages: Math.ceil((count || 0) / limit)
        };
      }
    });
  };

  // Get single trail by ID - ONLY REAL DATABASE TRAILS
  const useTrail = (trailId: string) => {
    return useQuery({
      queryKey: ['trails', trailId],
      queryFn: async (): Promise<Trail> => {
        const { data, error } = await supabase
          .from('trails')
          .select(`
            *,
            trail_tags (
              tag_name
            )
          `)
          .eq('id', trailId)
          .single();

        if (error) {
          console.error('Error fetching trail:', error);
          throw error;
        }

        return formatTrailFromDatabase(data);
      },
      enabled: !!trailId
    });
  };

  // Get nearby trails using PostGIS - ONLY REAL DATABASE TRAILS
  const useNearbyTrails = (lat: number, lng: number, radius: number = 25) => {
    return useQuery({
      queryKey: ['trails', 'nearby', lat, lng, radius],
      queryFn: async (): Promise<Trail[]> => {
        const { data, error } = await supabase
          .rpc('trails_within_radius', {
            center_lat: lat,
            center_lng: lng,
            radius_meters: radius * 1000
          });

        if (error) {
          console.error('Error fetching nearby trails:', error);
          throw error;
        }

        return (data || []).map(formatTrailFromDatabase);
      },
      enabled: !!(lat && lng)
    });
  };

  // Get popular trails for homepage - ONLY REAL DATABASE TRAILS
  const usePopularTrails = (limit: number = 6) => {
    return useQuery({
      queryKey: ['trails', 'popular', limit],
      queryFn: async (): Promise<Trail[]> => {
        const { data, error } = await supabase
          .from('trails')
          .select(`
            *,
            trail_tags (
              tag_name
            )
          `)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) {
          console.error('Error fetching popular trails:', error);
          throw error;
        }

        return (data || []).map(formatTrailFromDatabase);
      }
    });
  };

  return {
    useTrailsSearch,
    useTrail,
    useNearbyTrails,
    usePopularTrails,
  };
};
