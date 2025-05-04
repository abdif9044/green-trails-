
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
    
    // Call OpenWeather One Call API for forecast data
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=imperial&exclude=minutely,alerts`
    );
    
    const data = await response.json();
    
    if (data.cod && data.cod !== 200) {
      throw new Error(`Weather API error: ${data.message}`);
    }
    
    // Format hourly forecast (next 24 hours)
    const hourlyForecast = data.hourly?.slice(0, 24).map((hour: any) => ({
      time: new Date(hour.dt * 1000).toLocaleTimeString('en-US', { 
        hour: '2-digit', minute: '2-digit', hour12: true 
      }),
      temperature: Math.round(hour.temp),
      condition: hour.weather[0].main,
      precipitation: hour.pop * 100, // Probability of precipitation as percentage
      windSpeed: Math.round(hour.wind_speed),
      windDirection: getWindDirection(hour.wind_deg),
      icon: hour.weather[0].icon
    })) || [];
    
    // Format daily forecast (7 days)
    const dailyForecast = data.daily?.slice(0, 7).map((day: any) => ({
      date: new Date(day.dt * 1000).toLocaleDateString('en-US', { 
        weekday: 'short', month: 'short', day: 'numeric' 
      }),
      high: Math.round(day.temp.max),
      low: Math.round(day.temp.min),
      condition: day.weather[0].main,
      precipitation: day.pop * 100, // Probability of precipitation as percentage
      sunrise: new Date(day.sunrise * 1000).toLocaleTimeString('en-US', { 
        hour: '2-digit', minute: '2-digit', hour12: true 
      }),
      sunset: new Date(day.sunset * 1000).toLocaleTimeString('en-US', { 
        hour: '2-digit', minute: '2-digit', hour12: true 
      }),
      icon: day.weather[0].icon
    })) || [];
    
    // Store the forecast data in the database
    const { error: dbError } = await fetch(`${req.url.split('/functions')[0]}/rest/v1/trail_weather_forecasts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        'apikey': Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        trail_id: trailId,
        hourly: hourlyForecast,
        daily: dailyForecast,
        updated_at: new Date().toISOString()
      })
    }).then(res => res.json());
    
    if (dbError) {
      console.error('Error storing forecast data:', dbError);
    }
    
    return new Response(
      JSON.stringify({ hourly: hourlyForecast, daily: dailyForecast }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in get-weather-forecast function:', error);
    
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
