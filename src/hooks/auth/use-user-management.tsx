
import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { AuthService } from '@/services/auth';
import { useToast } from '@/hooks/use-toast';

export const useUserManagement = (currentUser: User | null) => {
  const [resettingPassword, setResettingPassword] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [verifyingAge, setVerifyingAge] = useState(false);
  const { toast } = useToast();

  const resetPassword = async (email: string) => {
    setResettingPassword(true);
    try {
      const result = await AuthService.resetPassword(email);
      
      if (!result.success) {
        console.error('Password reset error:', result.message);
      }
      
      return result;
    } catch (error) {
      console.error('Exception during password reset:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      
      return { 
        success: false, 
        message: errorMessage
      };
    } finally {
      setResettingPassword(false);
    }
  };

  const updatePassword = async (password: string) => {
    setUpdatingPassword(true);
    try {
      const result = await AuthService.updatePassword(password);
      
      if (!result.success) {
        console.error('Password update error:', result.message);
      }
      
      return result;
    } catch (error) {
      console.error('Exception during password update:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      
      return { 
        success: false, 
        message: errorMessage
      };
    } finally {
      setUpdatingPassword(false);
    }
  };

  // Updated to properly handle the birthdate
  const verifyAge = async (birthdate: Date) => {
    if (!currentUser) {
      console.error('Cannot verify age: No user is logged in');
      toast({
        title: "Authentication required",
        description: "You must be signed in to verify your age",
        variant: "destructive",
      });
      return false;
    }
    
    setVerifyingAge(true);
    
    try {
      console.log(`Verifying age for user ${currentUser.id} with birthdate:`, birthdate);
      const result = await AuthService.verifyAge(birthdate, currentUser.id);
      
      if (!result) {
        console.error('Age verification failed for user:', currentUser.id);
        toast({
          title: "Age verification failed",
          description: "You must be 21 or older to use GreenTrails",
          variant: "destructive",
        });
      } else {
        console.log('Age verification successful for user:', currentUser.id);
      }
      
      return result;
    } catch (error) {
      console.error('Exception during age verification:', error);
      toast({
        title: "Age verification error",
        description: "An error occurred while verifying your age",
        variant: "destructive",
      });
      return false;
    } finally {
      setVerifyingAge(false);
    }
  };

  return {
    resetPassword,
    updatePassword,
    verifyAge,
    resettingPassword,
    updatingPassword,
    verifyingAge
  };
};
