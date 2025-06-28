
import { supabase } from '@/integrations/supabase/client';

interface DebugReport {
  step: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  data?: any;
  error?: any;
  timestamp: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  trail?: any;
}

interface ImportSummary {
  totalFetched: number;
  schemaValidated: number;
  successfullyInserted: number;
  failureReasons: Record<string, number>;
  successRate: number;
  sourceBreakdown: Record<string, { fetched: number; inserted: number; failed: number }>;
}

export class DebugImportService {
  private reports: DebugReport[] = [];
  private timeouts = new Map<string, NodeJS.Timeout>();

  private log(step: string, status: 'success' | 'error' | 'warning', message: string, data?: any, error?: any) {
    const report: DebugReport = {
      step,
      status,
      message,
      data,
      error,
      timestamp: new Date().toISOString()
    };
    this.reports.push(report);
    console.log(`[${status.toUpperCase()}] ${step}: ${message}`, data || error || '');
  }

  // Step 1: Validate Environment with masked values
  async validateEnvironment(): Promise<boolean> {
    this.log('Environment', 'success', 'Starting environment validation');
    
    try {
      // Check and mask Supabase environment variables
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      this.log('Environment', 'success', 'Environment variables check', { 
        SUPABASE_URL: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...***` : 'MISSING',
        SUPABASE_KEY: supabaseKey ? `${supabaseKey.substring(0, 10)}...*** (${supabaseKey.length} chars)` : 'MISSING'
      });

      if (!supabaseUrl || !supabaseKey) {
        this.log('Environment', 'error', 'Critical Supabase environment variables missing');
        return false;
      }

      // Test database connectivity with simple SELECT
      const { data, error } = await supabase
        .from('trails')
        .select('id, name, source')
        .limit(5);

      if (error) {
        this.log('Environment', 'error', 'Database connectivity failed', null, error);
        return false;
      }

      this.log('Environment', 'success', 'Database connectivity confirmed', { 
        currentTrailCount: data?.length || 0,
        sampleTrails: data?.map(t => ({ id: t.id, name: t.name, source: t.source })) || []
      });

      // Check data sources table and log available sources
      const { data: sources, error: sourcesError } = await supabase
        .from('trail_data_sources')
        .select('*')
        .eq('is_active', true);

      if (sourcesError) {
        this.log('Environment', 'error', 'Failed to fetch data sources', null, sourcesError);
        return false;
      }

      this.log('Environment', 'success', 'Data sources validated', {
        activeSourceCount: sources?.length || 0,
        sources: sources?.map(s => ({ 
          type: s.source_type, 
          name: s.name,
          country: s.country,
          hasConfig: !!s.config 
        })) || []
      });

      return true;
    } catch (error) {
      this.log('Environment', 'error', 'Environment validation failed', null, error);
      return false;
    }
  }

  // Step 2: Single Record Import Test with full error exposure
  async testSingleRecordImport(): Promise<boolean> {
    this.log('SingleRecord', 'success', 'Starting single record import test for each source');

    try {
      // Get the three specific sources we're debugging
      const { data: sources, error } = await supabase
        .from('trail_data_sources')
        .select('*')
        .in('source_type', ['parks_canada', 'inegi_mexico', 'trails_bc'])
        .eq('is_active', true);

      if (error || !sources?.length) {
        this.log('SingleRecord', 'error', 'Target sources not found', null, error);
        return false;
      }

      this.log('SingleRecord', 'success', `Found ${sources.length} target sources`, {
        sources: sources.map(s => s.source_type)
      });

      for (const source of sources) {
        this.log('SingleRecord', 'success', `Testing source: ${source.name}`);

        try {
          // Generate a single test trail for this specific source
          const testTrail = await this.generateSourceSpecificTestTrail(source);
          
          if (!testTrail) {
            this.log('SingleRecord', 'error', `Failed to generate test trail for ${source.name}`);
            continue;
          }

          this.log('SingleRecord', 'success', `Generated test trail for ${source.name}`, {
            trailName: testTrail.name,
            location: testTrail.location,
            source: testTrail.source,
            sourceId: testTrail.source_id
          });

          // Step 3: Schema validation with detailed error reporting
          const validation = this.validateTrailDataDetailed(testTrail);
          if (!validation.isValid) {
            this.log('SingleRecord', 'error', `Schema validation failed for ${source.name}`, {
              errors: validation.errors,
              trailData: testTrail
            });
            continue;
          }

          this.log('SingleRecord', 'success', `Schema validation passed for ${source.name}`);

          // Attempt insert with NO try/catch to surface exact errors
          this.log('SingleRecord', 'success', `Attempting database insert for ${source.name}...`);
          
          const { data: insertResult, error: insertError } = await supabase
            .from('trails')
            .insert([testTrail])
            .select('id, name, source');

          if (insertError) {
            this.log('SingleRecord', 'error', `Database insert failed for ${source.name}`, {
              errorCode: insertError.code,
              errorMessage: insertError.message,
              errorDetails: insertError.details,
              errorHint: insertError.hint,
              trail: testTrail
            }, insertError);
            continue;
          }

          this.log('SingleRecord', 'success', `Successfully inserted trail from ${source.name}`, {
            insertedId: insertResult?.[0]?.id,
            insertedName: insertResult?.[0]?.name,
            insertedSource: insertResult?.[0]?.source
          });

        } catch (sourceError) {
          this.log('SingleRecord', 'error', `Exception testing ${source.name}`, {
            errorName: sourceError instanceof Error ? sourceError.name : 'Unknown',
            errorMessage: sourceError instanceof Error ? sourceError.message : 'Unknown error',
            errorStack: sourceError instanceof Error ? sourceError.stack : undefined
          }, sourceError);
        }
      }

      return true;
    } catch (error) {
      this.log('SingleRecord', 'error', 'Single record test failed', null, error);
      return false;
    }
  }

  // Enhanced schema validation with detailed field-by-field checking
  private validateTrailDataDetailed(trail: any): ValidationResult {
    const errors: string[] = [];

    // Required string fields
    const requiredStringFields = ['name', 'location', 'country'];
    for (const field of requiredStringFields) {
      if (!trail[field] || typeof trail[field] !== 'string' || trail[field].trim() === '') {
        errors.push(`${field} is required and must be a non-empty string`);
      }
    }

    // Numeric fields validation
    const numericFields = ['latitude', 'longitude', 'length', 'length_km', 'elevation_gain', 'elevation'];
    for (const field of numericFields) {
      if (trail[field] !== null && trail[field] !== undefined) {
        const value = Number(trail[field]);
        if (isNaN(value)) {
          errors.push(`${field} must be a valid number, got: ${trail[field]} (${typeof trail[field]})`);
        }
      }
    }

    // Special validation for required numeric fields
    if (trail.length && (typeof trail.length !== 'number' || isNaN(trail.length) || trail.length <= 0)) {
      errors.push(`length must be a positive number, got: ${trail.length}`);
    }

    if (trail.elevation && (typeof trail.elevation !== 'number' || isNaN(trail.elevation))) {
      errors.push(`elevation must be a number, got: ${trail.elevation}`);
    }

    // Enum validation for difficulty
    const validDifficulties = ['easy', 'moderate', 'hard', 'expert'];
    if (trail.difficulty && !validDifficulties.includes(trail.difficulty)) {
      errors.push(`difficulty must be one of: ${validDifficulties.join(', ')}, got: ${trail.difficulty}`);
    }

    // Source validation
    if (!trail.source || typeof trail.source !== 'string') {
      errors.push(`source is required and must be a string, got: ${trail.source}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      trail
    };
  }

  // Generate source-specific test trail data
  private async generateSourceSpecificTestTrail(source: any): Promise<any> {
    const timestamp = Date.now();
    const baseTrail = {
      name: `Debug Test Trail ${timestamp}`,
      description: `Test trail generated for debugging ${source.name} import pipeline`,
      location: 'Test Location',
      country: 'Test Country',
      state_province: 'Test Province',
      length: 5.5,
      length_km: 8.8,
      elevation_gain: 300,
      elevation: 1200,
      difficulty: 'moderate' as const,
      latitude: 45.5236,
      longitude: -122.6750,
      surface: 'dirt',
      trail_type: 'hiking',
      source: source.source_type,
      source_id: `debug-${source.source_type}-${timestamp}`,
      geojson: null,
      is_age_restricted: false,
      last_updated: new Date().toISOString()
    };

    // Customize based on specific source type
    switch (source.source_type) {
      case 'parks_canada':
        return {
          ...baseTrail,
          name: `Banff Debug Trail ${timestamp}`,
          location: 'Banff National Park, Alberta',
          country: 'Canada',
          state_province: 'Alberta',
          latitude: 51.4968,
          longitude: -115.9281
        };
      case 'inegi_mexico':
        return {
          ...baseTrail,
          name: `Sierra Madre Debug Trail ${timestamp}`,
          location: 'Sierra Madre Oriental, Nuevo León',
          country: 'Mexico',
          state_province: 'Nuevo León',
          latitude: 25.6866,
          longitude: -100.3161
        };
      case 'trails_bc':
        return {
          ...baseTrail,
          name: `Whistler Debug Trail ${timestamp}`,
          location: 'Whistler Area, British Columbia',
          country: 'Canada',
          state_province: 'British Columbia',
          latitude: 50.1163,
          longitude: -122.9574
        };
      default:
        return baseTrail;
    }
  }

  // Step 4: Network & Timeout Checks with 30-second timeout and retry
  async testNetworkConnectivity(): Promise<boolean> {
    this.log('Network', 'success', 'Starting network connectivity tests with 30s timeout');

    const testUrls = [
      { url: 'https://httpbin.org/status/200', name: 'HTTPBin Status Check' },
      { url: 'https://api.github.com/zen', name: 'GitHub API Test' },
      { url: 'https://httpbin.org/delay/2', name: 'Timeout Test (2s delay)' }
    ];

    for (const test of testUrls) {
      let success = false;
      let attempt = 0;
      const maxAttempts = 2;

      while (!success && attempt < maxAttempts) {
        attempt++;
        try {
          this.log('Network', 'success', `Testing ${test.name} (attempt ${attempt}/${maxAttempts})`);

          const controller = new AbortController();
          const timeoutId = setTimeout(() => {
            controller.abort();
            this.log('Network', 'warning', `Request to ${test.name} timed out after 30 seconds`);
          }, 30000);

          const startTime = Date.now();
          const response = await fetch(test.url, {
            signal: controller.signal,
            headers: {
              'User-Agent': 'GreenTrails-Debug/1.0'
            }
          });

          const responseTime = Date.now() - startTime;
          clearTimeout(timeoutId);

          this.log('Network', response.ok ? 'success' : 'warning', 
            `${test.name} responded`, {
            status: response.status,
            statusText: response.statusText,
            responseTime: `${responseTime}ms`,
            headers: Object.fromEntries(response.headers.entries())
          });

          if (response.ok) {
            success = true;
          }

        } catch (error) {
          this.log('Network', 'error', `Network test failed for ${test.name} (attempt ${attempt})`, {
            errorName: error instanceof Error ? error.name : 'Unknown',
            errorMessage: error instanceof Error ? error.message : 'Unknown error'
          }, error);

          if (attempt === maxAttempts) {
            this.log('Network', 'error', `Final failure for ${test.name} after ${maxAttempts} attempts`);
          } else {
            // Wait 2 seconds before retry
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }
      }
    }

    return true;
  }

  // Step 5: Batch Import Test with progress reporting every 500 records
  async runBatchImportTest(targetCount: number = 10000): Promise<ImportSummary> {
    this.log('BatchImport', 'success', `Starting batch import test for ${targetCount} trails with progress reporting`);

    const summary: ImportSummary = {
      totalFetched: 0,
      schemaValidated: 0,
      successfullyInserted: 0,
      failureReasons: {},
      successRate: 0,
      sourceBreakdown: {}
    };

    try {
      // Trigger the bootstrap function for the 10K import
      const { data: bootstrapResult, error: bootstrapError } = await supabase.functions.invoke('bootstrap-trail-database', {
        body: {
          immediate: true,
          target: '10K',
          debug: true,
          progressReporting: true,
          progressInterval: 500
        }
      });

      if (bootstrapError) {
        this.log('BatchImport', 'error', 'Bootstrap function failed', null, bootstrapError);
        return summary;
      }

      this.log('BatchImport', 'success', 'Bootstrap function executed', bootstrapResult);

      // Monitor progress for up to 15 minutes with detailed reporting
      const startTime = Date.now();
      const maxWaitTime = 15 * 60 * 1000; // 15 minutes
      let lastReportedProgress = 0;

      while (Date.now() - startTime < maxWaitTime) {
        // Check bulk import job status
        const { data: jobs, error: jobError } = await supabase
          .from('bulk_import_jobs')
          .select('*')
          .order('started_at', { ascending: false })
          .limit(1);

        if (jobError) {
          this.log('BatchImport', 'warning', 'Could not check job status', null, jobError);
          break;
        }

        if (jobs && jobs.length > 0) {
          const job = jobs[0];
          summary.totalFetched = job.trails_processed || 0;
          summary.successfullyInserted = job.trails_added || 0;
          summary.successRate = summary.totalFetched > 0 ? (summary.successfullyInserted / summary.totalFetched) * 100 : 0;

          // Progress reporting every 500 records or significant changes
          if (summary.totalFetched - lastReportedProgress >= 500 || job.status !== 'processing') {
            this.log('BatchImport', 'success', `Progress update (every 500 records)`, {
              processed: summary.totalFetched,
              added: summary.successfullyInserted,
              failed: job.trails_failed || 0,
              successRate: `${summary.successRate.toFixed(1)}%`,
              status: job.status,
              elapsedTime: `${Math.round((Date.now() - startTime) / 1000)}s`
            });
            lastReportedProgress = summary.totalFetched;
          }

          // Check if success rate drops below 80% and we have enough data
          if (summary.totalFetched > 1000 && summary.successRate < 80) {
            this.log('BatchImport', 'warning', `Success rate ${summary.successRate.toFixed(1)}% below 80% threshold - pausing for analysis`);
            
            // Get recent failure logs if available
            const { data: recentJobs } = await supabase
              .from('trail_import_jobs')
              .select('*')
              .eq('status', 'error')
              .order('completed_at', { ascending: false })
              .limit(100);

            if (recentJobs) {
              this.log('BatchImport', 'warning', `Last 100 failure logs`, {
                failureCount: recentJobs.length,
                recentFailures: recentJobs.slice(0, 10).map(job => ({
                  source: job.source_id,
                  error: job.error_message,
                  timestamp: job.completed_at
                }))
              });
            }
            break;
          }

          if (job.status === 'completed' || job.status === 'error') {
            this.log('BatchImport', job.status === 'completed' ? 'success' : 'error', 
              `Batch import ${job.status}`, {
                finalStats: {
                  processed: job.trails_processed,
                  added: job.trails_added,
                  failed: job.trails_failed,
                  successRate: `${summary.successRate.toFixed(1)}%`,
                  totalTime: `${Math.round((Date.now() - startTime) / 1000)}s`
                }
              });
            break;
          }
        }

        // Wait 5 seconds before checking again
        await new Promise(resolve => setTimeout(resolve, 5000));
      }

      // Final evaluation
      if (summary.successRate >= 80) {
        this.log('BatchImport', 'success', `SUCCESS: Achieved ${summary.successRate.toFixed(1)}% success rate (target: 80%)`);
      } else {
        this.log('BatchImport', 'error', `FAILED: Only achieved ${summary.successRate.toFixed(1)}% success rate (target: 80%)`);
      }

    } catch (error) {
      this.log('BatchImport', 'error', 'Batch import test failed', null, error);
    }

    return summary;
  }

  // Step 6: Generate comprehensive summary report
  generateSummaryReport(summary: ImportSummary): string {
    const successCount = this.reports.filter(r => r.status === 'success').length;
    const errorCount = this.reports.filter(r => r.status === 'error').length;
    const warningCount = this.reports.filter(r => r.status === 'warning').length;

    const report = `
=== TRAIL IMPORT DEBUG SUMMARY ===
Generated: ${new Date().toISOString()}
Target: 8,000+ successful imports out of 10,000 trails (80% success rate)

OVERALL TEST RESULTS:
✅ Success Steps: ${successCount}
❌ Error Steps: ${errorCount}
⚠️  Warning Steps: ${warningCount}

IMPORT STATISTICS:
• Records Fetched: ${summary.totalFetched.toLocaleString()}
• Schema Validated: ${summary.schemaValidated.toLocaleString()}
• Successfully Inserted: ${summary.successfullyInserted.toLocaleString()}
• Success Rate: ${summary.successRate.toFixed(1)}%

SOURCE BREAKDOWN:
${Object.entries(summary.sourceBreakdown)
  .map(([source, stats]) => `• ${source}: ${stats.inserted}/${stats.fetched} (${((stats.inserted/stats.fetched)*100).toFixed(1)}%)`)
  .join('\n')}

TOP FAILURE REASONS:
${Object.entries(summary.failureReasons)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 5)
  .map(([reason, count], i) => `${i + 1}. ${reason}: ${count} occurrences`)
  .join('\n')}

DETAILED EXECUTION LOG:
${this.reports.map(r => 
  `[${r.timestamp}] ${r.status.toUpperCase()} - ${r.step}: ${r.message}`
).join('\n')}

RECOMMENDATION:
${summary.successRate >= 80 
  ? '✅ SYSTEM READY - Proceed with 30K trail import' 
  : '❌ SYSTEM REQUIRES FIXES - Address failure points before scaling up'}

TARGET STATUS: ${summary.successRate >= 80 ? '✅ ACHIEVED' : '❌ NOT MET'} (Target: 80%, Actual: ${summary.successRate.toFixed(1)}%)

Next Steps: ${summary.successRate >= 80 
  ? 'Automatically scale up to 30,000 trail import' 
  : 'Fix identified issues and re-run debug sequence'}
    `;

    this.log('Summary', 'success', 'Comprehensive debug report generated', { 
      reportLength: report.length,
      meetsCriteria: summary.successRate >= 80
    });
    
    return report;
  }

  // Main debug runner implementing all 6 steps
  async runFullDebugSequence(): Promise<string> {
    console.log('🔍 Starting comprehensive trail import debug sequence...');

    // Step 1: Environment validation
    const envValid = await this.validateEnvironment();
    if (!envValid) {
      return this.generateSummaryReport({
        totalFetched: 0,
        schemaValidated: 0,
        successfullyInserted: 0,
        failureReasons: { 'Environment validation failed': 1 },
        successRate: 0,
        sourceBreakdown: {}
      });
    }

    // Step 2: Single record test with detailed error surfacing
    await this.testSingleRecordImport();

    // Step 4: Network tests with timeout and retry
    await this.testNetworkConnectivity();

    // Step 5: Batch import test with progress reporting every 500 records
    const summary = await this.runBatchImportTest(10000);

    // Step 6: Generate comprehensive report
    return this.generateSummaryReport(summary);
  }

  getReports(): DebugReport[] {
    return this.reports;
  }
}
