
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { TrailDataSource } from "@/hooks/useTrailImport";

export function useBulkImport(handleBulkImport: (sourceIds: string[], trailCount: number) => Promise<boolean>) {
  const [bulkImportOpen, setBulkImportOpen] = useState(false);
  const [trailCount, setTrailCount] = useState(55369); // Default to 55369 as requested
  const { toast } = useToast();
  
  const onBulkImport = async (selectedSources: string[], dataSources: TrailDataSource[]) => {
    // If no sources are selected, select all active sources
    const sourcesToUse = selectedSources.length > 0 
      ? selectedSources 
      : dataSources.filter(s => s.is_active).map(s => s.id);
    
    // Make sure we have sources
    if (sourcesToUse.length === 0) {
      toast({
        title: "No sources selected",
        description: "Please select at least one data source.",
        variant: "destructive"
      });
      return false;
    }
    
    const success = await handleBulkImport(sourcesToUse, trailCount);
    if (success) {
      setBulkImportOpen(false);
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
