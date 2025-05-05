
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { AuthService } from '@/services/auth';

export const useUserManagement = (user: User | null) => {
  const { toast } = useToast();

  const verifyAge = async (birthdate: Date) => {
    const result = await AuthService.verifyAge(birthdate, user?.id);
    
    if (result) {
      toast({
        title: "Age verification successful",
        description: "Your account has been verified as 21+.",
      });
    } else {
      toast({
        title: "Age verification failed",
        description: "You must be 21 or older to use GreenTrails.",
        variant: "destructive",
      });
    }
    
    return result;
  };

  const resetPassword = async (email: string) => {
    const result = await AuthService.resetPassword(email);
    
    if (result.success) {
      toast({
        title: "Password reset email sent",
        description: "Please check your email to reset your password.",
      });
    } else {
      toast({
        title: "Password reset failed",
        description: result.message || "An error occurred during password reset",
        variant: "destructive",
      });
    }
    
    return result;
  };

  const updatePassword = async (password: string) => {
    const result = await AuthService.updatePassword(password, user?.id);
    
    if (result.success) {
      toast({
        title: "Password updated successfully",
        description: "Your password has been changed.",
      });
    } else {
      toast({
        title: "Password update failed",
        description: result.message || "An error occurred during password update",
        variant: "destructive",
      });
    }
    
    return result;
  };

  return {
    verifyAge,
    resetPassword,
    updatePassword,
  };
};
