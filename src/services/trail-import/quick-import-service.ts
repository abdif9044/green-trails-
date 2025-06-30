import { supabase } from '@/integrations/supabase/client';
import { RealTrailsImportService, type RealImportResult, type ImportProgress } from './real-trails-import-service';

export interface QuickImportResult {
  success: boolean;
  imported: number;
  failed: number;
  message: string;
  sources?: {
    usgs: { inserted: number; updated: number; failed: number };
    nps: { inserted: number; updated: number; failed: number };
  };
}

/**
 * Quick Import Service - Production-ready trail import from authoritative US sources
 * Imports 200K+ real trails from USGS and NPS databases with proper error handling and progress tracking
 */
export class QuickImportService {
  private static progressCallbacks: Set<(progress: ImportProgress) => void> = new Set();

  /**
   * Import 200K+ real trails from USGS and NPS authoritative sources
   * Replaces synthetic data with real trail data from government databases
   */
  static async import200KRealTrails(
    progressCallback?: (progress: ImportProgress) => void
  ): Promise<QuickImportResult> {
    try {
      console.log('🚀 Starting import of 200K+ real trails from authoritative sources...');
      
      // Add progress callback if provided
      if (progressCallback) {
        this.progressCallbacks.add(progressCallback);
      }

      // Check current trail count first
      const status = await this.checkImportStatus();
      if (status.count >= 200000) {
        console.log('✅ Database already has sufficient trails:', status.count);
        return {
          success: true,
          imported: 0,
          failed: 0,
          message: `Import skipped - database already contains ${status.count} trails`,
          sources: {
            usgs: { inserted: 0, updated: 0, failed: 0 },
            nps: { inserted: 0, updated: 0, failed: 0 }
          }
        };
      }

      // Import real trail data from authoritative sources
      const importResult = await RealTrailsImportService.importRealTrails(
        (progress) => {
          // Broadcast progress to all registered callbacks
          this.progressCallbacks.forEach(callback => {
            try {
              callback(progress);
            } catch (error) {
              console.warn('Progress callback error:', error);
            }
          });
        }
      );

      // Clean up progress callback
      if (progressCallback) {
        this.progressCallbacks.delete(progressCallback);
      }

      if (!importResult.success) {
        return {
          success: false,
          imported: 0,
          failed: importResult.total_failed,
          message: importResult.message
        };
      }

      console.log('✅ Real trail import completed:', importResult);
      return {
        success: true,
        imported: importResult.total_inserted,
        failed: importResult.total_failed,
        message: `Successfully imported ${importResult.total_inserted} real trails from USGS and NPS sources`,
        sources: importResult.sources
      };

    } catch (error) {
      console.error('❌ Real trail import failed:', error);
      
      // Clean up progress callback on error
      if (progressCallback) {
        this.progressCallbacks.delete(progressCallback);
      }

      return {
        success: false,
        imported: 0,
        failed: 0,
        message: error instanceof Error ? error.message : 'Unknown error occurred during real trail import'
      };
    }
  }

  /**
   * Legacy method - redirects to new real trail import
   * @deprecated Use import200KRealTrails instead
   */
  static async import30KTrails(): Promise<QuickImportResult> {
    console.warn('⚠️ import30KTrails is deprecated. Using import200KRealTrails instead.');
    return this.import200KRealTrails();
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