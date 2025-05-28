
import { useApiQuery } from '@/hooks/use-api-fetch';
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
  const { data: mapConfig, isLoading: configLoading } = useApiQuery<MapTileConfig>(
    ['map-config'],
    '/api/maps/config',
    { skipAuth: false }
  );

  // Get trail markers for map display
  const useTrailMarkers = (bounds?: MapBounds) => {
    const queryKey = bounds 
      ? ['trail-markers', bounds] 
      : ['trail-markers'];
    
    const url = bounds 
      ? `/api/maps/markers?north=${bounds.north}&south=${bounds.south}&east=${bounds.east}&west=${bounds.west}`
      : '/api/maps/markers';

    return useApiQuery<Trail[]>(queryKey, url);
  };

  return {
    mapConfig,
    configLoading,
    useTrailMarkers,
  };
};
