
import { useEffect, useState } from 'react';
import { TrailDataSource } from '@/hooks/useTrailImport';
import { useLocation } from 'react-router-dom';

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
  const location = useLocation();
  
  // Check for auto import parameter in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const autoImport = params.get('autoImport') === 'true';
    
    if (autoImport && !autoImportTriggered && !loading && !bulkImportLoading && !activeBulkJobId && dataSources.length > 0) {
      setAutoImportTriggered(true);
      
      // Filter active sources
      const activeSources = dataSources
        .filter(source => source.is_active)
        .map(source => source.id);
      
      if (activeSources.length > 0) {
        // Auto start a bulk import with all active sources
        handleBulkImport(activeSources, trailCount).then(success => {
          if (success) {
            setActiveTab('bulk');
          }
        });
      }
    }
  }, [dataSources, loading, location.search, autoImportTriggered, bulkImportLoading, activeBulkJobId, handleBulkImport, trailCount, setActiveTab]);
  
  return { autoImportTriggered };
}
