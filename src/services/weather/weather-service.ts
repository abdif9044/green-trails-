import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface WeatherData {
  temperature: number;
  condition: string;
  high: number;
  low: number;
  precipitation: string;
  sunrise: string;
  sunset: string;
  windSpeed?: string;
  windDirection?: string;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  condition: string;
  precipitation: number;
  windSpeed: number;
  windDirection: string;
  icon: string;
}

export interface DailyForecast {
  date: string;
  high: number;
  low: number;
  condition: string;
  precipitation: number;
  sunrise: string;
  sunset: string;
  icon: string;
}

export interface DetailedWeatherData extends WeatherData {
  hourlyForecast: HourlyForecast[];
  dailyForecast: DailyForecast[];
}

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
          temperature: existingData.temperature,
          condition: existingData.condition,
          high: existingData.high,
          low: existingData.low,
          precipitation: existingData.precipitation,
          sunrise: existingData.sunrise,
          sunset: existingData.sunset,
          windSpeed: existingData.wind_speed,
          windDirection: existingData.wind_direction
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
