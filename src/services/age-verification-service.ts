
import { supabase } from '@/integrations/supabase/client';
import { DatabaseSetupService } from '@/services/database/setup-service';

export const AgeVerificationService = {
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
  }
};
