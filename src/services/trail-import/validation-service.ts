
import { supabase } from '@/integrations/supabase/client';

export class ValidationService {
  static async validateEnvironment(): Promise<{ hasPermissions: boolean; errors: string[] }> {
    const errors: string[] = [];
    
    try {
      // Test database connectivity
      const { data, error } = await supabase
        .from('trails')
        .select('id')
        .limit(1);

      if (error) {
        errors.push(`Database connectivity: ${error.message}`);
      }

      // Test function access
      try {
        const { error: functionError } = await supabase.functions.invoke('import-trails-massive', {
          body: { test: true }
        });

        if (functionError && !functionError.message.includes('Sources specified')) {
          errors.push(`Function access: ${functionError.message}`);
        }
      } catch (fnError) {
        errors.push(`Function test failed: ${fnError instanceof Error ? fnError.message : 'Unknown error'}`);
      }

    } catch (error) {
      errors.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return {
      hasPermissions: errors.length === 0,
      errors
    };
  }

  static validateTrailData(trail: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields
    if (!trail.name || typeof trail.name !== 'string') {
      errors.push('name is required and must be a string');
    }

    if (!trail.location || typeof trail.location !== 'string') {
      errors.push('location is required and must be a string');
    }

    // Numeric validations
    if (trail.length && (typeof trail.length !== 'number' || isNaN(trail.length))) {
      errors.push('length must be a valid number');
    }

    if (trail.elevation && (typeof trail.elevation !== 'number' || isNaN(trail.elevation))) {
      errors.push('elevation must be a valid number');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
