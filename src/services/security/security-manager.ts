
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface SecurityConfig {
  enforceHttps: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  requireStrongPasswords: boolean;
}

interface SecurityEvent {
  event_type: string;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export class SecurityManager {
  private static config: SecurityConfig = {
    enforceHttps: true,
    sessionTimeout: 3600000, // 1 hour
    maxLoginAttempts: 5,
    requireStrongPasswords: true,
  };

  static async validateEnvironment(): Promise<{ isValid: boolean; issues: string[] }> {
    const issues: string[] = [];
    
    // Check HTTPS enforcement
    if (this.config.enforceHttps && window.location.protocol !== 'https:' && !window.location.hostname.includes('localhost')) {
      issues.push('Application must be served over HTTPS in production');
    }
    
    // Check Supabase URL
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl) {
      issues.push('VITE_SUPABASE_URL environment variable is not set');
    } else if (!supabaseUrl.startsWith('https://')) {
      issues.push('Supabase URL must use HTTPS protocol');
    }
    
    // Check API key
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!anonKey) {
      issues.push('VITE_SUPABASE_ANON_KEY environment variable is not set');
    } else if (anonKey.includes('service_role')) {
      issues.push('Service role key should not be used in frontend applications');
    }
    
    return {
      isValid: issues.length === 0,
      issues,
    };
  }

  static async logSecurityEvent(event: Omit<SecurityEvent, 'created_at'>): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase
        .from('security_audit_log')
        .insert([
          {
            event_type: event.event_type,
            user_id: event.user_id || user?.id,
            metadata: {
              ...event.metadata,
              ip_address: event.ip_address,
              user_agent: event.user_agent || navigator.userAgent,
              severity: event.severity,
              timestamp: new Date().toISOString(),
              url: window.location.href,
            },
            created_at: new Date().toISOString(),
          },
        ]);
    } catch (error) {
      console.warn('Failed to log security event (non-critical):', error);
    }
  }

  static async validateSession(): Promise<{ isValid: boolean; shouldRefresh: boolean }> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        return { isValid: false, shouldRefresh: false };
      }
      
      const expiresAt = new Date(session.expires_at! * 1000);
      const now = new Date();
      const timeUntilExpiry = expiresAt.getTime() - now.getTime();
      
      // Refresh if less than 10 minutes remaining
      const shouldRefresh = timeUntilExpiry < 600000;
      
      return {
        isValid: timeUntilExpiry > 0,
        shouldRefresh,
      };
    } catch (error) {
      console.error('Session validation failed:', error);
      return { isValid: false, shouldRefresh: false };
    }
  }

  static async enforcePasswordPolicy(password: string): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];
    
    if (!this.config.requireStrongPasswords) {
      return { isValid: true, errors: [] };
    }
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static async checkRateLimiting(identifier: string, action: string): Promise<{ allowed: boolean; retryAfter?: number }> {
    try {
      const key = `rate_limit_${action}_${identifier}`;
      const stored = localStorage.getItem(key);
      
      if (!stored) {
        localStorage.setItem(key, JSON.stringify({ count: 1, timestamp: Date.now() }));
        return { allowed: true };
      }
      
      const { count, timestamp } = JSON.parse(stored);
      const hourAgo = Date.now() - 3600000; // 1 hour
      
      if (timestamp < hourAgo) {
        localStorage.setItem(key, JSON.stringify({ count: 1, timestamp: Date.now() }));
        return { allowed: true };
      }
      
      if (count >= this.config.maxLoginAttempts) {
        const retryAfter = Math.ceil((timestamp + 3600000 - Date.now()) / 1000);
        return { allowed: false, retryAfter };
      }
      
      localStorage.setItem(key, JSON.stringify({ count: count + 1, timestamp }));
      return { allowed: true };
      
    } catch (error) {
      console.warn('Rate limiting check failed:', error);
      return { allowed: true }; // Fail open for availability
    }
  }

  static async sanitizeInput(input: string): Promise<string> {
    // Basic XSS prevention
    return input
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim();
  }

  static getSecurityHeaders(): Record<string, string> {
    return {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co wss://*.supabase.co;",
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    };
  }
}
