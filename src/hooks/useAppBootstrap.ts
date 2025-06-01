
import { useState, useEffect } from 'react';
import { autoBootstrapService } from '@/services/trail-import/auto-bootstrap-service';
import { useToast } from '@/hooks/use-toast';

export function useAppBootstrap() {
  const [isBootstrapping, setIsBootstrapping] = useState(false);
  const [bootstrapComplete, setBootstrapComplete] = useState(false);
  const [trailCount, setTrailCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    initializeBootstrap();
  }, []);

  const initializeBootstrap = async () => {
    try {
      console.log('🚀 Initializing app bootstrap...');
      setIsBootstrapping(true);

      // Check if bootstrap is needed and trigger if necessary
      const result = await autoBootstrapService.checkAndBootstrap();
      
      setTrailCount(result.currentCount);
      
      if (result.needed && result.triggered) {
        console.log('✅ Auto-bootstrap triggered successfully');
        
        // Monitor progress
        const progressInterval = setInterval(async () => {
          const progress = await autoBootstrapService.getBootstrapProgress();
          setTrailCount(progress.currentCount);
          
          // Consider bootstrap complete when we have 25K+ trails
          if (progress.currentCount >= 25000 || !progress.isActive) {
            setBootstrapComplete(true);
            clearInterval(progressInterval);
            
            if (progress.currentCount >= 25000) {
              toast({
                title: "🎉 Bootstrap Complete!",
                description: `Successfully loaded ${progress.currentCount.toLocaleString()} trails`,
              });
            }
          }
        }, 5000);
        
        // Clean up after 10 minutes
        setTimeout(() => {
          clearInterval(progressInterval);
          setBootstrapComplete(true);
        }, 600000);
        
      } else if (!result.needed) {
        console.log('✅ Bootstrap not needed, sufficient trails already loaded');
        setBootstrapComplete(true);
      } else {
        console.log('⚠️ Bootstrap needed but not triggered automatically');
        setBootstrapComplete(true); // Allow app to continue
      }
      
    } catch (error) {
      console.error('💥 Bootstrap initialization error:', error);
      setBootstrapComplete(true); // Allow app to continue even if bootstrap fails
    } finally {
      setIsBootstrapping(false);
    }
  };

  return {
    isBootstrapping,
    bootstrapComplete,
    trailCount,
    initializeBootstrap
  };
}
