
import { supabase } from '@/integrations/supabase/client';
import { DatabaseSetupService } from '@/services/database/setup-service';

export const AuthService = {
  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Error signing in:', error);
        
        // Log failed sign in attempts for security monitoring
        await DatabaseSetupService.logSecurityEvent('failed_login_attempt', { 
          email, 
          error: error.message, 
          timestamp: new Date().toISOString() 
        });
        
        return { success: false, message: error.message };
      }
      
      // Log successful sign in
      await DatabaseSetupService.logSecurityEvent('successful_login', { 
        user_id: data.user?.id,
        timestamp: new Date().toISOString() 
      });

      return { success: true };
    } catch (error) {
      console.error('Exception during sign in:', error);
      
      if (error instanceof Error) {
        return { success: false, message: error.message };
      }
      return { success: false, message: 'An unknown error occurred' };
    }
  },

  signUp: async (email: string, password: string, metadata: object = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...metadata,
            signup_timestamp: new Date().toISOString()
          },
        }
      });

      if (error) {
        console.error('Error signing up:', error);
        return { success: false, message: error.message };
      }

      // Log successful registration
      await DatabaseSetupService.logSecurityEvent('user_registration', { 
        user_id: data.user?.id,
        timestamp: new Date().toISOString() 
      });

      return { success: true };
    } catch (error) {
      console.error('Exception during sign up:', error);
      
      if (error instanceof Error) {
        return { success: false, message: error.message };
      }
      return { success: false, message: 'An unknown error occurred' };
    }
  },

  signOut: async (userId?: string) => {
    try {
      // Log the sign out for security audit
      if (userId) {
        await DatabaseSetupService.logSecurityEvent('user_signout', { 
          user_id: userId,
          timestamp: new Date().toISOString() 
        });
      }
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        return { success: false, message: error.message };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Exception during sign out:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  resetPassword: async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) {
        console.error('Error resetting password:', error);
        return { success: false, message: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Exception during password reset:', error);
      
      if (error instanceof Error) {
        return { success: false, message: error.message };
      }
      return { success: false, message: 'An unknown error occurred' };
    }
  },

  updatePassword: async (password: string, userId?: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        console.error('Error updating password:', error);
        return { success: false, message: error.message };
      }

      // Log password update for security audit
      if (userId) {
        await DatabaseSetupService.logSecurityEvent('password_updated', { 
          user_id: userId,
          timestamp: new Date().toISOString() 
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Exception during password update:', error);
      
      if (error instanceof Error) {
        return { success: false, message: error.message };
      }
      return { success: false, message: 'An unknown error occurred' };
    }
  }
};
