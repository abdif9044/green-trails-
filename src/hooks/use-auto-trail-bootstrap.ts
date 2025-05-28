
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BootstrapStatus {
  isBootstrapping: boolean;
  currentTrailCount: number;
  isComplete: boolean;
  error: string | null;
  message: string | null;
  jobId: string | null;
}

export function useAutoTrailBootstrap() {
  const [status, setStatus] = useState<BootstrapStatus>({
    isBootstrapping: false,
    currentTrailCount: 0,
    isComplete: false,
    error: null,
    message: null,
    jobId: null
  });

  useEffect(() => {
    // Trigger bootstrap check when the app starts
    checkAndBootstrap();
  }, []);

  const checkAndBootstrap = async () => {
    try {
      setStatus(prev => ({ ...prev, isBootstrapping: true, error: null }));
      
      console.log('🔍 Checking if trail database needs bootstrapping...');
      
      // Call the bootstrap function
      const { data, error } = await supabase.functions.invoke('bootstrap-trail-database');
      
      if (error) {
        throw error;
      }
      
      console.log('Bootstrap response:', data);
      
      setStatus({
        isBootstrapping: false,
        currentTrailCount: data.current_count || 0,
        isComplete: data.action === 'none',
        error: null,
        message: data.message,
        jobId: data.job_id || null
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
        
        setStatus(prev => ({
          ...prev,
          currentTrailCount: job.trails_added || 0,
          isComplete: job.status === 'completed',
          message: job.status === 'completed' 
            ? `Import complete! Added ${job.trails_added} trails.`
            : `Import in progress... ${job.trails_added || 0} trails added so far.`
        }));
        
        if (job.status === 'completed' || job.status === 'error') {
          clearInterval(interval);
        }
        
      } catch (error) {
        console.error('Error monitoring import:', error);
        clearInterval(interval);
      }
    }, 10000); // Check every 10 seconds
    
    // Stop monitoring after 30 minutes
    setTimeout(() => {
      clearInterval(interval);
    }, 30 * 60 * 1000);
  };

  return {
    status,
    triggerBootstrap: checkAndBootstrap
  };
}
