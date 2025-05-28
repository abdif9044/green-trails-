
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
    return useQuery({
      queryKey: ['weather', 'current', lat, lng],
      queryFn: async (): Promise<WeatherData> => {
        const { data, error } = await supabase.functions.invoke('get-weather', {
          body: { lat, lng }
        });

        if (error) {
          console.error('Error fetching weather:', error);
          throw error;
        }

        return data;
      },
      enabled: !!(lat && lng)
    });
  };

  // Get weather forecast for coordinates
  const useWeatherForecast = (lat: number, lng: number) => {
    return useQuery({
      queryKey: ['weather', 'forecast', lat, lng],
      queryFn: async (): Promise<WeatherForecast> => {
        const { data, error } = await supabase.functions.invoke('get-weather-forecast', {
          body: { lat, lng }
        });

        if (error) {
          console.error('Error fetching weather forecast:', error);
          throw error;
        }

        return data;
      },
      enabled: !!(lat && lng)
    });
  };

  // Get weather for a specific trail
  const useTrailWeather = (trailId: string) => {
    return useQuery({
      queryKey: ['weather', 'trail', trailId],
      queryFn: async (): Promise<WeatherData> => {
        // First get trail coordinates
        const { data: trail, error: trailError } = await supabase
          .from('trails')
          .select('latitude, longitude')
          .eq('id', trailId)
          .single();

        if (trailError || !trail) {
          throw trailError || new Error('Trail not found');
        }

        // Then get weather for those coordinates
        const { data, error } = await supabase.functions.invoke('get-weather', {
          body: { 
            lat: trail.latitude, 
            lng: trail.longitude 
          }
        });

        if (error) {
          console.error('Error fetching trail weather:', error);
          throw error;
        }

        return data;
      },
      enabled: !!trailId
    });
  };

  return {
    useCurrentWeather,
    useWeatherForecast,
    useTrailWeather,
  };
};
