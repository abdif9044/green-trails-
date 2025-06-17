
import { supabase } from '@/integrations/supabase/client';
import { InputValidationService } from '../security/input-validation';
import { SecurityManager } from '../security/security-manager';

export class EnhancedAuthService {
  
  static async secureSignUp(email: string, password: string, additionalData?: any) {
    // Validate inputs
    const emailValidation = InputValidationService.validateEmail(email);
    if (!emailValidation.isValid) {
      return { success: false, error: emailValidation.error };
    }

    const passwordValidation = InputValidationService.validatePassword(password);
    if (!passwordValidation.isValid) {
      return { success: false, error: passwordValidation.errors.join('. ') };
    }

    // Check rate limiting
    const rateLimit = InputValidationService.checkRateLimit(email, 'signup', 3, 3600000); // 3 attempts per hour
    if (!rateLimit.allowed) {
      return { 
        success: false, 
        error: `Too many signup attempts. Please try again in ${Math.ceil(rateLimit.retryAfter! / 60)} minutes.` 
      };
    }

    try {
      // Log security event
      await SecurityManager.logSecurityEvent({
        event_type: 'signup_attempt',
        metadata: { email: email.substring(0, 3) + '***' }, // Partial email for privacy
        severity: 'low'
      });

      const { data, error } = await supabase.auth.signUp({
        email: emailValidation.isValid ? email : '',
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: additionalData
        }
      });

      if (error) {
        await SecurityManager.logSecurityEvent({
          event_type: 'signup_failed',
          metadata: { error: error.message, email: email.substring(0, 3) + '***' },
          severity: 'medium'
        });
        
        return { success: false, error: error.message };
      }

      if (data.user) {
        await SecurityManager.logSecurityEvent({
          event_type: 'signup_success',
          user_id: data.user.id,
          metadata: { email: email.substring(0, 3) + '***' },
          severity: 'low'
        });
      }

      return { success: true, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during signup';
      
      await SecurityManager.logSecurityEvent({
        event_type: 'signup_error',
        metadata: { error: errorMessage },
        severity: 'high'
      });
      
      return { success: false, error: errorMessage };
    }
  }

  static async secureSignIn(email: string, password: string) {
    // Validate email format
    const emailValidation = InputValidationService.validateEmail(email);
    if (!emailValidation.isValid) {
      return { success: false, error: emailValidation.error };
    }

    // Check rate limiting - more restrictive for sign-ins
    const rateLimit = InputValidationService.checkRateLimit(email, 'signin', 5, 900000); // 5 attempts per 15 minutes
    if (!rateLimit.allowed) {
      await SecurityManager.logSecurityEvent({
        event_type: 'signin_rate_limited',
        metadata: { email: email.substring(0, 3) + '***' },
        severity: 'high'
      });
      
      return { 
        success: false, 
        error: `Too many login attempts. Please try again in ${Math.ceil(rateLimit.retryAfter! / 60)} minutes.` 
      };
    }

    try {
      await SecurityManager.logSecurityEvent({
        event_type: 'signin_attempt',
        metadata: { email: email.substring(0, 3) + '***' },
        severity: 'low'
      });

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        await SecurityManager.logSecurityEvent({
          event_type: 'signin_failed',
          metadata: { error: error.message, email: email.substring(0, 3) + '***' },
          severity: 'medium'
        });
        
        return { success: false, error: error.message };
      }

      if (data.user) {
        await SecurityManager.logSecurityEvent({
          event_type: 'signin_success',
          user_id: data.user.id,
          metadata: { email: email.substring(0, 3) + '***' },
          severity: 'low'
        });
      }

      return { success: true, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during sign in';
      
      await SecurityManager.logSecurityEvent({
        event_type: 'signin_error',
        metadata: { error: errorMessage },
        severity: 'high'
      });
      
      return { success: false, error: errorMessage };
    }
  }

  static async securePasswordReset(email: string) {
    const emailValidation = InputValidationService.validateEmail(email);
    if (!emailValidation.isValid) {
      return { success: false, error: emailValidation.error };
    }

    // Rate limit password reset attempts
    const rateLimit = InputValidationService.checkRateLimit(email, 'password_reset', 3, 3600000); // 3 per hour
    if (!rateLimit.allowed) {
      return { 
        success: false, 
        error: `Too many password reset attempts. Please try again in ${Math.ceil(rateLimit.retryAfter! / 60)} minutes.` 
      };
    }

    try {
      await SecurityManager.logSecurityEvent({
        event_type: 'password_reset_request',
        metadata: { email: email.substring(0, 3) + '***' },
        severity: 'low'
      });

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?mode=reset`
      });

      if (error) {
        await SecurityManager.logSecurityEvent({
          event_type: 'password_reset_failed',
          metadata: { error: error.message },
          severity: 'medium'
        });
        
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during password reset';
      
      await SecurityManager.logSecurityEvent({
        event_type: 'password_reset_error',
        metadata: { error: errorMessage },
        severity: 'high'
      });
      
      return { success: false, error: errorMessage };
    }
  }

  static async secureUpdatePassword(newPassword: string) {
    const passwordValidation = InputValidationService.validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return { success: false, error: passwordValidation.errors.join('. ') };
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await SecurityManager.logSecurityEvent({
        event_type: 'password_update_attempt',
        user_id: user?.id,
        severity: 'medium'
      });

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        await SecurityManager.logSecurityEvent({
          event_type: 'password_update_failed',
          user_id: user?.id,
          metadata: { error: error.message },
          severity: 'high'
        });
        
        return { success: false, error: error.message };
      }

      await SecurityManager.logSecurityEvent({
        event_type: 'password_update_success',
        user_id: user?.id,
        severity: 'medium'
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during password update';
      
      await SecurityManager.logSecurityEvent({
        event_type: 'password_update_error',
        metadata: { error: errorMessage },
        severity: 'high'
      });
      
      return { success: false, error: errorMessage };
    }
  }

  static async secureAgeVerification(birthYear: string) {
    const validation = InputValidationService.validateBirthYear(birthYear);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Update user profile with age verification
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_age_verified: validation.age! >= 21 
        })
        .eq('id', user.id);

      if (error) {
        await SecurityManager.logSecurityEvent({
          event_type: 'age_verification_failed',
          user_id: user.id,
          metadata: { error: error.message },
          severity: 'medium'
        });
        
        return { success: false, error: error.message };
      }

      await SecurityManager.logSecurityEvent({
        event_type: 'age_verification_success',
        user_id: user.id,
        metadata: { age: validation.age, verified: validation.age! >= 21 },
        severity: 'low'
      });

      return { 
        success: true, 
        age: validation.age, 
        isVerified: validation.age! >= 21 
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during age verification';
      
      await SecurityManager.logSecurityEvent({
        event_type: 'age_verification_error',
        metadata: { error: errorMessage },
        severity: 'high'
      });
      
      return { success: false, error: errorMessage };
    }
  }
}
