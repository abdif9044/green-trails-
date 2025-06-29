
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { AuthResult } from './types';

export const SimpleUserService = {
  /**
   * Get user profile from profiles table
   */
  async getProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Profile fetch error:', error);
      return null;
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        return { success: false, message: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, message: 'Failed to update profile' };
    }
  },

  /**
   * Verify user age
   */
  async verifyAge(user: User | null, birthYear: string): Promise<AuthResult & { age?: number }> {
    if (!user) {
      return { success: false, message: 'User not authenticated' };
    }

    try {
      const year = parseInt(birthYear);
      const currentYear = new Date().getFullYear();
      const age = currentYear - year;

      if (age < 21) {
        return { success: false, message: 'You must be at least 21 years old' };
      }

      // Update profile with verified age
      const { error } = await supabase
        .from('profiles')
        .update({
          year_of_birth: year,
          is_age_verified: true
        })
        .eq('id', user.id);

      if (error) {
        console.error('Age verification update error:', error);
        return { success: false, message: 'Failed to verify age' };
      }

      return { success: true, age, message: 'Age verified successfully' };
    } catch (error) {
      console.error('Age verification error:', error);
      return { success: false, message: 'Invalid birth year' };
    }
  }
};
