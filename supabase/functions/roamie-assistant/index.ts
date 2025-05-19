
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
    const { message, chatHistory = [], trailContext = null, userLocation = null } = await req.json();
    
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
      const contextInfo = `
Current trail information:
- Name: ${trailContext.trailName || 'Not specified'}
- Difficulty: ${trailContext.difficulty || 'Not specified'}
- Length: ${trailContext.length ? `${trailContext.length} miles` : 'Not specified'}
- Elevation Gain: ${trailContext.elevation ? `${trailContext.elevation} ft` : 'Not specified'}
- Location: ${trailContext.location || 'Not specified'}`;
      
      messages.splice(1, 0, { 
        role: 'system', 
        content: contextInfo
      });
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
    
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
