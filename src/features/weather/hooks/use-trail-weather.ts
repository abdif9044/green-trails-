
import { useQuery } from '@tanstack/react-query';
import { getTrailWeather } from '@/features/weather/services/weather-service';
import { WeatherData } from '@/features/weather/types/weather-types';

/**
 * Hook to fetch basic weather information for a trail
 * @param trailId - The ID of the trail
 * @param coordinates - The geographical coordinates of the trail [longitude, latitude]
 */
export function useTrailWeather(trailId: string | undefined, coordinates?: [number, number]) {
  return useQuery({
    queryKey: ['trail-weather', trailId],
    queryFn: async (): Promise<WeatherData | null> => {
      if (!trailId || !coordinates) {
        return null;
      }
      
      try {
        const weatherData = await getTrailWeather(trailId, coordinates);
        return weatherData;
      } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
      }
    },
    enabled: !!trailId && !!coordinates,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}
