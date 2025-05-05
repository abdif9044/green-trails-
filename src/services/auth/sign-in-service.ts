
import { supabase } from '@/integrations/supabase/client';
import { DatabaseSetupService } from '@/services/database/setup-service';

/**
 * Service for handling sign-in operations
 */
export const SignInService = {
  /**
   * Sign in a user with email and password
   * @param email The user's email
   * @param password The user's password
   * @returns Promise with result object containing success status and optional error message
   */
  signIn: async (email: string, password: string) => {
    try {
      if (!email || !password) {
        return { success: false, message: "Email and password are required" };
      }
      
      console.log('Attempting signin with Supabase for:', email);
      
      let startTime = performance.now();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      let duration = performance.now() - startTime;
      
      console.log(`Auth request took ${duration.toFixed(0)}ms`);

      if (error) {
        console.error('Error signing in:', error);
        
        // Log failed sign in attempts for security monitoring
        try {
          await DatabaseSetupService.logSecurityEvent('failed_login_attempt', { 
            email, 
            error: error.message, 
            timestamp: new Date().toISOString(),
            duration: duration 
          });
        } catch (logError) {
          console.warn('Failed to log security event for failed login (non-critical):', logError);
        }
        
        // Check for specific error cases for better user feedback
        if (error.message.includes('Invalid login')) {
          return { success: false, message: "Invalid email or password" };
        } else if (error.message.includes('Email not confirmed')) {
          return { success: false, message: "Please confirm your email before signing in" };
        } else if (error.message.includes('rate limit')) {
          return { success: false, message: "Too many login attempts. Please try again later." };
        }
        
        return { success: false, message: error.message };
      }
      
      if (!data.user) {
        console.error('No user data returned from signIn');
        return { success: false, message: 'Authentication failed - no user data returned' };
      }
      
      console.log('Signin successful for:', email);
      
      try {
        // Log successful sign in
        await DatabaseSetupService.logSecurityEvent('successful_login', { 
          user_id: data.user?.id,
          timestamp: new Date().toISOString(),
          duration: duration 
        });
      } catch (logError) {
        console.warn('Failed to log security event for successful login (non-critical):', logError);
      }

      return { 
        success: true,
        user_id: data.user.id
      };
    } catch (error) {
      console.error('Exception during sign in:', error);
      
      if (error instanceof Error) {
        return { success: false, message: error.message };
      }
      return { success: false, message: 'An unknown error occurred' };
    }
  }
};
