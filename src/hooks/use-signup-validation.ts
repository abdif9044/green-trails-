
import { useState } from 'react';
import {
  validateEmail,
  validatePassword,
  passwordsMatch,
  validateDateOfBirth
} from '@/utils/form-validators';

export const useSignupValidation = () => {
  // Validation states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [dobError, setDobError] = useState('');

  const validateEmailField = (emailValue: string): boolean => {
    const trimmedEmail = emailValue.trim();
    if (!trimmedEmail) {
      setEmailError('Email is required');
      return false;
    } else if (!validateEmail(trimmedEmail)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePasswordField = (passwordValue: string): boolean => {
    if (!passwordValue) {
      setPasswordError('Password is required');
      return false;
    } else if (!validatePassword(passwordValue)) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirmPasswordField = (password: string, confirmPassword: string): boolean => {
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      return false;
    } else if (!passwordsMatch(password, confirmPassword)) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const validateForm = (email: string, password: string, confirmPassword: string, 
                         showDobFields: boolean, day: string, month: string, year: string): boolean => {
    const isEmailValid = validateEmailField(email);
    const isPasswordValid = validatePasswordField(password);
    const isConfirmPasswordValid = validateConfirmPasswordField(password, confirmPassword);
    
    if (!showDobFields) {
      return isEmailValid && isPasswordValid && isConfirmPasswordValid;
    }
    
    const dobValidation = validateDateOfBirth(day, month, year);
    setDobError(dobValidation.message || '');
    return isEmailValid && isPasswordValid && isConfirmPasswordValid && dobValidation.isValid;
  };

  return {
    emailError,
    passwordError,
    confirmPasswordError,
    dobError,
    setDobError,
    validateEmailField,
    validatePasswordField,
    validateConfirmPasswordField,
    validateForm
  };
};
