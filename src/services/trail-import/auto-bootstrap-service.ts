
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BootstrapConfig {
  minTrailCount: number;
  targetTrailCount: number;
  autoTrigger: boolean;
  sources: string[];
}

export class AutoBootstrapService {
  private static instance: AutoBootstrapService;
  private config: BootstrapConfig;
  private isBootstrapping = false;

  private constructor() {
    this.config = {
      minTrailCount: 5000,
      targetTrailCount: 30000,
      autoTrigger: true,
      sources: ['hiking_project', 'openstreetmap', 'usgs']
    };
  }

  static getInstance(): AutoBootstrapService {
    if (!AutoBootstrapService.instance) {
      AutoBootstrapService.instance = new AutoBootstrapService();
    }
    return AutoBootstrapService.instance;
  }

  /**
   * Check if bootstrap is needed and trigger if necessary
   */
  async checkAndBootstrap(): Promise<{ needed: boolean; triggered: boolean; currentCount: number }> {
    try {
      console.log('🔍 Checking if trail bootstrap is needed...');
      
      // Get current trail count
      const { count: currentCount, error } = await supabase
        .from('trails')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error checking trail count:', error);
        return { needed: false, triggered: false, currentCount: 0 };
      }

      const trailCount = currentCount || 0;
      console.log(`📊 Current trail count: ${trailCount.toLocaleString()}`);

      const bootstrapNeeded = trailCount < this.config.minTrailCount;
      
      if (!bootstrapNeeded) {
        console.log(`✅ Bootstrap not needed: ${trailCount} >= ${this.config.minTrailCount} minimum`);
        return { needed: false, triggered: false, currentCount: trailCount };
      }

      console.log(`🚨 Bootstrap needed: ${trailCount} < ${this.config.minTrailCount} minimum`);

      if (!this.config.autoTrigger) {
        console.log('⏸️ Auto-trigger disabled, manual bootstrap required');
        return { needed: true, triggered: false, currentCount: trailCount };
      }

      if (this.isBootstrapping) {
        console.log('⏳ Bootstrap already in progress');
        return { needed: true, triggered: false, currentCount: trailCount };
      }

      // Trigger FIXED bootstrap with improved error handling
      const triggered = await this.triggerFixedBootstrap();
      return { needed: true, triggered, currentCount: trailCount };

    } catch (error) {
      console.error('Error in checkAndBootstrap:', error);
      return { needed: false, triggered: false, currentCount: 0 };
    }
  }

  /**
   * Trigger FIXED bootstrap with schema corrections
   */
  async triggerFixedBootstrap(): Promise<boolean> {
    if (this.isBootstrapping) {
      console.log('⏳ Fixed bootstrap already in progress');
      return false;
    }

    try {
      this.isBootstrapping = true;
      console.log('🔧 Starting FIXED bootstrap with corrected schema...');

      toast.success('🔧 Fixed Schema Import Started - Downloading 30K trails!');

      // Call the FIXED massive import function
      const { data: importResult, error: importError } = await supabase.functions.invoke('import-trails-massive', {
        body: {
          sources: this.config.sources,
          maxTrailsPerSource: Math.ceil(this.config.targetTrailCount / this.config.sources.length),
          batchSize: 20, // Smaller batches for reliability
          concurrency: 1,
          target: '30K Fixed Schema',
          debug: true,
          validation: true
        }
      });

      if (importError) {
        console.error('❌ Fixed bootstrap failed:', importError);
        toast.error(`❌ Import failed: ${importError.message}`);
        return false;
      } else if (importResult && importResult.total_added > 0) {
        console.log(`✅ Fixed bootstrap SUCCESS: ${importResult.total_added} trails imported!`);
        toast.success(`🎉 SUCCESS! ${importResult.total_added.toLocaleString()} trails downloaded with ${importResult.success_rate}% success rate!`);
        return true;
      } else {
        console.error('❌ Fixed bootstrap completed but no trails added:', importResult);
        toast.error('❌ Import completed but no trails were added. Check console for details.');
        return false;
      }

    } catch (error) {
      console.error('💥 Fixed bootstrap exception:', error);
      toast.error('Fixed bootstrap failed with an error');
      return false;
    } finally {
      this.isBootstrapping = false;
    }
  }

  /**
   * Monitor bootstrap progress
   */
  async getBootstrapProgress(): Promise<{
    isActive: boolean;
    currentCount: number;
    targetCount: number;
    progressPercent: number;
  }> {
    try {
      // Get current trail count
      const { count: currentCount } = await supabase
        .from('trails')
        .select('*', { count: 'exact', head: true });

      // Check for active bulk jobs
      const { data: activeJobs } = await supabase
        .from('bulk_import_jobs')
        .select('*')
        .eq('status', 'processing')
        .order('started_at', { ascending: false })
        .limit(1);

      const isActive = activeJobs && activeJobs.length > 0;
      const trailCount = currentCount || 0;
      const progressPercent = Math.min((trailCount / this.config.targetTrailCount) * 100, 100);

      return {
        isActive: isActive || this.isBootstrapping,
        currentCount: trailCount,
        targetCount: this.config.targetTrailCount,
        progressPercent: Math.round(progressPercent)
      };

    } catch (error) {
      console.error('Error getting bootstrap progress:', error);
      return {
        isActive: false,
        currentCount: 0,
        targetCount: this.config.targetTrailCount,
        progressPercent: 0
      };
    }
  }

  /**
   * Force trigger fixed bootstrap (for manual use)
   */
  async forceBootstrap(): Promise<boolean> {
    console.log('🔧 Force triggering FIXED bootstrap...');
    this.isBootstrapping = false; // Reset state
    return this.triggerFixedBootstrap();
  }

  /**
   * Run database diagnostics
   */
  async runDiagnostics(): Promise<{ hasPermissions: boolean; errors: string[] }> {
    const errors: string[] = [];

    try {
      // Test basic SELECT permission
      const { data: selectTest, error: selectError } = await supabase
        .from('trails')
        .select('id')
        .limit(1);

      if (selectError) {
        errors.push(`SELECT permission failed: ${selectError.message}`);
      }

      // Test bulk_import_jobs table
      const { data: bulkTest, error: bulkError } = await supabase
        .from('bulk_import_jobs')
        .select('id')
        .limit(1);

      if (bulkError) {
        errors.push(`Bulk import jobs table failed: ${bulkError.message}`);
      }

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      errors.push(`Permission test exception: ${errorMsg}`);
    }

    return {
      hasPermissions: errors.length === 0,
      errors
    };
  }
}

// Singleton export
export const autoBootstrapService = AutoBootstrapService.getInstance();
