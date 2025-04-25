
import { useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AgeVerificationForm from '@/components/auth/AgeVerificationForm';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const { user, signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAgeVerification, setShowAgeVerification] = useState(false);
  
  const defaultTab = searchParams.get('signup') === 'true' ? 'signup' : 'signin';
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  if (user) {
    return <Navigate to="/" />;
  }
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (!email || !password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }
    
    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
        variant: "default",
      });
      
      navigate('/');
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignUpStart = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    // Show age verification before proceeding with signup
    setShowAgeVerification(true);
  };
  
  const handleSignUp = async () => {
    setLoading(true);
    
    try {
      const { error } = await signUp(email, password);
      if (error) throw error;
      
      toast({
        title: "Account created!",
        description: "Your account has been successfully created. Please check your email to verify your account.",
      });
      
      // Auto switch to signin tab
      setActiveTab('signin');
    } catch (err: any) {
      console.error('Sign up error:', err);
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
      setShowAgeVerification(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center bg-greentrail-50 dark:bg-greentrail-950 py-12">
        <div className="w-full max-w-md px-4">
          {showAgeVerification ? (
            <AgeVerificationForm 
              onVerified={handleSignUp}
              onCancel={() => setShowAgeVerification(false)}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-2xl">Welcome to GreenTrails</CardTitle>
                <CardDescription className="text-center">
                  Sign in to your account or create a new one
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="signin">
                    <form onSubmit={handleSignIn} className="space-y-4 mt-4">
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
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
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
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="signup">
                    <form onSubmit={handleSignUpStart} className="space-y-4 mt-4">
                      {error && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}
                      
                      <div className="space-y-2">
                        <Label htmlFor="email-signup">Email</Label>
                        <Input
                          id="email-signup"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password-signup">Password</Label>
                        <Input
                          id="password-signup"
                          type="password"
                          placeholder="Create a password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="Confirm your password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        By signing up, you agree to the <a href="#" className="text-greentrail-600 hover:underline">Terms of Service</a> and <a href="#" className="text-greentrail-600 hover:underline">Privacy Policy</a>.
                        <br />
                        <strong>You must be 21 years or older to create an account.</strong>
                      </div>
                      
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Creating account...' : 'Continue'}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
              
              <CardFooter className="flex justify-center text-sm text-muted-foreground">
                {activeTab === 'signin' ? (
                  <p>
                    Don't have an account?{' '}
                    <a 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('signup');
                      }}
                      className="text-greentrail-600 hover:underline"
                    >
                      Sign up
                    </a>
                  </p>
                ) : (
                  <p>
                    Already have an account?{' '}
                    <a 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('signin');
                      }}
                      className="text-greentrail-600 hover:underline"
                    >
                      Sign in
                    </a>
                  </p>
                )}
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Auth;
