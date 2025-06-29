
import { supabase } from '@/integrations/supabase/client';

export interface WeatherData {
  temperature: number;
  condition: string;
  high: number;
  low: number;
  precipitation: string;
  wind_speed: string;
  wind_direction: string;
  sunrise: string;
  sunset: string;
}

export class WeatherService {
  /**
   * Get weather for a trail
   */
  static async getWeatherForTrail(trailId: string): Promise<WeatherData | null> {
    try {
      // First get the trail coordinates
      const { data: trail, error: trailError } = await supabase
        .from('trails')
        .select('latitude, longitude, lat, lon')
        .eq('id', trailId)
        .single();

      if (trailError || !trail) {
        console.error('Error fetching trail for weather:', trailError);
        return null;
      }

      const latitude = trail.latitude || trail.lat;
      const longitude = trail.longitude || trail.lon;

      if (!latitude || !longitude) {
        console.warn('Trail has no coordinates for weather lookup');
        return null;
      }

      // Check if we have cached weather data
      const { data: weatherData, error: weatherError } = await supabase
        .from('trail_weather')
        .select('*')
        .eq('trail_id', trailId)
        .gte('updated_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()) // 1 hour cache
        .single();

      if (weatherData && !weatherError) {
        return {
          temperature: weatherData.temperature || 70,
          condition: weatherData.condition || 'Clear',
          high: weatherData.high || 75,
          low: weatherData.low || 65,
          precipitation: weatherData.precipitation || '0%',
          wind_speed: weatherData.wind_speed || '5 mph',
          wind_direction: weatherData.wind_direction || 'N',
          sunrise: weatherData.sunrise || '6:30 AM',
          sunset: weatherData.sunset || '7:30 PM'
        };
      }

      // If no cached data, return mock weather data
      // TODO: Integrate with OpenWeather API using the provided key
      const mockWeather: WeatherData = {
        temperature: Math.round(Math.random() * 30 + 50), // 50-80°F
        condition: ['Clear', 'Partly Cloudy', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)],
        high: Math.round(Math.random() * 10 + 75), // 75-85°F
        low: Math.round(Math.random() * 10 + 55), // 55-65°F
        precipitation: Math.random() > 0.7 ? `${Math.round(Math.random() * 50)}%` : '0%',
        wind_speed: `${Math.round(Math.random() * 15 + 5)} mph`,
        wind_direction: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
        sunrise: '6:30 AM',
        sunset: '7:30 PM'
      };

      // Cache the weather data
      await supabase
        .from('trail_weather')
        .upsert({
          trail_id: trailId,
          temperature: mockWeather.temperature,
          condition: mockWeather.condition,
          high: mockWeather.high,
          low: mockWeather.low,
          precipitation: mockWeather.precipitation,
          wind_speed: mockWeather.wind_speed,
          wind_direction: mockWeather.wind_direction,
          sunrise: mockWeather.sunrise,
          sunset: mockWeather.sunset,
          updated_at: new Date().toISOString()
        });

      return mockWeather;
    } catch (error) {
      console.error('Error getting weather for trail:', error);
      return null;
    }
  }

  /**
   * Get weather forecast for a trail
   */
  static async getWeatherForecast(trailId: string, days: number = 5): Promise<any[]> {
    try {
      // Check for cached forecast
      const { data: forecast, error } = await supabase
        .from('trail_weather_forecasts')
        .select('daily')
        .eq('trail_id', trailId)
        .gte('updated_at', new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()) // 6 hour cache
        .single();

      if (forecast && !error && forecast.daily) {
        return forecast.daily.slice(0, days);
      }

      // Generate mock forecast data
      const mockForecast = Array.from({ length: days }, (_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        high: Math.round(Math.random() * 15 + 70),
        low: Math.round(Math.random() * 15 + 50),
        condition: ['Clear', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Showers'][Math.floor(Math.random() * 5)],
        precipitation: Math.random() > 0.6 ? `${Math.round(Math.random() * 60)}%` : '0%'
      }));

      // Cache the forecast
      await supabase
        .from('trail_weather_forecasts')
        .upsert({
          trail_id: trailId,
          daily: mockForecast,
          updated_at: new Date().toISOString()
        });

      return mockForecast;
    } catch (error) {
      console.error('Error getting weather forecast:', error);
      return [];
    }
  }
}
