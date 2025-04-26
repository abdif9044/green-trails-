
import { supabase } from '@/integrations/supabase/client';

interface WeatherData {
  temperature: number;
  condition: string;
  high: number;
  low: number;
  precipitation: string;
  sunrise: string;
  sunset: string;
}

// Demo weather API for development purposes
// In production, this would connect to a real weather API
const fetchWeatherFromAPI = async (lat: number, lng: number): Promise<WeatherData> => {
  console.log(`Fetching weather for coordinates: ${lat}, ${lng}`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate realistic but randomized weather data
  const conditions = ["Clear", "Partly Cloudy", "Cloudy", "Rain", "Thunderstorm", "Snow", "Fog"];
  const baseTemp = Math.floor(10 + Math.random() * 25); // Base temp between 10-35°C
  
  return {
    temperature: baseTemp,
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    high: baseTemp + Math.floor(Math.random() * 5),
    low: baseTemp - Math.floor(Math.random() * 8),
    precipitation: `${Math.floor(Math.random() * 50)}%`,
    sunrise: "06:15 AM",
    sunset: "08:45 PM",
  };
};

export const getTrailWeather = async (trailId: string, coordinates?: [number, number]): Promise<WeatherData | null> => {
  try {
    // First check if we have cached weather data
    const { data: cachedWeather, error } = await supabase
      .from('trail_weather')
      .select('*')
      .eq('trail_id', trailId)
      .single();
    
    // If we have recently cached data (less than 1 hour old), return it
    if (cachedWeather && new Date(cachedWeather.updated_at) > new Date(Date.now() - 3600000)) {
      return {
        temperature: cachedWeather.temperature,
        condition: cachedWeather.condition,
        high: cachedWeather.high,
        low: cachedWeather.low,
        precipitation: cachedWeather.precipitation,
        sunrise: cachedWeather.sunrise,
        sunset: cachedWeather.sunset
      };
    }
    
    // If no coordinates provided or no cached data, return null
    if (!coordinates) return null;
    
    // Fetch fresh weather data
    const weatherData = await fetchWeatherFromAPI(coordinates[1], coordinates[0]);
    
    // Cache the weather data
    await supabase
      .from('trail_weather')
      .upsert({
        trail_id: trailId,
        temperature: weatherData.temperature,
        condition: weatherData.condition,
        high: weatherData.high,
        low: weatherData.low,
        precipitation: weatherData.precipitation,
        sunrise: weatherData.sunrise,
        sunset: weatherData.sunset,
      }, { onConflict: 'trail_id' });
    
    return weatherData;
  } catch (error) {
    console.error('Error fetching trail weather:', error);
    return null;
  }
};
