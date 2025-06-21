
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, handleCorsOptions } from './cors.ts';
import { AutonomousImportOrchestrator } from './orchestrator.ts';
import { DatabaseFoundationFixer } from './database-fixer.ts';
import { ImportMonitor } from './monitor.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return handleCorsOptions();
  }
  
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    if (!supabaseServiceKey) {
      throw new Error('Service role key not configured');
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });
    
    console.log('🚀 AUTONOMOUS TRAIL IMPORT SYSTEM - Starting 55,555 trail import');
    
    const requestBody = await req.json();
    const targetTrails = requestBody.targetTrails || 55555;
    
    // Initialize the autonomous orchestrator
    const orchestrator = new AutonomousImportOrchestrator(supabase, targetTrails);
    
    // Start the autonomous import process
    const result = await orchestrator.executeAutonomousImport();
    
    return new Response(
      JSON.stringify({
        success: result.success,
        message: result.message,
        jobId: result.jobId,
        trailsImported: result.trailsImported,
        timeElapsed: result.timeElapsed,
        autonomous: true
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('💥 Autonomous import system error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Autonomous import system failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        autonomous: false
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
