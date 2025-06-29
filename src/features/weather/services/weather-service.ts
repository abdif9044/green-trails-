
import { supabase } from '@/integrations/supabase/client';
import { WeatherData, DetailedWeatherData, HourlyForecast, DailyForecast } from '@/features/weather/types/weather-types';
import { toast } from '@/hooks/use-toast';

/**
 * Fetches basic weather data for a trail
 * @param trailId - The ID of the trail
 * @param coordinates - The geographical coordinates of the trail [longitude, latitude]
 */
export const getTrailWeather = async (trailId: string, coordinates: [number, number]): Promise<WeatherData | null> => {
  try {
    // First check if we have recent weather data in the database (less than 1 hour old)
    const { data: existingData, error } = await supabase
      .from('trail_weather')
      .select('*')
      .eq('trail_id', trailId)
      .single();
      
    if (!error && existingData) {
      const updatedAt = new Date(existingData.updated_at);
      const now = new Date();
      const diffHours = (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60);
      
      // If data is less than 1 hour old, use it
      if (diffHours < 1) {
        return {
          temperature: existingData.temperature || 0,
          condition: existingData.condition || 'Unknown',
          high: existingData.high || 0,
          low: existingData.low || 0,
          precipitation: existingData.precipitation || '0%',
          sunrise: existingData.sunrise || '6:00 AM',
          sunset: existingData.sunset || '6:00 PM',
          windSpeed: parseFloat(existingData.wind_speed || '0'),
          windDirection: existingData.wind_direction || 'N',
          humidity: 50 // Default value since not stored in DB yet
        };
      }
    }
    
    // Otherwise, call our edge function to get fresh data
    const { data, error: fetchError } = await supabase.functions.invoke('get-weather', {
      body: { 
        trailId, 
        coordinates 
      }
    });
    
    if (fetchError) {
      console.error('Weather function error:', fetchError);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};

/**
 * Fetches detailed weather data including forecasts for a trail
 * @param trailId - The ID of the trail
 * @param coordinates - The geographical coordinates of the trail [longitude, latitude]
 */
export const getDetailedTrailWeather = async (trailId: string, coordinates: [number, number]): Promise<DetailedWeatherData | null> => {
  try {
    // Get basic weather data first
    const basicWeather = await getTrailWeather(trailId, coordinates);
    
    if (!basicWeather) {
      return null;
    }
    
    // Call edge function for detailed forecast
    const { data: detailedData, error: forecastError } = await supabase.functions.invoke('get-weather-forecast', {
      body: { 
        trailId, 
        coordinates 
      }
    });
    
    if (forecastError) {
      console.error('Weather forecast function error:', forecastError);
      // Return basic weather if forecast fails
      return { ...basicWeather, hourlyForecast: [], dailyForecast: [] };
    }
    
    return {
      ...basicWeather,
      hourlyForecast: detailedData.hourly || [],
      dailyForecast: detailedData.daily || []
    };
  } catch (error) {
    console.error('Error fetching detailed weather data:', error);
    return null;
  }
};
