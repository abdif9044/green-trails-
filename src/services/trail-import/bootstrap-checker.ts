
import { supabase } from '@/integrations/supabase/client';

export class BootstrapChecker {
  static async getCurrentTrailCount(): Promise<number> {
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

  static async checkIfBootstrapNeeded(): Promise<{ needed: boolean; currentCount: number }> {
    try {
      const currentCount = await this.getCurrentTrailCount();
      const needed = currentCount < 25000;
      
      return { needed, currentCount };
    } catch (error) {
      console.error('Error in checkIfBootstrapNeeded:', error);
      return { needed: true, currentCount: 0 };
    }
  }

  static async getBootstrapProgress() {
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
}
