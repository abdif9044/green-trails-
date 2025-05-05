
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
      if (!userId) {
        console.error('Cannot verify age: No user ID provided');
        return false;
      }
      
      if (!(birthdate instanceof Date) || isNaN(birthdate.getTime())) {
        console.error('Cannot verify age: Invalid birthdate provided');
        return false;
      }
      
      const now = new Date();
      let age = now.getFullYear() - birthdate.getFullYear();
      
      // Adjust age if birthday hasn't occurred yet this year
      if (
        now.getMonth() < birthdate.getMonth() || 
        (now.getMonth() === birthdate.getMonth() && now.getDate() < birthdate.getDate())
      ) {
        age = age - 1;
      }
      
      console.log(`User age calculated: ${age} years`);
      
      // Users must be 21+ for GreenTrails
      if (age < 21) {
        console.warn(`Age verification failed: User is ${age} years old (minimum 21 required)`);
        
        try {
          // Log failed verification attempt
          await DatabaseSetupService.logSecurityEvent('age_verification_failed', {
            user_id: userId,
            age: age,
            timestamp: new Date().toISOString()
          });
        } catch (logError) {
          console.warn('Failed to log age verification failure (non-critical):', logError);
        }
        
        return false;
      }
      
      // User is at least 21, update their profile
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_age_verified: true,
          age_verified_at: new Date().toISOString() 
        })
        .eq('id', userId);
        
      if (error) {
        console.error('Error updating age verification status:', error);
        return false;
      }
      
      console.log('Age verification successful for user:', userId);
      
      try {
        // Log successful age verification
        await DatabaseSetupService.logSecurityEvent('age_verification', {
          user_id: userId,
          verified: true,
          age: age,
          timestamp: new Date().toISOString()
        });
      } catch (logError) {
        console.warn('Failed to log age verification success (non-critical):', logError);
      }
      
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
      if (!userId) {
        console.warn('Cannot check age verification status: No user ID provided');
        return false;
      }

      // Check if user is already verified in their profile
      const { data, error } = await supabase
        .from('profiles')
        .select('is_age_verified, age_verified_at')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error checking age verification status:', error);
        return false;
      }
      
      if (data?.is_age_verified) {
        console.log('User is already age verified:', userId);
      } else {
        console.log('User is not age verified yet:', userId);
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
