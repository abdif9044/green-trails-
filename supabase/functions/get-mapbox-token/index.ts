
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('🗺️ Mapbox token request received');
    
    // Try to get the token from environment variables
    let token = Deno.env.get('MAPBOX_ACCESS_TOKEN');
    
    // If no token in env, use the fallback token
    if (!token) {
      console.log('🗺️ No MAPBOX_ACCESS_TOKEN found in environment, using fallback');
      token = 'pk.eyJ1IjoiZ3Ryb2FtaWUiLCJhIjoiY21iNzF1YjltMDY4MjJubjVsMm4wbml6eiJ9.HTW9ugjeNZTbK9mafphIQQ';
    } else {
      console.log('🗺️ Using MAPBOX_ACCESS_TOKEN from environment');
    }
    
    // Basic token validation
    if (!token.startsWith('pk.')) {
      console.error('🗺️ Invalid Mapbox token format');
      throw new Error('Invalid token format');
    }
    
    console.log('🗺️ Returning Mapbox token successfully');
    
    // Return the token
    return new Response(
      JSON.stringify({ 
        token,
        source: Deno.env.get('MAPBOX_ACCESS_TOKEN') ? 'environment' : 'fallback'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('🗺️ Error in get-mapbox-token function:', error);
    
    // Return error response with fallback token
    const fallbackToken = 'pk.eyJ1IjoiZ3Ryb2FtaWUiLCJhIjoiY21iNzF1YjltMDY4MjJubjVsMm4wbml6eiJ9.HTW9ugjeNZTbK9mafphIQQ';
    
    return new Response(
      JSON.stringify({ 
        token: fallbackToken,
        source: 'fallback',
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200  // Return 200 so the app can still work with fallback
      }
    )
  }
})
