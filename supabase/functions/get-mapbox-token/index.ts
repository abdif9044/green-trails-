
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
    // Get the Mapbox token from environment variables
    const token = Deno.env.get('MAPBOX_ACCESS_TOKEN') || 'pk.eyJ1IjoiZGVtby1ncmVlbnRyYWlscyIsImEiOiJjbHdnYW9sdTAwbmpvMmp0ZWJvNnQ2cXdxIn0.F7uYVxm9vBqBRdlSIkd4Kg';
    
    // Return the token
    return new Response(
      JSON.stringify({ token }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    // Return error response
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
