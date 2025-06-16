
import { supabase } from '@/integrations/supabase/client';

interface SecurityCheckResult {
  check: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  recommendation?: string;
}

export class SupabaseSecurityChecker {
  static async runSecurityAudit(): Promise<SecurityCheckResult[]> {
    const results: SecurityCheckResult[] = [];

    // 1. Check Supabase URL configuration
    results.push(await this.checkSupabaseUrl());

    // 2. Check RLS policies
    results.push(await this.checkRLSPolicies());

    // 3. Check authentication configuration
    results.push(await this.checkAuthConfiguration());

    // 4. Check API key exposure
    results.push(await this.checkApiKeyExposure());

    // 5. Check CORS and redirect URLs
    results.push(await this.checkCorsAndRedirects());

    return results;
  }

  private static async checkSupabaseUrl(): Promise<SecurityCheckResult> {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    
    if (!supabaseUrl) {
      return {
        check: 'Supabase URL Configuration',
        status: 'fail',
        message: 'VITE_SUPABASE_URL is not configured',
        recommendation: 'Set VITE_SUPABASE_URL in your environment variables'
      };
    }

    if (!supabaseUrl.startsWith('https://')) {
      return {
        check: 'Supabase URL Security',
        status: 'fail',
        message: 'Supabase URL must use HTTPS for secure connections',
        recommendation: 'Ensure your Supabase URL starts with https://'
      };
    }

    if (supabaseUrl.includes('localhost') || supabaseUrl.includes('127.0.0.1')) {
      return {
        check: 'Supabase URL Configuration',
        status: 'warning',
        message: 'Using localhost Supabase URL',
        recommendation: 'Use production Supabase URL for deployed applications'
      };
    }

    return {
      check: 'Supabase URL Configuration',
      status: 'pass',
      message: 'Supabase URL is properly configured with HTTPS'
    };
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

      if (profilesError?.message.includes('row-level security')) {
        return {
          check: 'Row Level Security (RLS)',
          status: 'pass',
          message: 'RLS policies are properly configured and enforced'
        };
      }

      return {
        check: 'Row Level Security (RLS)',
        status: 'warning',
        message: 'RLS policies may not be properly configured',
        recommendation: 'Review and update RLS policies for all tables'
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
      
      // Check if auth is working
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

  private static async checkApiKeyExposure(): Promise<SecurityCheckResult> {
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!anonKey) {
      return {
        check: 'API Key Configuration',
        status: 'fail',
        message: 'VITE_SUPABASE_ANON_KEY is not configured',
        recommendation: 'Set VITE_SUPABASE_ANON_KEY in your environment variables'
      };
    }

    // Check if service role key is accidentally exposed (should never be in frontend)
    if (anonKey.includes('service_role')) {
      return {
        check: 'API Key Security',
        status: 'fail',
        message: 'Service role key detected in frontend - SECURITY RISK!',
        recommendation: 'Use only the anon/public key in frontend applications'
      };
    }

    return {
      check: 'API Key Configuration',
      status: 'pass',
      message: 'API key is properly configured'
    };
  }

  private static async checkCorsAndRedirects(): Promise<SecurityCheckResult> {
    const currentUrl = window.location.origin;
    
    // Check if we're on a secure connection
    if (!window.location.protocol.includes('https') && !currentUrl.includes('localhost')) {
      return {
        check: 'CORS and Redirects',
        status: 'fail',
        message: 'Application is not served over HTTPS',
        recommendation: 'Ensure the application is served over HTTPS in production'
      };
    }

    // Check if current URL would be allowed for auth redirects
    if (currentUrl.includes('lovableproject.com') || currentUrl.includes('localhost')) {
      return {
        check: 'CORS and Redirects',
        status: 'pass',
        message: 'URL configuration appears correct for auth redirects'
      };
    }

    return {
      check: 'CORS and Redirects',
      status: 'warning',
      message: 'Verify this URL is configured in Supabase auth settings',
      recommendation: `Add ${currentUrl} to allowed redirect URLs in Supabase Dashboard > Authentication > URL Configuration`
    };
  }
}
