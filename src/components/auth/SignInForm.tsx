
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/auth/FormField';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { validateEmail } from '@/utils/form-validators';
import { cn } from '@/lib/utils';

interface SignInFormProps {
  onForgotPassword: () => void;
}

export const SignInForm = ({ onForgotPassword }: SignInFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  const [emailError, setEmailError] = useState('');
  
  const { signIn } = useAuth();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmailField(email)) {
      return;
    }
    
    if (!password) {
      setError('Password is required');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const { success, message } = await signIn(email, password);
      
      if (!success) {
        console.error('Sign in failed:', message);
        if (message?.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please try again.');
        } else if (message?.includes('Email not confirmed')) {
          setError('Please confirm your email before signing in.');
        } else {
          setError(message || 'An error occurred during sign in');
        }
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError(err.message || 'An error occurred');
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
      
      <FormField id="email" label="Email" error={emailError} showError={formTouched}>
        <Input
          id="email"
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
      
      <FormField id="password" label="Password" error="">
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            handleFieldChange();
          }}
          required
        />
      </FormField>
      
      <div className="flex justify-end">
        <Button 
          type="button" 
          variant="link" 
          className="text-greentrail-600 p-0 h-auto font-normal"
          onClick={onForgotPassword}
        >
          Forgot password?
        </Button>
      </div>
      
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </Button>
    </form>
  );
};
