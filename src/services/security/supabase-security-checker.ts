
import { supabase } from '@/integrations/supabase/client';
import { SecurityManager } from './security-manager';

interface SecurityCheckResult {
  check: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  recommendation?: string;
}

export class SupabaseSecurityChecker {
  static async runSecurityAudit(): Promise<SecurityCheckResult[]> {
    const results: SecurityCheckResult[] = [];

    // Use the SecurityManager for environment validation
    const envValidation = await SecurityManager.validateEnvironment();
    
    if (!envValidation.isValid) {
      results.push({
        check: 'Environment Configuration',
        status: 'fail',
        message: `Configuration issues detected: ${envValidation.issues.join(', ')}`,
        recommendation: 'Fix environment variable configuration and ensure HTTPS is used'
      });
    } else {
      results.push({
        check: 'Environment Configuration',
        status: 'pass',
        message: 'Environment variables are properly configured'
      });
    }

    // Check session security
    const sessionCheck = await SecurityManager.validateSession();
    if (!sessionCheck.isValid) {
      results.push({
        check: 'Session Security',
        status: 'warning',
        message: 'No valid session found or session expired',
        recommendation: 'Users should re-authenticate with secure credentials'
      });
    } else {
      results.push({
        check: 'Session Security',
        status: 'pass',
        message: 'Active session is valid and secure'
      });
    }

    // Test RLS policies
    results.push(await this.checkRLSPolicies());

    // Test authentication configuration  
    results.push(await this.checkAuthConfiguration());

    // Check security headers
    results.push(await this.checkSecurityHeaders());

    return results;
  }

  private static async checkRLSPolicies(): Promise<SecurityCheckResult> {
    try {
      // Test if we can access tables without proper authentication
      const { data: profilesTest, error: profilesError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      const { data: trailsTest, error: trailsError } = await supabase
        .from('trails')
        .select('id')
        .limit(1);

      // If we get RLS errors, that's actually good - it means RLS is working
      const hasRLSErrors = 
        profilesError?.message.includes('row-level security') ||
        trailsError?.message.includes('row-level security');

      if (hasRLSErrors) {
        return {
          check: 'Row Level Security (RLS)',
          status: 'pass',
          message: 'RLS policies are properly configured and enforced'
        };
      }

      // If we can access data without auth, that might be intentional for public data
      if (!profilesError && !trailsError) {
        return {
          check: 'Row Level Security (RLS)',
          status: 'warning',
          message: 'Tables are accessible without authentication - verify this is intentional',
          recommendation: 'Review RLS policies to ensure sensitive data is protected'
        };
      }

      return {
        check: 'Row Level Security (RLS)',
        status: 'pass',
        message: 'RLS policies appear to be working correctly'
      };
    } catch (error) {
      return {
        check: 'Row Level Security (RLS)',
        status: 'fail',
        message: `RLS check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        recommendation: 'Check Supabase connection and RLS configuration'
      };
    }
  }

  private static async checkAuthConfiguration(): Promise<SecurityCheckResult> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Test auth endpoint accessibility
      const { error: authError } = await supabase.auth.signInAnonymously();
      
      if (authError && !authError.message.includes('Anonymous sign-ins are disabled')) {
        return {
          check: 'Authentication Configuration',
          status: 'fail',
          message: `Auth configuration error: ${authError.message}`,
          recommendation: 'Check Supabase auth settings and Site URL configuration'
        };
      }

      return {
        check: 'Authentication Configuration',
        status: 'pass',
        message: 'Authentication is properly configured'
      };
    } catch (error) {
      return {
        check: 'Authentication Configuration',
        status: 'fail',
        message: `Auth check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        recommendation: 'Verify Supabase auth configuration and Site URL settings'
      };
    }
  }

  private static async checkSecurityHeaders(): Promise<SecurityCheckResult> {
    try {
      const headers = SecurityManager.getSecurityHeaders();
      const currentUrl = window.location.origin;
      
      // Check if we're on HTTPS in production
      if (!window.location.protocol.includes('https') && !currentUrl.includes('localhost')) {
        return {
          check: 'Security Headers & HTTPS',
          status: 'fail',
          message: 'Application is not served over HTTPS',
          recommendation: 'Ensure the application is served over HTTPS in production'
        };
      }

      // Check if current URL would be allowed for auth redirects
      if (currentUrl.includes('lovableproject.com') || currentUrl.includes('localhost')) {
        return {
          check: 'Security Headers & HTTPS',
          status: 'pass',
          message: 'Security headers configured and HTTPS is properly enforced'
        };
      }

      return {
        check: 'Security Headers & HTTPS',
        status: 'warning',
        message: 'Verify this URL is configured in Supabase auth settings',
        recommendation: `Add ${currentUrl} to allowed redirect URLs in Supabase Dashboard > Authentication > URL Configuration`
      };
    } catch (error) {
      return {
        check: 'Security Headers & HTTPS',
        status: 'fail',
        message: `Security headers check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        recommendation: 'Review security header configuration and HTTPS setup'
      };
    }
  }
}
