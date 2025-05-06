
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SignUpService } from '@/services/auth/sign-up-service';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

export function DemoAccountCreator() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoCredentials, setDemoCredentials] = useState<{ email: string; password: string } | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const createDemoAccount = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await SignUpService.createDemoAccount();
      
      if (result.success && result.credentials) {
        setDemoCredentials(result.credentials);
        toast({
          title: "Demo account created!",
          description: "You can now sign in with the demo credentials.",
        });
      } else {
        setError(result.message);
        toast({
          title: "Failed to create demo account",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const signInWithDemoAccount = async () => {
    if (!demoCredentials) return;
    
    setLoading(true);
    try {
      const result = await signIn(demoCredentials.email, demoCredentials.password);
      
      if (result.success) {
        toast({
          title: "Signed in!",
          description: "You're now signed in with the demo account.",
        });
        navigate('/discover');
      } else {
        setError(result.message);
        toast({
          title: "Sign in failed",
          description: result.message || "Failed to sign in with demo account",
          variant: "destructive",
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border-greentrail-200 dark:border-greentrail-800">
      <CardHeader>
        <CardTitle className="text-xl text-greentrail-700 dark:text-greentrail-300">Quick Demo Account</CardTitle>
        <CardDescription>
          Create a test account to quickly explore GreenTrails without using your personal email
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {demoCredentials ? (
          <div className="space-y-4">
            <div className="p-4 bg-greentrail-50 dark:bg-greentrail-900/30 rounded-lg">
              <div className="flex items-center gap-2 text-greentrail-700 dark:text-greentrail-300 mb-2">
                <Check className="h-5 w-5 text-green-500" />
                <h3 className="font-medium">Demo Account Created!</h3>
              </div>
              <div className="space-y-2 text-sm">
                <p><span className="font-semibold">Email:</span> {demoCredentials.email}</p>
                <p><span className="font-semibold">Password:</span> {demoCredentials.password}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-2">
            <p className="text-sm text-muted-foreground mb-4">
              This will create a test account with random credentials that you can use for testing the app's features.
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-center">
        {demoCredentials ? (
          <Button 
            onClick={signInWithDemoAccount} 
            disabled={loading}
            className="w-full bg-greentrail-600 hover:bg-greentrail-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in with Demo Account'
            )}
          </Button>
        ) : (
          <Button 
            onClick={createDemoAccount} 
            disabled={loading}
            className="w-full bg-greentrail-600 hover:bg-greentrail-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Demo Account'
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
