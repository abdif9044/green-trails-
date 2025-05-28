
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('🔧 Setting up daily trail maintenance cron job...');
    
    // Create the cron job that runs daily at 2 AM UTC
    const cronJobQuery = `
      SELECT cron.schedule(
        'daily-trail-maintenance',
        '0 2 * * *', -- Daily at 2 AM UTC
        $$
        SELECT
          net.http_post(
            url:='${supabaseUrl}/functions/v1/bootstrap-trail-database',
            headers:='{"Content-Type": "application/json", "Authorization": "Bearer ${supabaseKey}"}'::jsonb,
            body:='{"source": "cron", "timestamp": "' || now() || '"}'::jsonb
          ) as request_id;
        $$
      );
    `;
    
    // Execute the cron setup using the execute_sql function
    const { data, error } = await supabase.rpc('execute_sql', {
      sql_query: cronJobQuery
    });
    
    if (error) {
      console.error('Error setting up cron job:', error);
      throw error;
    }
    
    console.log('✅ Daily trail maintenance cron job configured successfully');
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Daily trail maintenance cron job configured',
        schedule: 'Daily at 2 AM UTC',
        details: data
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Setup cron job error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to setup cron job', 
        details: error.message 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
