
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface WeatherProphetData {
  analysis: string;
  weatherData: {
    current: any;
    hourly: any[];
    daily: any[];
  };
  timestamp: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

interface TrailData {
  name?: string;
  difficulty?: string;
  elevation?: number;
  length?: number;
}

export const useWeatherProphet = (
  coordinates: [number, number],
  trailData?: TrailData,
  analysisType: 'comprehensive' | 'safety' | 'optimal_timing' | 'gear_recommendations' = 'comprehensive'
) => {
  return useQuery({
    queryKey: ['weather-prophet', coordinates, trailData, analysisType],
    queryFn: async (): Promise<WeatherProphetData> => {
      const { data, error } = await supabase.functions.invoke('weather-prophet', {
        body: {
          coordinates,
          trailData,
          analysisType
        }
      });

      if (error) {
        console.error('Weather Prophet error:', error);
        throw new Error(error.message || 'Failed to get weather analysis');
      }

      return data;
    },
    enabled: !!(coordinates && coordinates.length === 2),
    staleTime: 1000 * 60 * 30, // 30 minutes
    retry: 2,
  });
};
