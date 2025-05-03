
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { createExtendedSupabaseClient } from '@/types/supabase-extensions';

// Create an extended client with the additional types
const extendedSupabase = createExtendedSupabaseClient(supabase);

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
  const { toast } = useToast();
  const [dataSources, setDataSources] = useState<TrailDataSource[]>([]);
  const [importJobs, setImportJobs] = useState<ImportJob[]>([]);
  const [bulkImportJobs, setBulkImportJobs] = useState<BulkImportJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [importLoading, setImportLoading] = useState<Record<string, boolean>>({});
  const [bulkImportLoading, setBulkImportLoading] = useState(false);
  const [activeBulkJobId, setActiveBulkJobId] = useState<string | null>(null);
  const [bulkProgress, setBulkProgress] = useState(0);

  // Function to load all data
  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch data sources
      const { data: sources, error: sourcesError } = await supabase
        .from("trail_data_sources")
        .select("*")
        .order("last_synced", { ascending: false });
        
      if (sourcesError) throw sourcesError;
      
      // Fetch recent import jobs
      const { data: jobs, error: jobsError } = await supabase
        .from("trail_import_jobs")
        .select("*")
        .order("started_at", { ascending: false })
        .limit(20);
        
      if (jobsError) throw jobsError;
      
      // Fetch bulk import jobs using the extended client
      const { data: bulkJobs, error: bulkJobsError } = await extendedSupabase
        .from("bulk_import_jobs")
        .select("*")
        .order("started_at", { ascending: false })
        .limit(10);
        
      if (bulkJobsError) throw bulkJobsError;
      
      setDataSources(sources || []);
      setImportJobs(jobs || []);
      setBulkImportJobs(bulkJobs || []);
      
      // Check if there's an active bulk job
      const activeJob = bulkJobs?.find(job => job.status === 'processing');
      if (activeJob) {
        setActiveBulkJobId(activeJob.id);
        const progress = Math.round((activeJob.trails_processed / activeJob.total_trails_requested) * 100);
        setBulkProgress(progress);
      }
      
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error loading data",
        description: "Failed to load trail import data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to start a single source import
  const handleImport = async (sourceId: string) => {
    if (importLoading[sourceId]) return;
    
    setImportLoading(prev => ({ ...prev, [sourceId]: true }));
    try {
      // Call the import-trails edge function
      const response = await supabase.functions.invoke('import-trails', {
        body: { sourceId }
      });
      
      if (response.error) throw new Error(response.error.message);
      
      toast({
        title: "Import started",
        description: "The trail import process has been started successfully.",
      });
      
      // Refresh the import jobs list
      loadData();
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import error",
        description: "Failed to start the trail import process.",
        variant: "destructive",
      });
    } finally {
      setImportLoading(prev => ({ ...prev, [sourceId]: false }));
    }
  };

  // Function to start a bulk import
  const handleBulkImport = async (sourceIds: string[], trailCount: number) => {
    if (bulkImportLoading || sourceIds.length === 0) return false;
    
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

  // Effect to monitor the active bulk job
  useEffect(() => {
    if (!activeBulkJobId) return;
    
    const interval = setInterval(async () => {
      try {
        const { data, error } = await extendedSupabase
          .from("bulk_import_jobs")
          .select("*")
          .eq("id", activeBulkJobId)
          .single();
          
        if (error || !data) {
          clearInterval(interval);
          return;
        }
        
        if (data.status === "completed" || data.status === "error") {
          // Job finished
          clearInterval(interval);
          setActiveBulkJobId(null);
          loadData();
          
          toast({
            title: data.status === "completed" ? "Bulk import completed" : "Bulk import error",
            description: `Processed ${data.trails_processed.toLocaleString()} trails: ${data.trails_added.toLocaleString()} added, ${data.trails_updated.toLocaleString()} updated, ${data.trails_failed.toLocaleString()} failed`,
            variant: data.status === "completed" ? "default" : "destructive",
          });
        } else {
          // Job in progress
          const progress = Math.round((data.trails_processed / data.total_trails_requested) * 100);
          setBulkProgress(progress);
        }
      } catch (error) {
        console.error("Error checking bulk job status:", error);
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [activeBulkJobId, toast]);

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
