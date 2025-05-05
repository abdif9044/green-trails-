
import React, { useEffect, ReactNode } from 'react';
import { AuthContext } from '@/contexts/auth-context';
import { useAuthState } from '@/hooks/auth/use-auth-state';
import { useAuthMethods } from '@/hooks/auth/use-auth-methods';
import { useUserManagement } from '@/hooks/auth/use-user-management';
import { initializeAuthState, setupAuthStateListener } from '@/utils/auth-utils';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { user, session, loading, setUser, setSession, setLoading } = useAuthState();
  const { signIn, signUp, signOut } = useAuthMethods(user);
  const { verifyAge, resetPassword, updatePassword } = useUserManagement(user);

  useEffect(() => {
    // Set up auth state listener FIRST
    const subscription = setupAuthStateListener(
      { setUser, setSession, setLoading },
      user?.id
    );

    // THEN check for existing session
    initializeAuthState({ setUser, setSession, setLoading });

    return () => {
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
