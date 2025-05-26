
export const useSignUpValidation = () => {
  const validateForm = (
    email: string,
    password: string,
    confirmPassword: string,
    fullName: string,
    username: string,
    birthYear: string
  ): string | null => {
    if (!email.trim()) {
      return 'Email is required';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    
    if (!password) {
      return 'Password is required';
    }
    
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    
    if (!fullName.trim()) {
      return 'Full name is required';
    }
    
    if (!username.trim()) {
      return 'Username is required';
    }
    
    if (username.length < 3) {
      return 'Username must be at least 3 characters long';
    }

    if (!birthYear) {
      return 'Please select your birth year';
    }

    const currentYear = new Date().getFullYear();
    const age = currentYear - parseInt(birthYear);
    if (age < 13) {
      return 'You must be at least 13 years old to create an account';
    }
    
    return null;
  };

  return { validateForm };
};
