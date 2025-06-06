
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MemoryRequest {
  user_id: string;
  memory_key: string;
  memory_value: any;
}

interface MemoryResponse {
  memory_value: any;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  try {
    const url = new URL(req.url)
    const method = req.method

    console.log(`Memory API ${method} request to ${url.pathname}`)

    // GET /memory?user_id={id}&key={memory_key}
    if (method === 'GET') {
      const userId = url.searchParams.get('user_id')
      const memoryKey = url.searchParams.get('key')

      if (!userId || !memoryKey) {
        console.error('Missing required parameters: user_id or key')
        return new Response(
          JSON.stringify({ error: 'Missing required parameters: user_id and key' } as ErrorResponse),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      console.log(`Fetching memory for user ${userId}, key: ${memoryKey}`)

      const { data, error } = await supabaseClient
        .from('user_memory')
        .select('memory_value')
        .eq('user_id', userId)
        .eq('memory_key', memoryKey)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No data found
          console.log(`No memory found for user ${userId}, key: ${memoryKey}`)
          return new Response(
            JSON.stringify({ memory_value: null } as MemoryResponse),
            { 
              status: 200, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }
        
        console.error('Database error:', error)
        return new Response(
          JSON.stringify({ error: 'Database error', details: error.message } as ErrorResponse),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      console.log(`Successfully retrieved memory for user ${userId}`)
      return new Response(
        JSON.stringify({ memory_value: data.memory_value } as MemoryResponse),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // POST /memory
    if (method === 'POST') {
      const requestBody: MemoryRequest = await req.json()
      const { user_id, memory_key, memory_value } = requestBody

      if (!user_id || !memory_key || memory_value === undefined) {
        console.error('Missing required fields in request body')
        return new Response(
          JSON.stringify({ error: 'Missing required fields: user_id, memory_key, memory_value' } as ErrorResponse),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      console.log(`Upserting memory for user ${user_id}, key: ${memory_key}`)

      const { error } = await supabaseClient
        .from('user_memory')
        .upsert(
          {
            user_id,
            memory_key,
            memory_value,
            updated_at: new Date().toISOString()
          },
          {
            onConflict: 'user_id,memory_key'
          }
        )

      if (error) {
        console.error('Database error:', error)
        return new Response(
          JSON.stringify({ error: 'Database error', details: error.message } as ErrorResponse),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      console.log(`Successfully upserted memory for user ${user_id}`)
      return new Response(
        JSON.stringify({ success: true }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // DELETE /memory?user_id={id}&key={memory_key}
    if (method === 'DELETE') {
      const userId = url.searchParams.get('user_id')
      const memoryKey = url.searchParams.get('key')

      if (!userId || !memoryKey) {
        console.error('Missing required parameters: user_id or key')
        return new Response(
          JSON.stringify({ error: 'Missing required parameters: user_id and key' } as ErrorResponse),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      console.log(`Deleting memory for user ${userId}, key: ${memoryKey}`)

      const { error } = await supabaseClient
        .from('user_memory')
        .delete()
        .eq('user_id', userId)
        .eq('memory_key', memoryKey)

      if (error) {
        console.error('Database error:', error)
        return new Response(
          JSON.stringify({ error: 'Database error', details: error.message } as ErrorResponse),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      console.log(`Successfully deleted memory for user ${userId}`)
      return new Response(
        JSON.stringify({ success: true }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Method not allowed
    return new Response(
      JSON.stringify({ error: 'Method not allowed' } as ErrorResponse),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      } as ErrorResponse),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
