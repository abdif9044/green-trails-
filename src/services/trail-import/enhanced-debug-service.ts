
import { supabase } from '@/integrations/supabase/client';

interface DetailedFailureLog {
  trailId: string;
  source: string;
  failureReason: string;
  validationErrors: string[];
  timestamp: string;
  trailData: any;
}

interface EnhancedImportSummary {
  totalProcessed: number;
  successfullyInserted: number;
  validationFailures: number;
  databaseFailures: number;
  permissionFailures: number;
  detailedFailures: DetailedFailureLog[];
  successRate: number;
}

export class EnhancedDebugImportService {
  private failureLog: DetailedFailureLog[] = [];

  // Test database permissions and RLS policies
  async testDatabasePermissions(): Promise<{ hasPermissions: boolean; errors: string[] }> {
    const errors: string[] = [];

    try {
      console.log('🔍 Testing fixed RLS permissions for global trail access...');

      // Test basic SELECT permission (should work for authenticated users)
      const { data: selectTest, error: selectError } = await supabase
        .from('trails')
        .select('id')
        .limit(1);

      if (selectError) {
        errors.push(`SELECT permission failed: ${selectError.message}`);
      } else {
        console.log('✅ SELECT permission: OK');
      }

      // Test the permissions check function
      const { data: permTest, error: permError } = await supabase
        .rpc('test_trail_permissions');

      if (permError) {
        errors.push(`Permission test function failed: ${permError.message}`);
      } else {
        console.log('✅ Permission test function: OK', permTest);
      }

      // Test if we can call the massive import function (this will use service role)
      try {
        const { data: importTest, error: importError } = await supabase.functions.invoke('import-trails-massive', {
          body: {
            sources: ['test_source'],
            maxTrailsPerSource: 1,
            debug: true,
            validation: true
          }
        });

        if (importError) {
          errors.push(`Service role import test failed: ${importError.message}`);
        } else {
          console.log('✅ Service role import function: OK');
        }
      } catch (invokeError) {
        errors.push(`Import function invocation failed: ${invokeError instanceof Error ? invokeError.message : 'Unknown error'}`);
      }

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      errors.push(`Permission test exception: ${errorMsg}`);
      console.error('💥 Permission test exception:', error);
    }

    const hasPermissions = errors.length === 0;
    console.log(hasPermissions ? '🎉 All permissions tests passed!' : '🚨 Permission issues detected:', errors);

    return {
      hasPermissions,
      errors
    };
  }

  // Enhanced batch import using the fixed service role function
  async runEnhancedBatchImport(targetCount: number = 1000): Promise<EnhancedImportSummary> {
    console.log(`🔍 Starting enhanced batch import of ${targetCount} trails using service role`);
    
    const summary: EnhancedImportSummary = {
      totalProcessed: 0,
      successfullyInserted: 0,
      validationFailures: 0,
      databaseFailures: 0,
      permissionFailures: 0,
      detailedFailures: [],
      successRate: 0
    };

    this.failureLog = []; // Reset failure log

    try {
      // Test database permissions first
      console.log('🔐 Testing database permissions...');
      const permissionTest = await this.testDatabasePermissions();
      if (!permissionTest.hasPermissions) {
        console.error('❌ Database permission issues detected:', permissionTest.errors);
        summary.permissionFailures = 1;
        summary.detailedFailures = [{
          trailId: 'permission-test',
          source: 'system',
          failureReason: 'Database permissions failed',
          validationErrors: permissionTest.errors,
          timestamp: new Date().toISOString(),
          trailData: null
        }];
        return summary;
      }

      // Call the massive import function with service role
      console.log('🚀 Calling massive import with service role authentication...');
      
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
        console.error('❌ Massive import function failed:', importError);
        summary.databaseFailures = 1;
        this.logFailure('massive-import', 'service-function', 'Massive import function failed', [importError.message], null);
      } else if (importResult) {
        console.log('✅ Massive import completed:', importResult);
        
        summary.totalProcessed = importResult.total_processed || 0;
        summary.successfullyInserted = importResult.total_added || 0;
        summary.databaseFailures = importResult.total_failed || 0;
        
        // Calculate success rate
        summary.successRate = summary.totalProcessed > 0 ? (summary.successfullyInserted / summary.totalProcessed) * 100 : 0;
      }

      // Log final results
      console.log(`🎉 Enhanced import completed:`, {
        processed: summary.totalProcessed,
        inserted: summary.successfullyInserted,
        successRate: `${summary.successRate.toFixed(1)}%`,
        failures: summary.detailedFailures.length
      });

    } catch (error) {
      console.error('💥 Enhanced batch import failed:', error);
      summary.databaseFailures = 1;
      this.logFailure('batch-import', 'system', 'Batch import exception', [error instanceof Error ? error.message : 'Unknown error'], null);
    }

    summary.detailedFailures = this.failureLog;
    return summary;
  }

  private logFailure(trailId: string, source: string, reason: string, errors: string[], trailData: any) {
    this.failureLog.push({
      trailId,
      source,
      failureReason: reason,
      validationErrors: errors,
      timestamp: new Date().toISOString(),
      trailData
    });
  }

  // Generate detailed debug report
  generateDetailedReport(summary: EnhancedImportSummary): string {
    const report = `
=== ENHANCED TRAIL IMPORT DEBUG REPORT ===
Generated: ${new Date().toISOString()}

🎯 TARGET: Fix RLS permissions and enable 30K+ trail imports

📊 IMPORT STATISTICS:
• Total Processed: ${summary.totalProcessed.toLocaleString()}
• Successfully Inserted: ${summary.successfullyInserted.toLocaleString()}
• Success Rate: ${summary.successRate.toFixed(1)}%

❌ FAILURE BREAKDOWN:
• Validation Failures: ${summary.validationFailures}
• Database Failures: ${summary.databaseFailures}
• Permission Failures: ${summary.permissionFailures}

🔧 RLS FIX STATUS:
${summary.permissionFailures === 0 
  ? '✅ RLS policies are working correctly - service role can import trails' 
  : '❌ RLS policies still blocking imports - check service role configuration'}

💡 SERVICE ROLE AUTHENTICATION:
${summary.successfullyInserted > 0 
  ? '✅ Service role bypass is working - imports are succeeding'
  : '❌ Service role may not be configured correctly'}

🎯 NEXT STEPS:
${summary.successRate >= 80 
  ? '✅ SUCCESS! Ready for 30K trail preload on user signup' 
  : '❌ ISSUES DETECTED - Check service role key and RLS policies'}

📋 DETAILED FAILURE LOG:
${summary.detailedFailures.length > 0 
  ? summary.detailedFailures.slice(-5).map((failure, i) => 
      `${i + 1}. ${failure.source} - ${failure.failureReason}
         Trail: ${failure.trailId}
         Errors: ${failure.validationErrors.join(', ')}
         Time: ${failure.timestamp}
      `).join('\n')
  : 'No failures detected'}

🔑 CONFIGURATION CHECKLIST:
• Service role key in environment: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅' : '❌'}
• RLS enabled on trails table: Expected ✅
• Service role can bypass RLS: ${summary.successfullyInserted > 0 ? '✅' : '❌'}
• Global trail access for users: Expected ✅

${summary.successRate >= 80 
  ? '🚀 READY FOR PRODUCTION: 30K trail preload can be enabled!' 
  : '🔧 NEEDS FIXES: Address the issues above before enabling 30K preload'}
    `;

    return report;
  }
}
