
import { useQuery } from '@tanstack/react-query';
import { getDetailedTrailWeather } from '@/features/weather/services/weather-service';
import { DetailedWeatherData } from '@/features/weather/types/weather-types';

/**
 * Hook to fetch detailed weather information for a trail
 * @param trailId - The ID of the trail
 * @param coordinates - The geographical coordinates of the trail [longitude, latitude]
 */
export function useDetailedWeather(trailId: string | undefined, coordinates?: [number, number]) {
  return useQuery({
    queryKey: ['trail-detailed-weather', trailId],
    queryFn: async (): Promise<DetailedWeatherData | null> => {
      if (!trailId || !coordinates) {
        return null;
      }
      
      try {
        const weatherData = await getDetailedTrailWeather(trailId, coordinates);
        return weatherData;
      } catch (error) {
        console.error('Error fetching detailed weather:', error);
        return null;
      }
    },
    enabled: !!trailId && !!coordinates,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}
