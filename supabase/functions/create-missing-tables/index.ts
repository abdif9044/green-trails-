
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

    // Create activity_feed table
    const { error: activityFeedError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.activity_feed (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES auth.users ON DELETE CASCADE,
          type TEXT NOT NULL,
          trail_id UUID REFERENCES trails(id) ON DELETE CASCADE,
          album_id UUID,
          target_user_id UUID REFERENCES auth.users ON DELETE CASCADE,
          content TEXT,
          created_at TIMESTAMPTZ DEFAULT now()
        );
        
        ALTER TABLE public.activity_feed ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Users can view activity from people they follow" ON public.activity_feed FOR SELECT USING (
          auth.uid() = user_id OR 
          EXISTS (
            SELECT 1 FROM follows 
            WHERE follower_id = auth.uid() AND following_id = activity_feed.user_id
          )
        );
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
