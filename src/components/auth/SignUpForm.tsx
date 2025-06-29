
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { TermsAndPrivacy } from '@/components/auth/TermsAndPrivacy';
import { SignUpFormFields } from '@/components/auth/SignUpFormFields';
import { SignUpSuccessMessage } from '@/components/auth/SignUpSuccessMessage';
import { useSignUpValidation } from '@/components/auth/SignUpFormValidation';
import { EnhancedSignUpService } from '@/services/auth/enhanced-signup-service';

interface SignUpFormProps {
  onSuccess: () => void;
}

export const SignUpForm = ({ onSuccess }: SignUpFormProps) => {
  const [step, setStep] = useState<'signup' | 'success'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { validateForm } = useSignUpValidation();

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const validationError = validateForm(email, password, confirmPassword, fullName, username, birthYear);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Validate age (must be 21+)
    const currentYear = new Date().getFullYear();
    const age = currentYear - parseInt(birthYear);
    if (age < 21) {
      setError('You must be at least 21 years old to create an account.');
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('Attempting to create account for:', email);
      
      const result = await EnhancedSignUpService.signUp({
        email: email.trim(),
        password,
        full_name: fullName.trim(),
        username: username.trim(),
        year_of_birth: parseInt(birthYear)
      });
      
      if (!result.success) {
        console.error('Enhanced sign up failed:', result.message);
        if (result.message?.includes('User already registered')) {
          setError('This email is already registered. Please sign in instead.');
        } else if (result.message?.includes('Invalid email')) {
          setError('Please provide a valid email address.');
        } else if (result.message?.includes('Password should be at least')) {
          setError('Password must be at least 8 characters long.');
        } else {
          setError(result.message || 'Failed to create account. Please try again.');
        }
        return;
      }
      
      console.log('Account created successfully for:', email);
      setStep('success');
      
      setTimeout(() => {
        onSuccess();
      }, 2000);
      
    } catch (err: any) {
      console.error('Sign up error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success') {
    return <SignUpSuccessMessage />;
  }

  return (
    <form onSubmit={handleSignUpSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <SignUpFormFields
        fullName={fullName}
        username={username}
        email={email}
        password={password}
        confirmPassword={confirmPassword}
        birthYear={birthYear}
        loading={loading}
        onFullNameChange={setFullName}
        onUsernameChange={setUsername}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onConfirmPasswordChange={setConfirmPassword}
        onBirthYearChange={setBirthYear}
      />
      
      <TermsAndPrivacy />
      
      <Button 
        type="submit" 
        className="w-full bg-greentrail-600 hover:bg-greentrail-700 text-white" 
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          'Create Account'
        )}
      </Button>
    </form>
  );
};
