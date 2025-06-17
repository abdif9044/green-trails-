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
    
    // Test connection to Supabase first with improved error handling
    try {
      const { data: connectionTest } = await supabase.from('profiles').select('count(*)', { count: 'exact', head: true });
      console.log('Supabase connection verified', connectionTest);
    } catch (connectionError: any) {
      console.error('Supabase connection test failed:', connectionError);
      
      // Check for SSL/HTTPS issues
      if (connectionError?.message?.includes('SSL') || 
          connectionError?.message?.includes('secure connection') ||
          connectionError?.message?.includes('CORS')) {
        return { 
          success: false, 
          message: 'SSL/HTTPS connection error. Please check your Supabase URL configuration and ensure it uses HTTPS.', 
          data: null 
        };
      }
      
      return { 
        success: false, 
        message: 'Failed to connect to authentication service. Please check your internet connection and Supabase configuration.', 
        data: null 
      };
    }
    
    // Clean up any expired sessions first
    cleanupExpiredSessions();
    
    // Get official user session from Supabase with retry logic
    let sessionAttempts = 0;
    let initialSession = null;
    let sessionError = null;
    
    while (sessionAttempts < 3) {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (!error) {
        initialSession = session;
        break;
      }
      sessionError = error;
      sessionAttempts++;
      
      if (sessionAttempts < 3) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
      }
    }
    
    if (sessionError) {
      console.error('Error getting initial session after retries:', sessionError);
      return { success: false, message: sessionError.message, data: null };
    }
    
    if (initialSession) {
      console.log('Initial session found:', initialSession.user?.email);
      setSession(initialSession);
      setUser(initialSession?.user || null);
      
      // Log successful initialization
      try {
        await DatabaseSetupService.logSecurityEvent('session_restored', initialSession.user?.id, { 
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
  } catch (error: any) {
    console.error('Exception during auth initialization:', error);
    
    // Enhanced error message for SSL/connection issues
    let errorMessage = error instanceof Error ? error.message : 'Unknown error during initialization';
    if (errorMessage.includes('SSL') || errorMessage.includes('HTTPS') || errorMessage.includes('secure')) {
      errorMessage = 'Secure connection failed. Please ensure your Supabase configuration uses HTTPS and check your network settings.';
    }
    
    return { success: false, message: errorMessage, data: null };
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
  
  // Set up auth state listener with enhanced error handling
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, currentSession) => {
      console.log(`Auth state change: ${event}`, currentSession?.user?.email || 'No user');
      
      setSession(currentSession);
      setUser(currentSession?.user || null);
      setLoading(false);
      
      // Save session to localStorage for persistence with better error handling
      if (currentSession) {
        try {
          localStorage.setItem('greentrails.last_auth_event', JSON.stringify({
            event,
            timestamp: new Date().toISOString(),
            user_email: currentSession.user?.email
          }));
        } catch (storageError) {
          console.warn('Failed to save auth event to localStorage:', storageError);
        }
      }
      
      // Log auth state changes for security purposes
      if (event) {
        try {
          DatabaseSetupService.logSecurityEvent('auth_state_change', currentSession?.user?.id, {
            event: event,
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

// Helper function to check if Supabase connection is valid with enhanced diagnostics
export const checkSupabaseConnection = async () => {
  try {
    const start = performance.now();
    
    // Check if we're on HTTPS in production
    const isProduction = !window.location.hostname.includes('localhost');
    const isSecure = window.location.protocol === 'https:';
    
    if (isProduction && !isSecure) {
      return {
        connected: false,
        message: 'Application must be served over HTTPS in production',
        duration: 0,
        securityIssue: true
      };
    }
    
    const { data, error } = await supabase.from('profiles').select('count(*)', { count: 'exact', head: true });
    const duration = performance.now() - start;
    
    if (error) {
      console.error('Supabase connection check failed:', error);
      
      let enhancedMessage = error.message;
      if (error.message.includes('SSL') || error.message.includes('CORS')) {
        enhancedMessage = `${error.message}. Check your Supabase URL configuration and ensure HTTPS is properly configured.`;
      }
      
      return {
        connected: false,
        message: enhancedMessage,
        duration: duration,
        securityIssue: error.message.includes('SSL') || error.message.includes('CORS')
      };
    }
    
    return {
      connected: true,
      message: 'Connection successful',
      duration: duration,
      securityIssue: false
    };
  } catch (err: any) {
    console.error('Exception during Supabase connection check:', err);
    
    let enhancedMessage = err instanceof Error ? err.message : 'Unknown error checking connection';
    if (enhancedMessage.includes('SSL') || enhancedMessage.includes('fetch')) {
      enhancedMessage = 'Network or SSL connection error. Please check your Supabase configuration and network settings.';
    }
    
    return {
      connected: false,
      message: enhancedMessage,
      duration: 0,
      securityIssue: true
    };
  }
};

// Clean up expired sessions from localStorage with better error handling
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
          // Also clean up other auth-related localStorage items
          localStorage.removeItem('greentrails.last_auth_event');
        }
      }
    }
  } catch (e) {
    console.warn('Failed to cleanup expired sessions:', e);
    // If we can't parse the session, remove it to be safe
    try {
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('greentrails.last_auth_event');
    } catch (removeError) {
      console.warn('Failed to remove corrupted session data:', removeError);
    }
  }
};

// New utility to validate Supabase configuration
export const validateSupabaseConfig = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  const issues: string[] = [];
  
  if (!supabaseUrl) {
    issues.push('VITE_SUPABASE_URL environment variable is not set');
  } else if (!supabaseUrl.startsWith('https://')) {
    issues.push('VITE_SUPABASE_URL must use HTTPS protocol');
  }
  
  if (!supabaseKey) {
    issues.push('VITE_SUPABASE_ANON_KEY environment variable is not set');
  } else if (supabaseKey.includes('service_role')) {
    issues.push('Service role key should not be used in frontend applications');
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
};
