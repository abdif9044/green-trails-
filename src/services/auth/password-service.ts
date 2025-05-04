
import { supabase } from '@/integrations/supabase/client';
import { DatabaseSetupService } from '@/services/database/setup-service';

export const PasswordService = {
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
