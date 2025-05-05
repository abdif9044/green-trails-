
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FormField } from '@/components/auth/FormField';
import { DateOfBirthForm } from '@/components/auth/DateOfBirthForm';
import {
  validateEmail,
  validatePassword,
  passwordsMatch,
  validateDateOfBirth
} from '@/utils/form-validators';

interface SignUpFormProps {
  onSuccess: () => void;
}

export const SignUpForm = ({ onSuccess }: SignUpFormProps) => {
  // Form field states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  
  // Form state management
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDobFields, setShowDobFields] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  
  // Validation states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [dobError, setDobError] = useState('');
  
  const { signUp } = useAuth();
  const { toast } = useToast();

  const handleFieldChange = () => {
    if (!formTouched) setFormTouched(true);
    if (error) setError('');
  };

  const validateEmailField = (emailValue: string): boolean => {
    if (!emailValue) {
      setEmailError('Email is required');
      return false;
    } else if (!validateEmail(emailValue)) {
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

  const validateForm = (): boolean => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    if (!showDobFields) {
      setShowDobFields(true);
      return;
    }
    
    const dobValidation = validateDateOfBirth(day, month, year);
    if (!dobValidation.isValid || !dobValidation.birthDate) {
      setDobError(dobValidation.message || 'Invalid date of birth');
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('Submitting signup with DOB:', dobValidation.birthDate);
      
      const { success, message } = await signUp(email, password, {
        birthdate: dobValidation.birthDate.toISOString()
      });
      
      if (!success) {
        console.error('Signup error details:', message);
        
        // Handle specific error messages
        if (message?.includes('User already registered')) {
          setError('This email is already registered. Please sign in instead.');
        } else if (message?.toLowerCase().includes('email')) {
          setError('Please provide a valid email address.');
        } else if (message?.toLowerCase().includes('password')) {
          setError('Password must be at least 6 characters long.');
        } else if (message?.includes('pattern')) {
          setError('One or more fields contain invalid characters.');
        } else {
          setError(message || 'Failed to create account. Please try again.');
        }
        return;
      }
      
      toast({
        title: "Account created!",
        description: "You can now sign in with your account.",
      });
      
      onSuccess();
    } catch (err: any) {
      console.error('Sign up error:', err);
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <FormField id="email-signup" label="Email" error={emailError} showError={formTouched}>
        <Input
          id="email-signup"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            handleFieldChange();
          }}
          onBlur={() => validateEmailField(email)}
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
            setPassword(e.target.value);
            handleFieldChange();
          }}
          onBlur={() => validatePasswordField(password)}
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
            setConfirmPassword(e.target.value);
            handleFieldChange();
          }}
          onBlur={() => validateConfirmPasswordField(password, confirmPassword)}
          className={cn(
            formTouched && confirmPasswordError ? "border-red-500 focus-visible:ring-red-500" : ""
          )}
          required
        />
      </FormField>
      
      {showDobFields && (
        <DateOfBirthForm
          day={day}
          month={month}
          year={year}
          setDay={setDay}
          setMonth={setMonth}
          setYear={setYear}
          dobError={dobError}
          formTouched={formTouched}
          onFieldChange={handleFieldChange}
        />
      )}
      
      <div className="text-xs text-muted-foreground">
        By signing up, you agree to the <a href="#" className="text-greentrail-600 hover:underline">Terms of Service</a> and <a href="#" className="text-greentrail-600 hover:underline">Privacy Policy</a>.
        <br />
        <strong>You must be 21 years or older to create an account.</strong>
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={loading || (formTouched && !validateForm())}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {showDobFields ? 'Creating account...' : 'Validating...'}
          </>
        ) : (
          showDobFields ? 'Create Account' : 'Continue'
        )}
      </Button>
    </form>
  );
};
