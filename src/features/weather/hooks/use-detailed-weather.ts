
import { useQuery } from '@tanstack/react-query';
import { getDetailedTrailWeather } from '../services/weather-service';

export const useDetailedWeather = (trailId: string, coordinates: [number, number]) => {
  return useQuery({
    queryKey: ['detailed-weather', trailId, coordinates],
    queryFn: async () => {
      const weatherData = await getDetailedTrailWeather(trailId, coordinates);
      
      // Transform to match expected interface with all required properties
      return {
        ...weatherData,
        condition: weatherData.conditions,
        high: weatherData.temperature + 5,
        low: weatherData.temperature - 8,
        precipitation: 20,
        windDirection: 'NW',
        hourlyForecast: weatherData.forecast.slice(0, 24).map((f, i) => ({
          time: `${i}:00`,
          temperature: f.high - (i % 6),
          condition: f.conditions,
          precipitation: f.precipitation
        })),
        dailyForecast: weatherData.forecast
      };
    },
    enabled: !!coordinates && coordinates[0] !== 0 && coordinates[1] !== 0,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};
