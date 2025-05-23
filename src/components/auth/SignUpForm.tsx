
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { DateOfBirthForm } from '@/components/auth/DateOfBirthForm';
import { validateDateOfBirth } from '@/utils/form-validators';
import { AccountCredentialsForm } from '@/components/auth/AccountCredentialsForm';
import { TermsAndPrivacy } from '@/components/auth/TermsAndPrivacy';
import { useSignupValidation } from '@/hooks/use-signup-validation';

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
  
  const { signUp } = useAuth();
  const { toast } = useToast();
  
  // Use the validation hook
  const {
    emailError,
    passwordError,
    confirmPasswordError,
    dobError,
    setDobError,
    validateEmailField,
    validatePasswordField,
    validateConfirmPasswordField,
    validateForm
  } = useSignupValidation();

  const handleFieldChange = () => {
    if (!formTouched) setFormTouched(true);
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(false);
    
    console.log('Form submission started:', { email, showDobFields, day, month, year });
    
    // First validate basic credentials
    if (!validateForm(email, password, confirmPassword, showDobFields, day, month, year)) {
      console.log('Basic validation failed');
      setFormTouched(true);
      return;
    }
    
    // If DOB fields aren't shown yet, show them
    if (!showDobFields) {
      console.log('Showing DOB fields');
      setShowDobFields(true);
      return;
    }
    
    // Validate date of birth
    const dobValidation = validateDateOfBirth(day, month, year);
    if (!dobValidation.isValid || !dobValidation.birthDate) {
      console.log('DOB validation failed:', dobValidation.message);
      setDobError(dobValidation.message || 'Invalid date of birth');
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('Submitting signup with DOB:', dobValidation.birthDate);
      
      const { success, message } = await signUp(email, password, {
        birthdate: dobValidation.birthDate.toISOString(),
        signup_source: 'web_form'
      });
      
      if (!success) {
        console.error('Signup failed:', message);
        
        // Handle specific error messages
        if (message?.includes('User already registered') || message?.includes('already registered')) {
          setError('This email is already registered. Please sign in instead or use a different email.');
        } else if (message?.includes('Invalid email')) {
          setError('Please provide a valid email address.');
        } else if (message?.includes('Password')) {
          setError('Password must be at least 6 characters long.');
        } else if (message?.includes('Signup is disabled')) {
          setError('Account registration is currently disabled. Please try again later.');
        } else {
          setError(message || 'Failed to create account. Please try again.');
        }
        return;
      }
      
      console.log('Signup successful');
      
      toast({
        title: "Account created successfully!",
        description: "You can now sign in with your account.",
      });
      
      onSuccess();
    } catch (err: any) {
      console.error('Sign up error:', err);
      setError(err.message || 'Failed to create account. Please try again.');
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
      
      <AccountCredentialsForm
        email={email}
        password={password}
        confirmPassword={confirmPassword}
        emailError={emailError}
        passwordError={passwordError}
        confirmPasswordError={confirmPasswordError}
        formTouched={formTouched}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onConfirmPasswordChange={setConfirmPassword}
        onFieldChange={handleFieldChange}
        onBlurEmail={() => validateEmailField(email)}
        onBlurPassword={() => validatePasswordField(password)}
        onBlurConfirmPassword={() => validateConfirmPasswordField(password, confirmPassword)}
      />
      
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
      
      <TermsAndPrivacy />
      
      <Button 
        type="submit" 
        className="w-full bg-greentrail-600 hover:bg-greentrail-700 text-white" 
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {showDobFields ? 'Creating account...' : 'Processing...'}
          </>
        ) : (
          showDobFields ? 'Create Account' : 'Continue'
        )}
      </Button>
      
      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-400 mt-2">
          Debug: Email={email ? 'filled' : 'empty'}, Password={password ? 'filled' : 'empty'}, 
          DOB shown={showDobFields ? 'yes' : 'no'}
        </div>
      )}
    </form>
  );
};
