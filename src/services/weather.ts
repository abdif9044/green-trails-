
import { useApiQuery } from '@/hooks/use-api-fetch';

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  high: number;
  low: number;
  precipitation: string;
  sunrise: string;
  sunset: string;
}

export interface WeatherForecast {
  current: WeatherData;
  hourly: Array<{
    time: string;
    temperature: number;
    condition: string;
  }>;
  daily: Array<{
    date: string;
    high: number;
    low: number;
    condition: string;
  }>;
}

export const useWeather = () => {
  // Get current weather for coordinates
  const useCurrentWeather = (lat: number, lng: number) => {
    return useApiQuery<WeatherData>(
      ['weather', 'current', lat, lng],
      `/api/weather/current?lat=${lat}&lng=${lng}`,
      {},
      { enabled: !!(lat && lng) }
    );
  };

  // Get weather forecast for coordinates
  const useWeatherForecast = (lat: number, lng: number) => {
    return useApiQuery<WeatherForecast>(
      ['weather', 'forecast', lat, lng],
      `/api/weather/forecast?lat=${lat}&lng=${lng}`,
      {},
      { enabled: !!(lat && lng) }
    );
  };

  // Get weather for a specific trail
  const useTrailWeather = (trailId: string) => {
    return useApiQuery<WeatherData>(
      ['weather', 'trail', trailId],
      `/api/weather/trail/${trailId}`,
      {},
      { enabled: !!trailId }
    );
  };

  return {
    useCurrentWeather,
    useWeatherForecast,
    useTrailWeather,
  };
};
