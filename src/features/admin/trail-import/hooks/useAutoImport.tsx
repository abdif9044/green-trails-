
import { useEffect, useState } from 'react';
import { TrailDataSource } from '@/hooks/useTrailImport';

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
  const [autoImportTriggered, setAutoImportTriggered] = useState(false);
  
  // Auto-import functionality
  useEffect(() => {
    const autoImport = async () => {
      // Check if we have data sources and no active import job
      if (
        !loading && 
        !bulkImportLoading && 
        !activeBulkJobId && 
        dataSources.length > 0 &&
        !autoImportTriggered
      ) {
        setAutoImportTriggered(true);
        console.log('Starting auto-import process...');
        
        // Filter active sources
        const activeSources = dataSources
          .filter(source => source.is_active)
          .map(source => source.id);
        
        if (activeSources.length > 0) {
          // Start the bulk import with all active sources
          const success = await handleBulkImport(activeSources, trailCount);
          
          if (success) {
            console.log('Auto-import triggered successfully');
            // Switch to bulk tab to show progress
            setActiveTab('bulk');
          } else {
            console.error('Failed to trigger auto-import');
          }
        }
      }
    };
    
    // Check URL for auto param
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auto') === 'true') {
      autoImport();
    }
  }, [
    dataSources, 
    loading, 
    bulkImportLoading, 
    activeBulkJobId, 
    autoImportTriggered,
    handleBulkImport,
    trailCount,
    setActiveTab
  ]);
  
  return { autoImportTriggered };
}
