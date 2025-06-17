
import { supabase } from '@/integrations/supabase/client';
import { DatabaseSetupService } from '../database/setup-service';

export class PasswordService {
  static async resetPassword(email: string): Promise<{ success: boolean; message?: string }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        await this.logPasswordEvent('password_reset_failed', error.message);
        return { success: false, message: error.message };
      }

      await this.logPasswordEvent('password_reset_requested');
      return { success: true, message: 'Password reset email sent' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await this.logPasswordEvent('password_reset_error', errorMessage);
      return { success: false, message: errorMessage };
    }
  }

  static async updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        await this.logPasswordEvent('password_update_failed', error.message);
        return { success: false, error: error.message };
      }

      await this.logPasswordEvent('password_updated');
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await this.logPasswordEvent('password_update_error', errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  private static async logPasswordEvent(eventType: string, errorDetails?: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await DatabaseSetupService.logSecurityEvent(
        eventType,
        user?.id,
        errorDetails ? { error: errorDetails, timestamp: new Date().toISOString() } : { timestamp: new Date().toISOString() }
      );
    } catch (error) {
      console.error('Error logging password event:', error);
    }
  }
}
