
// Export all auth service components
export * from './sign-in-service';
export * from './sign-out-service';
export * from './sign-up-service';
export * from './password-service';
export * from './age-verification-service';
// Re-export without name collision
import { AgeVerificationService as AuthVerificationService } from './auth-verification-service';
export { AuthVerificationService };
export * from './types';

// Main consolidated AuthService object for convenience
import { SignInService } from './sign-in-service';
import { SignOutService } from './sign-out-service';
import { SignUpService } from './sign-up-service';
import { PasswordService } from './password-service';
import { AgeVerificationService } from './age-verification-service';
import { AgeVerificationService as AVerificationService } from './auth-verification-service';

export const AuthService = {
  signIn: SignInService.signIn,
  signUp: SignUpService.signUp,
  signOut: SignOutService.signOut,
  resetPassword: PasswordService.resetPassword,
  updatePassword: PasswordService.updatePassword,
  verifyAge: AgeVerificationService.verifyAge,
  verifyUserAge: AgeVerificationService.verifyUserAge,
  verifyAuthToken: AVerificationService.verifyAge, // Using the age verification function from auth-verification-service
};

// Convenience method for age verification
export const verifyUserAge = AgeVerificationService.verifyUserAge;
