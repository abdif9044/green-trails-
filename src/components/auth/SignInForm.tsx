import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const SignInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleFieldChange = () => {
    if (!formTouched) setFormTouched(true);
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (!email || !password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }
    
    try {
      const { success, message } = await signIn(email, password);
      if (!success) {
        console.error('Sign in error:', message);
        setError(message || 'Failed to sign in');
      }
      
      // Navigate is handled by the AuthProvider's onAuthStateChange
    } catch (err: any) {
      console.error('Exception during sign in:', err);
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return email && password && validateEmail(email);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email-signin">Email</Label>
        <Input
          id="email-signin"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            handleFieldChange();
          }}
          className={cn(
            formTouched && !validateEmail(email) && email ? "border-red-500 focus-visible:ring-red-500" : ""
          )}
          autoComplete="email"
          required
        />
        {formTouched && !validateEmail(email) && email && (
          <p className="text-xs text-red-500 mt-1">Please enter a valid email</p>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="password-signin">Password</Label>
          <a href="#" className="text-xs text-greentrail-600 hover:underline">
            Forgot password?
          </a>
        </div>
        <Input
          id="password-signin"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            handleFieldChange();
          }}
          className={cn(
            formTouched && !password ? "border-red-500 focus-visible:ring-red-500" : ""
          )}
          autoComplete="current-password"
          required
        />
        {formTouched && !password && (
          <p className="text-xs text-red-500 mt-1">Password is required</p>
        )}
      </div>
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={loading || (!isFormValid() && formTouched)}
      >
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
