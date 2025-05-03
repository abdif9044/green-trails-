
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
  
  const submitAgeVerification = async (birthdate: Date) => {
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
      const verified = await verifyAge(birthdate);
      setIsVerified(verified);
      
      if (!verified) {
        toast({
          title: "Age verification failed",
          description: "You must be 21 or older to access all features.",
          variant: "destructive",
        });
      }
      
      return verified;
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
