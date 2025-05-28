
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

  // Step 1: Validate Environment
  async validateEnvironment(): Promise<boolean> {
    this.log('Environment', 'success', 'Starting environment validation');
    
    try {
      // Check Supabase environment
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      this.log('Environment', 'success', 'Supabase URL found', { 
        url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'MISSING',
        keyLength: supabaseKey ? `${supabaseKey.length} chars` : 'MISSING'
      });

      // Test database connectivity
      const { data, error } = await supabase
        .from('trails')
        .select('id, name')
        .limit(1);

      if (error) {
        this.log('Environment', 'error', 'Database connectivity failed', null, error);
        return false;
      }

      this.log('Environment', 'success', 'Database connectivity confirmed', { 
        currentTrailCount: data?.length || 0 
      });

      // Check data sources table
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
        sources: sources?.map(s => s.source_type) || []
      });

      return true;
    } catch (error) {
      this.log('Environment', 'error', 'Environment validation failed', null, error);
      return false;
    }
  }

  // Step 2: Single Record Import Test
  async testSingleRecordImport(): Promise<boolean> {
    this.log('SingleRecord', 'success', 'Starting single record import test');

    try {
      // Get active data sources
      const { data: sources, error } = await supabase
        .from('trail_data_sources')
        .select('*')
        .eq('is_active', true)
        .limit(3);

      if (error || !sources?.length) {
        this.log('SingleRecord', 'error', 'No active data sources found', null, error);
        return false;
      }

      for (const source of sources) {
        this.log('SingleRecord', 'success', `Testing source: ${source.name}`, { sourceType: source.source_type });

        try {
          // Generate a single test trail for this source
          const testTrail = await this.generateSingleTestTrail(source);
          
          if (!testTrail) {
            this.log('SingleRecord', 'error', `Failed to generate test trail for ${source.name}`);
            continue;
          }

          this.log('SingleRecord', 'success', `Generated test trail for ${source.name}`, {
            trailName: testTrail.name,
            location: testTrail.location
          });

          // Validate the trail data
          const validation = this.validateTrailData(testTrail);
          if (!validation.isValid) {
            this.log('SingleRecord', 'error', `Validation failed for ${source.name}`, {
              errors: validation.errors,
              trail: testTrail
            });
            continue;
          }

          // Attempt to insert with no error handling to surface schema issues
          const { data: insertResult, error: insertError } = await supabase
            .from('trails')
            .insert([testTrail])
            .select('id, name');

          if (insertError) {
            this.log('SingleRecord', 'error', `Insert failed for ${source.name}`, {
              trail: testTrail,
              errorCode: insertError.code,
              errorMessage: insertError.message,
              errorDetails: insertError.details,
              errorHint: insertError.hint
            }, insertError);
            continue;
          }

          this.log('SingleRecord', 'success', `Successfully inserted trail from ${source.name}`, {
            insertedId: insertResult?.[0]?.id,
            insertedName: insertResult?.[0]?.name
          });
        } catch (sourceError) {
          this.log('SingleRecord', 'error', `Exception testing ${source.name}`, null, sourceError);
        }
      }

      return true;
    } catch (error) {
      this.log('SingleRecord', 'error', 'Single record test failed', null, error);
      return false;
    }
  }

  // Step 3: Schema Validation
  private validateTrailData(trail: any): ValidationResult {
    const errors: string[] = [];

    // Required fields
    if (!trail.name || typeof trail.name !== 'string') {
      errors.push('name is required and must be a string');
    }
    if (!trail.location || typeof trail.location !== 'string') {
      errors.push('location is required and must be a string');
    }
    if (!trail.country || typeof trail.country !== 'string') {
      errors.push('country is required and must be a string');
    }

    // Numeric fields
    if (trail.latitude && (typeof trail.latitude !== 'number' || isNaN(trail.latitude))) {
      errors.push('latitude must be a valid number');
    }
    if (trail.longitude && (typeof trail.longitude !== 'number' || isNaN(trail.longitude))) {
      errors.push('longitude must be a valid number');
    }
    if (trail.length && (typeof trail.length !== 'number' || isNaN(trail.length) || trail.length < 0)) {
      errors.push('length must be a positive number');
    }
    if (trail.length_km && (typeof trail.length_km !== 'number' || isNaN(trail.length_km) || trail.length_km < 0)) {
      errors.push('length_km must be a positive number');
    }
    if (trail.elevation_gain && (typeof trail.elevation_gain !== 'number' || isNaN(trail.elevation_gain))) {
      errors.push('elevation_gain must be a number');
    }

    // Enum validation
    const validDifficulties = ['easy', 'moderate', 'hard', 'expert'];
    if (trail.difficulty && !validDifficulties.includes(trail.difficulty)) {
      errors.push(`difficulty must be one of: ${validDifficulties.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      trail
    };
  }

  // Generate test trail data
  private async generateSingleTestTrail(source: any): Promise<any> {
    const baseTrail = {
      name: `Debug Test Trail ${Date.now()}`,
      description: `Test trail generated for debugging ${source.name}`,
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
      source_id: `debug-${source.source_type}-${Date.now()}`,
      geojson: null,
      is_age_restricted: false,
      last_updated: new Date().toISOString()
    };

    // Customize based on source type
    switch (source.source_type) {
      case 'parks_canada':
        return {
          ...baseTrail,
          name: 'Banff Debug Trail',
          location: 'Banff National Park, Alberta',
          country: 'Canada',
          state_province: 'Alberta'
        };
      case 'inegi_mexico':
        return {
          ...baseTrail,
          name: 'Sierra Madre Debug Trail',
          location: 'Sierra Madre Oriental, Nuevo León',
          country: 'Mexico',
          state_province: 'Nuevo León'
        };
      case 'trails_bc':
        return {
          ...baseTrail,
          name: 'Whistler Debug Trail',
          location: 'Whistler Area, British Columbia',
          country: 'Canada',
          state_province: 'British Columbia'
        };
      default:
        return baseTrail;
    }
  }

  // Step 4: Network & Timeout Checks
  async testNetworkConnectivity(): Promise<boolean> {
    this.log('Network', 'success', 'Starting network connectivity tests');

    const testUrls = [
      'https://httpbin.org/status/200',
      'https://api.github.com/zen'
    ];

    for (const url of testUrls) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'GreenTrails-Debug/1.0'
          }
        });

        clearTimeout(timeoutId);

        this.log('Network', response.ok ? 'success' : 'warning', 
          `${url} responded`, {
            status: response.status,
            statusText: response.statusText
          });

      } catch (error) {
        this.log('Network', 'error', `Network test failed for ${url}`, null, error);
      }
    }

    return true;
  }

  // Step 5: Batch Import Test
  async runBatchImportTest(targetCount: number = 10000): Promise<ImportSummary> {
    this.log('BatchImport', 'success', `Starting batch import test for ${targetCount} trails`);

    const summary: ImportSummary = {
      totalFetched: 0,
      schemaValidated: 0,
      successfullyInserted: 0,
      failureReasons: {},
      successRate: 0
    };

    try {
      // Trigger the bootstrap function which should start the massive import
      const { data: bootstrapResult, error: bootstrapError } = await supabase.functions.invoke('bootstrap-trail-database', {
        body: {
          immediate: true,
          target: '10K',
          debug: true
        }
      });

      if (bootstrapError) {
        this.log('BatchImport', 'error', 'Bootstrap function failed', null, bootstrapError);
        return summary;
      }

      this.log('BatchImport', 'success', 'Bootstrap function executed', bootstrapResult);

      // Monitor progress for up to 10 minutes
      const startTime = Date.now();
      const maxWaitTime = 10 * 60 * 1000; // 10 minutes

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

          this.log('BatchImport', 'success', `Progress update`, {
            processed: summary.totalFetched,
            added: summary.successfullyInserted,
            failed: job.trails_failed || 0,
            successRate: `${summary.successRate.toFixed(1)}%`,
            status: job.status
          });

          if (job.status === 'completed' || job.status === 'error') {
            this.log('BatchImport', job.status === 'completed' ? 'success' : 'error', 
              `Batch import ${job.status}`, {
                finalStats: {
                  processed: job.trails_processed,
                  added: job.trails_added,
                  failed: job.trails_failed,
                  successRate: `${summary.successRate.toFixed(1)}%`
                }
              });
            break;
          }
        }

        // Wait 5 seconds before checking again
        await new Promise(resolve => setTimeout(resolve, 5000));
      }

      // Check if we hit our success target
      if (summary.successRate < 80) {
        this.log('BatchImport', 'warning', `Success rate ${summary.successRate.toFixed(1)}% below 80% target`);
      } else {
        this.log('BatchImport', 'success', `Success rate ${summary.successRate.toFixed(1)}% meets 80% target`);
      }

    } catch (error) {
      this.log('BatchImport', 'error', 'Batch import test failed', null, error);
    }

    return summary;
  }

  // Step 6: Generate Summary Report
  generateSummaryReport(summary: ImportSummary): string {
    const successCount = this.reports.filter(r => r.status === 'success').length;
    const errorCount = this.reports.filter(r => r.status === 'error').length;
    const warningCount = this.reports.filter(r => r.status === 'warning').length;

    const report = `
=== TRAIL IMPORT DEBUG SUMMARY ===
Generated: ${new Date().toISOString()}

OVERALL RESULTS:
✅ Success Steps: ${successCount}
❌ Error Steps: ${errorCount}
⚠️  Warning Steps: ${warningCount}

IMPORT STATISTICS:
• Records Fetched: ${summary.totalFetched}
• Schema Validated: ${summary.schemaValidated}
• Successfully Inserted: ${summary.successfullyInserted}
• Success Rate: ${summary.successRate.toFixed(1)}%

TOP FAILURE REASONS:
${Object.entries(summary.failureReasons)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 3)
  .map(([reason, count], i) => `${i + 1}. ${reason}: ${count} occurrences`)
  .join('\n')}

DETAILED LOG:
${this.reports.map(r => 
  `[${r.timestamp}] ${r.status.toUpperCase()} - ${r.step}: ${r.message}`
).join('\n')}

TARGET STATUS: ${summary.successRate >= 80 ? '✅ ACHIEVED' : '❌ NOT MET'} (Target: 80%, Actual: ${summary.successRate.toFixed(1)}%)
    `;

    this.log('Summary', 'success', 'Debug report generated', { report });
    return report;
  }

  // Main debug runner
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
        successRate: 0
      });
    }

    // Step 2: Single record test
    await this.testSingleRecordImport();

    // Step 3: Network tests
    await this.testNetworkConnectivity();

    // Step 4: Batch import test
    const summary = await this.runBatchImportTest(10000);

    // Step 5: Generate final report
    return this.generateSummaryReport(summary);
  }

  getReports(): DebugReport[] {
    return this.reports;
  }
}
