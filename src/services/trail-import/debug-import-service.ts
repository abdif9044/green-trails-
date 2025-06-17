
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

  async validateEnvironment(): Promise<boolean> {
    this.log('Environment', 'success', 'Starting environment validation');
    
    try {
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

      // Test database connectivity - use existing columns only
      const { data, error } = await supabase
        .from('trails')
        .select('id, name')
        .limit(5);

      if (error) {
        this.log('Environment', 'error', 'Database connectivity failed', null, error);
        return false;
      }

      this.log('Environment', 'success', 'Database connectivity confirmed', { 
        currentTrailCount: data?.length || 0,
        sampleTrails: data?.map(t => ({ id: t.id, name: t.name })) || []
      });

      return true;
    } catch (error) {
      this.log('Environment', 'error', 'Environment validation failed', null, error);
      return false;
    }
  }

  async testSingleRecordImport(): Promise<boolean> {
    this.log('SingleRecord', 'success', 'Starting single record import test');

    try {
      // Generate a test trail with only required columns
      const testTrail = {
        name: `Debug Test Trail ${Date.now()}`,
        location: 'Test Location',
        country: 'Test Country',
        length: 5.5,
        elevation: 1200,
        difficulty: 'moderate' as const,
        latitude: 45.5236,
        longitude: -122.6750
      };

      // Validate the trail data
      const validation = this.validateTrailDataDetailed(testTrail);
      if (!validation.isValid) {
        this.log('SingleRecord', 'error', 'Schema validation failed', {
          errors: validation.errors,
          trailData: testTrail
        });
        return false;
      }

      this.log('SingleRecord', 'success', 'Schema validation passed');

      // Attempt insert
      const { data: insertResult, error: insertError } = await supabase
        .from('trails')
        .insert([testTrail])
        .select('id, name');

      if (insertError) {
        this.log('SingleRecord', 'error', 'Database insert failed', {
          errorCode: insertError.code,
          errorMessage: insertError.message,
          trail: testTrail
        }, insertError);
        return false;
      }

      this.log('SingleRecord', 'success', 'Successfully inserted test trail', {
        insertedId: insertResult?.[0]?.id,
        insertedName: insertResult?.[0]?.name
      });

      // Clean up test trail
      if (insertResult?.[0]?.id) {
        await supabase.from('trails').delete().eq('id', insertResult[0].id);
      }

      return true;
    } catch (error) {
      this.log('SingleRecord', 'error', 'Single record test failed', null, error);
      return false;
    }
  }

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
    const numericFields = ['latitude', 'longitude', 'length', 'elevation'];
    for (const field of numericFields) {
      if (trail[field] !== null && trail[field] !== undefined) {
        const value = Number(trail[field]);
        if (isNaN(value)) {
          errors.push(`${field} must be a valid number, got: ${trail[field]} (${typeof trail[field]})`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      trail
    };
  }

  async testNetworkConnectivity(): Promise<boolean> {
    this.log('Network', 'success', 'Starting network connectivity tests with 30s timeout');

    const testUrls = [
      { url: 'https://httpbin.org/status/200', name: 'HTTPBin Status Check' },
      { url: 'https://api.github.com/zen', name: 'GitHub API Test' }
    ];

    for (const test of testUrls) {
      try {
        this.log('Network', 'success', `Testing ${test.name}`);

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
          responseTime: `${responseTime}ms`
        });

      } catch (error) {
        this.log('Network', 'error', `Network test failed for ${test.name}`, {
          errorName: error instanceof Error ? error.name : 'Unknown',
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        }, error);
      }
    }

    return true;
  }

  async runBatchImportTest(targetCount: number = 1000): Promise<ImportSummary> {
    this.log('BatchImport', 'success', `Starting batch import test for ${targetCount} trails`);
    
    const summary: ImportSummary = {
      totalFetched: 0,
      schemaValidated: 0,
      successfullyInserted: 0,
      failureReasons: {},
      successRate: 0,
      sourceBreakdown: {}
    };

    try {
      const { data: importResult, error: importError } = await supabase.functions.invoke('import-trails-massive', {
        body: {
          sources: ['hiking_project', 'openstreetmap', 'usgs'],
          maxTrailsPerSource: Math.ceil(targetCount / 3),
          batchSize: 50,
          concurrency: 1,
          target: `${targetCount} Trail Test`,
          debug: true,
          validation: true
        }
      });

      if (importError) {
        this.log('BatchImport', 'error', 'Massive import function failed', null, importError);
        summary.failureReasons['massive_import_failed'] = 1;
      } else if (importResult) {
        this.log('BatchImport', 'success', 'Massive import completed', importResult);
        
        summary.totalFetched = importResult.total_processed || 0;
        summary.successfullyInserted = importResult.total_added || 0;
        summary.successRate = summary.totalFetched > 0 ? (summary.successfullyInserted / summary.totalFetched) * 100 : 0;
      }

    } catch (error) {
      this.log('BatchImport', 'error', 'Batch import test failed', null, error);
      summary.failureReasons['batch_import_exception'] = 1;
    }

    return summary;
  }

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

TOP FAILURE REASONS:
${Object.entries(summary.failureReasons)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 5)
  .map(([reason, count], i) => `${i + 1}. ${reason}: ${count} occurrences`)
  .join('\n')}

TARGET STATUS: ${summary.successRate >= 80 ? '✅ ACHIEVED' : '❌ NOT MET'} (Target: 80%, Actual: ${summary.successRate.toFixed(1)}%)
    `;

    this.log('Summary', 'success', 'Comprehensive debug report generated', { 
      reportLength: report.length,
      meetsCriteria: summary.successRate >= 80
    });
    
    return report;
  }

  async runFullDebugSequence(): Promise<string> {
    console.log('🔍 Starting comprehensive trail import debug sequence...');

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

    await this.testSingleRecordImport();
    await this.testNetworkConnectivity();
    const summary = await this.runBatchImportTest(1000);

    return this.generateSummaryReport(summary);
  }

  getReports(): DebugReport[] {
    return this.reports;
  }
}
