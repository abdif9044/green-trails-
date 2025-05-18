
import { supabase } from '@/integrations/supabase/client';
import { DatabaseSetupService } from '@/services/database/setup-service';
import { AuthResult } from './types';

/**
 * Service for handling demo account creation and management
 */
export interface DemoAccountCredentials {
  email: string;
  password: string;
}

export const DemoAccountService = {
  /**
   * Creates a demo test account with predefined credentials
   * @returns Promise with result object containing success status and credentials
   */
  createDemoAccount: async (): Promise<AuthResult & { credentials?: DemoAccountCredentials }> => {
    try {
      console.log('Creating demo test account...');
      
      // Generate a unique demo email that's compatible with Supabase auth requirements
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      // Use a valid email domain that will pass validation
      const demoEmail = `demo_${randomString}_${timestamp}@example.com`;
      
      // Stronger password for demo accounts with better randomization
      const demoPassword = `Demo${randomString}${Math.floor(Math.random() * 1000)}!`;
      
      // Create a birthdate that makes the user over 21 (requirement for GreenTrails)
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 25); // 25 years old
      
      console.log(`Attempting Supabase signup for demo account: ${demoEmail}`);
      
      const { data, error } = await supabase.auth.signUp({
        email: demoEmail,
        password: demoPassword,
        options: {
          data: {
            birthdate: birthDate.toISOString(),
            is_demo_account: true,
            full_name: 'Demo Explorer',
            username: `TrailDemo_${randomString.substring(0, 4)}`,
            role: 'demo',
            age_verified: true,
            favorite_trails: [],
            last_login: new Date().toISOString()
          },
          // Remove emailRedirectTo to avoid email verification issues with demo accounts
        }
      });
      
      if (error) {
        console.error('Demo account creation failed:', error);
        return { 
          success: false, 
          message: `Failed to create demo account: ${error.message}`
        };
      }
      
      if (!data.user) {
        console.error('No user data returned from demo account creation');
        return {
          success: false,
          message: 'Demo account creation failed - no user data returned'
        };
      }
      
      console.log('Demo account created successfully with ID:', data.user.id);
      
      // Log success
      try {
        await DatabaseSetupService.logSecurityEvent('demo_account_created', {
          user_id: data.user.id,
          email: demoEmail,
          timestamp: new Date().toISOString()
        });
      } catch (logError) {
        // Non-critical error, just log warning
        console.warn('Failed to log demo account creation (non-critical):', logError);
      }

      // Immediately sign in with the demo account
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword
      });

      if (signInError) {
        console.error('Failed to sign in with demo account:', signInError);
        // We still return success since the account was created
        return { 
          success: true, 
          message: 'Demo account created, but auto-login failed. Please sign in manually.',
          credentials: {
            email: demoEmail,
            password: demoPassword
          }
        };
      }
      
      // Add some sample activities for the demo account
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            username: `TrailDemo_${randomString.substring(0, 4)}`,
            full_name: 'Demo Explorer',
            bio: 'This is a demo account to try out GreenTrails features!',
            is_demo_account: true,
            age_verified: true
          });
          
        if (profileError) {
          console.warn('Could not create demo profile:', profileError);
        }
      } catch (err) {
        console.warn('Error creating demo profile data:', err);
      }
      
      return { 
        success: true, 
        message: 'Demo account created and signed in successfully',
        credentials: {
          email: demoEmail,
          password: demoPassword
        }
      };
    } catch (error) {
      console.error('Exception during demo account creation:', error);
      if (error instanceof Error) {
        return { success: false, message: error.message };
      }
      return { success: false, message: 'An unknown error occurred while creating the demo account' };
    }
  }
};
