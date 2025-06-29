
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

      // Step 2: Update profile with additional data
      // Note: The trigger should have created the profile row, we just need to update it
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: data.full_name,
          username: data.username,
          year_of_birth: data.year_of_birth,
          is_age_verified: data.year_of_birth && (new Date().getFullYear() - data.year_of_birth) >= 21
        })
        .eq('id', authData.user.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
        // Don't fail the whole signup for profile update errors
        console.warn('Profile update failed but continuing with signup');
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
