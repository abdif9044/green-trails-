
import { SignInService } from './sign-in-service';
import { SignUpService } from './sign-up-service';
import { SignOutService } from './sign-out-service';
import { PasswordService } from './password-service';
import { AgeVerificationService } from './age-verification-service';

// Create a unified AuthService interface for easier usage
export const AuthService = {
  signIn: SignInService.signIn,
  signUp: SignUpService.signUp,
  signOut: SignOutService.signOut,
  resetPassword: PasswordService.resetPassword,
  updatePassword: PasswordService.updatePassword,
  verifyAge: AgeVerificationService.verifyAge
};

// Export individual services for direct access
export {
  SignInService,
  SignUpService,
  SignOutService,
  PasswordService,
  AgeVerificationService
};
