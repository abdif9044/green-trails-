import { supabase } from '@/integrations/supabase/client';
import { HikingProjectAPI } from '@/services/trail-apis/hiking-project-api';
import { OpenStreetMapAPI } from '@/services/trail-apis/openstreetmap-api';
import { USGSAPI } from '@/services/trail-apis/usgs-api';
import { 
  normalizeTrail, 
  type NormalizedTrail,
  type HikingProjectTrail,
  type OSMTrail,
  type USGSTrail 
} from '@/utils/trail-data-normalizer';

export interface ImportProgress {
  currentSource: string;
  currentBatch: number;
  totalBatches: number;
  processed: number;
  inserted: number;
  updated: number;
  failed: number;
  errors: string[];
  estimatedTimeRemaining?: string;
}

export interface ImportResult {
  success: boolean;
  jobId: string;
  totalProcessed: number;
  totalInserted: number;
  totalUpdated: number;
  totalFailed: number;
  sources: {
    [key: string]: {
      processed: number;
      inserted: number;
      failed: number;
      errors: string[];
    };
  };
  finalTrailCount: number;
  duration: number;
  message: string;
}

export interface ImportConfiguration {
  maxTrailsPerSource: number;
  batchSize: number;
  enableDuplicateDetection: boolean;
  enableQualityFiltering: boolean;
  minQualityScore: number;
  retryAttempts: number;
  retryDelay: number;
  location?: {
    name: string;
    lat: number;
    lng: number;
    radius: number;
  };
}

export class ComprehensiveImportService {
  private hikingProjectAPI?: HikingProjectAPI;
  private osmAPI: OpenStreetMapAPI;
  private usgsAPI: USGSAPI;
  private startTime: number = 0;

  constructor() {
    this.osmAPI = new OpenStreetMapAPI();
    this.usgsAPI = new USGSAPI();
  }

  /**
   * Initialize API connections with proper authentication
   */
  private async initializeAPIs(): Promise<void> {
    // Get API keys from edge function
    try {
      const { data: apiKeys } = await supabase.functions.invoke('get-api-keys');
      
      if (apiKeys?.HIKING_PROJECT_KEY) {
        this.hikingProjectAPI = new HikingProjectAPI(apiKeys.HIKING_PROJECT_KEY);
      } else {
        console.warn('Hiking Project API key not found, will skip this source');
      }
      
      // USGS/NPS and OSM don't require API keys but we can set them if available
      if (apiKeys?.NPS_API_KEY) {
        this.usgsAPI = new USGSAPI(apiKeys.NPS_API_KEY);
      }
    } catch (error) {
      console.error('Error initializing APIs:', error);
      throw new Error('Failed to initialize API connections. Please check API key configuration.');
    }
  }

  /**
   * Main import function with comprehensive error handling and progress tracking
   */
  async importTrails(
    config: ImportConfiguration,
    onProgress?: (progress: ImportProgress) => void
  ): Promise<ImportResult> {
    this.startTime = Date.now();
    
    const result: ImportResult = {
      success: false,
      jobId: '',
      totalProcessed: 0,
      totalInserted: 0,
      totalUpdated: 0,
      totalFailed: 0,
      sources: {},
      finalTrailCount: 0,
      duration: 0,
      message: ''
    };

    try {
      // Initialize APIs
      await this.initializeAPIs();

      // Create bulk import job
      const { data: bulkJob, error: jobError } = await supabase
        .from('bulk_import_jobs')
        .insert([{
          status: 'processing',
          started_at: new Date().toISOString(),
          total_trails_requested: config.maxTrailsPerSource * 3, // Estimate for 3 sources
          total_sources: 3,
          config: config as any
        }])
        .select('*')
        .single();

      if (jobError || !bulkJob) {
        throw new Error(`Failed to create import job: ${jobError?.message}`);
      }

      result.jobId = bulkJob.id;

      // Get active data sources
      const { data: sources, error: sourcesError } = await supabase
        .from('trail_data_sources')
        .select('*')
        .eq('is_active', true);

      if (sourcesError || !sources?.length) {
        throw new Error('No active data sources found');
      }

      // Import from each source
      for (const source of sources) {
        try {
          const sourceResult = await this.importFromSource(
            source, 
            config, 
            bulkJob.id,
            onProgress
          );
          
          result.sources[source.name] = sourceResult;
          result.totalProcessed += sourceResult.processed;
          result.totalInserted += sourceResult.inserted;
          result.totalFailed += sourceResult.failed;
          
        } catch (sourceError) {
          console.error(`Error importing from ${source.name}:`, sourceError);
          result.sources[source.name] = {
            processed: 0,
            inserted: 0,
            failed: config.maxTrailsPerSource,
            errors: [sourceError instanceof Error ? sourceError.message : 'Unknown error']
          };
          result.totalFailed += config.maxTrailsPerSource;
        }
      }

      // Update final job status
      const finalStatus = result.totalInserted > 0 ? 'completed' : 'error';
      await supabase
        .from('bulk_import_jobs')
        .update({
          status: finalStatus,
          completed_at: new Date().toISOString(),
          trails_processed: result.totalProcessed,
          trails_added: result.totalInserted,
          trails_failed: result.totalFailed,
          results: result.sources
        })
        .eq('id', bulkJob.id);

      // Get final trail count
      const { count: finalCount } = await supabase
        .from('trails')
        .select('*', { count: 'exact', head: true });

      result.finalTrailCount = finalCount || 0;
      result.duration = Date.now() - this.startTime;
      result.success = result.totalInserted > 0;
      result.message = result.success 
        ? `Successfully imported ${result.totalInserted} trails`
        : 'Import failed - no trails were added';

      // Final progress update
      if (onProgress) {
        onProgress({
          currentSource: 'complete',
          currentBatch: 0,
          totalBatches: 0,
          processed: result.totalProcessed,
          inserted: result.totalInserted,
          updated: result.totalUpdated,
          failed: result.totalFailed,
          errors: Object.values(result.sources).flatMap(s => s.errors)
        });
      }

      return result;

    } catch (error) {
      console.error('Comprehensive import error:', error);
      result.duration = Date.now() - this.startTime;
      result.message = error instanceof Error ? error.message : 'Unknown error occurred';
      return result;
    }
  }

  /**
   * Import trails from a specific source with robust error handling
   */
  private async importFromSource(
    source: any,
    config: ImportConfiguration,
    jobId: string,
    onProgress?: (progress: ImportProgress) => void
  ): Promise<{ processed: number; inserted: number; failed: number; errors: string[] }> {
    
    const sourceResult = {
      processed: 0,
      inserted: 0,
      failed: 0,
      errors: [] as string[]
    };

    // Create import log entry
    const { data: importLog } = await supabase
      .from('import_logs')
      .insert([{
        job_id: jobId,
        source_name: source.name,
        source_type: source.source_type,
        total_requested: config.maxTrailsPerSource
      }])
      .select('*')
      .single();

    try {
      let rawTrails: any[] = [];

      // Fetch data based on source type with proper error handling
      switch (source.source_type) {
        case 'hiking_project':
          if (!this.hikingProjectAPI) {
            throw new Error('Hiking Project API not initialized - missing API key');
          }
          rawTrails = await this.fetchHikingProjectTrails(config);
          break;
          
        case 'openstreetmap':
          rawTrails = await this.fetchOSMTrails(config);
          break;
          
        case 'usgs':
          rawTrails = await this.fetchUSGSTrails(config);
          break;
          
        default:
          throw new Error(`Unknown source type: ${source.source_type}`);
      }

      console.log(`Fetched ${rawTrails.length} raw trails from ${source.name}`);

      // Process trails in batches
      const batchSize = config.batchSize;
      const totalBatches = Math.ceil(rawTrails.length / batchSize);

      for (let i = 0; i < rawTrails.length; i += batchSize) {
        const batch = rawTrails.slice(i, i + batchSize);
        const batchNumber = Math.floor(i / batchSize) + 1;

        if (onProgress) {
          onProgress({
            currentSource: source.name,
            currentBatch: batchNumber,
            totalBatches,
            processed: sourceResult.processed,
            inserted: sourceResult.inserted,
            updated: 0,
            failed: sourceResult.failed,
            errors: sourceResult.errors,
            estimatedTimeRemaining: this.calculateETA(sourceResult.processed, rawTrails.length)
          });
        }

        const batchResult = await this.processBatch(
          batch,
          source.source_type,
          config,
          jobId
        );

        sourceResult.processed += batchResult.processed;
        sourceResult.inserted += batchResult.inserted;
        sourceResult.failed += batchResult.failed;
        sourceResult.errors.push(...batchResult.errors);

        // Update import log
        if (importLog) {
          await supabase
            .from('import_logs')
            .update({
              successful_imports: sourceResult.inserted,
              failed_imports: sourceResult.failed,
              error_details: sourceResult.errors
            })
            .eq('id', importLog.id);
        }

        // Rate limiting between batches
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Final import log update
      if (importLog) {
        await supabase
          .from('import_logs')
          .update({
            end_time: new Date().toISOString(),
            successful_imports: sourceResult.inserted,
            failed_imports: sourceResult.failed,
            error_details: sourceResult.errors
          })
          .eq('id', importLog.id);
      }

      return sourceResult;

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      sourceResult.errors.push(errorMsg);
      sourceResult.failed = config.maxTrailsPerSource;

      // Update import log with error
      if (importLog) {
        await supabase
          .from('import_logs')
          .update({
            end_time: new Date().toISOString(),
            failed_imports: sourceResult.failed,
            error_details: [errorMsg]
          })
          .eq('id', importLog.id);
      }

      throw error;
    }
  }

  /**
   * Fetch trails from Hiking Project API with region-based approach
   */
  private async fetchHikingProjectTrails(config: ImportConfiguration): Promise<HikingProjectTrail[]> {
    if (!this.hikingProjectAPI) {
      throw new Error('Hiking Project API not initialized');
    }

    const allTrails: HikingProjectTrail[] = [];
    const regions = config.location ? 
      [{ lat: config.location.lat, lon: config.location.lng, name: config.location.name }] :
      [
        { lat: 40.7128, lon: -74.0060, name: 'Northeast' },
        { lat: 39.7392, lon: -104.9903, name: 'Colorado' },
        { lat: 37.7749, lon: -122.4194, name: 'California' },
        { lat: 47.6062, lon: -122.3321, name: 'Pacific Northwest' }
      ];

    const trailsPerRegion = Math.ceil(config.maxTrailsPerSource / regions.length);

    for (const region of regions) {
      try {
        const result = await this.hikingProjectAPI.getTrails({
          lat: region.lat,
          lon: region.lon,
          maxDistance: config.location?.radius || 200,
          maxResults: trailsPerRegion,
          sort: 'quality'
        });

        if (result.trails && result.trails.length > 0) {
          allTrails.push(...result.trails);
        }

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`Error fetching Hiking Project trails for ${region.name}:`, error);
      }
    }

    return allTrails.slice(0, config.maxTrailsPerSource);
  }

  /**
   * Fetch trails from OpenStreetMap with region-based queries
   */
  private async fetchOSMTrails(config: ImportConfiguration): Promise<OSMTrail[]> {
    const regions = config.location ?
      [{
        name: config.location.name,
        bbox: {
          south: config.location.lat - 2,
          west: config.location.lng - 2,
          north: config.location.lat + 2,
          east: config.location.lng + 2
        }
      }] :
      this.osmAPI.getPopularHikingRegions();

    const trails = await this.osmAPI.getTrailsByRegions(regions.slice(0, 3));
    return trails.slice(0, config.maxTrailsPerSource);
  }

  /**
   * Fetch trails from USGS/NPS API
   */
  private async fetchUSGSTrails(config: ImportConfiguration): Promise<USGSTrail[]> {
    const trails = await this.usgsAPI.generateTrailsFromParks();
    return trails.slice(0, config.maxTrailsPerSource);
  }

  /**
   * Process a batch of trails with validation and deduplication
   */
  private async processBatch(
    rawTrails: any[],
    sourceType: string,
    config: ImportConfiguration,
    jobId: string
  ): Promise<{ processed: number; inserted: number; failed: number; errors: string[] }> {
    
    const batchResult = {
      processed: 0,
      inserted: 0,
      failed: 0,
      errors: [] as string[]
    };

    const validTrails: any[] = [];

    // Normalize and validate trails
    for (const rawTrail of rawTrails) {
      try {
        const normalized = normalizeTrail(rawTrail, sourceType);
        
        // Quality filtering
        if (config.enableQualityFiltering) {
          const qualityScore = await this.calculateQualityScore(normalized);
          if (qualityScore < config.minQualityScore) {
            batchResult.failed++;
            continue;
          }
          // Add quality score to the trail data for database insert
          (normalized as any).data_quality_score = qualityScore;
        }

        // Duplicate detection
        if (config.enableDuplicateDetection) {
          const isDuplicate = await this.checkForDuplicate(normalized);
          if (isDuplicate) {
            batchResult.failed++;
            continue;
          }
        }

        validTrails.push({
          ...normalized,
          import_job_id: jobId,
          source: sourceType,
          created_at: new Date().toISOString()
        });
        
        batchResult.processed++;
        
      } catch (error) {
        batchResult.failed++;
        batchResult.errors.push(`Normalization error: ${error instanceof Error ? error.message : 'Unknown'}`);
      }
    }

    // Bulk insert valid trails
    if (validTrails.length > 0) {
      try {
        const { error: insertError } = await supabase
          .from('trails')
          .insert(validTrails);

        if (insertError) {
          throw insertError;
        }

        batchResult.inserted = validTrails.length;
        
      } catch (error) {
        batchResult.failed += validTrails.length;
        batchResult.errors.push(`Database insert error: ${error instanceof Error ? error.message : 'Unknown'}`);
      }
    }

    return batchResult;
  }

  /**
   * Calculate trail quality score
   */
  private async calculateQualityScore(trail: NormalizedTrail): Promise<number> {
    try {
      const { data } = await supabase.rpc('calculate_trail_quality_score', {
        trail_name: trail.name,
        trail_description: trail.description,
        trail_length: trail.length,
        trail_elevation: trail.elevation_gain,
        trail_lat: trail.latitude,
        trail_lon: trail.longitude
      });
      
      return data || 0.5;
    } catch (error) {
      console.error('Error calculating quality score:', error);
      return 0.5;
    }
  }

  /**
   * Check for duplicate trails
   */
  private async checkForDuplicate(trail: NormalizedTrail): Promise<boolean> {
    try {
      // Check for trails with similar coordinates (within ~100 meters)
      const { data: existingTrails } = await supabase
        .from('trails')
        .select('id, name, latitude, longitude')
        .gte('latitude', trail.latitude - 0.001)
        .lte('latitude', trail.latitude + 0.001)
        .gte('longitude', trail.longitude - 0.001)
        .lte('longitude', trail.longitude + 0.001);

      if (existingTrails && existingTrails.length > 0) {
        // Check name similarity
        for (const existing of existingTrails) {
          const nameSimilarity = this.calculateStringSimilarity(
            trail.name.toLowerCase(),
            existing.name.toLowerCase()
          );
          
          if (nameSimilarity > 0.8) {
            // Log duplicate
            await supabase
              .from('trail_duplicates')
              .insert([{
                original_trail_id: existing.id,
                duplicate_source: trail.source,
                duplicate_source_id: trail.source_id,
                similarity_score: nameSimilarity,
                duplicate_data: trail as any
              }]);
            
            return true;
          }
        }
      }

      return false;
      
    } catch (error) {
      console.error('Error checking for duplicates:', error);
      return false;
    }
  }

  /**
   * Calculate string similarity using Levenshtein distance
   */
  private calculateStringSimilarity(str1: string, str2: string): number {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix = Array(len2 + 1).fill(null).map(() => Array(len1 + 1).fill(null));

    for (let i = 0; i <= len1; i += 1) {
      matrix[0][i] = i;
    }

    for (let j = 0; j <= len2; j += 1) {
      matrix[j][0] = j;
    }

    for (let j = 1; j <= len2; j += 1) {
      for (let i = 1; i <= len1; i += 1) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator,
        );
      }
    }

    const distance = matrix[len2][len1];
    return 1 - distance / Math.max(len1, len2);
  }

  /**
   * Calculate estimated time remaining
   */
  private calculateETA(processed: number, total: number): string {
    if (processed === 0) return 'Calculating...';
    
    const elapsed = Date.now() - this.startTime;
    const rate = processed / elapsed; // trails per ms
    const remaining = total - processed;
    const estimatedMs = remaining / rate;
    
    const minutes = Math.floor(estimatedMs / 60000);
    const seconds = Math.floor((estimatedMs % 60000) / 1000);
    
    return `${minutes}m ${seconds}s`;
  }
}