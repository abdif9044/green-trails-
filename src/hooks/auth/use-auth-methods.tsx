
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAuthMethods = (user: User | null) => {
  const signIn = async (email: string, password: string) => {
    console.log(`Attempting sign in for user: ${email}`);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in failed:', error.message);
        return { success: false, message: error.message };
      }
      
      console.log('Sign in successful for:', email);
      localStorage.setItem('greentrails.user_email', email);
      
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Exception during sign in:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return { success: false, message: errorMessage };
    }
  };

  const signUp = async (email: string, password: string, metadata: object = {}) => {
    console.log(`Attempting sign up for new user: ${email}`);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...metadata,
            signup_timestamp: new Date().toISOString(),
          },
          emailRedirectTo: window.location.origin + '/auth',
        }
      });
      
      if (error) {
        console.error('Sign up failed:', error.message);
        return { success: false, message: error.message };
      }
      
      if (!data.session) {
        console.log('Account created, email confirmation required');
      } else {
        localStorage.setItem('greentrails.user_email', email);
        console.log('Account created successfully with auto-login');
      }
      
      return { 
        success: true, 
        user: data.user
      };
    } catch (error) {
      console.error('Exception during sign up:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return { success: false, message: errorMessage };
    }
  };

  const signOut = async () => {
    console.log('Attempting to sign out user:', user?.email);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out failed:', error.message);
        return { success: false, message: error.message };
      }
      
      localStorage.removeItem('greentrails.user_email');
      return { success: true };
    } catch (error) {
      console.error('Exception during sign out:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return { success: false, message: errorMessage };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/auth/update-password',
      });

      if (error) {
        console.error('Password reset failed:', error.message);
        return { success: false, message: error.message };
      }

      console.log('Password reset email sent to:', email);
      return { success: true, message: 'Password reset email sent successfully' };
    } catch (error) {
      console.error('Exception during password reset:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return { success: false, message: errorMessage };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        console.error('Password update failed:', error.message);
        return { success: false, message: error.message };
      }

      console.log('Password updated successfully');
      return { success: true, message: 'Password updated successfully' };
    } catch (error) {
      console.error('Exception during password update:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return { success: false, message: errorMessage };
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
  };
};
