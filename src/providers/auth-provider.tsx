
import React, { ReactNode } from 'react';
import { AuthContext } from '@/contexts/auth-context';
import { useSimpleAuthState } from '@/hooks/auth/use-simple-auth-state';
import { SimpleAuthService } from '@/services/auth/simple-auth-service';
import { SimpleUserService } from '@/services/auth/simple-user-service';
import { toast } from 'sonner';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { user, session, loading, initialized } = useSimpleAuthState();

  // Auth methods with toast notifications handled here
  const signIn = async (email: string, password: string) => {
    const result = await SimpleAuthService.signIn(email, password);
    
    if (result.success) {
      toast.success("Welcome back! You have successfully signed in.");
    } else {
      toast.error(`Sign in failed: ${result.message}`);
    }
    
    return result;
  };

  const signUp = async (email: string, password: string, metadata: object = {}) => {
    const result = await SimpleAuthService.signUp(email, password, metadata);
    
    if (result.success) {
      toast.success("Account created! Welcome to GreenTrails! You can now sign in.");
    } else {
      toast.error(`Sign up failed: ${result.message}`);
    }
    
    return result;
  };

  const signOut = async () => {
    const result = await SimpleAuthService.signOut();
    
    if (result.success) {
      toast.success("You have been successfully signed out.");
    } else {
      toast.error(`Sign out failed: ${result.message}`);
    }
    
    return result;
  };

  const resetPassword = async (email: string) => {
    const result = await SimpleAuthService.resetPassword(email);
    
    if (result.success) {
      toast.success(result.message || "Password reset email sent");
    } else {
      toast.error(`Password reset failed: ${result.message}`);
    }
    
    return result;
  };

  const updatePassword = async (password: string) => {
    const result = await SimpleAuthService.updatePassword(password);
    
    if (result.success) {
      toast.success(result.message || "Password updated successfully");
    } else {
      toast.error(`Password update failed: ${result.message}`);
    }
    
    return result;
  };

  const verifyAge = async (birthYear: string) => {
    const result = await SimpleUserService.verifyAge(user, birthYear);
    
    if (result.success) {
      toast.success("Age verification successful");
    } else {
      toast.error(result.message || "Age verification failed");
    }
    
    return result;
  };

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
    isInitialized: initialized
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
