
import { SignInService } from './sign-in-service';
import { SignUpService } from './sign-up-service';
import { SignOutService } from './sign-out-service';
import { PasswordService } from './password-service';
import { AgeVerificationService, verifyUserAge } from './age-verification-service';
import type { AuthResult, UserMetadata } from './types';

/**
 * Unified AuthService for easier usage across the application
 */
export const AuthService = {
  // Authentication methods
  signIn: SignInService.signIn,
  signUp: SignUpService.signUp,
  signOut: SignOutService.signOut,
  
  // Password management
  resetPassword: PasswordService.resetPassword,
  updatePassword: PasswordService.updatePassword,
  
  // Age verification
  verifyAge: AgeVerificationService.verifyAge,
  verifyUserAge: AgeVerificationService.verifyUserAge
};

// Export individual services for direct access
export {
  SignInService,
  SignUpService,
  SignOutService,
  PasswordService,
  AgeVerificationService,
  verifyUserAge
};

// Export types
export type { AuthResult, UserMetadata };
