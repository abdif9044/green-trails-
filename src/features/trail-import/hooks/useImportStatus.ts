
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ImportProgress, BulkImportJob } from '../types/import-types';

export function useImportStatus() {
  const [progress, setProgress] = useState<ImportProgress>({
    currentStep: 'Idle',
    progress: 0,
    isActive: false,
    currentCount: 0,
    targetCount: 0
  });
  
  const [recentJobs, setRecentJobs] = useState<BulkImportJob[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCurrentTrailCount = async () => {
    try {
      const { count } = await supabase
        .from('trails')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    } catch (error) {
      console.error('Error fetching trail count:', error);
      return 0;
    }
  };

  const fetchRecentJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('bulk_import_jobs')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setRecentJobs(data || []);
    } catch (error) {
      console.error('Error fetching import jobs:', error);
    }
  };

  const checkActiveJobs = async () => {
    try {
      const { data } = await supabase
        .from('bulk_import_jobs')
        .select('*')
        .eq('status', 'processing')
        .order('started_at', { ascending: false })
        .limit(1);

      const activeJob = data?.[0];
      const currentCount = await fetchCurrentTrailCount();

      if (activeJob) {
        setProgress({
          currentStep: 'Import in progress...',
          progress: Math.round((activeJob.trails_added / activeJob.total_trails_requested) * 100),
          isActive: true,
          currentCount,
          targetCount: activeJob.total_trails_requested
        });
      } else {
        setProgress(prev => ({
          ...prev,
          currentStep: currentCount > 0 ? 'Ready' : 'No trails imported',
          isActive: false,
          currentCount
        }));
      }
    } catch (error) {
      console.error('Error checking active jobs:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchRecentJobs(), checkActiveJobs()]);
      setLoading(false);
    };

    loadData();

    // Refresh every 5 seconds if there's an active job
    const interval = setInterval(() => {
      if (progress.isActive) {
        checkActiveJobs();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [progress.isActive]);

  return {
    progress,
    recentJobs,
    loading,
    refreshData: () => Promise.all([fetchRecentJobs(), checkActiveJobs()]),
    fetchCurrentTrailCount
  };
}
