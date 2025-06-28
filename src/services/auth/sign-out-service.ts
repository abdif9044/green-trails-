
import { supabase } from '@/integrations/supabase/client';
import { DatabaseSetupService } from '@/services/database/setup-service';

/**
 * Service for handling sign-out operations
 */
export const SignOutService = {
  /**
   * Sign out the current user
   * @param userId Optional user ID for logging purposes
   * @returns Promise with result object containing success status and optional error message
   */
  signOut: async (userId?: string) => {
    try {
      // Log the sign out for security audit
      if (userId) {
        await DatabaseSetupService.logSecurityEvent('user_signout', { 
          user_id: userId,
          timestamp: new Date().toISOString() 
        });
      }
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        return { success: false, message: error.message };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Exception during sign out:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
};
