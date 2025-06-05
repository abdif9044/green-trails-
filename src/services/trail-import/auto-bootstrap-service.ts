import { supabase } from '@/integrations/supabase/client';

interface BootstrapProgress {
  isActive: boolean;
  currentCount: number;
  targetCount: number;
  progressPercent: number;
}

interface DiagnosticsResult {
  hasPermissions: boolean;
  errors: string[];
}

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

export class AutoBootstrapService {
  static async checkAndBootstrap(): Promise<{ needed: boolean; triggered: boolean; currentCount: number }> {
    try {
      const currentCount = await this.getCurrentTrailCount();
      const needed = currentCount < 25000;
      
      if (needed) {
        // Auto-trigger Rochester import if count is very low
        if (currentCount < 1000) {
          console.log('🎯 Auto-triggering Rochester import for 5,555 trails...');
          const rochesterTriggered = await this.forceRochesterImport();
          if (rochesterTriggered) {
            return { needed, triggered: true, currentCount };
          }
        }
        
        const triggered = await this.forceBootstrap();
        return { needed, triggered, currentCount };
      }
      
      return { needed: false, triggered: false, currentCount };
    } catch (error) {
      console.error('Error in checkAndBootstrap:', error);
      return { needed: true, triggered: false, currentCount: 0 };
    }
  }

  static async autoTriggerRochesterImport(): Promise<boolean> {
    try {
      console.log('🚀 Automatically starting Rochester, MN import of 5,555 trails...');
      
      const currentCount = await this.getCurrentTrailCount();
      console.log(`📊 Current trail count: ${currentCount}`);
      
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

  static async forceBootstrap(): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('import-trails-massive', {
        body: {
          sources: ['hiking_project', 'openstreetmap', 'usgs'],
          maxTrailsPerSource: 10000,
          batchSize: 50,
          concurrency: 2,
          priority: 'high',
          target: '30K',
          debug: true,
          validation: true
        }
      });

      if (error) {
        console.error('Bootstrap error:', error);
        return false;
      }

      console.log('Bootstrap response:', data);
      return true;
    } catch (error) {
      console.error('Bootstrap exception:', error);
      return false;
    }
  }

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

  static async getBootstrapProgress(): Promise<BootstrapProgress> {
    try {
      const currentCount = await this.getCurrentTrailCount();
      const targetCount = 30000;
      const progressPercent = Math.min(Math.round((currentCount / targetCount) * 100), 100);
      
      // Check if there's an active import job
      const { data: activeJobs } = await supabase
        .from('bulk_import_jobs')
        .select('*')
        .eq('status', 'processing')
        .order('started_at', { ascending: false })
        .limit(1);

      const isActive = activeJobs && activeJobs.length > 0;

      return {
        isActive,
        currentCount,
        targetCount,
        progressPercent
      };
    } catch (error) {
      console.error('Error getting bootstrap progress:', error);
      return {
        isActive: false,
        currentCount: 0,
        targetCount: 30000,
        progressPercent: 0
      };
    }
  }

  static async runDiagnostics(): Promise<DiagnosticsResult> {
    const errors: string[] = [];
    let hasPermissions = true;

    try {
      // Test basic table access
      const { error: trailsError } = await supabase
        .from('trails')
        .select('id')
        .limit(1);

      if (trailsError) {
        errors.push(`Trails table access: ${trailsError.message}`);
        hasPermissions = false;
      }

      // Test bulk import tables
      const { error: bulkError } = await supabase
        .from('bulk_import_jobs')
        .select('id')
        .limit(1);

      if (bulkError) {
        errors.push(`Bulk import tables: ${bulkError.message}`);
        hasPermissions = false;
      }

      // Test function access
      const { error: functionError } = await supabase.functions.invoke('import-trails-massive', {
        body: { test: true }
      });

      if (functionError && !functionError.message.includes('Sources specified')) {
        errors.push(`Function access: ${functionError.message}`);
      }

    } catch (error) {
      errors.push(`Diagnostics error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      hasPermissions = false;
    }

    return { hasPermissions, errors };
  }

  private static async getCurrentTrailCount(): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('trails')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error getting trail count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error getting trail count:', error);
      return 0;
    }
  }
}

// Auto-execute Rochester import immediately
(async () => {
  try {
    console.log('🎯 GreenTrails: Auto-executing Rochester trail import...');
    const success = await AutoBootstrapService.autoTriggerRochesterImport();
    
    if (success) {
      console.log('🚀 Rochester import started successfully! 5,555 trails incoming...');
    } else {
      console.log('⚠️ Rochester import could not be started automatically');
    }
  } catch (error) {
    console.error('❌ Auto-execution error:', error);
  }
})();

export const autoBootstrapService = AutoBootstrapService;
