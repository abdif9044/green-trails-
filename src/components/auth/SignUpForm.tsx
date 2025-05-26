
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { TermsAndPrivacy } from '@/components/auth/TermsAndPrivacy';
import { SignUpFormFields } from '@/components/auth/SignUpFormFields';
import { SignUpSuccessMessage } from '@/components/auth/SignUpSuccessMessage';
import { useSignUpValidation } from '@/components/auth/SignUpFormValidation';

interface SignUpFormProps {
  onSuccess: () => void;
}

export const SignUpForm = ({ onSuccess }: SignUpFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { signUp } = useAuth();
  const { validateForm } = useSignUpValidation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const validationError = validateForm(email, password, confirmPassword, fullName, username, birthYear);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('Attempting to create account for:', email);
      
      const { success: signUpSuccess, message } = await signUp(email, password, {
        full_name: fullName.trim(),
        username: username.trim(),
        birth_year: birthYear,
        signup_source: 'web_form'
      });
      
      if (!signUpSuccess) {
        console.error('Sign up failed:', message);
        if (message?.includes('User already registered')) {
          setError('This email is already registered. Please sign in instead.');
        } else if (message?.includes('Invalid email')) {
          setError('Please provide a valid email address.');
        } else if (message?.includes('Password should be at least')) {
          setError('Password must be at least 6 characters long.');
        } else {
          setError(message || 'Failed to create account. Please try again.');
        }
        return;
      }
      
      console.log('Account created successfully for:', email);
      setSuccess(true);
      
      // Show success message briefly before switching to sign in
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

  if (success) {
    return <SignUpSuccessMessage />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
