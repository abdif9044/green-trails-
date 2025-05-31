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
      console.log('🔍 Testing database permissions and RLS policies...');

      // Test basic SELECT permission
      const { data: selectTest, error: selectError } = await supabase
        .from('trails')
        .select('id')
        .limit(1);

      if (selectError) {
        errors.push(`SELECT permission failed: ${selectError.message}`);
      } else {
        console.log('✅ SELECT permission: OK');
      }

      // Test RLS permission check function
      const { data: rlsTest, error: rlsError } = await supabase
        .rpc('test_trail_insert_permissions');

      if (rlsError) {
        errors.push(`RLS test function failed: ${rlsError.message}`);
      } else {
        console.log('✅ RLS test function: OK', rlsTest);
      }

      // Test INSERT permission with a detailed test record
      const testTrail = {
        name: `RLS Permission Test ${Date.now()}`,
        location: 'Test Location for RLS',
        country: 'Test Country',
        difficulty: 'moderate',
        length: 1.5,
        elevation: 100,
        source: 'rls_test',
        source_id: `rls-test-${Date.now()}`,
        last_updated: new Date().toISOString(),
        trail_type: 'hiking',
        is_age_restricted: false
      };

      console.log('🧪 Testing INSERT with test trail...', testTrail);

      const { data: insertTest, error: insertError } = await supabase
        .from('trails')
        .insert([testTrail])
        .select('id, name, source')
        .single();

      if (insertError) {
        errors.push(`INSERT permission failed: ${insertError.message} (Code: ${insertError.code})`);
        console.error('❌ INSERT failed:', insertError);
        
        // Check if it's an RLS policy violation
        if (insertError.message.includes('row-level security') || insertError.code === '42501') {
          errors.push('RLS Policy Issue: The trails table INSERT policy is blocking imports. Run the RLS fix migration.');
        }
      } else if (insertTest?.id) {
        console.log('✅ INSERT permission: OK - Test trail inserted with ID:', insertTest.id);
        
        // Clean up test record
        const { error: deleteError } = await supabase
          .from('trails')
          .delete()
          .eq('id', insertTest.id);
          
        if (deleteError) {
          console.warn('⚠️ Could not clean up test record:', deleteError);
        } else {
          console.log('🧹 Test record cleaned up successfully');
        }
      } else {
        errors.push('INSERT succeeded but no data returned');
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

  // Core validation with detailed error reporting
  private validateTrailForInsertion(trail: any, source: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Critical required fields - these must exist
    if (!trail.name || typeof trail.name !== 'string' || trail.name.trim() === '') {
      errors.push('Missing or invalid trail name');
    }

    if (!trail.location || typeof trail.location !== 'string' || trail.location.trim() === '') {
      errors.push('Missing or invalid location');
    }

    if (!trail.country || typeof trail.country !== 'string' || trail.country.trim() === '') {
      errors.push('Missing or invalid country');
    }

    // Validate coordinates if present
    if (trail.latitude !== null && trail.latitude !== undefined) {
      const lat = Number(trail.latitude);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        errors.push(`Invalid latitude: ${trail.latitude}`);
      }
    }

    if (trail.longitude !== null && trail.longitude !== undefined) {
      const lng = Number(trail.longitude);
      if (isNaN(lng) || lng < -180 || lng > 180) {
        errors.push(`Invalid longitude: ${trail.longitude}`);
      }
    }

    // Validate numeric fields - convert invalid ones to null instead of failing
    const numericFields = ['length', 'length_km', 'elevation_gain', 'elevation'];
    numericFields.forEach(field => {
      if (trail[field] !== null && trail[field] !== undefined && trail[field] !== '') {
        const value = Number(trail[field]);
        if (isNaN(value) || value < 0) {
          console.warn(`Invalid ${field} value: ${trail[field]} for trail ${trail.name}, setting to null`);
          trail[field] = null; // Fix instead of failing
        }
      }
    });

    // Validate difficulty enum
    const validDifficulties = ['easy', 'moderate', 'hard', 'expert'];
    if (trail.difficulty && !validDifficulties.includes(trail.difficulty)) {
      console.warn(`Invalid difficulty: ${trail.difficulty} for trail ${trail.name}, setting to 'moderate'`);
      trail.difficulty = 'moderate'; // Fix instead of failing
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Enhanced trail insertion with detailed error tracking
  private async insertTrailWithDetailedLogging(trail: any, source: any): Promise<{ success: boolean; error?: string; trailId?: string }> {
    try {
      // Pre-insertion validation
      const validation = this.validateTrailForInsertion(trail, source.source_type);
      if (!validation.isValid) {
        this.logFailure(trail.id || 'unknown', source.source_type, 'Validation failed', validation.errors, trail);
        return { success: false, error: `Validation errors: ${validation.errors.join(', ')}` };
      }

      // Prepare trail data with explicit null handling
      const trailData = {
        name: trail.name.trim(),
        description: trail.description || null,
        location: trail.location.trim(),
        country: trail.country.trim(),
        state_province: trail.state_province || null,
        length_km: trail.length_km || trail.length || null,
        length: trail.length || trail.length_km || null,
        elevation_gain: trail.elevation_gain || null,
        elevation: trail.elevation || null,
        difficulty: trail.difficulty || 'moderate',
        geojson: trail.geojson || null,
        latitude: trail.latitude || null,
        longitude: trail.longitude || null,
        surface: trail.surface || null,
        trail_type: trail.trail_type || 'hiking',
        is_age_restricted: trail.is_age_restricted || false,
        source: source.source_type,
        source_id: trail.id || `generated-${Date.now()}-${Math.random()}`,
        last_updated: new Date().toISOString()
      };

      console.log(`🚀 Attempting to insert trail: ${trailData.name} from ${source.source_type}`);

      // Attempt database insertion with explicit error handling
      const { data, error } = await supabase
        .from('trails')
        .insert([trailData])
        .select('id, name, source')
        .single();

      if (error) {
        // Log specific database errors
        this.logFailure(
          trail.id || 'unknown', 
          source.source_type, 
          'Database insertion failed', 
          [error.message, error.code || 'unknown', error.details || 'no details'], 
          trailData
        );
        console.error(`❌ Database insertion failed for trail ${trailData.name}:`, error);
        return { success: false, error: error.message };
      }

      if (!data || !data.id) {
        this.logFailure(trail.id || 'unknown', source.source_type, 'No data returned from insert', ['Insert succeeded but no ID returned'], trailData);
        return { success: false, error: 'No data returned from insert' };
      }

      console.log(`✅ Successfully inserted trail: ${data.name} with ID: ${data.id}`);
      return { success: true, trailId: data.id };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logFailure(trail.id || 'unknown', source.source_type, 'Exception during insertion', [errorMessage], trail);
      console.error(`💥 Exception during trail insertion:`, error);
      return { success: false, error: errorMessage };
    }
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

  // Enhanced batch import with resilience
  async runEnhancedBatchImport(targetCount: number = 1000): Promise<EnhancedImportSummary> {
    console.log(`🔍 Starting enhanced batch import of ${targetCount} trails`);
    
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
      // First, test database permissions
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

      // Get active sources
      const { data: sources, error: sourcesError } = await supabase
        .from('trail_data_sources')
        .select('*')
        .eq('is_active', true)
        .limit(3); // Test with first 3 sources

      if (sourcesError || !sources?.length) {
        console.error('❌ Failed to fetch data sources:', sourcesError);
        return summary;
      }

      console.log(`📋 Found ${sources.length} active sources`);

      // Process each source with resilience
      const trailsPerSource = Math.ceil(targetCount / sources.length);

      for (const source of sources) {
        console.log(`⚙️ Processing source: ${source.name} (${source.source_type})`);
        
        try {
          // Generate realistic test trails for this source
          const trails = await this.generateRealisticTrailsForSource(source, trailsPerSource);
          summary.totalProcessed += trails.length;

          // Process trails individually with detailed logging
          for (const trail of trails) {
            const result = await this.insertTrailWithDetailedLogging(trail, source);
            
            if (result.success) {
              summary.successfullyInserted++;
            } else {
              if (result.error?.includes('validation') || result.error?.includes('Validation')) {
                summary.validationFailures++;
              } else {
                summary.databaseFailures++;
              }
            }

            // Add small delay to prevent overwhelming the database
            await new Promise(resolve => setTimeout(resolve, 10));
          }

        } catch (sourceError) {
          console.error(`💥 Error processing source ${source.name}:`, sourceError);
          this.logFailure('source-error', source.source_type, 'Source processing failed', [sourceError instanceof Error ? sourceError.message : 'Unknown error'], null);
        }
      }

      // Calculate final statistics
      summary.successRate = summary.totalProcessed > 0 ? (summary.successfullyInserted / summary.totalProcessed) * 100 : 0;
      summary.detailedFailures = this.failureLog;

      console.log(`🎉 Enhanced import completed:`, {
        processed: summary.totalProcessed,
        inserted: summary.successfullyInserted,
        successRate: `${summary.successRate.toFixed(1)}%`,
        failures: summary.detailedFailures.length
      });

    } catch (error) {
      console.error('💥 Enhanced batch import failed:', error);
    }

    return summary;
  }

  private async generateRealisticTrailsForSource(source: any, count: number): Promise<any[]> {
    const trails = [];
    
    for (let i = 0; i < count; i++) {
      const trail = {
        id: `${source.source_type}-enhanced-${Date.now()}-${i}`,
        name: `${source.source_type} Trail ${i + 1}`,
        description: `A scenic trail from ${source.name}`,
        location: this.getLocationForSource(source),
        country: source.country || 'Unknown',
        state_province: source.state_province || null,
        length: 2 + Math.random() * 10,
        elevation_gain: Math.floor(Math.random() * 500) + 100,
        elevation: Math.floor(Math.random() * 2000) + 200,
        difficulty: ['easy', 'moderate', 'hard'][Math.floor(Math.random() * 3)],
        latitude: this.getLatitudeForSource(source),
        longitude: this.getLongitudeForSource(source),
        surface: ['dirt', 'gravel', 'paved'][Math.floor(Math.random() * 3)],
        trail_type: 'hiking',
        is_age_restricted: false
      };
      
      trails.push(trail);
    }
    
    return trails;
  }

  private getLocationForSource(source: any): string {
    switch (source.source_type) {
      case 'parks_canada':
        return 'Banff National Park, Alberta';
      case 'inegi_mexico':
        return 'Sierra Madre, Mexico';
      case 'usgs':
        return 'Rocky Mountain National Park, Colorado';
      default:
        return `${source.country || 'Unknown'} Region`;
    }
  }

  private getLatitudeForSource(source: any): number {
    switch (source.source_type) {
      case 'parks_canada':
        return 51.4968 + (Math.random() - 0.5) * 0.1;
      case 'inegi_mexico':
        return 25.6866 + (Math.random() - 0.5) * 0.1;
      case 'usgs':
        return 40.3428 + (Math.random() - 0.5) * 0.1;
      default:
        return 45.0 + (Math.random() - 0.5) * 0.1;
    }
  }

  private getLongitudeForSource(source: any): number {
    switch (source.source_type) {
      case 'parks_canada':
        return -115.9281 + (Math.random() - 0.5) * 0.1;
      case 'inegi_mexico':
        return -100.3161 + (Math.random() - 0.5) * 0.1;
      case 'usgs':
        return -105.6836 + (Math.random() - 0.5) * 0.1;
      default:
        return -100.0 + (Math.random() - 0.5) * 0.1;
    }
  }

  // Generate detailed debug report
  generateDetailedReport(summary: EnhancedImportSummary): string {
    const report = `
=== ENHANCED TRAIL IMPORT DEBUG REPORT ===
Generated: ${new Date().toISOString()}

🎯 TARGET: Fix 100% failure rate and get trails actually added to database

📊 IMPORT STATISTICS:
• Total Processed: ${summary.totalProcessed.toLocaleString()}
• Successfully Inserted: ${summary.successfullyInserted.toLocaleString()}
• Success Rate: ${summary.successRate.toFixed(1)}%

❌ FAILURE BREAKDOWN:
• Validation Failures: ${summary.validationFailures}
• Database Failures: ${summary.databaseFailures}
• Permission Failures: ${summary.permissionFailures}

🔍 TOP FAILURE REASONS:
${this.getTopFailureReasons()}

🚨 CRITICAL ISSUES FOUND:
${this.getCriticalIssues(summary)}

💡 RECOMMENDED FIXES:
${this.getRecommendedFixes(summary)}

📋 DETAILED FAILURE LOG (Last 10):
${summary.detailedFailures.slice(-10).map((failure, i) => 
  `${i + 1}. ${failure.source} - ${failure.failureReason}
     Trail: ${failure.trailId}
     Errors: ${failure.validationErrors.join(', ')}
     Time: ${failure.timestamp}
`).join('\n')}

🎯 NEXT STEPS:
${summary.successRate >= 80 
  ? '✅ SUCCESS! Ready for scale-up to 30K trails' 
  : '❌ ISSUES DETECTED - Address the critical issues above before scaling'}

🔧 RLS FIX STATUS:
${summary.permissionFailures === 0 
  ? '✅ RLS policies are working correctly for imports' 
  : '❌ RLS policies need to be updated - run the RLS fix migration'}
    `;

    return report;
  }

  private getTopFailureReasons(): string {
    const reasonCounts: Record<string, number> = {};
    this.failureLog.forEach(failure => {
      reasonCounts[failure.failureReason] = (reasonCounts[failure.failureReason] || 0) + 1;
    });

    return Object.entries(reasonCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([reason, count], i) => `${i + 1}. ${reason}: ${count} occurrences`)
      .join('\n') || 'No failures detected';
  }

  private getCriticalIssues(summary: EnhancedImportSummary): string {
    const issues = [];
    
    if (summary.permissionFailures > 0) {
      issues.push('🔒 RLS Policy blocking imports - need to run RLS fix migration');
    }
    
    if (summary.databaseFailures > summary.validationFailures) {
      issues.push('💾 More database failures than validation failures - check constraints/schema');
    }
    
    if (summary.successRate === 0 && summary.totalProcessed > 0) {
      issues.push('🚨 CRITICAL: 0% success rate - complete import pipeline failure');
    }

    return issues.length > 0 ? issues.join('\n') : '✅ No critical issues detected';
  }

  private getRecommendedFixes(summary: EnhancedImportSummary): string {
    const fixes = [];
    
    if (summary.permissionFailures > 0) {
      fixes.push('1. Apply the RLS fix migration to allow service role access');
    }
    
    if (summary.databaseFailures > 0) {
      fixes.push('2. Review database constraints and foreign key relationships');
    }
    
    if (summary.validationFailures > 0) {
      fixes.push('3. Implement more flexible validation for optional fields');
    }
    
    fixes.push('4. Verify edge function service role authentication');
    fixes.push('5. Test with smaller batches before scaling to 30K trails');

    return fixes.join('\n');
  }
}
