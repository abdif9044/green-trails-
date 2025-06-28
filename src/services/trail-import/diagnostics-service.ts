
import { supabase } from '@/integrations/supabase/client';

interface DiagnosticsResult {
  hasPermissions: boolean;
  errors: string[];
}

export class DiagnosticsService {
  static async runDiagnostics(): Promise<DiagnosticsResult> {
    const errors: string[] = [];
    let hasPermissions = true;

    try {
      // Test basic table access
      const { error: trailsError } = await supabase
        .from('trails')
        .select('id')
        .limit(1);

      if (trailsError) {
        errors.push(`Trails table access: ${trailsError.message}`);
        hasPermissions = false;
      }

      // Test bulk import tables
      const { error: bulkError } = await supabase
        .from('bulk_import_jobs')
        .select('id')
        .limit(1);

      if (bulkError) {
        errors.push(`Bulk import tables: ${bulkError.message}`);
        hasPermissions = false;
      }

      // Test function access
      const { error: functionError } = await supabase.functions.invoke('import-trails-massive', {
        body: { test: true }
      });

      if (functionError && !functionError.message.includes('Sources specified')) {
        errors.push(`Function access: ${functionError.message}`);
      }

    } catch (error) {
      errors.push(`Diagnostics error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      hasPermissions = false;
    }

    return { hasPermissions, errors };
  }
}
