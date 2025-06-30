/**
 * Real Trails Import Service - Production-ready trail data import from authoritative sources
 * Replaces synthetic data generation with real USGS and NPS trail data
 */

import { supabase } from '@/integrations/supabase/client';
import { USGSTrailsService, type USGSTrail } from './data-sources/usgs-trails-service';
import { NPSTrailsService, type NPSTrail } from './data-sources/nps-trails-service';

export interface RealImportResult {
  success: boolean;
  total_inserted: number;
  total_updated: number;
  total_failed: number;
  message: string;
  sources: {
    usgs: { inserted: number; updated: number; failed: number };
    nps: { inserted: number; updated: number; failed: number };
  };
}

export interface ImportProgress {
  currentSource: 'usgs' | 'nps' | 'complete';
  currentBatch: number;
  totalBatches: number;
  processed: number;
  inserted: number;
  updated: number;
  failed: number;
}

export class RealTrailsImportService {
  private static readonly BATCH_SIZE = 10000; // Large batches for efficiency
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY_MS = 2000;

  /**
   * Import real trail data from USGS and NPS sources
   */
  static async importRealTrails(
    progressCallback?: (progress: ImportProgress) => void
  ): Promise<RealImportResult> {
    console.log('🚀 Starting real trail data import from authoritative sources...');
    
    const result: RealImportResult = {
      success: false,
      total_inserted: 0,
      total_updated: 0,
      total_failed: 0,
      message: '',
      sources: {
        usgs: { inserted: 0, updated: 0, failed: 0 },
        nps: { inserted: 0, updated: 0, failed: 0 }
      }
    };

    try {
      // Check if we already have data to avoid duplicates
      const existingCheck = await this.checkExistingData();
      if (existingCheck.hasUSGS && existingCheck.hasNPS) {
        result.success = true;
        result.message = `Import skipped - already have ${existingCheck.totalCount} trails from both sources`;
        return result;
      }

      // Import USGS trails
      if (!existingCheck.hasUSGS) {
        console.log('📍 Importing USGS trails...');
        progressCallback?.({
          currentSource: 'usgs',
          currentBatch: 0,
          totalBatches: 0,
          processed: 0,
          inserted: 0,
          updated: 0,
          failed: 0
        });

        const usgsResult = await this.importUSGSTrails(progressCallback);
        result.sources.usgs = usgsResult;
        result.total_inserted += usgsResult.inserted;
        result.total_updated += usgsResult.updated;
        result.total_failed += usgsResult.failed;
      }

      // Import NPS trails
      if (!existingCheck.hasNPS) {
        console.log('🏞️ Importing NPS trails...');
        progressCallback?.({
          currentSource: 'nps',
          currentBatch: 0,
          totalBatches: 0,
          processed: 0,
          inserted: result.total_inserted,
          updated: result.total_updated,
          failed: result.total_failed
        });

        const npsResult = await this.importNPSTrails(progressCallback);
        result.sources.nps = npsResult;
        result.total_inserted += npsResult.inserted;
        result.total_updated += npsResult.updated;
        result.total_failed += npsResult.failed;
      }

      // Final progress update
      progressCallback?.({
        currentSource: 'complete',
        currentBatch: 0,
        totalBatches: 0,
        processed: result.total_inserted + result.total_updated,
        inserted: result.total_inserted,
        updated: result.total_updated,
        failed: result.total_failed
      });

      result.success = true;
      result.message = `Successfully imported ${result.total_inserted} new trails and updated ${result.total_updated} existing trails`;
      
      console.log('✅ Real trail import completed:', result);
      return result;

    } catch (error) {
      console.error('❌ Real trail import failed:', error);
      result.success = false;
      result.message = error instanceof Error ? error.message : 'Unknown error occurred';
      return result;
    }
  }

  /**
   * Import USGS trails with retry logic and progress tracking
   */
  private static async importUSGSTrails(
    progressCallback?: (progress: ImportProgress) => void
  ): Promise<{ inserted: number; updated: number; failed: number }> {
    let totalInserted = 0;
    let totalUpdated = 0;
    let totalFailed = 0;

    try {
      // Fetch all USGS trails
      const usgsTrails = await USGSTrailsService.fetchAllUSTrails();
      console.log(`📊 Fetched ${usgsTrails.length} USGS trails`);

      if (usgsTrails.length === 0) {
        console.warn('⚠️ No USGS trails fetched');
        return { inserted: 0, updated: 0, failed: 0 };
      }

      // Process in batches
      const totalBatches = Math.ceil(usgsTrails.length / this.BATCH_SIZE);
      
      for (let i = 0; i < usgsTrails.length; i += this.BATCH_SIZE) {
        const batch = usgsTrails.slice(i, i + this.BATCH_SIZE);
        const batchNumber = Math.floor(i / this.BATCH_SIZE) + 1;

        progressCallback?.({
          currentSource: 'usgs',
          currentBatch: batchNumber,
          totalBatches,
          processed: i,
          inserted: totalInserted,
          updated: totalUpdated,
          failed: totalFailed
        });

        try {
          const batchResult = await this.processBatchWithRetry(batch, 'USGS');
          totalInserted += batchResult.inserted;
          totalUpdated += batchResult.updated;
          
          console.log(`✅ USGS batch ${batchNumber}/${totalBatches}: +${batchResult.inserted} inserted, +${batchResult.updated} updated`);
        } catch (error) {
          console.error(`❌ USGS batch ${batchNumber} failed:`, error);
          totalFailed += batch.length;
        }

        // Rate limiting between batches
        await this.delay(500);
      }

      return { inserted: totalInserted, updated: totalUpdated, failed: totalFailed };
    } catch (error) {
      console.error('❌ USGS import failed:', error);
      throw error;
    }
  }

  /**
   * Import NPS trails with retry logic and progress tracking
   */
  private static async importNPSTrails(
    progressCallback?: (progress: ImportProgress) => void
  ): Promise<{ inserted: number; updated: number; failed: number }> {
    let totalInserted = 0;
    let totalUpdated = 0;
    let totalFailed = 0;

    try {
      // Fetch all NPS trails
      const npsTrails = await NPSTrailsService.fetchAllNPSTrails();
      console.log(`📊 Fetched ${npsTrails.length} NPS trails`);

      if (npsTrails.length === 0) {
        console.warn('⚠️ No NPS trails fetched');
        return { inserted: 0, updated: 0, failed: 0 };
      }

      // Process in batches
      const totalBatches = Math.ceil(npsTrails.length / this.BATCH_SIZE);
      
      for (let i = 0; i < npsTrails.length; i += this.BATCH_SIZE) {
        const batch = npsTrails.slice(i, i + this.BATCH_SIZE);
        const batchNumber = Math.floor(i / this.BATCH_SIZE) + 1;

        progressCallback?.({
          currentSource: 'nps',
          currentBatch: batchNumber,
          totalBatches,
          processed: i,
          inserted: totalInserted,
          updated: totalUpdated,
          failed: totalFailed
        });

        try {
          const batchResult = await this.processBatchWithRetry(batch, 'NPS');
          totalInserted += batchResult.inserted;
          totalUpdated += batchResult.updated;
          
          console.log(`✅ NPS batch ${batchNumber}/${totalBatches}: +${batchResult.inserted} inserted, +${batchResult.updated} updated`);
        } catch (error) {
          console.error(`❌ NPS batch ${batchNumber} failed:`, error);
          totalFailed += batch.length;
        }

        // Rate limiting between batches
        await this.delay(500);
      }

      return { inserted: totalInserted, updated: totalUpdated, failed: totalFailed };
    } catch (error) {
      console.error('❌ NPS import failed:', error);
      throw error;
    }
  }

  /**
   * Process a batch of trails with retry logic
   */
  private static async processBatchWithRetry(
    trails: (USGSTrail | NPSTrail)[],
    source: 'USGS' | 'NPS'
  ): Promise<{ inserted: number; updated: number }> {
    const payload = trails.map(trail => ({
      id: trail.id,
      name: trail.name,
      location: trail.location,
      difficulty: trail.difficulty,
      length: trail.length_km,
      elevation_gain: trail.elevation_gain,
      latitude: trail.latitude,
      longitude: trail.longitude,
      geojson: trail.geojson,
      description: trail.description,
      source
    }));

    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        const { data, error } = await supabase.rpc('bulk_insert_trails', {
          payload: JSON.stringify(payload)
        });

        if (error) {
          throw new Error(`RPC error: ${error.message}`);
        }

        if (!data || data.length === 0) {
          throw new Error('No data returned from bulk_insert_trails');
        }

        const result = data[0];
        return {
          inserted: result.inserted_count || 0,
          updated: result.updated_count || 0
        };

      } catch (error) {
        console.warn(`Attempt ${attempt}/${this.MAX_RETRIES} failed:`, error);
        
        if (attempt === this.MAX_RETRIES) {
          throw error;
        }
        
        // Exponential backoff
        await this.delay(this.RETRY_DELAY_MS * Math.pow(2, attempt - 1));
      }
    }

    throw new Error('All retry attempts failed');
  }

  /**
   * Check existing data to avoid duplicates
   */
  private static async checkExistingData(): Promise<{
    hasUSGS: boolean;
    hasNPS: boolean;
    totalCount: number;
    usgsCount: number;
    npsCount: number;
  }> {
    try {
      const { count: usgsCount } = await supabase
        .from('trails')
        .select('*', { count: 'exact', head: true })
        .eq('source', 'USGS');

      const { count: npsCount } = await supabase
        .from('trails')
        .select('*', { count: 'exact', head: true })
        .eq('source', 'NPS');

      const { count: totalCount } = await supabase
        .from('trails')
        .select('*', { count: 'exact', head: true });

      const usgsTotal = usgsCount || 0;
      const npsTotal = npsCount || 0;
      const total = totalCount || 0;

      return {
        hasUSGS: usgsTotal > 50000,
        hasNPS: npsTotal > 10000,
        totalCount: total,
        usgsCount: usgsTotal,
        npsCount: npsTotal
      };
    } catch (error) {
      console.error('Error checking existing data:', error);
      return {
        hasUSGS: false,
        hasNPS: false,
        totalCount: 0,
        usgsCount: 0,
        npsCount: 0
      };
    }
  }

  /**
   * Utility function for delays
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get import status and statistics
   */
  static async getImportStatus(): Promise<{
    totalTrails: number;
    sourceBreakdown: Record<string, number>;
    lastImported?: string;
  }> {
    try {
      const { count: totalCount } = await supabase
        .from('trails')
        .select('*', { count: 'exact', head: true });

      const { data: sourceData } = await supabase
        .from('trails')
        .select('source')
        .not('source', 'is', null);

      const sourceBreakdown: Record<string, number> = {};
      sourceData?.forEach(row => {
        const source = row.source || 'Unknown';
        sourceBreakdown[source] = (sourceBreakdown[source] || 0) + 1;
      });

      return {
        totalTrails: totalCount || 0,
        sourceBreakdown,
        lastImported: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting import status:', error);
      return {
        totalTrails: 0,
        sourceBreakdown: {},
      };
    }
  }
}