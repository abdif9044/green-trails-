import { supabase } from '@/integrations/supabase/client';

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
