
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { DatabaseSetupService } from '@/services/database/setup-service';

export type AuthStateUpdater = {
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
};

export const initializeAuthState = async (
  { setUser, setSession, setLoading }: AuthStateUpdater
) => {
  setLoading(true);
  try {
    console.log('Getting initial session from Supabase...');
    
    // Test connection to Supabase first
    try {
      const { data: connectionTest } = await supabase.from('profiles').select('count(*)', { count: 'exact', head: true });
      console.log('Supabase connection verified', connectionTest);
    } catch (connectionError) {
      console.error('Supabase connection test failed:', connectionError);
      return { 
        success: false, 
        message: 'Failed to connect to authentication service. Please check your internet connection.', 
        data: null 
      };
    }
    
    // Get user session from localStorage first for immediate UI update
    const savedSessionStr = localStorage.getItem('supabase.auth.token');
    if (savedSessionStr) {
      try {
        const savedSession = JSON.parse(savedSessionStr);
        if (savedSession?.currentSession?.access_token) {
          console.log('Found saved session in localStorage');
          // Don't set user yet - wait for official session check
        }
      } catch (e) {
        console.warn('Failed to parse saved session:', e);
      }
    }
    
    // Get official user session from Supabase
    const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Error getting initial session:', sessionError);
      return { success: false, message: sessionError.message, data: null };
    }
    
    if (initialSession) {
      console.log('Initial session found:', initialSession.user?.email);
      setSession(initialSession);
      setUser(initialSession?.user || null);
      
      // Log successful initialization
      try {
        await DatabaseSetupService.logSecurityEvent('session_restored', { 
          user_id: initialSession.user?.id,
          timestamp: new Date().toISOString() 
        });
      } catch (logError) {
        console.warn('Unable to log session restoration (non-critical):', logError);
      }
      
      return { success: true, message: 'Session restored', data: { 
        user: initialSession?.user, 
        session: initialSession 
      }};
    } else {
      console.log('No active session found');
      setSession(null);
      setUser(null);
      return { success: true, message: 'No active session', data: null };
    }
  } catch (error) {
    console.error('Exception during auth initialization:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error during initialization', data: null };
  } finally {
    setLoading(false);
  }
};

type AuthEventCallback = (
  event: string, 
  session: Session | null
) => void;

export const setupAuthStateListener = (
  { setUser, setSession, setLoading }: AuthStateUpdater,
  callback?: AuthEventCallback
) => {
  console.log('Setting up auth state listener...');
  
  // Set up auth state listener
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, currentSession) => {
      console.log(`Auth state change: ${event}`, currentSession?.user?.email || 'No user');
      
      setSession(currentSession);
      setUser(currentSession?.user || null);
      setLoading(false);
      
      // Save session to localStorage for persistence
      if (currentSession) {
        localStorage.setItem('greentrails.last_auth_event', JSON.stringify({
          event,
          timestamp: new Date().toISOString(),
          user_email: currentSession.user?.email
        }));
      }
      
      // Log auth state changes for security purposes
      if (event) {
        try {
          DatabaseSetupService.logSecurityEvent('auth_state_change', {
            event: event,
            user_id: currentSession?.user?.id,
            timestamp: new Date().toISOString()
          }).catch(error => console.warn('Failed to log auth state change (non-critical):', error));
        } catch (error) {
          console.warn('Error in auth state logging (non-critical):', error);
        }
      }

      // Execute callback if provided
      if (callback) {
        callback(event, currentSession);
      }
    }
  );

  return subscription;
};

// Helper function to check if Supabase connection is valid
export const checkSupabaseConnection = async () => {
  try {
    const start = performance.now();
    const { data, error } = await supabase.from('profiles').select('count(*)', { count: 'exact', head: true });
    const duration = performance.now() - start;
    
    if (error) {
      console.error('Supabase connection check failed:', error);
      return {
        connected: false,
        message: error.message,
        duration: duration
      };
    }
    
    return {
      connected: true,
      message: 'Connection successful',
      duration: duration
    };
  } catch (err) {
    console.error('Exception during Supabase connection check:', err);
    return {
      connected: false,
      message: err instanceof Error ? err.message : 'Unknown error checking connection',
      duration: 0
    };
  }
};

// Clean up expired sessions from localStorage
export const cleanupExpiredSessions = () => {
  try {
    const savedSessionStr = localStorage.getItem('supabase.auth.token');
    if (savedSessionStr) {
      const savedSession = JSON.parse(savedSessionStr);
      if (savedSession?.currentSession?.expires_at) {
        const expiresAt = new Date(savedSession.currentSession.expires_at * 1000);
        if (expiresAt < new Date()) {
          console.log('Removing expired session from localStorage');
          localStorage.removeItem('supabase.auth.token');
        }
      }
    }
  } catch (e) {
    console.warn('Failed to cleanup expired sessions:', e);
  }
};
