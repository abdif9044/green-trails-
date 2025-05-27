
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qzcplkyinvndvhnevsbt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6Y3Bsa3lpbnZuZHZobmV2c2J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwMzg1OTUsImV4cCI6MjA2MDYxNDU5NX0.ehgiR9tiAz4kbaMFaRI-loE7NI7eOfcvrE-gnutONQY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
});

// Test connection on initialization
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Supabase connection error:', error);
  } else {
    console.log('Supabase connected successfully');
  }
}).catch(err => {
  console.error('Supabase initialization failed:', err);
});
