
import { supabase } from '@/integrations/supabase/client';
import { DatabaseSetupService } from '@/services/database/setup-service';
import { AuthResult } from './types';
import { DemoAccountService } from './demo-account-service';

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
  signUp: async (email: string, password: string, metadata: object = {}): Promise<AuthResult & { user_id?: string }> => {
    try {
      console.log('Starting signup process for:', email);

      // Validate inputs before attempting signup
      if (!email || !password) {
        return { success: false, message: "Email and password are required" };
      }
      
      if (password.length < 6) {
        return { success: false, message: "Password must be at least 6 characters long" };
      }
      
      // Check if metadata contains birthdate for age verification
      if (!metadata.hasOwnProperty('birthdate')) {
        console.warn('Signup attempt without birthdate. Age verification is required.');
        return { success: false, message: "Date of birth is required for age verification" };
      }
      
      // Clean up email - trim whitespace
      const cleanEmail = email.trim();
      
      console.log('Inputs validated, attempting signup with Supabase...');
      
      try {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
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
  
        console.log('Signup successful, user ID:', data.user.id);
        
        try {
          // Log successful registration
          await SignUpService.logRegistration(data.user.id);
        } catch (logError) {
          // Non-critical error, just log it
          console.warn('Failed to log security event for registration (non-critical):', logError);
        }
  
        // If email confirmation is enabled in Supabase, let the user know
        if (data.session === null) {
          console.log('Email confirmation required for:', email);
          return { 
            success: true, 
            message: "Account created successfully. Please check your email for confirmation." 
          };
        }
  
        return { 
          success: true,
          user_id: data.user.id, 
          message: "Account created successfully. You can now sign in." 
        };
      } catch (supabaseError) {
        console.error('Supabase API error:', supabaseError);
        if (supabaseError instanceof Error) {
          return { success: false, message: supabaseError.message };
        }
        return { success: false, message: 'Error communicating with authentication service.' };
      }
    } catch (error) {
      console.error('Exception during sign up:', error);
      
      if (error instanceof Error) {
        return { success: false, message: error.message };
      }
      return { success: false, message: 'An unknown error occurred' };
    }
  },

  /**
   * Log a registration security event
   * @param userId The ID of the user who registered
   */
  logRegistration: async (userId: string): Promise<void> => {
    await DatabaseSetupService.logSecurityEvent('user_registration', { 
      user_id: userId,
      timestamp: new Date().toISOString() 
    });
  },

  // Re-export the demo account creation function
  createDemoAccount: DemoAccountService.createDemoAccount
};
