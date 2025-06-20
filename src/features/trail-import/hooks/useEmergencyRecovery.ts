
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { RecoveryStatus } from '../types/import-types';

export function useEmergencyRecovery() {
  const [status, setStatus] = useState<RecoveryStatus>({
    phase: 'initialization',
    step: 'Ready to start recovery',
    progress: 0,
    canProceed: true
  });
  
  const { toast } = useToast();

  const executeRecoveryPlan = async () => {
    try {
      setStatus({
        phase: 'initialization',
        step: 'Starting emergency recovery...',
        progress: 10,
        canProceed: false
      });

      // Phase 1: Test with bulletproof import
      setStatus(prev => ({
        ...prev,
        phase: 'testing',
        step: 'Testing bulletproof import system...',
        progress: 25
      }));

      const { data: testResult, error: testError } = await supabase.functions.invoke('bulletproof-trail-import', {
        body: {
          testMode: true,
          maxTrails: 1000,
          batchSize: 50,
          validateFirst: true
        }
      });

      if (testError || !testResult?.success) {
        throw new Error(`Test import failed: ${testError?.message || 'Unknown error'}`);
      }

      toast({
        title: "✅ Test Successful",
        description: `Test import added ${testResult.trails_added} trails`,
      });

      // Phase 2: Scale up gradually
      setStatus(prev => ({
        ...prev,
        phase: 'scaling',
        step: 'Scaling to full import...',
        progress: 50
      }));

      const { data: fullResult, error: fullError } = await supabase.functions.invoke('bulletproof-trail-import', {
        body: {
          testMode: false,
          maxTrails: 25000,
          batchSize: 100,
          parallelWorkers: 3
        }
      });

      if (fullError || !fullResult?.success) {
        throw new Error(`Full import failed: ${fullError?.message || 'Unknown error'}`);
      }

      setStatus({
        phase: 'completed',
        step: 'Recovery completed successfully!',
        progress: 100,
        canProceed: true
      });

      toast({
        title: "🎉 Recovery Complete!",
        description: `Successfully imported ${fullResult.trails_added} trails`,
      });

    } catch (error) {
      console.error('Recovery failed:', error);
      setStatus({
        phase: 'error',
        step: 'Recovery failed',
        progress: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
        canProceed: true
      });

      toast({
        title: "❌ Recovery Failed",
        description: error instanceof Error ? error.message : 'Recovery encountered an error',
        variant: "destructive",
      });
    }
  };

  const resetRecovery = () => {
    setStatus({
      phase: 'initialization',
      step: 'Ready to start recovery',
      progress: 0,
      canProceed: true
    });
  };

  return {
    status,
    executeRecoveryPlan,
    resetRecovery
  };
}
