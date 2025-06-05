
import { supabase } from '@/integrations/supabase/client';

export class GeneralImportService {
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
}
