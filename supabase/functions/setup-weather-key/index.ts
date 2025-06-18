
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Production OpenWeather API key
    const weatherApiKey = '2f6fe1dd36e9425a3a51a182d9d9b3ca';
    
    console.log('Weather API configured for production use');
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Weather API configured',
        apiKey: weatherApiKey
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Weather API setup error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Weather API setup failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
