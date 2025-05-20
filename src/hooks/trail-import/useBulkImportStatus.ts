
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BulkImportJob } from '../useTrailImport';

export function useBulkImportStatus(reloadData: () => void) {
  const [activeBulkJobId, setActiveBulkJobId] = useState<string | null>(null);
  const [bulkProgress, setBulkProgress] = useState<number>(0);
  const [bulkImportLoading, setBulkImportLoading] = useState<boolean>(false);
  const [bulkJobDetails, setBulkJobDetails] = useState<BulkImportJob | null>(null);

  // Function to check for active bulk jobs
  const checkForActiveBulkJob = useCallback((bulkJobs?: BulkImportJob[]) => {
    if (!bulkJobs || bulkJobs.length === 0) return;
    
    // Look for in-progress jobs
    const activeJob = bulkJobs.find(job => 
      job.status === 'processing' || job.status === 'queued'
    );
    
    if (activeJob) {
      console.log('Found active bulk import job:', activeJob.id);
      setActiveBulkJobId(activeJob.id);
      
      // Calculate initial progress
      if (activeJob.total_trails_requested > 0) {
        const progress = Math.min(
          100,
          Math.round((activeJob.trails_processed / activeJob.total_trails_requested) * 100)
        );
        setBulkProgress(progress);
        setBulkJobDetails(activeJob);
      }
      
      // Start monitoring progress
      startProgressUpdates(activeJob.id);
    }
  }, []);

  // Function to start monitoring progress updates
  const startProgressUpdates = useCallback((jobId: string) => {
    setBulkImportLoading(true);
    
    const intervalId = setInterval(async () => {
      try {
        const { data: job, error } = await supabase
          .from('bulk_import_jobs')
          .select('*')
          .eq('id', jobId)
          .single();
          
        if (error) {
          console.error('Error fetching bulk job status:', error);
          return;
        }
        
        if (job) {
          setBulkJobDetails(job);
          
          // Calculate progress
          if (job.total_trails_requested > 0) {
            const progress = Math.min(
              100,
              Math.round((job.trails_processed / job.total_trails_requested) * 100)
            );
            setBulkProgress(progress);
          }
          
          // Check if job is completed or errored
          if (job.status === 'completed' || job.status === 'error') {
            console.log('Bulk job completed:', job.id);
            clearInterval(intervalId);
            
            // Wait 2 seconds before clearing the active job to allow progress display
            setTimeout(() => {
              setActiveBulkJobId(null);
              setBulkImportLoading(false);
              
              // Reload data to show updated results
              reloadData();
            }, 2000);
          }
        }
      } catch (e) {
        console.error('Error monitoring bulk job status:', e);
      }
    }, 3000);
    
    // Store the interval ID to clear it later
    return () => clearInterval(intervalId);
  }, [reloadData]);

  // Effect to clear active job when component unmounts
  useEffect(() => {
    return () => {
      // This is just a cleanup function - nothing needs to happen here
      // since the interval is managed within startProgressUpdates
    };
  }, []);

  return {
    activeBulkJobId,
    setActiveBulkJobId,
    bulkProgress,
    bulkImportLoading,
    setBulkImportLoading,
    bulkJobDetails,
    checkForActiveBulkJob,
    startProgressUpdates
  };
}
