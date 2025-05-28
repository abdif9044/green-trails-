
import { useWeather } from '@/services/weather';

export const useTrailWeather = (trailId: string, coordinates?: [number, number]) => {
  const { useTrailWeather: useTrailWeatherService, useCurrentWeather } = useWeather();
  
  // Try to get weather data specifically for the trail first
  const trailWeatherQuery = useTrailWeatherService(trailId);
  
  // Fallback to coordinates-based weather if trail-specific weather isn't available
  const coordinatesWeatherQuery = useCurrentWeather(
    coordinates?.[1] || 0, 
    coordinates?.[0] || 0
  );
  
  // Use trail weather if available, otherwise fall back to coordinates weather
  const weatherData = trailWeatherQuery.data || coordinatesWeatherQuery.data;
  const isLoading = trailWeatherQuery.isLoading || coordinatesWeatherQuery.isLoading;
  const error = trailWeatherQuery.error || coordinatesWeatherQuery.error;

  return {
    data: weatherData,
    isLoading,
    error,
  };
};
