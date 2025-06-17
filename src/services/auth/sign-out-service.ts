
import { supabase } from '@/integrations/supabase/client';
import { DatabaseSetupService } from '../database/setup-service';

export class SignOutService {
  static async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { success: false, error: error.message };
      }

      if (user) {
        await this.logSignOutEvent(user.id);
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  }

  private static async logSignOutEvent(userId: string) {
    try {
      await DatabaseSetupService.logSecurityEvent('sign_out', userId, { timestamp: new Date().toISOString() });
    } catch (error) {
      console.error('Error logging sign out event:', error);
    }
  }
}
