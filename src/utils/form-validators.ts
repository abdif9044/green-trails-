
/**
 * Validates email format
 * @param email Email string to validate
 * @returns True if email is valid
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return !!email && emailRegex.test(email);
};

/**
 * Validates password meets minimum requirements
 * @param password Password to validate
 * @returns True if password is valid
 */
export const validatePassword = (password: string): boolean => {
  return !!password && password.length >= 6;
};

/**
 * Validates the two passwords match
 * @param password Original password
 * @param confirmPassword Confirmation password
 * @returns True if passwords match
 */
export const passwordsMatch = (password: string, confirmPassword: string): boolean => {
  return !!confirmPassword && password === confirmPassword;
};

/**
 * Validates a year is reasonable for a birth year
 * @param yearValue Year string to validate
 * @returns True if year is valid
 */
export const validateYear = (yearValue: string): boolean => {
  if (!yearValue) {
    return false;
  }
  
  const yearNum = parseInt(yearValue);
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 120; // Reasonable lower bound for birth year
  
  return !isNaN(yearNum) && yearNum >= minYear && yearNum <= currentYear;
};

/**
 * Calculates age from birth date
 * @param birthDate Date object representing birth date
 * @returns Age in years
 */
export const calculateAge = (birthDate: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};
