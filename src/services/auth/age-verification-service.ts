
import { supabase } from '@/integrations/supabase/client';

/**
 * Service for handling age verification (21+ requirement for GreenTrails)
 */
export const AgeVerificationService = {
  /**
   * Verify if user is 21 or older
   * @param birthdate The user's birth date
   * @param userId The user's ID
   * @returns Promise with boolean indicating if user is 21+
   */
  verifyAge: async (birthdate: Date, userId: string): Promise<boolean> => {
    try {
      // Calculate age
      const today = new Date();
      const age = today.getFullYear() - birthdate.getFullYear();
      const monthDiff = today.getMonth() - birthdate.getMonth();
      
      // Adjust age if birthday hasn't occurred this year
      const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate()) 
        ? age - 1 
        : age;
      
      const isVerified = actualAge >= 21;
      
      if (isVerified) {
        // Update user profile to mark as age verified
        const { error } = await supabase
          .from('profiles')
          .update({ is_age_verified: true })
          .eq('id', userId);
          
        if (error) {
          console.error('Error updating age verification:', error);
          return false;
        }
      }
      
      return isVerified;
    } catch (error) {
      console.error('Error during age verification:', error);
      return false;
    }
  },

  /**
   * Check if user is already age verified
   * @param userId The user's ID
   * @returns Promise with boolean indicating verification status
   */
  verifyUserAge: async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_age_verified')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error checking age verification:', error);
        return false;
      }
      
      return data?.is_age_verified || false;
    } catch (error) {
      console.error('Error during age verification check:', error);
      return false;
    }
  }
};
