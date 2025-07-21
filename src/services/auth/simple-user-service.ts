
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface AuthResult {
  success: boolean;
  message?: string;
  age?: number;
}

export class SimpleUserService {
  static async verifyAge(user: User | null, birthYear: string): Promise<AuthResult & { age?: number }> {
    try {
      if (!user) {
        return { success: false, message: 'User not authenticated' };
      }

      const year = parseInt(birthYear);
      if (isNaN(year)) {
        return { success: false, message: 'Invalid birth year' };
      }

      const currentYear = new Date().getFullYear();
      const age = currentYear - year;

      if (age < 18) {
        return { 
          success: false, 
          message: 'You must be 18 or older to use GreenTrails',
          age 
        };
      }

      // Update user profile with age verification
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            year_of_birth: year,
            is_age_verified: true,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (error) {
          console.warn('Failed to update profile with age verification:', error);
        }
      } catch (profileError) {
        console.warn('Profile update error (non-critical):', profileError);
      }

      return { 
        success: true, 
        message: 'Age verification successful',
        age 
      };
    } catch (error) {
      return { 
        success: false, 
        message: 'An unexpected error occurred during age verification' 
      };
    }
  }
}
