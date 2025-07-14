
import { supabase } from '@/integrations/supabase/client';

export interface AuthResult {
  success: boolean;
  message?: string;
  user?: any;
}

export class SimpleAuthService {
  static async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, message: 'An unexpected error occurred' };
    }
  }

  static async signUp(email: string, password: string, metadata: object = {}): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        return { success: false, message: error.message };
      }

      return { 
        success: true, 
        user: data.user,
        message: data.session ? 'Account created successfully' : 'Please check your email for confirmation'
      };
    } catch (error) {
      return { success: false, message: 'An unexpected error occurred' };
    }
  }

  static async signOut(): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, message: 'An unexpected error occurred' };
    }
  }

  static async resetPassword(email: string): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, message: 'Password reset email sent' };
    } catch (error) {
      return { success: false, message: 'An unexpected error occurred' };
    }
  }

  static async updatePassword(password: string): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, message: 'Password updated successfully' };
    } catch (error) {
      return { success: false, message: 'An unexpected error occurred' };
    }
  }
}
