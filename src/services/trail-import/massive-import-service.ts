
import { supabase } from '@/integrations/supabase/client';

interface MassiveImportConfig {
  sources: string[];
  maxTrailsPerSource: number;
  batchSize?: number;
  concurrency?: number;
}

interface ImportProgress {
  jobId: string;
  status: 'processing' | 'completed' | 'error';
  totalProcessed: number;
  totalAdded: number;
  totalFailed: number;
  sourceProgress: Array<{
    source: string;
    processed: number;
    added: number;
    failed: number;
    status: string;
  }>;
}

export class MassiveTrailImportService {
  /**
   * Start a massive import job to fetch 50,000+ trails from multiple sources
   */
  static async startMassiveImport(config: MassiveImportConfig): Promise<{ jobId: string; success: boolean }> {
    try {
      console.log('Starting massive trail import:', config);
      
      // Call the Supabase Edge Function for massive import
      const { data, error } = await supabase.functions.invoke('import-trails-massive', {
        body: {
          sources: config.sources,
          maxTrailsPerSource: config.maxTrailsPerSource,
          batchSize: config.batchSize || 100,
          concurrency: config.concurrency || 3
        }
      });

      if (error) {
        console.error('Error starting massive import:', error);
        return { jobId: '', success: false };
      }

      console.log('Massive import started:', data);
      return { jobId: data.job_id, success: true };
    } catch (error) {
      console.error('Exception in massive import:', error);
      return { jobId: '', success: false };
    }
  }

  /**
   * Get the progress of a massive import job
   */
  static async getImportProgress(jobId: string): Promise<ImportProgress | null> {
    try {
      const { data, error } = await supabase
        .from('bulk_import_jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (error || !data) {
        console.error('Error fetching import progress:', error);
        return null;
      }

      return {
        jobId: data.id,
        status: data.status as 'processing' | 'completed' | 'error',
        totalProcessed: data.trails_processed || 0,
        totalAdded: data.trails_added || 0,
        totalFailed: data.trails_failed || 0,
        sourceProgress: [] // Would need to fetch from related table
      };
    } catch (error) {
      console.error('Error getting import progress:', error);
      return null;
    }
  }

  /**
   * Quick start function to import 50,000 trails from all major sources
   */
  static async quickStart50KTrails(): Promise<{ jobId: string; success: boolean }> {
    const config: MassiveImportConfig = {
      sources: ['hiking_project', 'openstreetmap', 'usgs'],
      maxTrailsPerSource: 20000, // 60K total across 3 sources
      batchSize: 200,
      concurrency: 4
    };

    return this.startMassiveImport(config);
  }

  /**
   * Get total trail count in database
   */
  static async getTrailCount(): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('trails')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error getting trail count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error getting trail count:', error);
      return 0;
    }
  }
}
