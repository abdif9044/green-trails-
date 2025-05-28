
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
}

export const useSimpleAuthState = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    initialized: false
  });

  useEffect(() => {
    let mounted = true;
    let subscription: { unsubscribe: () => void } | null = null;

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('Error getting initial session:', error);
        }

        setState(prevState => ({
          ...prevState,
          session: initialSession,
          user: initialSession?.user || null,
          loading: false,
          initialized: true
        }));

        // Set up auth state listener
        subscription = supabase.auth.onAuthStateChange((event, currentSession) => {
          if (!mounted) return;
          
          console.log(`Auth state change: ${event}`, currentSession?.user?.email || 'No user');
          
          setState(prevState => ({
            ...prevState,
            session: currentSession,
            user: currentSession?.user || null,
            loading: false
          }));
        }).data.subscription;

      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setState(prevState => ({
            ...prevState,
            loading: false,
            initialized: true
          }));
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  return state;
};
