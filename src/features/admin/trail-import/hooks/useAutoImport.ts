
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TrailDataSource } from '@/hooks/useTrailImport';

type UseAutoImportProps = {
  dataSources: TrailDataSource[];
  loading: boolean;
  bulkImportLoading: boolean;
  activeBulkJobId: string | null;
  handleBulkImport: (sourceIds: string[], trailCount: number) => Promise<boolean>;
  trailCount: number;
  setActiveTab: (tab: string) => void;
};

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

  useEffect(() => {
    const triggerAutoImport = async () => {
      if (!autoImportTriggered && !loading && dataSources.length > 0 && !bulkImportLoading && !activeBulkJobId) {
        setAutoImportTriggered(true);
        
        // Get all active data sources
        const activeSources = dataSources
          .filter(s => s.is_active)
          .map(s => s.id);
        
        if (activeSources.length === 0) {
          toast({
            title: "No active data sources found",
            description: "Please activate at least one data source before importing.",
            variant: "destructive"
          });
          return;
        }
        
        toast({
          title: "Starting bulk import",
          description: `Initiating import of 55,369 trails from ${activeSources.length} sources.`,
        });
        
        const success = await handleBulkImport(activeSources, trailCount);
        if (success) {
          setActiveTab('bulk');
          toast({
            title: "Bulk import started",
            description: "The import process is now running in the background.",
          });
        }
      }
    };
    
    triggerAutoImport();
  }, [dataSources, loading, bulkImportLoading, autoImportTriggered, activeBulkJobId, handleBulkImport, toast, trailCount, setActiveTab]);

  return { autoImportTriggered };
}
