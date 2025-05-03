
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useBulkImportHandler(
  setActiveBulkJobId: (id: string | null) => void,
  setBulkImportLoading: (loading: boolean) => void
) {
  const { toast } = useToast();

  // Function to start a bulk import
  const handleBulkImport = async (sourceIds: string[], trailCount: number) => {
    if (sourceIds.length === 0) return false;
    
    setBulkImportLoading(true);
    try {
      // Call the bulk-import-trails edge function
      const response = await supabase.functions.invoke('bulk-import-trails', {
        body: { 
          sourceIds, 
          totalTrails: trailCount,
          batchSize: 1000,  // Larger batch size for efficiency
          concurrency: 3    // Process multiple sources concurrently
        }
      });
      
      if (response.error) throw new Error(response.error.message);
      
      // Set active job ID for progress tracking
      setActiveBulkJobId(response.data.job_id);
      
      toast({
        title: "Bulk import started",
        description: `Starting import of approximately ${trailCount.toLocaleString()} trails from ${sourceIds.length} sources.`,
      });
      
      return true;
    } catch (error) {
      console.error('Bulk import error:', error);
      toast({
        title: "Bulk import error",
        description: "Failed to start the bulk trail import process.",
        variant: "destructive",
      });
      return false;
    } finally {
      setBulkImportLoading(false);
    }
  };

  return {
    handleBulkImport
  };
}
