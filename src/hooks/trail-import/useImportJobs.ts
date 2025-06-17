
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Define types that match actual database schema
export interface ImportJob {
  id: string;
  source_id: string;
  bulk_job_id: string | null;
  status: string;
  started_at: string;
  completed_at: string | null;
  trails_processed: number;
  trails_added: number;
  trails_updated: number;
  trails_failed: number;
  error_message: string | null;
}

export interface BulkImportJob {
  id: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  total_trails_requested: number;
  trails_processed: number | null;
  trails_added: number | null;
  trails_updated: number | null;
  trails_failed: number | null;
  total_sources: number;
  config: any;
  results: any;
  last_updated: string | null;
}

export function useImportJobs() {
  const [importJobs, setImportJobs] = useState<ImportJob[]>([]);
  const [bulkImportJobs, setBulkImportJobs] = useState<BulkImportJob[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Function to load import jobs with fallback handling
  const loadImportJobs = async () => {
    setLoading(true);
    try {
      // Try to fetch recent import jobs with error handling
      try {
        const { data: jobs, error: jobsError } = await supabase
          .from("trail_import_jobs")
          .select("*")
          .order("started_at", { ascending: false })
          .limit(20);
          
        if (jobsError) {
          console.error('Error fetching import jobs:', jobsError);
          setImportJobs([]);
        } else {
          // Map the data and ensure trails_failed is included
          const mappedJobs = (jobs || []).map(job => ({
            ...job,
            trails_failed: job.trails_failed ?? 0 // Use nullish coalescing
          })) as ImportJob[];
          setImportJobs(mappedJobs);
        }
      } catch (error) {
        console.error('Table trail_import_jobs may not exist:', error);
        setImportJobs([]);
      }
      
      // Try to fetch bulk import jobs with error handling
      try {
        const { data: bulkJobs, error: bulkJobsError } = await supabase
          .from("bulk_import_jobs")
          .select("*")
          .order("started_at", { ascending: false })
          .limit(10);
          
        if (bulkJobsError) {
          console.error('Error fetching bulk import jobs:', bulkJobsError);
          setBulkImportJobs([]);
        } else {
          setBulkImportJobs(bulkJobs || []);
        }
      } catch (error) {
        console.error('Table bulk_import_jobs may not exist:', error);
        setBulkImportJobs([]);
      }
      
      return {
        importJobs: importJobs,
        bulkImportJobs: bulkImportJobs
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
