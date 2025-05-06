
import React from 'react';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/auth/FormField';
import { cn } from '@/lib/utils';

interface AccountCredentialsFormProps {
  email: string;
  password: string;
  confirmPassword: string;
  emailError: string;
  passwordError: string;
  confirmPasswordError: string;
  formTouched: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onFieldChange: () => void;
  onBlurEmail: () => void;
  onBlurPassword: () => void;
  onBlurConfirmPassword: () => void;
}

export const AccountCredentialsForm: React.FC<AccountCredentialsFormProps> = ({
  email,
  password,
  confirmPassword,
  emailError,
  passwordError,
  confirmPasswordError,
  formTouched,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onFieldChange,
  onBlurEmail,
  onBlurPassword,
  onBlurConfirmPassword
}) => {
  return (
    <div className="space-y-4">
      <FormField id="email-signup" label="Email" error={emailError} showError={formTouched}>
        <Input
          id="email-signup"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            onEmailChange(e.target.value);
            onFieldChange();
          }}
          onBlur={onBlurEmail}
          className={cn(
            formTouched && emailError ? "border-red-500 focus-visible:ring-red-500" : ""
          )}
          required
        />
      </FormField>
      
      <FormField id="password-signup" label="Password" error={passwordError} showError={formTouched}>
        <Input
          id="password-signup"
          type="password"
          placeholder="Create a password (min. 6 characters)"
          value={password}
          onChange={(e) => {
            onPasswordChange(e.target.value);
            onFieldChange();
          }}
          onBlur={onBlurPassword}
          className={cn(
            formTouched && passwordError ? "border-red-500 focus-visible:ring-red-500" : ""
          )}
          required
        />
      </FormField>
      
      <FormField id="confirm-password" label="Confirm Password" error={confirmPasswordError} showError={formTouched}>
        <Input
          id="confirm-password"
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => {
            onConfirmPasswordChange(e.target.value);
            onFieldChange();
          }}
          onBlur={onBlurConfirmPassword}
          className={cn(
            formTouched && confirmPasswordError ? "border-red-500 focus-visible:ring-red-500" : ""
          )}
          required
        />
      </FormField>
    </div>
  );
};
