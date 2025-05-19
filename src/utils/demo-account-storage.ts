
/**
 * Utility for storing and retrieving demo account credentials
 */

export interface DemoCredentials {
  email: string;
  password: string;
}

/**
 * Stores demo account credentials in session storage
 * @param email Demo account email
 * @param password Demo account password
 */
export const storeCredentials = (email: string, password: string): void => {
  try {
    sessionStorage.setItem('greentrails.demo.email', email);
    sessionStorage.setItem('greentrails.demo.password', password);
    console.log('Demo credentials stored in session storage');
  } catch (error) {
    console.error('Error storing demo credentials:', error);
  }
};

/**
 * Loads saved demo account credentials from session storage
 * @returns The saved credentials or null if none exist
 */
export const loadSavedCredentials = (): DemoCredentials | null => {
  try {
    const email = sessionStorage.getItem('greentrails.demo.email');
    const password = sessionStorage.getItem('greentrails.demo.password');
    
    if (!email || !password) {
      return null;
    }
    
    return { email, password };
  } catch (error) {
    console.error('Error loading demo credentials:', error);
    return null;
  }
};

/**
 * Clears stored demo account credentials
 */
export const clearStoredCredentials = (): void => {
  try {
    sessionStorage.removeItem('greentrails.demo.email');
    sessionStorage.removeItem('greentrails.demo.password');
    console.log('Cleared stored demo credentials');
  } catch (error) {
    console.error('Error clearing demo credentials:', error);
  }
};
