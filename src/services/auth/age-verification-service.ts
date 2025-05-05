
import { supabase } from '@/integrations/supabase/client';
import { DatabaseSetupService } from '@/services/database/setup-service';

/**
 * Service for handling age verification functionality
 */
export const AgeVerificationService = {
  /**
   * Verify a user's age based on their birthdate
   * @param birthdate Date object representing the user's birthdate
   * @param userId The user's ID
   * @returns Promise resolving to boolean indicating if user is verified (21+)
   */
  verifyAge: async (birthdate: Date, userId: string | undefined): Promise<boolean> => {
    try {
      if (!userId) return false;
      
      const now = new Date();
      const age = now.getFullYear() - birthdate.getFullYear();
      
      // Adjust age if birthday hasn't occurred yet this year
      if (
        now.getMonth() < birthdate.getMonth() || 
        (now.getMonth() === birthdate.getMonth() && now.getDate() < birthdate.getDate())
      ) {
        const adjustedAge = age - 1;
        
        // Users must be 21+ for GreenTrails
        if (adjustedAge < 21) {
          return false;
        }
      }
      
      // User is at least 21, update their profile
      const { error } = await supabase
        .from('profiles')
        .update({ is_age_verified: true })
        .eq('id', userId);
        
      if (error) {
        console.error('Error updating age verification status:', error);
        return false;
      }
      
      // Log successful age verification
      await DatabaseSetupService.logSecurityEvent('age_verification', {
        user_id: userId,
        verified: true,
        timestamp: new Date().toISOString()
      });
      
      return true;
    } catch (error) {
      console.error('Error verifying age:', error);
      return false;
    }
  },

  /**
   * Check if a user is already age verified
   * @param userId The user's ID
   * @returns Promise resolving to boolean indicating if user is already verified
   */
  verifyUserAge: async (userId: string): Promise<boolean> => {
    try {
      if (!userId) return false;

      // Check if user is already verified in their profile
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

// Export the verifyUserAge function directly for components that need it
export const verifyUserAge = AgeVerificationService.verifyUserAge;
