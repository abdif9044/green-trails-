
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const weatherApiKey = Deno.env.get('OPENWEATHER_API_KEY');
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }
    
    if (!weatherApiKey) {
      throw new Error('Weather API key not configured');
    }

    const { coordinates, trailData, analysisType = 'comprehensive' } = await req.json();
    
    if (!coordinates || coordinates.length !== 2) {
      throw new Error('Invalid coordinates provided');
    }

    const [longitude, latitude] = coordinates;

    // Fetch extended weather forecast
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}&units=imperial&exclude=minutely`
    );
    
    const forecastData = await forecastResponse.json();

    // Prepare weather context for AI analysis
    const weatherContext = {
      current: {
        temperature: Math.round(forecastData.current.temp),
        condition: forecastData.current.weather[0].main,
        description: forecastData.current.weather[0].description,
        humidity: forecastData.current.humidity,
        windSpeed: Math.round(forecastData.current.wind_speed),
        visibility: forecastData.current.visibility,
        uvIndex: forecastData.current.uvi,
        pressure: forecastData.current.pressure
      },
      hourly: forecastData.hourly.slice(0, 24).map((hour: any) => ({
        time: new Date(hour.dt * 1000).toISOString(),
        temp: Math.round(hour.temp),
        condition: hour.weather[0].main,
        pop: Math.round(hour.pop * 100),
        windSpeed: Math.round(hour.wind_speed)
      })),
      daily: forecastData.daily.slice(0, 7).map((day: any) => ({
        date: new Date(day.dt * 1000).toISOString(),
        high: Math.round(day.temp.max),
        low: Math.round(day.temp.min),
        condition: day.weather[0].main,
        pop: Math.round(day.pop * 100),
        windSpeed: Math.round(day.wind_speed)
      }))
    };

    // Create AI prompt based on analysis type
    let systemPrompt = `You are the Weather Prophet, an AI weather analyst specializing in outdoor activities and hiking safety. Analyze weather data and provide intelligent insights for hikers.`;
    
    let userPrompt = '';
    
    switch (analysisType) {
      case 'safety':
        userPrompt = `Analyze the weather data for hiking safety concerns. Focus on dangerous conditions, visibility issues, temperature extremes, and provide safety recommendations.`;
        break;
      case 'optimal_timing':
        userPrompt = `Analyze the weather data to recommend the best times for hiking in the next 7 days. Consider temperature, precipitation, wind, and overall comfort.`;
        break;
      case 'gear_recommendations':
        userPrompt = `Based on the weather forecast, recommend appropriate hiking gear, clothing layers, and essential items hikers should bring.`;
        break;
      default:
        userPrompt = `Provide a comprehensive weather analysis for hiking including safety assessment, optimal timing recommendations, gear suggestions, and any notable weather patterns.`;
    }

    userPrompt += `\n\nWeather Data: ${JSON.stringify(weatherContext)}`;
    
    if (trailData) {
      userPrompt += `\n\nTrail Information: ${JSON.stringify(trailData)}`;
    }

    userPrompt += `\n\nProvide your analysis in a structured format with clear sections and actionable recommendations. Be specific about timing and conditions.`;

    // Call OpenAI for analysis
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!aiResponse.ok) {
      throw new Error(`OpenAI API error: ${aiResponse.statusText}`);
    }

    const aiData = await aiResponse.json();
    const analysis = aiData.choices[0].message.content;

    // Return structured response
    return new Response(
      JSON.stringify({
        analysis,
        weatherData: weatherContext,
        timestamp: new Date().toISOString(),
        coordinates: { latitude, longitude }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in weather-prophet function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Weather Prophet analysis failed'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});
