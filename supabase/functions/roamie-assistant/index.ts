
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SYSTEM_PROMPT = `
You are Roamie, the GreenTrails hiking assistant. You help users find trails, provide hiking advice, 
and answer questions about outdoor adventures. Your responses should be friendly, helpful, and concise.

You know about:
- Trail difficulty ratings and what they mean
- Basic hiking safety and etiquette
- General information about national parks and popular hiking destinations
- Weather considerations for hiking
- Gear recommendations based on trail conditions

When recommending trails, consider the user's preferences if mentioned (difficulty, length, location).
If you don't know the answer to a specific question about a trail, kindly let the user know and offer to help them find general information instead.
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
      messages.splice(1, 0, { 
        role: 'system', 
        content: `Current trail context: ${JSON.stringify(trailContext)}` 
      });
    }
    
    // Add user location if provided
    if (userLocation) {
      messages.splice(1, 0, { 
        role: 'system', 
        content: `User's current location: ${JSON.stringify(userLocation)}` 
      });
    }

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using the fast, cost-effective model
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
