
import { supabase } from '@/integrations/supabase/client';
import { DatabaseSetupService } from '@/services/database/setup-service';

export const SignUpService = {
  signUp: async (email: string, password: string, metadata: object = {}) => {
    try {
      console.log('Starting signup process for:', email);
      
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
        console.error('Supabase signUp error:', error);
        return { success: false, message: error.message };
      }

      console.log('Signup successful, user data:', data.user?.id);

      // Log successful registration
      if (data.user) {
        await DatabaseSetupService.logSecurityEvent('user_registration', { 
          user_id: data.user.id,
          timestamp: new Date().toISOString() 
        });
      }

      return { 
        success: true, 
        message: "Account created successfully. You can now sign in." 
      };
    } catch (error) {
      console.error('Exception during sign up:', error);
      
      if (error instanceof Error) {
        return { success: false, message: error.message };
      }
      return { success: false, message: 'An unknown error occurred' };
    }
  }
};
