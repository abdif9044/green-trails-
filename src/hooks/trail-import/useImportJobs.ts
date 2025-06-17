
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
  trails_failed: number;
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

        return data || [];
      } catch (error) {
        console.error('Error in useImportJobs:', error);
        return [];
      }
    },
    refetchInterval: 5000 // Refetch every 5 seconds to show progress
  });
}
