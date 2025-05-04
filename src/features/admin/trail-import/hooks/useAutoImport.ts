
import { useState, useEffect } from 'react';
import { TrailDataSource } from '@/hooks/useTrailImport';
import { useToast } from '@/hooks/use-toast';

interface UseAutoImportProps {
  dataSources: TrailDataSource[];
  loading: boolean;
  bulkImportLoading: boolean;
  activeBulkJobId: string | null;
  handleBulkImport: (sourceIds: string[], trailCount: number) => Promise<boolean>;
  trailCount: number;
  setActiveTab: (tab: string) => void;
}

export function useAutoImport({
  dataSources, 
  loading, 
  bulkImportLoading, 
  activeBulkJobId,
  handleBulkImport,
  trailCount,
  setActiveTab
}: UseAutoImportProps) {
  const { toast } = useToast();
  const [autoImportTriggered, setAutoImportTriggered] = useState(false);
  
  // Auto-import trails when the component loads if no active bulk job is running
  // and there are active data sources available
  useEffect(() => {
    const triggerBulkImport = async () => {
      if (autoImportTriggered) return;
      
      // Wait for data sources to load
      if (loading) return;
      
      // Don't trigger if already importing
      if (bulkImportLoading || activeBulkJobId) return;
      
      // Check if we have active data sources
      const activeSources = dataSources.filter(s => s.is_active);
      if (activeSources.length === 0) return;
      
      // Mark as triggered to prevent multiple attempts
      setAutoImportTriggered(true);
      
      // Show toast notification
      toast({
        title: "Starting Trail Import",
        description: `Importing approximately ${trailCount.toLocaleString()} trails from ${activeSources.length} sources.`,
      });
      
      // Switch to bulk tab to show progress
      setActiveTab('bulk');
      
      // Start bulk import with all active sources
      const sourceIds = activeSources.map(s => s.id);
      await handleBulkImport(sourceIds, trailCount);
    };
    
    // Try to trigger bulk import
    triggerBulkImport();
  }, [
    loading, 
    dataSources, 
    activeBulkJobId, 
    bulkImportLoading, 
    handleBulkImport, 
    trailCount, 
    autoImportTriggered, 
    toast,
    setActiveTab
  ]);
  
  return { autoImportTriggered };
}
