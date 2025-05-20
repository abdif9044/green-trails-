
import { useEffect, useState } from 'react';
import { TrailDataSource } from '@/hooks/useTrailImport';
import { useLocation } from 'react-router-dom';
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
  const [autoImportTriggered, setAutoImportTriggered] = useState(false);
  const location = useLocation();
  const { toast } = useToast();
  
  // Check for auto import parameter in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const autoImport = params.get('autoImport') === 'true' || params.get('auto') === 'true';
    
    if (autoImport && !autoImportTriggered && !loading && !bulkImportLoading && !activeBulkJobId && dataSources.length > 0) {
      console.log('Auto-import detected in URL. Preparing to start import...');
      setAutoImportTriggered(true);
      
      // Filter active sources
      const activeSources = dataSources
        .filter(source => source.is_active)
        .map(source => source.id);
      
      if (activeSources.length > 0) {
        console.log(`Found ${activeSources.length} active sources. Starting auto-import...`);
        toast({
          title: "Auto-import starting",
          description: `Starting automatic import of ${trailCount} trails from ${activeSources.length} sources.`,
        });
        
        // Auto start a bulk import with all active sources
        handleBulkImport(activeSources, trailCount)
          .then(success => {
            if (success) {
              console.log('Auto-import successfully triggered');
              setActiveTab('bulk');
            } else {
              console.error('Failed to start auto-import');
              setAutoImportTriggered(false); // Reset to allow retry
            }
          })
          .catch(err => {
            console.error('Error during auto-import:', err);
            setAutoImportTriggered(false); // Reset to allow retry
          });
      } else {
        console.warn('No active sources found for auto-import');
        toast({
          title: "Auto-import failed",
          description: "No active data sources found. Please activate at least one source.",
          variant: "destructive",
        });
        setAutoImportTriggered(false); // Reset to allow retry
      }
    }
  }, [dataSources, loading, location.search, autoImportTriggered, bulkImportLoading, activeBulkJobId, handleBulkImport, trailCount, setActiveTab, toast]);
  
  // Function to manually trigger auto-import
  const triggerAutoImport = async () => {
    if (loading || bulkImportLoading || activeBulkJobId) {
      toast({
        title: "Import in progress",
        description: "Please wait for the current import to complete.",
      });
      return false;
    }
    
    if (dataSources.length === 0) {
      toast({
        title: "No data sources",
        description: "Please add and activate data sources first.",
        variant: "destructive",
      });
      return false;
    }
    
    console.log('Manual auto-import triggered');
    
    // Filter active sources
    const activeSources = dataSources
      .filter(source => source.is_active)
      .map(source => source.id);
    
    if (activeSources.length === 0) {
      toast({
        title: "No active sources",
        description: "Please activate at least one data source.",
        variant: "destructive",
      });
      return false;
    }
    
    setAutoImportTriggered(true);
    const success = await handleBulkImport(activeSources, trailCount);
    
    if (success) {
      setActiveTab('bulk');
      return true;
    } else {
      setAutoImportTriggered(false); // Reset to allow retry
      return false;
    }
  };
  
  return { 
    autoImportTriggered, 
    triggerAutoImport 
  };
}
