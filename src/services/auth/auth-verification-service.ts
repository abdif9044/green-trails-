
import { supabase } from '@/integrations/supabase/client';
import { calculateAge } from '@/utils/form-validators';

/**
 * Service handling age verification processes
 */
export const AgeVerificationService = {
  /**
   * Verify a user's age based on birthdate
   * @param birthdate Date object representing user's date of birth
   * @param userId Current user's ID
   * @returns Promise<boolean> True if verification was successful
   */
  verifyAge: async (birthdate: Date, userId: string | undefined): Promise<boolean> => {
    try {
      if (!userId) {
        console.error('Cannot verify age: No user ID provided');
        return false;
      }
      
      // Calculate user's age
      const age = calculateAge(birthdate);
      
      // Check if user is at least 21
      if (age < 21) {
        console.warn(`Age verification failed: User is ${age} years old (minimum 21 required)`);
        return false;
      }
      
      // Update user profile with age verification status
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_age_verified: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (error) {
        console.error('Error updating age verification status:', error);
        return false;
      }
      
      console.log('Age verification successful for user:', userId);
      return true;
    } catch (error) {
      console.error('Error in age verification process:', error);
      return false;
    }
  },

  /**
   * Check if a user is already age verified
   * @param userId The current user's ID
   * @returns Promise<boolean> True if user is age verified
   */
  verifyUserAge: async (userId: string): Promise<boolean> => {
    try {
      if (!userId) {
        console.warn('Cannot check age verification status: No user ID provided');
        return false;
      }

      // Query user profile to check verification status
      const { data, error } = await supabase
        .from('profiles')
        .select('is_age_verified')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error checking age verification status:', error);
        return false;
      }
      
      return !!data?.is_age_verified;
    } catch (error) {
      console.error('Error in verifyUserAge:', error);
      return false;
    }
  }
};

// Export the function directly for components that need it
export const verifyUserAge = AgeVerificationService.verifyUserAge;
