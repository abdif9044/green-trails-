
import { supabase } from '@/integrations/supabase/client';

export interface AutonomousImportResult {
  success: boolean;
  message: string;
  jobId?: string;
  trailsImported: number;
  timeElapsed: number;
  phases?: Array<{
    phase: string;
    success: boolean;
    trailsProcessed: number;
    trailsAdded: number;
    trailsFailed: number;
    duration: number;
    errors: string[];
  }>;
}

export class AutonomousImportService {
  static async start55KImport(): Promise<AutonomousImportResult> {
    try {
      console.log('🚀 Starting autonomous 55,555 trail import...');
      
      const { data, error } = await supabase.functions.invoke('autonomous-trail-import', {
        body: {
          targetTrails: 55555,
          maxRetries: 3,
          batchSize: 100,
          concurrency: 2,
          autoHeal: true,
          phases: [
            { name: 'Database Health Check', trailCount: 0, batchSize: 1, concurrency: 1, successThreshold: 100, autoRetry: true },
            { name: 'Trail Generation', trailCount: 55555, batchSize: 1000, concurrency: 1, successThreshold: 95, autoRetry: true },
            { name: 'Batch Import', trailCount: 55555, batchSize: 100, concurrency: 2, successThreshold: 90, autoRetry: true },
            { name: 'Validation', trailCount: 0, batchSize: 1, concurrency: 1, successThreshold: 100, autoRetry: false }
          ]
        }
      });

      if (error) {
        console.error('Autonomous import error:', error);
        return {
          success: false,
          message: `Import failed: ${error.message}`,
          trailsImported: 0,
          timeElapsed: 0
        };
      }

      console.log('✅ Autonomous import response:', data);
      
      return {
        success: data.success || false,
        message: data.message || 'Import completed',
        jobId: data.jobId,
        trailsImported: data.trailsImported || 0,
        timeElapsed: data.timeElapsed || 0,
        phases: data.phases || []
      };
      
    } catch (error) {
      console.error('Autonomous import exception:', error);
      return {
        success: false,
        message: `Import exception: ${error instanceof Error ? error.message : 'Unknown error'}`,
        trailsImported: 0,
        timeElapsed: 0
      };
    }
  }

  static async getImportStatus(): Promise<{
    currentCount: number;
    isActive: boolean;
    progress: number;
  }> {
    try {
      const { count } = await supabase
        .from('trails')
        .select('*', { count: 'exact', head: true });
      
      const currentCount = count || 0;
      const progress = Math.min(100, (currentCount / 55555) * 100);
      
      // Check for active jobs
      const { data: activeJobs } = await supabase
        .from('bulk_import_jobs')
        .select('status')
        .in('status', ['processing', 'queued'])
        .limit(1);
      
      const isActive = (activeJobs && activeJobs.length > 0) || false;
      
      return {
        currentCount,
        isActive,
        progress
      };
      
    } catch (error) {
      console.error('Error getting import status:', error);
      return {
        currentCount: 0,
        isActive: false,
        progress: 0
      };
    }
  }

  static async validateImportQuality(): Promise<{
    isValid: boolean;
    totalTrails: number;
    issues: string[];
    recommendations: string[];
  }> {
    try {
      const { count: totalTrails } = await supabase
        .from('trails')
        .select('*', { count: 'exact', head: true });

      const issues: string[] = [];
      const recommendations: string[] = [];

      // Check for minimum trail count
      if (!totalTrails || totalTrails < 50000) {
        issues.push(`Trail count (${totalTrails?.toLocaleString()}) below production target of 50,000`);
      }

      // Check for geographic distribution
      const { data: countryStats } = await supabase
        .from('trails')
        .select('country')
        .not('country', 'is', null);

      if (countryStats) {
        const countries = [...new Set(countryStats.map(t => t.country))];
        if (countries.length < 3) {
          issues.push('Geographic diversity insufficient - need trails from at least 3 countries');
        }
      }

      // Add recommendations
      if (totalTrails && totalTrails >= 50000) {
        recommendations.push('Trail database is production-ready');
        recommendations.push('Consider adding trail images and user reviews');
        recommendations.push('Enable real-time trail condition updates');
      }

      return {
        isValid: issues.length === 0,
        totalTrails: totalTrails || 0,
        issues,
        recommendations
      };

    } catch (error) {
      console.error('Error validating import quality:', error);
      return {
        isValid: false,
        totalTrails: 0,
        issues: ['Unable to validate import quality'],
        recommendations: []
      };
    }
  }
}
