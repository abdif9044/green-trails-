
import { useState } from 'react';
import { useAuth } from './use-auth';
import { useToast } from './use-toast';
import { supabase } from '@/integrations/supabase/client';

export function useAgeVerification() {
  const [verifying, setVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const { user, verifyAge } = useAuth();
  const { toast } = useToast();
  
  const checkVerificationStatus = async () => {
    if (!user) {
      setIsVerified(false);
      return false;
    }
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_age_verified')
        .eq('id', user.id)
        .single();
        
      if (error) {
        console.error('Error checking age verification status:', error);
        setIsVerified(false);
        return false;
      }
      
      setIsVerified(data?.is_age_verified || false);
      return data?.is_age_verified || false;
    } catch (error) {
      console.error('Exception checking age verification:', error);
      setIsVerified(false);
      return false;
    }
  };
  
  const submitAgeVerification = async (birthYear: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be signed in to verify your age.",
        variant: "destructive",
      });
      return false;
    }
    
    setVerifying(true);
    try {
      const result = await verifyAge(birthYear);
      setIsVerified(result.success);
      
      if (!result.success) {
        toast({
          title: "Age verification failed",
          description: result.message || "You must be 18 or older to access all features.",
          variant: "destructive",
        });
      }
      
      return result.success;
    } catch (error) {
      console.error('Error during age verification:', error);
      toast({
        title: "Age verification error",
        description: "An error occurred during age verification.",
        variant: "destructive",
      });
      return false;
    } finally {
      setVerifying(false);
    }
  };
  
  return {
    isVerified,
    verifying,
    checkVerificationStatus,
    submitAgeVerification
  };
}
