
import { supabase } from '@/integrations/supabase/client';

export class ImportService {
  static async forceBootstrap(): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('import-trails-massive', {
        body: {
          sources: ['hiking_project', 'openstreetmap', 'usgs'],
          maxTrailsPerSource: 10000,
          batchSize: 50,
          concurrency: 2,
          priority: 'high',
          target: '30K',
          debug: true,
          validation: true
        }
      });

      if (error) {
        console.error('Bootstrap error:', error);
        return false;
      }

      console.log('Bootstrap response:', data);
      return true;
    } catch (error) {
      console.error('Bootstrap exception:', error);
      return false;
    }
  }

  static async forceRochesterImport(): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('import-americas-trails', {
        body: {
          region: 'rochester_ny',
          maxTrails: 5555,
          immediate: true,
          priority: 'high'
        }
      });

      if (error) {
        console.error('Rochester import error:', error);
        return false;
      }

      console.log('Rochester import started:', data);
      return true;
    } catch (error) {
      console.error('Rochester import exception:', error);
      return false;
    }
  }

  static async autoTriggerRochesterImport(): Promise<boolean> {
    try {
      console.log('🎯 Auto-triggering Rochester import...');
      return await this.forceRochesterImport();
    } catch (error) {
      console.error('Auto Rochester import failed:', error);
      return false;
    }
  }

  static async quickStart50KTrails(): Promise<{ jobId: string; success: boolean }> {
    try {
      const { data, error } = await supabase.functions.invoke('import-trails-massive', {
        body: {
          sources: ['hiking_project', 'openstreetmap', 'usgs'],
          maxTrailsPerSource: 20000,
          batchSize: 200,
          concurrency: 4
        }
      });

      if (error) {
        console.error('Error starting massive import:', error);
        return { jobId: '', success: false };
      }

      return { jobId: data.job_id, success: true };
    } catch (error) {
      console.error('Exception in massive import:', error);
      return { jobId: '', success: false };
    }
  }
}
