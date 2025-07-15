
export const useSignUpValidation = () => {
  const validateEmail = (email: string): string | null => {
    if (!email.trim()) {
      return 'Email is required';
    }
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      return 'Please enter a valid email address';
    }
    
    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (!password) {
      return 'Password is required';
    }
    
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    
    // Check for password strength (at least one letter and one number)
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    if (!hasLetter || !hasNumber) {
      return 'Password must contain at least one letter and one number';
    }
    
    return null;
  };

  const validateUsername = (username: string): string | null => {
    if (!username.trim()) {
      return 'Username is required';
    }
    
    if (username.length < 3) {
      return 'Username must be at least 3 characters long';
    }
    
    if (username.length > 20) {
      return 'Username must be 20 characters or less';
    }
    
    // Check for valid username characters (alphanumeric, underscore, dash)
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(username)) {
      return 'Username can only contain letters, numbers, underscores, and dashes';
    }
    
    return null;
  };

  const validateFullName = (fullName: string): string | null => {
    if (!fullName.trim()) {
      return 'Full name is required';
    }
    
    if (fullName.trim().length < 2) {
      return 'Full name must be at least 2 characters long';
    }
    
    // Check that name contains at least first and last name
    const nameParts = fullName.trim().split(' ').filter(part => part.length > 0);
    if (nameParts.length < 2) {
      return 'Please enter your first and last name';
    }
    
    return null;
  };

  const validateAge = (birthYear: string): { error: string | null; age?: number } => {
    if (!birthYear) {
      return { error: 'Please select your birth year' };
    }

    const currentYear = new Date().getFullYear();
    const age = currentYear - parseInt(birthYear);
    
    if (age < 13) {
      return { error: 'You must be at least 13 years old to create an account' };
    }
    
    if (age < 21) {
      return { error: 'You must be at least 21 years old for full access to GreenTrails features' };
    }
    
    return { error: null, age };
  };

  const validateForm = (
    email: string,
    password: string,
    confirmPassword: string,
    fullName: string,
    username: string,
    birthYear: string
  ): string | null => {
    // Validate email
    const emailError = validateEmail(email);
    if (emailError) return emailError;
    
    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) return passwordError;
    
    // Validate password confirmation
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    
    // Validate full name
    const nameError = validateFullName(fullName);
    if (nameError) return nameError;
    
    // Validate username
    const usernameError = validateUsername(username);
    if (usernameError) return usernameError;
    
    // Validate age
    const ageValidation = validateAge(birthYear);
    if (ageValidation.error) return ageValidation.error;
    
    return null;
  };

  return { 
    validateForm,
    validateEmail,
    validatePassword,
    validateUsername,
    validateFullName,
    validateAge
  };
};
