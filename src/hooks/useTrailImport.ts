
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useTrailDataSources } from './trail-import/useTrailDataSources';
import { useImportJobs } from './trail-import/useImportJobs';
import { useSingleImport } from './trail-import/useSingleImport';
import { useBulkImportStatus } from './trail-import/useBulkImportStatus';
import { useBulkImportHandler } from './trail-import/useBulkImportHandler';

// Types for data sources and import jobs
export type TrailDataSource = {
  id: string;
  name: string;
  source_type: string;
  url: string | null;
  country: string | null;
  state_province: string | null;
  region: string | null;
  last_synced: string | null;
  next_sync: string | null;
  is_active: boolean;
  config: any;
};

export type ImportJob = {
  id: string;
  source_id: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  trails_processed: number;
  trails_added: number;
  trails_updated: number;
  trails_failed: number;
  error_message: string | null;
  bulk_job_id?: string | null;
};

export type BulkImportJob = {
  id: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  total_trails_requested: number;
  total_sources: number;
  trails_processed: number;
  trails_added: number;
  trails_updated: number;
  trails_failed: number;
};

export function useTrailImport() {
  const [loading, setLoading] = useState(true);
  
  // Use our smaller, focused hooks
  const { 
    dataSources, 
    loadDataSources 
  } = useTrailDataSources();
  
  const { 
    importJobs, 
    bulkImportJobs, 
    loadImportJobs 
  } = useImportJobs();
  
  const { 
    activeBulkJobId, 
    setActiveBulkJobId, 
    bulkProgress, 
    bulkImportLoading, 
    setBulkImportLoading,
    checkForActiveBulkJob 
  } = useBulkImportStatus(loadData);
  
  const { 
    handleBulkImport 
  } = useBulkImportHandler(setActiveBulkJobId, setBulkImportLoading);
  
  const { 
    importLoading, 
    handleImport 
  } = useSingleImport(loadData);

  // Function to load all data
  async function loadData() {
    setLoading(true);
    try {
      // Load data sources and import jobs
      const sources = await loadDataSources();
      const { bulkImportJobs } = await loadImportJobs();
      
      // Check for active bulk job
      checkForActiveBulkJob(bulkImportJobs);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  return {
    dataSources,
    importJobs,
    bulkImportJobs,
    loading,
    importLoading,
    bulkImportLoading,
    activeBulkJobId,
    bulkProgress,
    loadData,
    handleImport,
    handleBulkImport,
    setActiveBulkJobId,
  };
}
