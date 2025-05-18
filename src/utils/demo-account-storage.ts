
/**
 * Utility for managing demo account credentials in session storage
 */

// Storage keys for demo credentials
const STORAGE_KEY_EMAIL = 'greentrails.demo.email';
const STORAGE_KEY_PASSWORD = 'greentrails.demo.password';
const STORAGE_KEY_CREATED = 'greentrails.demo.created';

/**
 * Type definition for demo account credentials
 */
export interface DemoCredentials {
  email: string;
  password: string;
}

/**
 * Loads saved demo account credentials from session storage
 * @returns Saved credentials if they exist and aren't expired, or null
 */
export const loadSavedCredentials = (): DemoCredentials | null => {
  try {
    const email = sessionStorage.getItem(STORAGE_KEY_EMAIL);
    const password = sessionStorage.getItem(STORAGE_KEY_PASSWORD);
    const createdTime = sessionStorage.getItem(STORAGE_KEY_CREATED);
  
    // If we have all the required data and it's not too old (24 hours)
    if (email && password && createdTime) {
      const created = parseInt(createdTime);
      const now = Date.now();
      const dayInMs = 24 * 60 * 60 * 1000;
      
      // Only use credentials if they're less than 24 hours old
      if (now - created < dayInMs) {
        return { email, password };
      } else {
        // Credentials too old, clear them
        clearStoredCredentials();
      }
    }
  } catch (err) {
    console.error("Error loading saved demo credentials:", err);
    clearStoredCredentials();
  }
  
  return null;
};

/**
 * Clears demo account credentials from session storage
 */
export const clearStoredCredentials = (): void => {
  try {
    sessionStorage.removeItem(STORAGE_KEY_EMAIL);
    sessionStorage.removeItem(STORAGE_KEY_PASSWORD);
    sessionStorage.removeItem(STORAGE_KEY_CREATED);
  } catch (err) {
    console.error("Error clearing demo credentials:", err);
  }
};

/**
 * Stores demo account credentials in session storage
 * @param email Demo account email
 * @param password Demo account password
 */
export const storeCredentials = (email: string, password: string): void => {
  try {
    sessionStorage.setItem(STORAGE_KEY_EMAIL, email);
    sessionStorage.setItem(STORAGE_KEY_PASSWORD, password);
    sessionStorage.setItem(STORAGE_KEY_CREATED, Date.now().toString());
  } catch (err) {
    console.error("Error storing demo credentials:", err);
  }
};
