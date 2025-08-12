
/**
 * Validates email format
 * @param email Email string to validate
 * @returns True if email is valid
 */
export const validateEmail = (email: string): boolean => {
  // Using a more permissive email regex that matches most valid emails
  // without being overly restrictive
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return !!email && emailRegex.test(email.trim());
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

/**
 * Validates if a date of birth makes the user at least 21 years old
 * @param day Day of birth
 * @param month Month name (e.g., "January")
 * @param year Year of birth
 * @returns Object containing validity and the Date object if valid
 */
export const validateDateOfBirth = (day: string, month: string, year: string): { isValid: boolean; birthDate: Date | null; message?: string } => {
  try {
    // Check if all fields are provided
    if (!day || !month || !year) {
      return { isValid: false, birthDate: null, message: 'Please complete all date of birth fields' };
    }
    
    // Validate day
    const dayNum = parseInt(day);
    if (isNaN(dayNum) || dayNum < 1 || dayNum > 31) {
      return { isValid: false, birthDate: null, message: 'Please enter a valid day (1-31)' };
    }
    
    // Validate year
    if (!validateYear(year)) {
      return { isValid: false, birthDate: null, message: 'Please enter a valid year' };
    }
    
    // Convert month name to index (0-11)
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const monthIndex = months.indexOf(month);
    
    if (monthIndex === -1) {
      return { isValid: false, birthDate: null, message: 'Please select a valid month' };
    }
    
    // Create the date object
    const birthDate = new Date(parseInt(year), monthIndex, dayNum);
    
    // Check if valid date (e.g., not February 30)
    if (
      birthDate.getFullYear() !== parseInt(year) ||
      birthDate.getMonth() !== monthIndex ||
      birthDate.getDate() !== dayNum
    ) {
      return { isValid: false, birthDate: null, message: 'Invalid date. Please check day, month, and year' };
    }
    
    const today = new Date();
    
    // Check if date is in the future
    if (birthDate > today) {
      return { isValid: false, birthDate: null, message: 'Date cannot be in the future' };
    }
    
    // Calculate age
    const age = calculateAge(birthDate);
    
    // Check if user is 21 or older
    if (age < 21) {
      return { 
        isValid: false, 
        birthDate, 
        message: `You must be 21 or older to access GreenTrails. You are currently ${age} years old.` 
      };
    }
    
    return { isValid: true, birthDate };
  } catch (error) {
    console.error('Error validating date of birth:', error);
    return { isValid: false, birthDate: null, message: 'An error occurred while validating your date of birth' };
  }
};
