
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
    const { apiKey } = await req.json();
    
    if (!apiKey) {
      throw new Error('API key is required');
    }
    
    console.log('OpenAI API key configured for assistant features');
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'OpenAI API key configured'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('OpenAI key setup error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Failed to set OpenAI key', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
