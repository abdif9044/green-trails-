
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BootstrapStatus {
  isBootstrapping: boolean;
  currentTrailCount: number;
  targetTrailCount: number;
  isComplete: boolean;
  error: string | null;
  message: string | null;
  jobId: string | null;
  progressPercent: number;
}

export function useAutoTrailBootstrap() {
  const [status, setStatus] = useState<BootstrapStatus>({
    isBootstrapping: false,
    currentTrailCount: 0,
    targetTrailCount: 30000,
    isComplete: false,
    error: null,
    message: null,
    jobId: null,
    progressPercent: 0
  });

  useEffect(() => {
    // Trigger bootstrap check when the app starts
    checkAndBootstrap();
  }, []);

  const checkAndBootstrap = async () => {
    try {
      setStatus(prev => ({ ...prev, isBootstrapping: true, error: null }));
      
      console.log('🔍 Checking if 30K trail database needs bootstrapping...');
      
      // Call the bootstrap function
      const { data, error } = await supabase.functions.invoke('bootstrap-trail-database');
      
      if (error) {
        throw error;
      }
      
      console.log('Bootstrap response:', data);
      
      const progressPercent = Math.min((data.current_count / 30000) * 100, 100);
      
      setStatus({
        isBootstrapping: false,
        currentTrailCount: data.current_count || 0,
        targetTrailCount: 30000,
        isComplete: data.action === 'none',
        error: null,
        message: data.message,
        jobId: data.job_id || null,
        progressPercent
      });
      
      // If import was started, monitor progress
      if (data.action === 'import_started' && data.job_id) {
        monitorImportProgress(data.job_id);
      }
      
    } catch (error) {
      console.error('Bootstrap error:', error);
      setStatus(prev => ({
        ...prev,
        isBootstrapping: false,
        error: error.message || 'Bootstrap failed'
      }));
    }
  };

  const monitorImportProgress = async (jobId: string) => {
    const interval = setInterval(async () => {
      try {
        // Check job status
        const { data: job, error } = await supabase
          .from('bulk_import_jobs')
          .select('*')
          .eq('id', jobId)
          .single();
          
        if (error || !job) {
          console.error('Error checking job status:', error);
          clearInterval(interval);
          return;
        }
        
        const progressPercent = Math.min((job.trails_added / 30000) * 100, 100);
        
        setStatus(prev => ({
          ...prev,
          currentTrailCount: job.trails_added || 0,
          isComplete: job.status === 'completed',
          progressPercent,
          message: job.status === 'completed' 
            ? `30K import complete! Added ${job.trails_added} trails.`
            : `30K import in progress... ${job.trails_added || 0} trails added so far.`
        }));
        
        if (job.status === 'completed' || job.status === 'error') {
          clearInterval(interval);
        }
        
      } catch (error) {
        console.error('Error monitoring import:', error);
        clearInterval(interval);
      }
    }, 10000); // Check every 10 seconds
    
    // Stop monitoring after 60 minutes (for 30K import)
    setTimeout(() => {
      clearInterval(interval);
    }, 60 * 60 * 1000);
  };

  return {
    status,
    triggerBootstrap: checkAndBootstrap
  };
}
