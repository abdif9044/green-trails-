
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ImportJob, BulkImportJob } from '../useTrailImport';
import { createExtendedSupabaseClient } from '@/types/supabase-extensions';

export function useImportJobs() {
  const [importJobs, setImportJobs] = useState<ImportJob[]>([]);
  const [bulkImportJobs, setBulkImportJobs] = useState<BulkImportJob[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Function to load import jobs
  const loadImportJobs = async () => {
    setLoading(true);
    try {
      // Create an extended client with the additional types
      const extendedSupabase = createExtendedSupabaseClient(supabase);
      
      // Fetch recent import jobs using standard supabase client
      const { data: jobs, error: jobsError } = await supabase
        .from("trail_import_jobs")
        .select("*")
        .order("started_at", { ascending: false })
        .limit(20);
        
      if (jobsError) throw jobsError;
      
      // Fetch bulk import jobs using the extended client
      const { data: bulkJobs, error: bulkJobsError } = await extendedSupabase
        .from("bulk_import_jobs")
        .select("*")
        .order("started_at", { ascending: false })
        .limit(10);
        
      if (bulkJobsError) throw bulkJobsError;
      
      setImportJobs(jobs || []);
      setBulkImportJobs(bulkJobs || []);
      
      return {
        importJobs: jobs || [],
        bulkImportJobs: bulkJobs || []
      };
    } catch (error) {
      console.error('Error loading import jobs:', error);
      toast({
        title: "Error loading jobs",
        description: "Failed to load trail import jobs. Please try again.",
        variant: "destructive",
      });
      return {
        importJobs: [],
        bulkImportJobs: []
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    importJobs,
    bulkImportJobs,
    loading,
    loadImportJobs,
  };
}
