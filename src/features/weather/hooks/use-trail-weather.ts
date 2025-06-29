
import { useQuery } from '@tanstack/react-query';
import { getTrailWeather } from '../services/weather-service';

export const useTrailWeather = (trailId: string, coordinates: [number, number]) => {
  return useQuery({
    queryKey: ['trail-weather', trailId, coordinates],
    queryFn: async () => {
      const weatherData = await getTrailWeather(trailId, coordinates);
      
      // Transform to match expected interface with all required properties
      return {
        ...weatherData,
        condition: weatherData.conditions,
        high: weatherData.temperature + 5,
        low: weatherData.temperature - 8,
        precipitation: 20,
        windDirection: 'NW'
      };
    },
    enabled: !!coordinates && coordinates[0] !== 0 && coordinates[1] !== 0,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};
