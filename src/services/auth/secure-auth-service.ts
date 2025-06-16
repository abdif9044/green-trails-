
import { supabase } from '@/integrations/supabase/client';
import { SecurityManager } from '@/services/security/security-manager';
import { User, Session } from '@supabase/supabase-js';

interface AuthResult {
  success: boolean;
  message?: string;
  user?: User;
  session?: Session;
  requiresMFA?: boolean;
}

export class SecureAuthService {
  static async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      // Rate limiting check
      const rateLimitCheck = await SecurityManager.checkRateLimiting(email, 'login');
      if (!rateLimitCheck.allowed) {
        await SecurityManager.logSecurityEvent({
          event_type: 'rate_limit_exceeded',
          metadata: { email, action: 'login' },
          severity: 'medium',
        });
        
        return {
          success: false,
          message: `Too many login attempts. Please try again in ${rateLimitCheck.retryAfter} seconds.`,
        };
      }

      // Sanitize inputs
      const sanitizedEmail = await SecurityManager.sanitizeInput(email);
      
      if (!sanitizedEmail || !password) {
        return { success: false, message: 'Email and password are required' };
      }

      console.log('Attempting secure sign-in for:', sanitizedEmail);
      
      const startTime = performance.now();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password,
      });
      const duration = performance.now() - startTime;

      if (error) {
        await SecurityManager.logSecurityEvent({
          event_type: 'failed_login_attempt',
          metadata: { 
            email: sanitizedEmail, 
            error: error.message,
            duration,
          },
          severity: 'medium',
        });

        if (error.message.includes('Invalid login')) {
          return { success: false, message: 'Invalid email or password' };
        } else if (error.message.includes('Email not confirmed')) {
          return { success: false, message: 'Please confirm your email before signing in' };
        }
        
        return { success: false, message: error.message };
      }

      if (!data.user || !data.session) {
        return { success: false, message: 'Authentication failed - no user data returned' };
      }

      // Log successful authentication
      await SecurityManager.logSecurityEvent({
        event_type: 'successful_login',
        user_id: data.user.id,
        metadata: { duration },
        severity: 'low',
      });

      console.log('Secure sign-in successful for:', sanitizedEmail);
      
      return {
        success: true,
        user: data.user,
        session: data.session,
      };
    } catch (error) {
      console.error('Exception during secure sign-in:', error);
      
      await SecurityManager.logSecurityEvent({
        event_type: 'auth_exception',
        metadata: { 
          error: error instanceof Error ? error.message : 'Unknown error',
          email,
        },
        severity: 'high',
      });
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  static async signUp(email: string, password: string, metadata: object = {}): Promise<AuthResult> {
    try {
      // Sanitize inputs
      const sanitizedEmail = await SecurityManager.sanitizeInput(email);
      
      if (!sanitizedEmail || !password) {
        return { success: false, message: 'Email and password are required' };
      }

      // Enforce password policy
      const passwordCheck = await SecurityManager.enforcePasswordPolicy(password);
      if (!passwordCheck.isValid) {
        return {
          success: false,
          message: `Password requirements not met: ${passwordCheck.errors.join(', ')}`,
        };
      }

      console.log('Attempting secure sign-up for:', sanitizedEmail);

      const { data, error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password,
        options: {
          data: {
            ...metadata,
            signup_timestamp: new Date().toISOString(),
            signup_ip: await this.getClientIP(),
          },
        },
      });

      if (error) {
        await SecurityManager.logSecurityEvent({
          event_type: 'failed_signup_attempt',
          metadata: { 
            email: sanitizedEmail, 
            error: error.message,
          },
          severity: 'medium',
        });
        
        return { success: false, message: error.message };
      }

      if (!data.user) {
        return { success: false, message: 'Account creation failed - no user data returned' };
      }

      await SecurityManager.logSecurityEvent({
        event_type: 'successful_signup',
        user_id: data.user.id,
        metadata: { email: sanitizedEmail },
        severity: 'low',
      });

      if (data.session === null) {
        return {
          success: true,
          message: 'Account created successfully. Please check your email for confirmation.',
        };
      }

      return {
        success: true,
        user: data.user,
        session: data.session,
        message: 'Account created successfully. Welcome to GreenTrails!',
      };
    } catch (error) {
      console.error('Exception during secure sign-up:', error);
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  static async signOut(userId?: string): Promise<AuthResult> {
    try {
      if (userId) {
        await SecurityManager.logSecurityEvent({
          event_type: 'user_signout',
          user_id: userId,
          severity: 'low',
        });
      }

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        return { success: false, message: error.message };
      }

      // Clear any sensitive data from localStorage
      this.clearSensitiveStorage();

      return { success: true };
    } catch (error) {
      console.error('Exception during sign out:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  static async refreshSession(): Promise<{ session: Session | null; error: string | null }> {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        await SecurityManager.logSecurityEvent({
          event_type: 'session_refresh_failed',
          metadata: { error: error.message },
          severity: 'medium',
        });
        
        return { session: null, error: error.message };
      }

      if (data.session) {
        await SecurityManager.logSecurityEvent({
          event_type: 'session_refreshed',
          user_id: data.session.user.id,
          severity: 'low',
        });
      }

      return { session: data.session, error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { session: null, error: errorMessage };
    }
  }

  private static async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || 'unknown';
    } catch {
      return 'unknown';
    }
  }

  private static clearSensitiveStorage(): void {
    try {
      // Clear auth-related items
      const keysToRemove = Object.keys(localStorage).filter(key => 
        key.includes('auth') || key.includes('token') || key.includes('session')
      );
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Clear any rate limiting data older than 1 hour
      const hourAgo = Date.now() - 3600000;
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('rate_limit_')) {
          try {
            const data = JSON.parse(localStorage.getItem(key) || '{}');
            if (data.timestamp && data.timestamp < hourAgo) {
              localStorage.removeItem(key);
            }
          } catch {
            localStorage.removeItem(key);
          }
        }
      });
    } catch (error) {
      console.warn('Failed to clear sensitive storage:', error);
    }
  }
}
