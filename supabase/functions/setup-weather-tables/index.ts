
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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Create trail_weather table
    const { error: weatherError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.trail_weather (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          trail_id UUID REFERENCES trails(id) ON DELETE CASCADE,
          temperature INTEGER,
          condition TEXT,
          high INTEGER,
          low INTEGER,
          precipitation TEXT,
          sunrise TEXT,
          sunset TEXT,
          wind_speed TEXT,
          wind_direction TEXT,
          updated_at TIMESTAMPTZ DEFAULT now(),
          created_at TIMESTAMPTZ DEFAULT now()
        );
        
        ALTER TABLE public.trail_weather ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Anyone can view trail weather" ON public.trail_weather FOR SELECT USING (true);
        CREATE POLICY "Service can manage trail weather" ON public.trail_weather FOR ALL USING (true);
      `
    })

    // Create trail_weather_forecasts table
    const { error: forecastError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.trail_weather_forecasts (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          trail_id UUID REFERENCES trails(id) ON DELETE CASCADE,
          hourly JSONB,
          daily JSONB,
          updated_at TIMESTAMPTZ DEFAULT now(),
          created_at TIMESTAMPTZ DEFAULT now()
        );
        
        ALTER TABLE public.trail_weather_forecasts ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Anyone can view trail forecasts" ON public.trail_weather_forecasts FOR SELECT USING (true);
        CREATE POLICY "Service can manage trail forecasts" ON public.trail_weather_forecasts FOR ALL USING (true);
      `
    })

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
