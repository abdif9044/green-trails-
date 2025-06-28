
import * as React from 'react';
import { AuthContext, AuthContextType } from '@/contexts/auth-context';
import { useSimpleAuthState } from '@/hooks/auth/use-simple-auth-state';
import { useAuthMethods } from '@/hooks/auth/use-auth-methods';
import { SimpleUserService } from '@/services/auth/simple-user-service';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, session, loading, initialized } = useSimpleAuthState();
  const { signIn, signUp, signOut, resetPassword, updatePassword } = useAuthMethods(user);

  const verifyAge = async (birthYear: string) => {
    return await SimpleUserService.verifyAge(user, birthYear);
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    isInitialized: initialized,
    signIn,
    signUp,
    signOut,
    verifyAge,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
