
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useBulkImportStatus(reloadData: () => void) {
  const [activeBulkJobId, setActiveBulkJobId] = useState<string | null>(null);
  const [bulkProgress, setBulkProgress] = useState(0);
  const [bulkImportLoading, setBulkImportLoading] = useState(false);
  const { toast } = useToast();

  // Effect to monitor the active bulk job
  useEffect(() => {
    if (!activeBulkJobId) return;
    
    const interval = setInterval(async () => {
      try {
        // Create an extended client with the additional types
        const { createExtendedSupabaseClient } = await import('@/types/supabase-extensions');
        const { supabase } = await import('@/integrations/supabase/client');
        const extendedSupabase = createExtendedSupabaseClient(supabase);
        
        const { data, error } = await extendedSupabase
          .from("bulk_import_jobs")
          .select("*")
          .eq("id", activeBulkJobId)
          .single();
          
        if (error || !data) {
          clearInterval(interval);
          return;
        }
        
        if (data.status === "completed" || data.status === "error") {
          // Job finished
          clearInterval(interval);
          setActiveBulkJobId(null);
          reloadData();
          
          toast({
            title: data.status === "completed" ? "Bulk import completed" : "Bulk import error",
            description: `Processed ${data.trails_processed.toLocaleString()} trails: ${data.trails_added.toLocaleString()} added, ${data.trails_updated.toLocaleString()} updated, ${data.trails_failed.toLocaleString()} failed`,
            variant: data.status === "completed" ? "default" : "destructive",
          });
        } else {
          // Job in progress
          const progress = Math.round((data.trails_processed / data.total_trails_requested) * 100);
          setBulkProgress(progress);
        }
      } catch (error) {
        console.error("Error checking bulk job status:", error);
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [activeBulkJobId, toast, reloadData]);

  // Check if there's an active bulk job when jobs are loaded
  const checkForActiveBulkJob = (bulkImportJobs: any[]) => {
    const activeJob = bulkImportJobs?.find(job => job.status === 'processing');
    if (activeJob) {
      setActiveBulkJobId(activeJob.id);
      const progress = Math.round((activeJob.trails_processed / activeJob.total_trails_requested) * 100);
      setBulkProgress(progress);
    } else {
      setActiveBulkJobId(null);
    }
  };

  return {
    activeBulkJobId,
    setActiveBulkJobId,
    bulkProgress,
    setBulkProgress,
    bulkImportLoading,
    setBulkImportLoading,
    checkForActiveBulkJob
  };
}
