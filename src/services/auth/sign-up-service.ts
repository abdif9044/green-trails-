
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
          await DatabaseSetupService.logSecurityEvent('user_registration', { 
            user_id: data.user.id,
            timestamp: new Date().toISOString() 
          });
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
   * Creates a demo test account with predefined credentials
   * @returns Promise with result object containing success status and credentials
   */
  createDemoAccount: async () => {
    try {
      console.log('Creating demo test account...');
      
      // Generate a unique demo email to avoid conflicts
      const timestamp = new Date().getTime();
      const demoEmail = `demo_user_${timestamp}@greentrails.test`;
      const demoPassword = 'test1234';
      
      // Create a birthdate that makes the user over 21 (requirement for GreenTrails)
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 25); // 25 years old
      
      const result = await SignUpService.signUp(demoEmail, demoPassword, {
        birthdate: birthDate.toISOString(),
        is_demo_account: true,
        full_name: 'Demo User',
        favorite_trails: [],
        last_login: new Date().toISOString()
      });
      
      if (result.success) {
        console.log('Demo account created successfully');
        return { 
          success: true, 
          message: 'Demo account created successfully',
          credentials: {
            email: demoEmail,
            password: demoPassword
          }
        };
      } else {
        console.error('Failed to create demo account:', result.message);
        return { 
          success: false, 
          message: `Failed to create demo account: ${result.message}`
        };
      }
    } catch (error) {
      console.error('Exception during demo account creation:', error);
      if (error instanceof Error) {
        return { success: false, message: error.message };
      }
      return { success: false, message: 'An unknown error occurred while creating the demo account' };
    }
  }
};
