
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Trail } from '@/types/trails';

export interface MapTileConfig {
  style: string;
  accessToken: string;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export const useMaps = () => {
  // Get Mapbox configuration from Supabase Edge Function
  const { data: mapConfig, isLoading: configLoading } = useQuery({
    queryKey: ['map-config'],
    queryFn: async (): Promise<MapTileConfig> => {
      const { data, error } = await supabase.functions.invoke('get-mapbox-token');
      
      if (error) {
        console.error('Error fetching map config:', error);
        throw error;
      }

      return data;
    }
  });

  // Get trail markers for map display
  const useTrailMarkers = (bounds?: MapBounds) => {
    const queryKey = bounds 
      ? ['trail-markers', bounds] 
      : ['trail-markers'];

    return useQuery({
      queryKey,
      queryFn: async (): Promise<Trail[]> => {
        let query = supabase
          .from('trails')
          .select(`
            id,
            name,
            location,
            latitude,
            longitude,
            difficulty,
            trail_length,
            elevation_gain
          `);

        // Apply bounds filter if provided
        if (bounds) {
          query = query
            .gte('latitude', bounds.south)
            .lte('latitude', bounds.north)
            .gte('longitude', bounds.west)
            .lte('longitude', bounds.east);
        }

        const { data, error } = await query.limit(500); // Limit for performance

        if (error) {
          console.error('Error fetching trail markers:', error);
          throw error;
        }

        return (data || []).map(trail => ({
          id: trail.id,
          name: trail.name,
          location: trail.location,
          coordinates: [trail.latitude, trail.longitude] as [number, number],
          difficulty: trail.difficulty as 'easy' | 'moderate' | 'hard' | 'expert',
          length: trail.trail_length,
          elevation_gain: trail.elevation_gain,
          imageUrl: '/placeholder.svg',
          elevation: 0,
          tags: [],
          likes: 0
        }));
      }
    });
  };

  return {
    mapConfig,
    configLoading,
    useTrailMarkers,
  };
};
