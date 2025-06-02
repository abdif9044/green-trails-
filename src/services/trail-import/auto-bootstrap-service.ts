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
      sources: ['hiking_project', 'openstreetmap', 'usgs', 'parks_canada']
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

      // Trigger bootstrap with fixed import system
      const triggered = await this.triggerBootstrap();
      return { needed: true, triggered, currentCount: trailCount };

    } catch (error) {
      console.error('Error in checkAndBootstrap:', error);
      return { needed: false, triggered: false, currentCount: 0 };
    }
  }

  /**
   * Trigger the 30K trail bootstrap process with fixed schema
   */
  async triggerBootstrap(): Promise<boolean> {
    if (this.isBootstrapping) {
      console.log('⏳ Bootstrap already in progress');
      return false;
    }

    try {
      this.isBootstrapping = true;
      console.log('🚀 Starting FIXED 30K trail bootstrap...');

      toast.success('🔧 Auto-loading 30,000 trails with FIXED schema!');

      // Calculate trails per source
      const trailsPerSource = Math.ceil(this.config.targetTrailCount / this.config.sources.length);

      // Call the FIXED massive import function
      const { data, error } = await supabase.functions.invoke('import-trails-massive', {
        body: {
          sources: this.config.sources,
          maxTrailsPerSource: trailsPerSource,
          batchSize: 25, // Smaller batches for reliability
          concurrency: 1,
          target: 'FIXED 30K Bootstrap',
          debug: true,
          validation: true
        }
      });

      if (error) {
        console.error('❌ FIXED Bootstrap failed:', error);
        toast.error('Schema fixes applied but bootstrap failed. Check console.');
        return false;
      }

      console.log('✅ FIXED Bootstrap initiated successfully:', data);
      toast.success(`🎉 FIXED trail loading started! Target: ${this.config.targetTrailCount.toLocaleString()} trails`);
      
      return true;

    } catch (error) {
      console.error('💥 FIXED Bootstrap exception:', error);
      toast.error('FIXED Bootstrap failed with an error');
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
        isActive,
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
   * Force trigger bootstrap with FIXED schema (for manual use)
   */
  async forceBootstrap(): Promise<boolean> {
    console.log('🔧 Force triggering FIXED bootstrap...');
    this.isBootstrapping = false; // Reset state
    return this.triggerBootstrap();
  }
}

// Singleton export
export const autoBootstrapService = AutoBootstrapService.getInstance();
