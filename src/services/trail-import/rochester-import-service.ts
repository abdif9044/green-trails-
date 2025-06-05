
import { supabase } from '@/integrations/supabase/client';

interface RochesterImportConfig {
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

export class RochesterImportService {
  static async forceRochesterImport(): Promise<boolean> {
    try {
      console.log('🎯 Starting Rochester, MN import of 5,555 trails...');
      
      const rochesterConfig: RochesterImportConfig = {
        sources: ['rochester_osm', 'minnesota_usgs', 'local_trails'],
        maxTrailsPerSource: 1855,
        target: 'Rochester_5555',
        location: {
          lat: 44.0223,
          lng: -92.4695,
          radius: 100,
          city: 'Rochester',
          state: 'Minnesota'
        }
      };

      const { data, error } = await supabase.functions.invoke('import-trails-massive', {
        body: rochesterConfig
      });

      if (error) {
        console.error('Rochester import error:', error);
        return false;
      }

      console.log('Rochester import response:', data);
      return true;
    } catch (error) {
      console.error('Rochester import exception:', error);
      return false;
    }
  }

  static async autoTriggerRochesterImport(): Promise<boolean> {
    try {
      console.log('🚀 Automatically starting Rochester, MN import of 5,555 trails...');
      
      const success = await this.forceRochesterImport();
      
      if (success) {
        console.log('✅ Rochester import successfully auto-triggered');
        return true;
      } else {
        console.error('❌ Failed to auto-trigger Rochester import');
        return false;
      }
    } catch (error) {
      console.error('💥 Error in auto-trigger Rochester import:', error);
      return false;
    }
  }
}
