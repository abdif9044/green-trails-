
import { supabase } from '@/integrations/supabase/client';
import { DatabaseSetupService } from '@/services/database/setup-service';

/**
 * Service for handling sign-up operations
 */
export const SignUpService = {
  /**
   * Register a new user
   * @param email The user's email
   * @param password The user's password
   * @param metadata Additional user metadata
   * @returns Promise with result object containing success status and optional message
   */
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

      // Make sure we have user data before proceeding
      if (!data.user) {
        console.error('No user data returned from signUp');
        return { success: false, message: 'Account creation failed - no user data returned' };
      }

      console.log('Signup successful, user data:', data.user.id);

      // Log successful registration
      await DatabaseSetupService.logSecurityEvent('user_registration', { 
        user_id: data.user.id,
        timestamp: new Date().toISOString() 
      }).catch(e => console.error('Failed to log security event:', e));

      // If email confirmation is enabled in Supabase, let the user know
      if (data.session === null) {
        return { 
          success: true, 
          message: "Account created successfully. Please check your email for confirmation." 
        };
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
