
import React, { useEffect, ReactNode, useState } from 'react';
import { AuthContext } from '@/contexts/auth-context';
import { useAuthState } from '@/hooks/auth/use-auth-state';
import { useAuthMethods } from '@/hooks/auth/use-auth-methods';
import { useUserManagement } from '@/hooks/auth/use-user-management';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

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
    
    const initialize = async () => {
      try {
        setLoading(true);
        
        // Set up auth state listener first
        subscription = supabase.auth.onAuthStateChange(
          (event, currentSession) => {
            console.log(`Auth state change: ${event}`, currentSession?.user?.email || 'No user');
            setSession(currentSession);
            setUser(currentSession?.user || null);
            
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
        ).data.subscription;

        // Get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
        } else if (initialSession) {
          console.log('Initial session found:', initialSession.user?.email);
          setSession(initialSession);
          setUser(initialSession.user);
        } else {
          console.log('No active session found');
          setSession(null);
          setUser(null);
        }
        
      } catch (error) {
        console.error('Exception during auth initialization:', error);
      } finally {
        setLoading(false);
        setAuthInitialized(true);
      }
    };

    initialize();

    return () => {
      console.log('AuthProvider cleanup: unsubscribing from auth changes');
      if (subscription) {
        subscription.unsubscribe();
      }
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
