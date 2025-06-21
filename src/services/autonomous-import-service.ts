
import { supabase } from '@/integrations/supabase/client';

export interface AutonomousImportResult {
  success: boolean;
  message: string;
  jobId?: string;
  trailsImported: number;
  timeElapsed: number;
}

export class AutonomousImportService {
  static async start55KImport(): Promise<AutonomousImportResult> {
    try {
      console.log('🚀 Starting autonomous 55,555 trail import...');
      
      const { data, error } = await supabase.functions.invoke('autonomous-trail-import', {
        body: {
          targetTrails: 55555
        }
      });

      if (error) {
        console.error('Autonomous import error:', error);
        return {
          success: false,
          message: `Import failed: ${error.message}`,
          trailsImported: 0,
          timeElapsed: 0
        };
      }

      console.log('Autonomous import response:', data);
      
      return {
        success: data.success,
        message: data.message,
        jobId: data.jobId,
        trailsImported: data.trailsImported,
        timeElapsed: data.timeElapsed
      };
      
    } catch (error) {
      console.error('Autonomous import exception:', error);
      return {
        success: false,
        message: `Import exception: ${error instanceof Error ? error.message : 'Unknown error'}`,
        trailsImported: 0,
        timeElapsed: 0
      };
    }
  }

  static async getImportStatus(): Promise<{
    currentCount: number;
    isActive: boolean;
    progress: number;
  }> {
    try {
      const { count } = await supabase
        .from('trails')
        .select('*', { count: 'exact', head: true });
      
      const currentCount = count || 0;
      const progress = Math.min(100, (currentCount / 55555) * 100);
      
      return {
        currentCount,
        isActive: false, // We'll implement active job tracking later
        progress
      };
      
    } catch (error) {
      console.error('Error getting import status:', error);
      return {
        currentCount: 0,
        isActive: false,
        progress: 0
      };
    }
  }
}
