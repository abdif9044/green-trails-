import React from 'react';
import { AuthContext, AuthContextType } from '@/contexts/auth-context';
import { useSimpleAuthState } from '@/hooks/auth/use-simple-auth-state';
import { SecureAuthService } from '@/services/auth/secure-auth-service';
import { SecurityManager } from '@/services/security/security-manager';
import { supabase } from '@/integrations/supabase/client';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, session, loading, initialized } = useSimpleAuthState();

  const signIn = async (email: string, password: string) => {
    const result = await SecureAuthService.signIn(email, password);
    return {
      success: result.success,
      message: result.message,
      user: result.user,
    };
  };

  const signUp = async (email: string, password: string, metadata: object = {}) => {
    const result = await SecureAuthService.signUp(email, password, metadata);
    return {
      success: result.success,
      message: result.message,
      user: result.user,
    };
  };

  const signOut = async () => {
    const result = await SecureAuthService.signOut(user?.id);
    return {
      success: result.success,
      message: result.message,
    };
  };

  const verifyAge = async (birthYear: string) => {
    try {
      const age = new Date().getFullYear() - parseInt(birthYear);
      const isValid = age >= 21;
      
      if (user) {
        await SecurityManager.logSecurityEvent({
          event_type: 'age_verification_attempt',
          user_id: user.id,
          metadata: { age_verified: isValid, provided_birth_year: birthYear },
          severity: 'low',
        });
      }
      
      return {
        success: isValid,
        message: isValid ? 'Age verification successful' : 'You must be 21 or older to use GreenTrails',
        age,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Invalid birth year provided',
      };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const sanitizedEmail = await SecurityManager.sanitizeInput(email);
      
      const { error } = await supabase.auth.resetPasswordForEmail(sanitizedEmail, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) {
        await SecurityManager.logSecurityEvent({
          event_type: 'password_reset_failed',
          metadata: { email: sanitizedEmail, error: error.message },
          severity: 'medium',
        });
        
        return { success: false, message: error.message };
      }

      await SecurityManager.logSecurityEvent({
        event_type: 'password_reset_requested',
        metadata: { email: sanitizedEmail },
        severity: 'low',
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      // Enforce password policy
      const passwordCheck = await SecurityManager.enforcePasswordPolicy(password);
      if (!passwordCheck.isValid) {
        return {
          success: false,
          message: `Password requirements not met: ${passwordCheck.errors.join(', ')}`,
        };
      }

      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        if (user) {
          await SecurityManager.logSecurityEvent({
            event_type: 'password_update_failed',
            user_id: user.id,
            metadata: { error: error.message },
            severity: 'medium',
          });
        }
        
        return { success: false, message: error.message };
      }

      if (user) {
        await SecurityManager.logSecurityEvent({
          event_type: 'password_updated',
          user_id: user.id,
          severity: 'low',
        });
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    isInitialized: initialized,
    signIn,
    signUp,
    signOut,
    verifyAge,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
