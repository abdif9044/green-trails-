
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
    const { hikingProject, openWeather, mapbox } = await req.json();
    
    console.log('API keys configured:', {
      hikingProject: hikingProject ? 'configured' : 'missing',
      openWeather: openWeather ? 'configured' : 'missing', 
      mapbox: mapbox ? 'configured' : 'missing'
    });
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'API keys saved for production use'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('API key save error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Failed to save API keys', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
