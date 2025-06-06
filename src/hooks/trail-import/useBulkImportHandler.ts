
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useBulkImportHandler(
  setActiveBulkJobId: (id: string | null) => void,
  setBulkImportLoading: (loading: boolean) => void
) {
  const { toast } = useToast();
  const [importProgress, setImportProgress] = useState<number>(0);

  // Function to start a bulk import
  const handleBulkImport = async (sourceIds: string[], trailCount: number) => {
    if (sourceIds.length === 0) {
      toast({
        title: "No sources selected",
        description: "Please select at least one data source for import.",
        variant: "destructive",
      });
      return false;
    }
    
    setBulkImportLoading(true);
    setImportProgress(0);
    try {
      console.log(`Starting bulk import of ${trailCount} trails from ${sourceIds.length} sources`);
      
      // First ensure indexes are created for better performance
      try {
        await supabase.functions.invoke('create-database-indexes', {
          body: { action: 'create' }
        });
        console.log("Database indexes created or verified");
      } catch (indexError) {
        console.warn("Could not create indexes, but continuing with import:", indexError);
      }
      
      // Call the optimized bulk-import-trails-optimized edge function
      const response = await supabase.functions.invoke('bulk-import-trails-optimized', {
        body: { 
          sourceIds, 
          totalTrails: trailCount,
          batchSize: 1000,  // Smaller batch size for better stability
          concurrency: 3    // Reduced concurrency to prevent DB overload
        }
      });
      
      if (response.error) throw new Error(response.error.message);
      
      // Set active job ID for progress tracking
      setActiveBulkJobId(response.data.job_id);
      
      toast({
        title: "Trail import started",
        description: `Starting import of approximately ${trailCount.toLocaleString()} trails from ${sourceIds.length} sources.`,
      });
      
      // Start the progress monitoring
      monitorImportProgress(response.data.job_id);
      
      return true;
    } catch (error) {
      console.error('Bulk import error:', error);
      toast({
        title: "Import error",
        description: "Failed to start the trail import process. Try again with fewer trails or sources.",
        variant: "destructive",
      });
      setBulkImportLoading(false);
      return false;
    }
  };

  // Function to monitor import progress
  const monitorImportProgress = async (jobId: string) => {
    const intervalId = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from('bulk_import_jobs')
          .select('status, trails_processed, total_trails_requested, trails_added, trails_updated, trails_failed')
          .eq('id', jobId)
          .single();
          
        if (error) {
          console.error('Error fetching import progress:', error);
          return;
        }
        
        if (data) {
          const progress = Math.min(
            100,
            Math.round((data.trails_processed / data.total_trails_requested) * 100)
          );
          setImportProgress(progress);
          
          // Stop monitoring once complete
          if (data.status === 'completed' || data.status === 'error') {
            clearInterval(intervalId);
            setBulkImportLoading(false);
            
            // Show completion notification
            if (data.status === 'completed') {
              toast({
                title: "Import completed",
                description: `Successfully imported ${data.trails_added + data.trails_updated} trails (${data.trails_added} new, ${data.trails_updated} updated).`,
              });
            } else {
              toast({
                title: "Import issues",
                description: `Import completed with issues. ${data.trails_failed} trails failed to import.`,
                variant: "destructive",
              });
            }
            
            // Clear the active job ID after a short delay
            setTimeout(() => {
              setActiveBulkJobId(null);
            }, 1000);
          }
        }
      } catch (e) {
        console.error('Error monitoring import progress:', e);
      }
    }, 3000); // Check progress every 3 seconds
    
    // Return cleanup function
    return () => clearInterval(intervalId);
  };

  return {
    handleBulkImport,
    importProgress
  };
}
