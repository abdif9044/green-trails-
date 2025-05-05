
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { DatabaseSetupService } from '@/services/database/setup-service';

export type AuthStateUpdater = {
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
};

export const initializeAuthState = async (
  { setUser, setSession, setLoading }: AuthStateUpdater,
  userId?: string
) => {
  try {
    // Get initial session
    const { data: { session: initialSession } } = await supabase.auth.getSession();
    setSession(initialSession);
    setUser(initialSession?.user || null);
  } catch (error) {
    console.error('Error getting initial session:', error);
  } finally {
    setLoading(false);
  }
};

export const setupAuthStateListener = (
  { setUser, setSession, setLoading }: AuthStateUpdater,
  currentUserId?: string
) => {
  // Set up auth state listener
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user || null);
      setLoading(false);
      
      // Log auth state changes for security purposes
      if (_event && currentUserId !== currentSession?.user?.id) {
        DatabaseSetupService.logSecurityEvent('auth_state_change', {
          event: _event,
          user_id: currentSession?.user?.id,
          timestamp: new Date().toISOString()
        }).catch(console.error);
      }
    }
  );

  return subscription;
};
