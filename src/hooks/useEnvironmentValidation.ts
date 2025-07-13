
import { useState, useEffect } from 'react';

interface EnvironmentStatus {
  isValid: boolean;
  missingKeys: string[];
  warnings: string[];
  recommendations: string[];
}

export function useEnvironmentValidation() {
  const [status, setStatus] = useState<EnvironmentStatus>({
    isValid: true,
    missingKeys: [],
    warnings: [],
    recommendations: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateEnvironment = async () => {
      try {
        const missingKeys: string[] = [];
        const warnings: string[] = [];
        const recommendations: string[] = [];

        // Check if we can reach Supabase
        try {
          const response = await fetch('/api/health-check', { 
            method: 'HEAD',
            timeout: 5000 
          } as any);
          
          if (!response.ok) {
            warnings.push('Unable to verify Supabase connection');
          }
        } catch (error) {
          warnings.push('Network connectivity issues detected');
        }

        // Add recommendations based on missing keys
        if (missingKeys.length > 0) {
          recommendations.push('Configure missing API keys for full functionality');
        }

        if (warnings.length === 0) {
          recommendations.push('Environment appears to be properly configured');
        }

        setStatus({
          isValid: missingKeys.length === 0 && warnings.length === 0,
          missingKeys,
          warnings,
          recommendations
        });
      } catch (error) {
        console.error('Environment validation error:', error);
        setStatus({
          isValid: false,
          missingKeys: [],
          warnings: ['Unable to validate environment'],
          recommendations: ['Check network connection and try again']
        });
      } finally {
        setLoading(false);
      }
    };

    validateEnvironment();
  }, []);

  return { status, loading };
}
