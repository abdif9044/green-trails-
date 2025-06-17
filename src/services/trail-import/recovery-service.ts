
import { supabase } from '@/integrations/supabase/client';

interface JobResults {
  errors?: string[];
  [key: string]: any;
}

export class TrailImportRecoveryService {
  
  static async analyzeImportFailures() {
    try {
      const { data: jobs, error } = await supabase
        .from('bulk_import_jobs')
        .select('*')
        .eq('status', 'completed')
        .eq('trails_added', 0)
        .order('started_at', { ascending: false });

      if (error) throw error;

      const analysis = {
        totalFailedJobs: jobs?.length || 0,
        commonErrors: [] as string[],
        suggestedFixes: [] as string[]
      };

      // Analyze common failure patterns with proper type checking
      jobs?.forEach(job => {
        if (job.results && typeof job.results === 'object') {
          const results = job.results as JobResults;
          if (results.errors && Array.isArray(results.errors)) {
            analysis.commonErrors.push(...results.errors);
          }
        }
      });

      // Suggest fixes based on patterns
      if (analysis.commonErrors.some(error => error.includes('RLS'))) {
        analysis.suggestedFixes.push('Update RLS policies to allow service role access');
      }

      if (analysis.commonErrors.some(error => error.includes('validation'))) {
        analysis.suggestedFixes.push('Improve data validation handling');
      }

      return analysis;
    } catch (error) {
      console.error('Error analyzing import failures:', error);
      throw error;
    }
  }

  static async fixServiceRoleAccess() {
    try {
      // Test if service role can insert trails
      const testTrail = {
        id: crypto.randomUUID(),
        name: 'Service Role Test Trail',
        location: 'Test Location',
        difficulty: 'easy',
        length: 1.0,
        elevation_gain: 100
      };

      const { error } = await supabase
        .from('trails')
        .insert([testTrail]);

      if (error) {
        console.error('Service role access test failed:', error);
        return false;
      }

      // Clean up test trail
      await supabase
        .from('trails')
        .delete()
        .eq('id', testTrail.id);

      return true;
    } catch (error) {
      console.error('Service role access fix failed:', error);
      return false;
    }
  }

  static async cancelStuckJobs() {
    try {
      const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
      
      const { data, error } = await supabase
        .from('bulk_import_jobs')
        .update({ 
          status: 'cancelled',
          completed_at: new Date().toISOString()
        })
        .eq('status', 'processing')
        .lt('started_at', oneHourAgo)
        .select();

      if (error) throw error;

      return data?.length || 0;
    } catch (error) {
      console.error('Error cancelling stuck jobs:', error);
      throw error;
    }
  }

  static async validateImportFunction() {
    try {
      // Test the import function with minimal parameters
      const { data, error } = await supabase.functions.invoke('import-trails-massive', {
        body: {
          sources: ['hiking_project'],
          maxTrailsPerSource: 1,
          batchSize: 1,
          debug: true,
          validation: true
        }
      });

      return { success: !error, data, error };
    } catch (error) {
      return { success: false, error };
    }
  }
}
