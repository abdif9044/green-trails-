
import React, { useEffect, ReactNode } from 'react';
import { AuthContext } from '@/contexts/auth-context';
import { useAuthState } from '@/hooks/auth/use-auth-state';
import { useAuthMethods } from '@/hooks/auth/use-auth-methods';
import { useUserManagement } from '@/hooks/auth/use-user-management';
import { initializeAuthState, setupAuthStateListener } from '@/utils/auth-utils';
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
    
    // Set up auth state listener FIRST
    const subscription = setupAuthStateListener(
      { setUser, setSession, setLoading },
      user?.id
    );

    // THEN check for existing session
    initializeAuthState({ setUser, setSession, setLoading })
      .then(result => {
        if (result.success) {
          console.log('Auth state initialized successfully', result.data);
          if (result.data?.user) {
            toast({
              title: "Welcome back!",
              description: `Signed in as ${result.data.user.email}`,
            });
          }
        } else {
          console.warn('Auth state initialization issues:', result.message);
          if (result.message?.includes('network')) {
            toast({
              title: "Connection issue",
              description: "Can't connect to authentication service. Check your internet connection.",
              variant: "destructive",
            });
          }
        }
      })
      .catch(error => {
        console.error('Failed to initialize auth state:', error);
      });

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
