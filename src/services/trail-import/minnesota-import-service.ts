
import { supabase } from '@/integrations/supabase/client';

interface MinnesotaImportConfig {
  sources: string[];
  maxTrailsPerSource: number;
  target: string;
  location: {
    lat: number;
    lng: number;
    radius: number;
    city: string;
    state: string;
  };
}

export class MinnesotaImportService {
  static async forceMinnesotaImport(): Promise<boolean> {
    try {
      console.log('🎯 Starting Minnesota import of 10,000 trails...');
      
      const minnesotaConfig: MinnesotaImportConfig = {
        sources: ['minnesota_osm', 'usgs_minnesota', 'local_minnesota_trails'],
        maxTrailsPerSource: 3334, // Split 10k across 3 sources
        target: 'Minnesota_10K',
        location: {
          lat: 46.7296,
          lng: -94.6859,
          radius: 250, // Cover entire state
          city: 'Minnesota',
          state: 'Minnesota'
        }
      };

      const { data, error } = await supabase.functions.invoke('import-trails-massive', {
        body: minnesotaConfig
      });

      if (error) {
        console.error('Minnesota import error:', error);
        return false;
      }

      console.log('Minnesota import response:', data);
      return true;
    } catch (error) {
      console.error('Minnesota import exception:', error);
      return false;
    }
  }

  static async autoTriggerMinnesotaImport(): Promise<boolean> {
    try {
      console.log('🚀 Automatically starting Minnesota import of 10,000 trails...');
      
      const success = await this.forceMinnesotaImport();
      
      if (success) {
        console.log('✅ Minnesota import successfully auto-triggered');
        return true;
      } else {
        console.error('❌ Failed to auto-trigger Minnesota import');
        return false;
      }
    } catch (error) {
      console.error('💥 Error in auto-trigger Minnesota import:', error);
      return false;
    }
  }
}
