import { supabase } from '@/integrations/supabase/client';

export interface QuickImportResult {
  success: boolean;
  imported: number;
  failed: number;
  message: string;
}

/**
 * Quick Import Service to rapidly populate the database with 30,000+ trails
 * Uses the optimized massive import edge function
 */
export class QuickImportService {
  static async import30KTrails(): Promise<QuickImportResult> {
    try {
      console.log('🚀 Starting quick import of 30,000+ trails...');
      
      const { data, error } = await supabase.functions.invoke('import-trails-massive', {
        body: {
          sources: [
            'hiking_project', 
            'openstreetmap', 
            'usgs',
            'parks_canada',
            'trails_bc',
            'inegi_mexico'
          ],
          maxTrailsPerSource: 6000, // 36K total across 6 sources
          batchSize: 50,
          concurrency: 2,
          priority: 'high',
          target: '30K',
          location: {
            lat: 39.8283, // Center of USA
            lng: -98.5795,
            radius: 2000 // Cover entire continent
          }
        }
      });

      if (error) {
        console.error('Quick import error:', error);
        return {
          success: false,
          imported: 0,
          failed: 0,
          message: `Import failed: ${error.message}`
        };
      }

      console.log('Quick import completed:', data);
      return {
        success: true,
        imported: data.total_added || 0,
        failed: data.total_failed || 0,
        message: `Successfully imported ${data.total_added || 0} trails`
      };
    } catch (error) {
      console.error('Quick import exception:', error);
      return {
        success: false,
        imported: 0,
        failed: 0,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  static async checkImportStatus(): Promise<{ count: number; lastImport?: string }> {
    try {
      const { count, error } = await supabase
        .from('trails')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error checking trail count:', error);
        return { count: 0 };
      }

      // Get last import job
      const { data: lastJob } = await supabase
        .from('bulk_import_jobs')
        .select('completed_at, trails_added')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      return {
        count: count || 0,
        lastImport: lastJob?.completed_at || undefined
      };
    } catch (error) {
      console.error('Error checking import status:', error);
      return { count: 0 };
    }
  }

  static async importRegionalTrails(region: 'minnesota' | 'denver' | 'canada'): Promise<QuickImportResult> {
    try {
      let location;
      let sources;
      
      switch (region) {
        case 'minnesota':
          location = { lat: 46.7296, lng: -94.6859, radius: 300 };
          sources = ['hiking_project', 'openstreetmap'];
          break;
        case 'denver':
          location = { lat: 39.7392, lng: -104.9903, radius: 200 };
          sources = ['hiking_project', 'usgs'];
          break;
        case 'canada':
          location = { lat: 56.1304, lng: -106.3468, radius: 800 };
          sources = ['parks_canada', 'trails_bc'];
          break;
      }

      const { data, error } = await supabase.functions.invoke('import-trails-massive', {
        body: {
          sources,
          maxTrailsPerSource: 5000,
          batchSize: 25,
          concurrency: 1,
          location
        }
      });

      if (error) {
        return {
          success: false,
          imported: 0,
          failed: 0,
          message: `Regional import failed: ${error.message}`
        };
      }

      return {
        success: true,
        imported: data.total_added || 0,
        failed: data.total_failed || 0,
        message: `Successfully imported ${data.total_added || 0} trails for ${region}`
      };
    } catch (error) {
      return {
        success: false,
        imported: 0,
        failed: 0,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}