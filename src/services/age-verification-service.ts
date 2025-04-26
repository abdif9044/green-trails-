
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const verifyUserAge = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('is_age_verified')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    return data?.is_age_verified || false;
  } catch (error) {
    console.error('Error checking age verification:', error);
    return false;
  }
};

export const markUserAsAgeVerified = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ is_age_verified: true })
      .eq('id', userId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating age verification status:', error);
    return false;
  }
};

export const useAgeVerification = () => {
  const { toast } = useToast();
  
  const validateAgeWithDate = (
    day: string,
    month: string,
    year: string
  ): { isValid: boolean; message?: string } => {
    if (!day || !month || !year) {
      return { isValid: false, message: 'Please complete all date fields' };
    }
    
    try {
      // Parse the date
      const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const today = new Date();
      
      // Check if date is valid
      if (isNaN(birthDate.getTime())) {
        return { isValid: false, message: 'Please enter a valid date' };
      }
      
      // Check if date is in the future
      if (birthDate > today) {
        return { isValid: false, message: 'Date cannot be in the future' };
      }
      
      // Calculate age
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      // Check if 21 or older
      if (age < 21) {
        return { isValid: false, message: 'You must be 21 or older to use GreenTrails' };
      }
      
      return { isValid: true };
    } catch {
      return { isValid: false, message: 'Invalid date format' };
    }
  };
  
  const handleSuccessfulVerification = async (userId: string) => {
    const success = await markUserAsAgeVerified(userId);
    
    if (success) {
      toast({
        title: "Age Verified",
        description: "You now have access to all GreenTrails content.",
        variant: "default",
      });
      return true;
    } else {
      toast({
        title: "Verification Error",
        description: "There was an error verifying your age. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  return {
    validateAgeWithDate,
    handleSuccessfulVerification,
    verifyUserAge
  };
};
