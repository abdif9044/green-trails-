
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { EnhancedDebugImportService } from './enhanced-debug-service';

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
  private debugService: EnhancedDebugImportService;

  private constructor() {
    this.config = {
      minTrailCount: 5000,
      targetTrailCount: 30000,
      autoTrigger: true,
      sources: ['hiking_project', 'openstreetmap', 'usgs', 'parks_canada']
    };
    this.debugService = new EnhancedDebugImportService();
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

      // Trigger ENHANCED DEBUG bootstrap to force downloads
      const triggered = await this.triggerEnhancedBootstrap();
      return { needed: true, triggered, currentCount: trailCount };

    } catch (error) {
      console.error('Error in checkAndBootstrap:', error);
      return { needed: false, triggered: false, currentCount: 0 };
    }
  }

  /**
   * Trigger ENHANCED DEBUG bootstrap with detailed error reporting
   */
  async triggerEnhancedBootstrap(): Promise<boolean> {
    if (this.isBootstrapping) {
      console.log('⏳ Enhanced bootstrap already in progress');
      return false;
    }

    try {
      this.isBootstrapping = true;
      console.log('🔧 Starting ENHANCED DEBUG bootstrap with detailed diagnostics...');

      toast.success('🔧 Enhanced Debug Import Started - Forcing trail downloads!');

      // Run enhanced debug import which tests permissions and forces downloads
      const summary = await this.debugService.runEnhancedBatchImport(this.config.targetTrailCount);
      
      if (summary.successfullyInserted > 0) {
        console.log(`✅ Enhanced bootstrap SUCCESS: ${summary.successfullyInserted} trails imported!`);
        toast.success(`🎉 SUCCESS! ${summary.successfullyInserted.toLocaleString()} trails downloaded successfully!`);
        return true;
      } else {
        console.error('❌ Enhanced bootstrap failed with detailed report:', summary);
        
        // Generate and log detailed report
        const report = this.debugService.generateDetailedReport(summary);
        console.error('📋 DETAILED FAILURE REPORT:', report);
        
        toast.error(`❌ Import failed: ${summary.detailedFailures.length} errors detected. Check console for details.`);
        return false;
      }

    } catch (error) {
      console.error('💥 Enhanced bootstrap exception:', error);
      toast.error('Enhanced bootstrap failed with an error');
      return false;
    } finally {
      this.isBootstrapping = false;
    }
  }

  /**
   * Legacy trigger function - now redirects to enhanced version
   */
  async triggerBootstrap(): Promise<boolean> {
    console.log('🔀 Redirecting to enhanced bootstrap...');
    return this.triggerEnhancedBootstrap();
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
   * Force trigger enhanced bootstrap (for manual use)
   */
  async forceBootstrap(): Promise<boolean> {
    console.log('🔧 Force triggering ENHANCED DEBUG bootstrap...');
    this.isBootstrapping = false; // Reset state
    return this.triggerEnhancedBootstrap();
  }

  /**
   * Run database diagnostics
   */
  async runDiagnostics(): Promise<{ hasPermissions: boolean; errors: string[] }> {
    return this.debugService.testDatabasePermissions();
  }
}

// Singleton export
export const autoBootstrapService = AutoBootstrapService.getInstance();
