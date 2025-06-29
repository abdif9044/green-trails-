
import { supabase } from '@/integrations/supabase/client';
import { AuthResult } from './types';

export interface SignUpData {
  email: string;
  password: string;
  full_name: string;
  username: string;
  year_of_birth: number;
}

export const EnhancedSignUpService = {
  signUp: async (data: SignUpData): Promise<AuthResult & { user_id?: string }> => {
    try {
      console.log('Enhanced signup process starting for:', data.email);

      // Step 1: Create auth user with metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
            username: data.username,
            year_of_birth: data.year_of_birth,
            signup_source: 'enhanced_flow'
          }
        }
      });

      if (authError) {
        console.error('Auth signup error:', authError);
        return { success: false, message: authError.message };
      }

      if (!authData.user) {
        return { success: false, message: 'Failed to create user account' };
      }

      console.log('Auth user created:', authData.user.id);

      // Step 2: Wait for profile to be created by trigger, then update it
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second for trigger

      // Retry profile update with backoff
      let retryCount = 0;
      const maxRetries = 3;
      let profileUpdateSuccess = false;

      while (retryCount < maxRetries && !profileUpdateSuccess) {
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: authData.user.id,
              full_name: data.full_name,
              username: data.username,
              year_of_birth: data.year_of_birth,
              is_age_verified: data.year_of_birth && (new Date().getFullYear() - data.year_of_birth) >= 21
            }, {
              onConflict: 'id'
            });

          if (profileError) {
            console.error(`Profile update attempt ${retryCount + 1} failed:`, profileError);
            retryCount++;
            if (retryCount < maxRetries) {
              await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)); // Exponential backoff
            }
          } else {
            profileUpdateSuccess = true;
            console.log('Profile updated successfully');
          }
        } catch (error) {
          console.error(`Profile update attempt ${retryCount + 1} error:`, error);
          retryCount++;
          if (retryCount < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          }
        }
      }

      if (!profileUpdateSuccess) {
        console.warn('Profile update failed after all retries, but continuing with signup');
      }

      // Check if email confirmation is required
      if (!authData.session) {
        return {
          success: true,
          user_id: authData.user.id,
          message: "Account created successfully. Please check your email for confirmation."
        };
      }

      return {
        success: true,
        user_id: authData.user.id,
        message: "Account created successfully. Welcome to GreenTrails!"
      };

    } catch (error) {
      console.error('Enhanced signup error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      };
    }
  }
};
