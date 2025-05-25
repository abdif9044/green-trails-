
import React, { useEffect, ReactNode, useState } from 'react';
import { AuthContext } from '@/contexts/auth-context';
import { useAuthState } from '@/hooks/auth/use-auth-state';
import { useAuthMethods } from '@/hooks/auth/use-auth-methods';
import { useUserManagement } from '@/hooks/auth/use-user-management';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { initializeAuthState, setupAuthStateListener } from '@/utils/auth-utils';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { user, session, loading, setUser, setSession, setLoading } = useAuthState();
  const { signIn, signUp, signOut } = useAuthMethods(user);
  const { verifyAge, resetPassword, updatePassword } = useUserManagement(user);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    console.log('AuthProvider initializing...');
    let subscription: { unsubscribe: () => void };
    
    // Set up auth state listener FIRST to catch any auth events
    subscription = setupAuthStateListener(
      { setUser, setSession, setLoading },
      (event, currentSession) => {
        if (event === 'SIGNED_IN') {
          console.log("User signed in:", currentSession?.user?.email);
        } else if (event === 'SIGNED_OUT') {
          console.log("User signed out");
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Auth token refreshed successfully');
        } else if (event === 'USER_UPDATED') {
          console.log("User profile updated");
        }
      }
    );

    // Initialize auth and check for existing session
    const initialize = async () => {
      try {
        setLoading(true);
        const result = await initializeAuthState({ setUser, setSession, setLoading });
        
        if (!result.success) {
          console.warn('Auth initialization issue:', result.message);
        }
      } catch (error) {
        console.error('Exception during auth initialization:', error);
      } finally {
        setLoading(false);
        setAuthInitialized(true);
      }
    };

    initialize();

    // Check session expiration and refresh if needed
    const sessionCheckInterval = setInterval(async () => {
      const { data } = await supabase.auth.getSession();
      const currentSession = data?.session;
      
      if (currentSession) {
        // If session exists but is about to expire (within 10 minutes), refresh it
        const expiresAt = new Date((currentSession.expires_at || 0) * 1000);
        const now = new Date();
        const tenMinutesFromNow = new Date(now.getTime() + 10 * 60 * 1000);
        
        if (expiresAt < tenMinutesFromNow) {
          console.log('Session about to expire, refreshing...');
          await supabase.auth.refreshSession();
        }
      }
    }, 60000); // Check every minute

    return () => {
      console.log('AuthProvider cleanup: unsubscribing from auth changes');
      clearInterval(sessionCheckInterval);
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    verifyAge,
    resetPassword,
    updatePassword,
    isInitialized: authInitialized
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
