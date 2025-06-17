
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TrailDataSource } from '@/hooks/useTrailImport';

export function useBulkImport(handleBulkImport: (sourceIds: string[], trailCount: number) => Promise<boolean>) {
  const [bulkImportOpen, setBulkImportOpen] = useState(false);
  const [trailCount, setTrailCount] = useState(5000);
  const { toast } = useToast();

  const onBulkImport = async (selectedSources: string[], dataSources: TrailDataSource[]): Promise<boolean> => {
    if (selectedSources.length === 0) {
      toast({
        title: "No sources selected",
        description: "Please select at least one data source to import from.",
        variant: "destructive",
      });
      return false;
    }

    // Count active sources
    const activeSelectedSources = selectedSources.filter(id => 
      dataSources.find(source => source.id === id && source.is_active)
    );
    
    if (activeSelectedSources.length === 0) {
      toast({
        title: "No active sources selected",
        description: "Please select at least one active data source.",
        variant: "destructive",
      });
      return false;
    }
    
    const success = await handleBulkImport(activeSelectedSources, trailCount);
    
    if (success) {
      setBulkImportOpen(false);
      toast({
        title: "Bulk import started",
        description: `Started importing approximately ${trailCount.toLocaleString()} trails from ${activeSelectedSources.length} sources.`,
      });
      return true;
    }
    
    return false;
  };

  return {
    bulkImportOpen,
    setBulkImportOpen,
    trailCount,
    setTrailCount,
    onBulkImport
  };
}
