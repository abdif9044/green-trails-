
import { useState, useEffect } from 'react';
import { MassiveTrailImportOrchestrator } from '@/services/trail-import/massive-import-orchestrator';
import { useToast } from '@/hooks/use-toast';

interface ImportProgress {
  isRunning: boolean;
  totalJobs: number;
  completedJobs: number;
  totalTrailsRequested: number;
  totalTrailsAdded: number;
  totalTrailsFailed: number;
  progressPercent: number;
  estimatedTimeRemaining?: string;
}

export function useMassiveTrailImport() {
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState<ImportProgress>({
    isRunning: false,
    totalJobs: 0,
    completedJobs: 0,
    totalTrailsRequested: 0,
    totalTrailsAdded: 0,
    totalTrailsFailed: 0,
    progressPercent: 0
  });
  const [orchestrator, setOrchestrator] = useState<MassiveTrailImportOrchestrator | null>(null);
  const { toast } = useToast();

  /**
   * Start the massive import of 15,000 trails
   */
  const startMassiveImport = async (): Promise<boolean> => {
    if (isImporting) {
      toast({
        title: "Import already running",
        description: "Please wait for the current import to complete.",
        variant: "destructive"
      });
      return false;
    }

    try {
      setIsImporting(true);
      
      const newOrchestrator = new MassiveTrailImportOrchestrator();
      setOrchestrator(newOrchestrator);
      
      const result = await newOrchestrator.startMassiveImport();
      
      if (result.success) {
        setProgress(prev => ({ ...prev, isRunning: true }));
        
        toast({
          title: "Massive import started!",
          description: "Importing 15,000 trails from multiple sources. This will take 15-30 minutes.",
        });
        
        // Start progress monitoring
        startProgressMonitoring(newOrchestrator);
        
        return true;
      } else {
        setIsImporting(false);
        return false;
      }
    } catch (error) {
      console.error('Failed to start massive import:', error);
      setIsImporting(false);
      
      toast({
        title: "Import failed to start",
        description: "There was an error starting the massive trail import.",
        variant: "destructive"
      });
      
      return false;
    }
  };

  /**
   * Monitor import progress
   */
  const startProgressMonitoring = (orchestrator: MassiveTrailImportOrchestrator) => {
    const interval = setInterval(() => {
      const currentProgress = orchestrator.getProgress();
      
      setProgress({
        isRunning: currentProgress.progressPercent < 100,
        totalJobs: currentProgress.totalJobs,
        completedJobs: currentProgress.completedJobs,
        totalTrailsRequested: currentProgress.totalTrailsRequested,
        totalTrailsAdded: currentProgress.totalTrailsAdded,
        totalTrailsFailed: currentProgress.totalTrailsFailed,
        progressPercent: currentProgress.progressPercent,
        estimatedTimeRemaining: calculateTimeRemaining(currentProgress.progressPercent)
      });
      
      // Stop monitoring when complete
      if (currentProgress.progressPercent >= 100) {
        clearInterval(interval);
        setIsImporting(false);
        
        toast({
          title: "Massive import completed!",
          description: `Successfully imported ${currentProgress.totalTrailsAdded.toLocaleString()} trails. ${currentProgress.totalTrailsFailed > 0 ? `${currentProgress.totalTrailsFailed} trails failed.` : ''}`,
        });
      }
    }, 5000); // Check every 5 seconds

    // Cleanup interval after 2 hours (safety)
    setTimeout(() => {
      clearInterval(interval);
      if (isImporting) {
        setIsImporting(false);
        setProgress(prev => ({ ...prev, isRunning: false }));
      }
    }, 2 * 60 * 60 * 1000);
  };

  /**
   * Calculate estimated time remaining
   */
  const calculateTimeRemaining = (progressPercent: number): string => {
    if (progressPercent === 0) return "Calculating...";
    if (progressPercent >= 100) return "Complete";
    
    // Estimate based on current progress (assuming linear progression)
    const remainingPercent = 100 - progressPercent;
    const estimatedMinutes = Math.round((remainingPercent / progressPercent) * 20); // Assuming 20 minutes average
    
    if (estimatedMinutes < 60) {
      return `~${estimatedMinutes} minutes`;
    } else {
      const hours = Math.floor(estimatedMinutes / 60);
      const minutes = estimatedMinutes % 60;
      return `~${hours}h ${minutes}m`;
    }
  };

  /**
   * Quick start function for immediate use
   */
  const quickStart15KTrails = async (): Promise<boolean> => {
    return await startMassiveImport();
  };

  return {
    isImporting,
    progress,
    startMassiveImport,
    quickStart15KTrails
  };
}
