
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ImportJob {
  id: string;
  source_id: string;
  bulk_job_id?: string;
  status: string;
  started_at: string;
  completed_at?: string;
  trails_processed: number;
  trails_added: number;
  trails_updated: number;
  trails_failed: number; // Add this property to match expected interface
  error_message?: string;
}

export const useImportJobs = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['import-jobs'],
    queryFn: async (): Promise<ImportJob[]> => {
      try {
        const { data, error } = await supabase
          .from('trail_import_jobs')
          .select('*')
          .order('started_at', { ascending: false });

        if (error) {
          console.error('Error fetching import jobs:', error);
          toast({
            title: 'Error loading import jobs',
            description: 'Failed to load import jobs from database.',
            variant: 'destructive',
          });
          return [];
        }

        // Transform the data to match the expected interface
        return (data || []).map(job => ({
          id: job.id,
          source_id: job.source_id,
          bulk_job_id: job.bulk_job_id,
          status: job.status,
          started_at: job.started_at,
          completed_at: job.completed_at,
          trails_processed: job.trails_processed,
          trails_added: job.trails_added,
          trails_updated: job.trails_updated,
          trails_failed: 0, // Default to 0 since this field doesn't exist in the database
          error_message: job.error_message,
        }));
      } catch (error) {
        console.error('Error fetching import jobs:', error);
        toast({
          title: 'Error loading import jobs',
          description: 'Failed to connect to database.',
          variant: 'destructive',
        });
        return [];
      }
    },
  });
};
