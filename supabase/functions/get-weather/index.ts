
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { trailId, coordinates } = await req.json();
    
    if (!trailId || !coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
      return new Response(
        JSON.stringify({ error: 'Invalid request parameters' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    const API_KEY = Deno.env.get('OPENWEATHER_API_KEY');
    
    if (!API_KEY) {
      throw new Error('Weather API key is not configured');
    }
    
    const [longitude, latitude] = coordinates;
    
    // Call OpenWeather API
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=imperial`
    );
    
    const data = await response.json();
    
    if (data.cod !== 200) {
      throw new Error(`Weather API error: ${data.message}`);
    }
    
    // Format the weather data
    const weatherData = {
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].main,
      high: Math.round(data.main.temp_max),
      low: Math.round(data.main.temp_min),
      precipitation: `${data.rain ? data.rain['1h'] : 0}mm`,
      sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US', { 
        hour: '2-digit', minute: '2-digit', hour12: true 
      }),
      sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US', { 
        hour: '2-digit', minute: '2-digit', hour12: true 
      }),
      windSpeed: `${Math.round(data.wind.speed)} mph`,
      windDirection: getWindDirection(data.wind.deg)
    };
    
    // Store the weather data in the database
    const { error: dbError } = await fetch(`${req.url.split('/functions')[0]}/rest/v1/trail_weather`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        'apikey': Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        trail_id: trailId,
        temperature: weatherData.temperature,
        condition: weatherData.condition,
        high: weatherData.high,
        low: weatherData.low,
        precipitation: weatherData.precipitation,
        sunrise: weatherData.sunrise,
        sunset: weatherData.sunset,
        wind_speed: weatherData.windSpeed,
        wind_direction: weatherData.windDirection,
        updated_at: new Date().toISOString()
      })
    }).then(res => res.json());
    
    if (dbError) {
      console.error('Error storing weather data:', dbError);
    }
    
    return new Response(
      JSON.stringify(weatherData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in get-weather function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

function getWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}
