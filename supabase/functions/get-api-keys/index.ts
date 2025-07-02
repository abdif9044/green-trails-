import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // For the GreenTrails application, we'll use the API keys that were configured
    const apiKeys = {
      HIKING_PROJECT_KEY: Deno.env.get('HIKING_PROJECT_KEY'),
      NPS_API_KEY: Deno.env.get('NPS_API_KEY'),
      OPENWEATHER_API_KEY: Deno.env.get('OPENWEATHER_API_KEY'),
      MAPBOX_TOKEN: Deno.env.get('MAPBOX_TOKEN'),
    }

    console.log('API Keys available:', Object.keys(apiKeys).filter(key => apiKeys[key as keyof typeof apiKeys]))

    return new Response(
      JSON.stringify(apiKeys),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error retrieving API keys:', error)
    
    return new Response(
      JSON.stringify({
        error: 'Failed to retrieve API keys',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})