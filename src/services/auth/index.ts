
import { SignInService } from './sign-in-service';
import { SignUpService } from './sign-up-service';
import { SignOutService } from './sign-out-service';
import { PasswordService } from './password-service';
import { AgeVerificationService, verifyUserAge } from './age-verification-service';
import type { AuthResult, UserMetadata } from './types';

/**
 * Unified AuthService for easier usage across the application
 * Provides a centralized interface to all authentication functionality
 */
export const AuthService = {
  // Authentication methods
  /**
   * Sign in a user with email and password
   * @param email User's email
   * @param password User's password
   * @returns Promise with auth result
   */
  signIn: SignInService.signIn,
  
  /**
   * Register a new user
   * @param email User's email
   * @param password User's password
   * @param metadata Additional user metadata (should include birthdate for age verification)
   * @returns Promise with auth result
   */
  signUp: SignUpService.signUp,
  
  /**
   * Sign out the current user
   * @param userId Optional user ID for logging purposes
   * @returns Promise with auth result
   */
  signOut: SignOutService.signOut,
  
  // Password management
  /**
   * Send a password reset email
   * @param email User's email address
   * @returns Promise with auth result
   */
  resetPassword: PasswordService.resetPassword,
  
  /**
   * Update a user's password
   * @param password New password
   * @param userId Optional user ID for logging
   * @returns Promise with auth result
   */
  updatePassword: PasswordService.updatePassword,
  
  // Age verification
  /**
   * Verify a user's age (21+)
   * @param birthdate User's date of birth
   * @param userId User's ID
   * @returns Promise resolving to verification result (boolean)
   */
  verifyAge: AgeVerificationService.verifyAge,
  
  /**
   * Check if user is already age verified
   * @param userId User's ID
   * @returns Promise resolving to verification status (boolean)
   */
  verifyUserAge: AgeVerificationService.verifyUserAge,
  
  // Debugging helper
  /**
   * Get diagnostic information about auth services
   * @returns Object with diagnostic info
   */
  getDiagnosticInfo: () => {
    return {
      serviceStatus: 'active',
      services: [
        'SignIn', 'SignUp', 'SignOut',
        'PasswordReset', 'PasswordUpdate', 
        'AgeVerification'
      ],
      timestamp: new Date().toISOString()
    };
  }
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
