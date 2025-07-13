
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
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    console.log('🔍 Starting comprehensive import system debug...')

    // 1. Check API Keys
    const apiKeys = {
      HIKING_PROJECT_KEY: Deno.env.get('HIKING_PROJECT_KEY'),
      NPS_API_KEY: Deno.env.get('NPS_API_KEY'),
      OPENWEATHER_API_KEY: Deno.env.get('OPENWEATHER_API_KEY'),
      MAPBOX_TOKEN: Deno.env.get('MAPBOX_TOKEN'),
      ONX_API_KEY: Deno.env.get('ONX_API_KEY')
    }

    const availableKeys = Object.entries(apiKeys)
      .filter(([_, value]) => value && value !== 'null')
      .map(([key, _]) => key)

    console.log('🔑 Available API Keys:', availableKeys)

    // 2. Check Database Status
    const { count: trailCount } = await supabase
      .from('trails')
      .select('*', { count: 'exact', head: true })

    const { data: recentJobs } = await supabase
      .from('bulk_import_jobs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    const { data: dataSources } = await supabase
      .from('trail_data_sources')
      .select('*')

    // 3. Test API Endpoints
    const apiTests = {}

    // Test Hiking Project API
    if (apiKeys.HIKING_PROJECT_KEY && apiKeys.HIKING_PROJECT_KEY !== 'null') {
      try {
        const response = await fetch(
          `https://www.hikingproject.com/data/get-trails?lat=40.0274&lon=-105.2519&maxDistance=10&maxResults=10&sort=quality&key=${apiKeys.HIKING_PROJECT_KEY}`
        )
        if (response.ok) {
          const data = await response.json()
          apiTests.hiking_project = {
            status: 'success',
            trails_returned: data.trails?.length || 0
          }
        } else {
          apiTests.hiking_project = {
            status: 'error',
            error: `HTTP ${response.status}: ${response.statusText}`
          }
        }
      } catch (error) {
        apiTests.hiking_project = {
          status: 'error',
          error: error.message
        }
      }
    } else {
      apiTests.hiking_project = {
        status: 'missing_key',
        error: 'API key not configured'
      }
    }

    // Test NPS API
    if (apiKeys.NPS_API_KEY && apiKeys.NPS_API_KEY !== 'null') {
      try {
        const response = await fetch(
          `https://www.nps.gov/api/v1/parks?limit=10&api_key=${apiKeys.NPS_API_KEY}`
        )
        if (response.ok) {
          const data = await response.json()
          apiTests.nps = {
            status: 'success',
            parks_returned: data.data?.length || 0
          }
        } else {
          apiTests.nps = {
            status: 'error',
            error: `HTTP ${response.status}: ${response.statusText}`
          }
        }
      } catch (error) {
        apiTests.nps = {
          status: 'error',
          error: error.message
        }
      }
    } else {
      apiTests.nps = {
        status: 'missing_key',
        error: 'API key not configured'
      }
    }

    // Test OpenStreetMap (no key required)
    try {
      const query = `[out:json][timeout:25];
        (
          relation["route"="hiking"](39.0,-106.0,40.0,-105.0);
        );
        out body;`

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}`
      })

      if (response.ok) {
        const data = await response.json()
        apiTests.openstreetmap = {
          status: 'success',
          elements_returned: data.elements?.length || 0
        }
      } else {
        apiTests.openstreetmap = {
          status: 'error',
          error: `HTTP ${response.status}: ${response.statusText}`
        }
      }
    } catch (error) {
      apiTests.openstreetmap = {
        status: 'error',
        error: error.message
      }
    }

    // 4. Test Trail Insertion
    const testTrail = {
      id: crypto.randomUUID(),
      name: 'Debug Test Trail',
      description: 'Test trail for debugging import system',
      latitude: 40.0274,
      longitude: -105.2519,
      difficulty: 'moderate',
      length: 2.5,
      elevation_gain: 500,
      location: 'Boulder, Colorado',
      source: 'debug_test',
      status: 'approved',
      created_at: new Date().toISOString()
    }

    let insertTest = {}
    try {
      const { error: insertError } = await supabase
        .from('trails')
        .insert([testTrail])

      if (insertError) {
        insertTest = {
          status: 'error',
          error: insertError.message
        }
      } else {
        insertTest = { status: 'success' }
        
        // Clean up test trail
        await supabase
          .from('trails')
          .delete()
          .eq('id', testTrail.id)
      }
    } catch (error) {
      insertTest = {
        status: 'error',
        error: error.message
      }
    }

    // 5. Check for stalled jobs and fix them
    const stalledJobs = recentJobs?.filter(job => 
      job.status === 'pending' && 
      new Date().getTime() - new Date(job.created_at).getTime() > 300000 // 5 minutes
    ) || []

    // Update stalled jobs to error status
    for (const job of stalledJobs) {
      await supabase
        .from('bulk_import_jobs')
        .update({
          status: 'error',
          completed_at: new Date().toISOString(),
          error_message: 'Job stalled - reset by debug system'
        })
        .eq('id', job.id)
    }

    const debugReport = {
      timestamp: new Date().toISOString(),
      system_status: {
        total_trails: trailCount,
        total_import_jobs: recentJobs?.length || 0,
        pending_jobs: recentJobs?.filter(j => j.status === 'pending').length || 0,
        stalled_jobs_fixed: stalledJobs.length,
        active_data_sources: dataSources?.filter(ds => ds.is_active).length || 0
      },
      api_keys: {
        configured: availableKeys,
        missing: Object.keys(apiKeys).filter(key => !availableKeys.includes(key))
      },
      api_tests: apiTests,
      database_test: insertTest,
      recommendations: []
    }

    // Generate recommendations
    if (availableKeys.length < 2) {
      debugReport.recommendations.push('CRITICAL: Configure missing API keys for trail data sources')
    }
    
    if (trailCount < 1000) {
      debugReport.recommendations.push('LOW TRAIL COUNT: Need to run massive import to reach target')
    }
    
    if (stalledJobs.length > 0) {
      debugReport.recommendations.push(`FIXED: Reset ${stalledJobs.length} stalled import jobs`)
    }
    
    if (Object.values(apiTests).some(test => test.status === 'error')) {
      debugReport.recommendations.push('API ISSUES: Some trail data APIs are not responding correctly')
    }

    console.log('🎯 Debug Report Generated:', debugReport)

    return new Response(
      JSON.stringify(debugReport, null, 2),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('💥 Debug system error:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Debug system failed',
        details: error.message,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
