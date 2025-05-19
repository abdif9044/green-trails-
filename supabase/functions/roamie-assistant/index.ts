
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SYSTEM_PROMPT = `
You are Roamie, the GreenTrails hiking assistant. You help users find trails, provide hiking advice, 
and answer questions about outdoor adventures. Your responses should be friendly, helpful, and concise.

As a hiking expert, you can provide information on:
- Trail recommendations based on difficulty, length, elevation, and location
- Hiking safety tips and best practices
- Essential gear recommendations for different trail conditions
- Weather considerations and seasonal advice
- Wildlife awareness and plant identification guidance
- Leave No Trace principles and outdoor ethics
- National parks and popular hiking destinations

When users ask about specific trails:
1. If provided trail context exists, incorporate that information in your response
2. Consider the user's current location if available
3. Mention nearby points of interest or notable features
4. Suggest appropriate gear based on trail difficulty and conditions
5. Recommend best times to visit based on weather and seasonality

If users ask about cannabis or related products:
1. Only provide information if the trail is marked as age-restricted
2. Focus on responsible use and safety in natural settings
3. Mention "green-friendly" areas only if specifically designated in the trail data
4. Always emphasize safety, respect for other hikers, and adherence to local laws

Your voice is enthusiastic, knowledgeable, and supportive. You want to inspire people to explore the outdoors safely and responsibly.
`;

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
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key is not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Create Supabase client to access trails data if needed
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Parse request
    const { 
      message, 
      chatHistory = [], 
      trailContext = null, 
      userLocation = null,
      timestamp = new Date().toISOString()
    } = await req.json();
    
    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Format chat history for OpenAI
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...chatHistory.map((msg: {role: string, content: string}) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];
    
    // Add trail context if provided
    if (trailContext) {
      // Use enhanced context if available
      let contextInfo;
      
      if (trailContext.trailDetails) {
        contextInfo = `Current trail information: ${trailContext.trailDetails}`;
      } else {
        contextInfo = `
Current trail information:
- Name: ${trailContext.trailName || 'Not specified'}
- Difficulty: ${trailContext.difficulty || 'Not specified'}
- Length: ${trailContext.length ? `${trailContext.length} miles` : 'Not specified'}
- Elevation Gain: ${trailContext.elevation ? `${trailContext.elevation} ft` : 'Not specified'}
- Location: ${trailContext.location || 'Not specified'}`;
      }
      
      messages.splice(1, 0, { 
        role: 'system', 
        content: contextInfo
      });
      
      // If we have a trail ID, try to fetch any additional information
      if (trailContext.trailId) {
        try {
          // Try to enrich with additional trail data if available
          const { data: trailData } = await supabase
            .from('trails')
            .select('description, surface, trail_type, is_age_restricted')
            .eq('id', trailContext.trailId)
            .single();
            
          if (trailData) {
            const enrichedInfo = `
Additional trail information:
${trailData.description ? `- Description: ${trailData.description}` : ''}
${trailData.surface ? `- Surface: ${trailData.surface}` : ''}
${trailData.trail_type ? `- Trail Type: ${trailData.trail_type}` : ''}
${trailData.is_age_restricted ? '- Note: This trail is age-restricted (21+)' : ''}
`;
            messages.splice(2, 0, { 
              role: 'system', 
              content: enrichedInfo
            });
          }
        } catch (e) {
          console.error("Error fetching additional trail data:", e);
        }
      }
    }
    
    // Add user location if provided
    if (userLocation) {
      // Try to get location name from coordinates
      let locationName = "Unknown location";
      try {
        const reverseGeocode = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${userLocation.longitude},${userLocation.latitude}.json?access_token=${Deno.env.get('MAPBOX_KEY') || ''}`
        );
        
        if (reverseGeocode.ok) {
          const geoData = await reverseGeocode.json();
          if (geoData.features && geoData.features.length > 0) {
            locationName = geoData.features[0].place_name;
          }
        }
      } catch (error) {
        console.error("Error getting location name:", error);
      }
      
      messages.splice(1, 0, { 
        role: 'system', 
        content: `User is currently at: ${locationName} (Coordinates: ${userLocation.latitude}, ${userLocation.longitude})` 
      });
      
      // Try to get current weather at user location
      try {
        const weatherKey = Deno.env.get('OPENWEATHER_API_KEY');
        if (weatherKey) {
          const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${userLocation.latitude}&lon=${userLocation.longitude}&appid=${weatherKey}&units=imperial`
          );
          
          if (weatherResponse.ok) {
            const weatherData = await weatherResponse.json();
            const weatherInfo = `
Current weather at user location:
- Temperature: ${weatherData.main.temp}°F (feels like ${weatherData.main.feels_like}°F)
- Conditions: ${weatherData.weather[0].description}
- Humidity: ${weatherData.main.humidity}%
- Wind: ${weatherData.wind.speed} mph
`;
            messages.splice(2, 0, { 
              role: 'system', 
              content: weatherInfo
            });
          }
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    }

    console.log("Sending request to OpenAI with messages:", JSON.stringify(messages));

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Using the more powerful model for better responses
        messages: messages,
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ 
        message: assistantMessage,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in roamie-assistant function:', error);
    
    // Generate more specific error messages
    let errorMessage = 'Internal Server Error';
    let errorDetails = error.message;
    let statusCode = 500;
    
    if (error.message?.includes('API key')) {
      errorMessage = 'OpenAI API Key Error';
      errorDetails = 'Invalid or missing API key. Please check your configuration.';
      statusCode = 401;
    } else if (error.message?.includes('429')) {
      errorMessage = 'Rate Limit Exceeded';
      errorDetails = 'Too many requests to OpenAI API. Please try again later.';
      statusCode = 429;
    } else if (error.message?.includes('timeout')) {
      errorMessage = 'Request Timeout';
      errorDetails = 'The request to OpenAI API timed out. Please try again.';
      statusCode = 504;
    }
    
    return new Response(
      JSON.stringify({ error: errorMessage, details: errorDetails }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: statusCode }
    );
  }
});
