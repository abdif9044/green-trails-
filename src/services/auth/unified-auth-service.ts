
import { supabase } from '@/integrations/supabase/client';
import { AuthError } from '@supabase/supabase-js';

export interface AuthResult {
  success: boolean;
  message?: string;
  user?: any;
  error?: AuthError | null;
}

export interface SignUpData {
  email: string;
  password: string;
  full_name: string;
  username: string;
  year_of_birth?: number;
}

export interface SocialAuthOptions {
  provider: 'google' | 'apple';
  redirectTo?: string;
}

export class UnifiedAuthService {
  static async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return {
          success: false,
          error,
          message: error.message
        };
      }

      return {
        success: true,
        user: data.user,
        message: 'Sign in successful'
      };
    } catch (error) {
      return {
        success: false,
        error: error as AuthError,
        message: 'An unexpected error occurred'
      };
    }
  }

  static async signUp(signUpData: SignUpData): Promise<AuthResult> {
    try {
      const { email, password, full_name, username, year_of_birth } = signUpData;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name,
            username,
            year_of_birth
          }
        }
      });

      if (error) {
        return {
          success: false,
          error,
          message: error.message
        };
      }

      return {
        success: true,
        user: data.user,
        message: 'Account created successfully. Please check your email to confirm your account.'
      };
    } catch (error) {
      return {
        success: false,
        error: error as AuthError,
        message: 'An unexpected error occurred during sign up'
      };
    }
  }

  static async signInWithSocial(options: SocialAuthOptions): Promise<AuthResult> {
    try {
      const { provider, redirectTo = `${window.location.origin}/auth/callback` } = options;
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo
        }
      });

      if (error) {
        return {
          success: false,
          error,
          message: error.message
        };
      }

      return {
        success: true,
        message: `${provider} sign in initiated`
      };
    } catch (error) {
      return {
        success: false,
        error: error as AuthError,
        message: `Failed to sign in with ${options.provider}`
      };
    }
  }

  static async signOut(): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return {
          success: false,
          error,
          message: error.message
        };
      }

      return {
        success: true,
        message: 'Signed out successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error as AuthError,
        message: 'An error occurred during sign out'
      };
    }
  }

  static async resetPassword(email: string): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (error) {
        return {
          success: false,
          error,
          message: error.message
        };
      }

      return {
        success: true,
        message: 'Password reset email sent. Please check your inbox.'
      };
    } catch (error) {
      return {
        success: false,
        error: error as AuthError,
        message: 'Failed to send password reset email'
      };
    }
  }

  static async updatePassword(password: string): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.updateUser({
        password
      });

      if (error) {
        return {
          success: false,
          error,
          message: error.message
        };
      }

      return {
        success: true,
        message: 'Password updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error as AuthError,
        message: 'Failed to update password'
      };
    }
  }

  static async verifyAge(birthYear: string): Promise<AuthResult & { age?: number }> {
    try {
      const currentYear = new Date().getFullYear();
      const age = currentYear - parseInt(birthYear);

      if (age < 21) {
        return {
          success: false,
          message: 'You must be 21 or older to access all features'
        };
      }

      // Update user metadata with age verification
      const { error } = await supabase.auth.updateUser({
        data: {
          age_verified: true,
          birth_year: parseInt(birthYear)
        }
      });

      if (error) {
        return {
          success: false,
          error,
          message: 'Failed to verify age'
        };
      }

      return {
        success: true,
        age,
        message: 'Age verified successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error as AuthError,
        message: 'Invalid birth year provided'
      };
    }
  }
}
