
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ImportJob {
  id: string;
  source_id: string;
  status: string;
  started_at: string;
  completed_at?: string;
  trails_processed: number;
  trails_added: number;
  trails_updated: number;
  error_message?: string;
  bulk_job_id?: string;
}

export function useImportJobs() {
  return useQuery({
    queryKey: ['import-jobs'],
    queryFn: async (): Promise<ImportJob[]> => {
      try {
        const { data, error } = await supabase
          .from('trail_import_jobs')
          .select('*')
          .order('started_at', { ascending: false })
          .limit(50);

        if (error) {
          console.error('Error fetching import jobs:', error);
          return [];
        }

        // Map the database response to our ImportJob interface
        return (data || []).map(job => ({
          id: job.id,
          source_id: job.source_id,
          status: job.status,
          started_at: job.started_at,
          completed_at: job.completed_at,
          trails_processed: job.trails_processed || 0,
          trails_added: job.trails_added || 0,
          trails_updated: job.trails_updated || 0,
          error_message: job.error_message,
          bulk_job_id: job.bulk_job_id
        }));
      } catch (error) {
        console.error('Error in useImportJobs:', error);
        return [];
      }
    },
    refetchInterval: 5000 // Refetch every 5 seconds to show progress
  });
}
