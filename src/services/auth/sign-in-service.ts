
import { supabase } from '@/integrations/supabase/client';
import { DatabaseSetupService } from '../database/setup-service';

export class SignInService {
  static async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    const startTime = Date.now();
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      const duration = Date.now() - startTime;

      if (error) {
        await this.logSignInEvent('sign_in_failed', { email, error: error.message, duration });
        return { success: false, error: error.message };
      }

      if (data.user) {
        await this.logSignInEvent('sign_in_success', { user_id: data.user.id, duration });
        return { success: true };
      }

      return { success: false, error: 'Sign in failed' };
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await this.logSignInEvent('sign_in_error', { email, error: errorMessage, duration });
      return { success: false, error: errorMessage };
    }
  }

  private static async logSignInEvent(eventType: string, metadata: any) {
    try {
      await DatabaseSetupService.logSecurityEvent(eventType, metadata.user_id, metadata);
    } catch (error) {
      console.error('Error logging sign in event:', error);
    }
  }
}
