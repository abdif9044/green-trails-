
/**
 * Common result type for auth operations
 */
export interface AuthResult {
  success: boolean;
  message?: string;
}

/**
 * User metadata interface
 */
export interface UserMetadata {
  [key: string]: any;
}
