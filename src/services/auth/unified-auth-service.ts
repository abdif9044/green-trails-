import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export interface AuthResult {
  success: boolean;
  message?: string;
  user?: User;
  session?: Session;
}

export interface SignUpData {
  email: string;
  password: string;
  full_name: string;
  username: string;
  year_of_birth?: number;
}

export interface UserProfile {
  id: string;
  full_name?: string;
  username?: string;
  bio?: string;
  avatar_url?: string;
  website_url?: string;
  year_of_birth?: number | null;
  is_age_verified?: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Unified Authentication Service for GreenTrails
 * Consolidates all auth operations into a single, typed service
 */
export class UnifiedAuthService {
  /**
   * Sign in with email and password
   */
  static async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      if (!email || !password) {
        return { success: false, message: "Email and password are required" };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        
        // Provide user-friendly error messages
        if (error.message.includes('Invalid login')) {
          return { success: false, message: "Invalid email or password" };
        } else if (error.message.includes('Email not confirmed')) {
          return { success: false, message: "Please confirm your email before signing in" };
        } else if (error.message.includes('rate limit')) {
          return { success: false, message: "Too many login attempts. Please try again later." };
        }
        
        return { success: false, message: error.message };
      }

      if (!data.user) {
        return { success: false, message: 'Authentication failed - no user data returned' };
      }

      return { 
        success: true, 
        user: data.user, 
        session: data.session 
      };
    } catch (error) {
      console.error('Sign in exception:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'An unknown error occurred' 
      };
    }
  }

  /**
   * Sign up with enhanced profile creation
   */
  static async signUp(signUpData: SignUpData): Promise<AuthResult> {
    try {
      const { email, password, full_name, username, year_of_birth } = signUpData;
      
      // Validate inputs
      if (!email || !password) {
        return { success: false, message: "Email and password are required" };
      }
      
      if (password.length < 6) {
        return { success: false, message: "Password must be at least 6 characters long" };
      }

      // Sign up with metadata
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name,
            username,
            year_of_birth,
            signup_timestamp: new Date().toISOString()
          }
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        return { success: false, message: error.message };
      }

      if (!data.user) {
        return { success: false, message: 'Account creation failed - no user data returned' };
      }

      // Wait for profile trigger, then update if needed
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update profile with complete data
      await this.updateUserProfile(data.user.id, {
        full_name,
        username,
        year_of_birth: year_of_birth || null,
        is_age_verified: year_of_birth ? (new Date().getFullYear() - year_of_birth) >= 21 : false
      });

      const message = data.session 
        ? "Account created successfully. Welcome to GreenTrails!"
        : "Account created successfully. Please check your email for confirmation.";

      return {
        success: true,
        user: data.user,
        session: data.session,
        message
      };
    } catch (error) {
      console.error('Sign up exception:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    }
  }

  /**
   * Sign out current user
   */
  static async signOut(): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        return { success: false, message: error.message };
      }

      return { success: true, message: "Signed out successfully" };
    } catch (error) {
      console.error('Sign out exception:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'An unknown error occurred' 
      };
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(email: string): Promise<AuthResult> {
    try {
      if (!email) {
        return { success: false, message: "Email is required" };
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (error) {
        console.error('Reset password error:', error);
        return { success: false, message: error.message };
      }

      return { 
        success: true, 
        message: "Password reset email sent. Please check your inbox." 
      };
    } catch (error) {
      console.error('Reset password exception:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'An unknown error occurred' 
      };
    }
  }

  /**
   * Update password
   */
  static async updatePassword(password: string): Promise<AuthResult> {
    try {
      if (!password) {
        return { success: false, message: "Password is required" };
      }

      if (password.length < 6) {
        return { success: false, message: "Password must be at least 6 characters long" };
      }

      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        console.error('Update password error:', error);
        return { success: false, message: error.message };
      }

      return { success: true, message: "Password updated successfully" };
    } catch (error) {
      console.error('Update password exception:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'An unknown error occurred' 
      };
    }
  }

  /**
   * Verify user age (21+ requirement)
   */
  static async verifyAge(birthYear: string): Promise<AuthResult & { age?: number }> {
    try {
      const year = parseInt(birthYear);
      if (isNaN(year)) {
        return { success: false, message: "Invalid birth year" };
      }

      const currentYear = new Date().getFullYear();
      const age = currentYear - year;

      if (age < 21) {
        return { 
          success: false, 
          message: "You must be 21 or older to use GreenTrails",
          age 
        };
      }

      // Update user profile with age verification
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await this.updateUserProfile(user.id, {
          year_of_birth: year,
          is_age_verified: true
        });
      }

      return { 
        success: true, 
        message: "Age verification successful",
        age 
      };
    } catch (error) {
      console.error('Age verification exception:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'An unknown error occurred' 
      };
    }
  }

  /**
   * Get current session
   */
  static async getCurrentSession(): Promise<{ session: Session | null; error: any }> {
    try {
      const { data, error } = await supabase.auth.getSession();
      return { session: data.session, error };
    } catch (error) {
      console.error('Get session exception:', error);
      return { session: null, error };
    }
  }

  /**
   * Get current user
   */
  static async getCurrentUser(): Promise<{ user: User | null; error: any }> {
    try {
      const { data, error } = await supabase.auth.getUser();
      return { user: data.user, error };
    } catch (error) {
      console.error('Get user exception:', error);
      return { user: null, error };
    }
  }

  /**
   * Update user profile
   */
  private static async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Profile update error:', error);
      }
    } catch (error) {
      console.error('Profile update exception:', error);
    }
  }
}