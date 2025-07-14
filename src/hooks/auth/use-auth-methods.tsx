
import { User } from '@supabase/supabase-js';
import { SimpleAuthService } from '@/services/auth/simple-auth-service';
import { SimpleUserService } from '@/services/auth/simple-user-service';

export const useAuthMethods = (user: User | null) => {
  const signIn = async (email: string, password: string) => {
    return await SimpleAuthService.signIn(email, password);
  };

  const signUp = async (email: string, password: string, metadata: object = {}) => {
    return await SimpleAuthService.signUp(email, password, metadata);
  };

  const signOut = async () => {
    return await SimpleAuthService.signOut();
  };

  const resetPassword = async (email: string) => {
    return await SimpleAuthService.resetPassword(email);
  };

  const updatePassword = async (password: string) => {
    return await SimpleAuthService.updatePassword(password);
  };

  return {
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
  };
};
