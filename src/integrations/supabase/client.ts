
import { createClient } from '@supabase/supabase-js';

// Use environment variables with fallbacks for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qzcplkyinvndvhnevsbt.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6Y3Bsa3lpbnZuZHZobmV2c2J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwMzg1OTUsImV4cCI6MjA2MDYxNDU5NX0.ehgiR9tiAz4kbaMFaRI-loE7NI7eOfcvrE-gnutONQY';

// Validate configuration
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration. Please check your environment variables.');
}

if (!supabaseUrl.startsWith('https://')) {
  console.error('Security Warning: Supabase URL must use HTTPS in production');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'greentrails.auth.token',
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'X-Client-Info': 'greentrails-web',
    },
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Enhanced connection test with retry logic
let connectionAttempts = 0;
const maxRetries = 3;

const testConnection = async (): Promise<void> => {
  try {
    connectionAttempts++;
    const { data, error } = await supabase.auth.getSession();
    
    if (error && connectionAttempts < maxRetries) {
      console.warn(`Connection attempt ${connectionAttempts} failed, retrying...`, error);
      setTimeout(testConnection, 1000 * connectionAttempts); // Exponential backoff
      return;
    }
    
    if (error) {
      console.error('Supabase connection failed after retries:', error);
    } else {
      console.log('Supabase connected successfully');
    }
  } catch (err) {
    console.error('Supabase initialization failed:', err);
    if (connectionAttempts < maxRetries) {
      setTimeout(testConnection, 1000 * connectionAttempts);
    }
  }
};

// Initialize connection test
testConnection();
