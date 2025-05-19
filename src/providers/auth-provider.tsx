
import React, { useEffect, ReactNode, useState } from 'react';
import { AuthContext } from '@/contexts/auth-context';
import { useAuthState } from '@/hooks/auth/use-auth-state';
import { useAuthMethods } from '@/hooks/auth/use-auth-methods';
import { useUserManagement } from '@/hooks/auth/use-user-management';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
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
          toast({
            title: "Welcome to GreenTrails!",
            description: `You're now signed in as ${currentSession?.user?.email}`,
          });
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Signed out",
            description: "You have been signed out successfully",
          });
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Auth token refreshed successfully');
        } else if (event === 'USER_UPDATED') {
          toast({
            title: "Profile updated",
            description: "Your profile information has been updated",
          });
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
          toast({
            title: "Authentication Notice",
            description: "There was an issue with your session. Please sign in again if needed.",
            variant: "default",
          });
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
