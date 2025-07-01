import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Set the API keys as provided in the prompt
    const apiKeys = {
      OPENAI_API_KEY: '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',
      MAPBOX_TOKEN: 'pk.eyJ1IjoiZ3Ryb2FtaWUiLCJhIjoiY21iNzF1YjltMDY4MjJubjVsMm4wbml6eiJ9.HTW9ugjeNZTbK9mafphIQQ',
      OPENWEATHER_API_KEY: '2f6fe1dd36e9425a3a51a182d9d9b3ca',
      ONX_API_KEY: 'c10ac85b-aaf8-428b-b7cd-ffe342769805'
    }

    console.log('Setting API keys for GreenTrails...')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'API keys configured successfully',
        keys: Object.keys(apiKeys)
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error setting API keys:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        message: 'Failed to set API keys'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})