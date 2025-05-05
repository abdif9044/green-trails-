
// This file is maintained for backward compatibility
// It re-exports the AuthService from the new modular structure
export { AuthService, verifyUserAge } from '@/services/auth';
export type { AuthResult, UserMetadata } from '@/services/auth/types';

// Add deprecation warning on import
console.warn(
  'Using auth-service.ts is deprecated. ' +
  'Please import from @/services/auth instead.'
);
