
import { supabase } from '@/integrations/supabase/client';
import { DatabaseSetupService } from '@/services/database/setup-service';

export const SignInService = {
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
  }
};
