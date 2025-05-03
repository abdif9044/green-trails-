
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordResetFormProps {
  onBack: () => void;
}

export const PasswordResetForm = ({ onBack }: PasswordResetFormProps) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const { resetPassword } = useAuth();
  const { toast } = useToast();

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
    
    if (!email) {
      setError('Email is required');
      setLoading(false);
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }
    
    try {
      const { success, message } = await resetPassword(email);
      if (!success) {
        setError(message || 'Failed to send password reset email');
        return;
      }
      
      setSubmitted(true);
      toast({
        title: "Password reset email sent",
        description: "Check your inbox for instructions to reset your password.",
      });
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.message || 'Failed to send password reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-start mb-4">
        <Button 
          variant="ghost" 
          type="button" 
          className="p-0" 
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to sign in
        </Button>
      </div>
  
      {submitted ? (
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold mb-2">Password Reset Email Sent</h3>
          <p className="text-muted-foreground mb-4">
            If an account exists for {email}, you'll receive an email with instructions to reset your password.
          </p>
          <Button onClick={onBack} variant="outline">Return to sign in</Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 text-center mb-6">
            <h3 className="text-lg font-semibold">Reset Your Password</h3>
            <p className="text-sm text-muted-foreground">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
          </div>
  
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email-reset">Email</Label>
            <Input
              id="email-reset"
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
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={loading || (!email || (formTouched && !validateEmail(email)))}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Reset Instructions'
            )}
          </Button>
        </form>
      )}
    </>
  );
};

export default PasswordResetForm;
