
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Fetches the OpenWeather API key from Supabase Edge Function
 * @returns Promise with the API key
 */
export const fetchWeatherApiKey = async (): Promise<string> => {
  try {
    const { data: { apiKey }, error } = await supabase.functions.invoke('get-weather-key');
    
    if (error) {
      throw new Error(`Failed to get weather API key: ${error.message}`);
    }
    
    if (!apiKey) {
      throw new Error('Weather API key is not configured');
    }
    
    return apiKey;
  } catch (error) {
    console.error('Error fetching weather API key:', error);
    toast({
      title: "Weather layer error",
      description: "Unable to load weather data layer. Please try again later.",
      variant: "destructive",
    });
    throw error;
  }
};

/**
 * Builds the OpenWeatherMap tile URL for a specific layer type
 * @param layerType - The type of weather layer
 * @param apiKey - The OpenWeatherMap API key
 * @returns The tile URL for the weather layer
 */
export const buildWeatherTileUrl = (layerType: string, apiKey: string): string => {
  return `https://tile.openweathermap.org/map/${layerType}/{z}/{x}/{y}.png?appid=${apiKey}`;
};
