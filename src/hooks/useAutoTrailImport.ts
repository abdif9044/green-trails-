
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { DatabaseSetupService } from '@/services/database/setup-service';
import { useTrailDataSources } from './trail-import/useTrailDataSources';
import { useBulkImportHandler } from './trail-import/useBulkImportHandler';
import { useBulkImportStatus } from './trail-import/useBulkImportStatus';

export function useAutoTrailImport() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSettingUpDb, setIsSettingUpDb] = useState(false);
  const [isImportTriggered, setIsImportTriggered] = useState(false);
  const [isImportComplete, setIsImportComplete] = useState(false);
  const { toast } = useToast();
  
  const DEFAULT_TRAIL_COUNT = 5000;
  
  // Hooks for trail data operations
  const { loadDataSources, dataSources, createDefaultDataSources } = useTrailDataSources();
  const { activeBulkJobId, setActiveBulkJobId, bulkProgress, setBulkImportLoading } = useBulkImportStatus(refreshData);
  const { handleBulkImport } = useBulkImportHandler(setActiveBulkJobId, setBulkImportLoading);
  
  // Effect to check when the import is complete
  useEffect(() => {
    if (isImportTriggered && activeBulkJobId === null && !isSettingUpDb && !loading && !isImportComplete) {
      setIsImportComplete(true);
      toast({
        title: "Import completed",
        description: "Trail data has been imported successfully. Redirecting to discover page..."
      });
      
      setTimeout(() => {
        navigate('/discover');
      }, 3000);
    }
  }, [isImportTriggered, activeBulkJobId, isSettingUpDb, loading, navigate, toast, isImportComplete]);
  
  const initializeAutoImport = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await setupDatabase();
      await loadAllDataSources();
      await startAutoImport();
    } catch (err) {
      console.error('Auto-import initialization error:', err);
      setError('Failed to initialize auto-import process');
      toast({
        title: "Auto-import failed",
        description: "There was a problem setting up the auto-import process",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const setupDatabase = async () => {
    setIsSettingUpDb(true);
    try {
      const tablesExist = await DatabaseSetupService.checkBulkImportTablesExist();
      
      if (!tablesExist) {
        toast({
          title: "Setting up database",
          description: "Creating necessary tables for trail import...",
        });
        
        const result = await DatabaseSetupService.setupBulkImportTables();
        
        if (!result.success) {
          throw new Error("Failed to set up database tables");
        }
        
        toast({
          title: "Database setup complete",
          description: "Successfully created trail import tables.",
        });
      }
      return true;
    } catch (error) {
      console.error('Error checking/setting up database:', error);
      setError("An unexpected error occurred while setting up database.");
      toast({
        title: "Database setup failed",
        description: "Failed to set up database for trail import.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsSettingUpDb(false);
    }
  };
  
  const loadAllDataSources = async () => {
    try {
      const sources = await loadDataSources();
      
      if (!sources || sources.length === 0) {
        console.log('No data sources found, creating defaults');
        await createDefaultDataSources();
        await loadDataSources();
      }
    } catch (error) {
      console.error('Error loading data sources:', error);
      setError("Failed to load trail data sources");
      toast({
        title: "Error loading sources",
        description: "Could not load trail data sources for import",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  function refreshData() {
    loadDataSources();
  }
  
  const startAutoImport = async () => {
    if (dataSources.length === 0) {
      setError("No data sources available for import");
      toast({
        title: "Import failed",
        description: "No data sources available to import from",
        variant: "destructive",
      });
      return false;
    }
    
    const activeSources = dataSources.filter(source => source.is_active).map(source => source.id);
    
    if (activeSources.length === 0) {
      setError("No active data sources available");
      toast({
        title: "Import failed",
        description: "No active data sources found for import",
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Starting auto-import",
      description: `Importing approximately ${DEFAULT_TRAIL_COUNT.toLocaleString()} trails from ${activeSources.length} sources`,
    });
    
    const success = await handleBulkImport(activeSources, DEFAULT_TRAIL_COUNT);
    
    if (success) {
      setIsImportTriggered(true);
      return true;
    }
    
    setError("Failed to start bulk import");
    toast({
      title: "Import failed",
      description: "Could not start the automatic trail import process",
      variant: "destructive",
    });
    
    return false;
  };
  
  return {
    loading,
    error,
    isSettingUpDb,
    isImportTriggered,
    isImportComplete,
    bulkProgress,
    activeBulkJobId,
    initializeAutoImport,
  };
}
