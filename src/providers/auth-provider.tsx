
import React, { useEffect, ReactNode } from 'react';
import { AuthContext } from '@/contexts/auth-context';
import { useAuthState } from '@/hooks/auth/use-auth-state';
import { useAuthMethods } from '@/hooks/auth/use-auth-methods';
import { useUserManagement } from '@/hooks/auth/use-user-management';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { toast } = useToast();
  const { user, session, loading, setUser, setSession, setLoading } = useAuthState();
  const { signIn, signUp, signOut } = useAuthMethods(user);
  const { verifyAge, resetPassword, updatePassword } = useUserManagement(user);

  useEffect(() => {
    console.log('AuthProvider initializing...');
    let subscription: { unsubscribe: () => void };
    
    // Set up auth state listener FIRST
    const setupAuthListener = () => {
      const { data } = supabase.auth.onAuthStateChange(
        (event, currentSession) => {
          console.log(`Auth state change: ${event}`, currentSession?.user?.email || 'No user');
          
          setSession(currentSession);
          setUser(currentSession?.user || null);
          setLoading(false);
          
          // Handle specific auth events with user-friendly notifications
          if (event === 'SIGNED_IN') {
            toast({
              title: "Welcome back!",
              description: `Signed in as ${currentSession?.user?.email}`,
            });
          } else if (event === 'SIGNED_OUT') {
            toast({
              title: "Signed out",
              description: "You have been signed out successfully",
            });
          }
        }
      );
      
      return data.subscription;
    };

    // Initialize auth and check for existing session
    const initializeAuth = async () => {
      try {
        setLoading(true);
        // Check for existing session
        const { data: { session: existingSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          toast({
            title: "Authentication Error",
            description: "There was a problem connecting to the authentication service",
            variant: "destructive",
          });
        } else if (existingSession) {
          console.log('Existing session found for:', existingSession.user?.email);
          setSession(existingSession);
          setUser(existingSession.user || null);
        } else {
          console.log('No active session found');
          setSession(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Exception during auth initialization:', error);
      } finally {
        setLoading(false);
      }
    };

    // Setup auth listener first, then initialize
    subscription = setupAuthListener();
    initializeAuth();

    return () => {
      console.log('AuthProvider cleanup: unsubscribing from auth changes');
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
