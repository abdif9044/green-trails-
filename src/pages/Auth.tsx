
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AgeVerification from '@/components/auth/AgeVerification';

const Auth = () => {
  const { signIn, signUp, session } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<"signin" | "signup">(
    searchParams.get('signup') === 'true' ? 'signup' : 'signin'
  );
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [ageVerified, setAgeVerified] = useState(false);
  
  // Redirect if already signed in
  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        toast({
          title: 'Sign In Failed',
          description: error.message || 'There was a problem signing in.',
          variant: 'destructive',
        });
        return;
      }
      
      // Success is handled by the auth state change in useAuth
    } catch (err) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!ageVerified) {
      toast({
        title: 'Age Verification Required',
        description: 'You must verify you are 21 or older to create an account.',
        variant: 'destructive',
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await signUp(email, password);
      
      if (error) {
        toast({
          title: 'Sign Up Failed',
          description: error.message || 'There was a problem creating your account.',
          variant: 'destructive',
        });
        return;
      }
      
      toast({
        title: 'Account Created',
        description: 'Your account has been created successfully. You can now sign in.',
      });
      
      setActiveTab('signin');
    } catch (err) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAgeVerification = (isVerified: boolean) => {
    setAgeVerified(isVerified);
    if (!isVerified) {
      toast({
        title: 'Age Verification Failed',
        description: 'You must be 21 or older to use GreenTrails.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Age Verified',
        description: 'You have been verified as 21 or older.',
        variant: 'success',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center bg-greentrail-50 dark:bg-greentrail-950 py-12">
        <div className="container max-w-md px-4">
          <div className="mb-8 flex justify-center">
            <img 
              src="/lovable-uploads/0c2a9cc4-4fdb-4d4a-965c-47b406e4ec4e.png" 
              alt="GreenTrails Logo" 
              className="h-16 w-auto"
            />
          </div>
          
          <Tabs
            defaultValue={activeTab}
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as 'signin' | 'signup')}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 mb-8 w-full">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="mt-0">
              <Card>
                <CardHeader className="pb-2">
                  <h1 className="text-2xl font-bold text-greentrail-800 dark:text-greentrail-200 text-center">
                    Welcome Back
                  </h1>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignIn} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="your.email@example.com"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="signin-password">Password</Label>
                        <Link to="/forgot-password" className="text-sm text-greentrail-600 hover:text-greentrail-800 dark:text-greentrail-400 dark:hover:text-greentrail-200">
                          Forgot password?
                        </Link>
                      </div>
                      <Input
                        id="signin-password"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Signing In...' : 'Sign In'}
                    </Button>
                  </form>
                  <div className="mt-6 text-center text-sm text-greentrail-600 dark:text-greentrail-400">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      className="font-medium text-greentrail-600 hover:text-greentrail-700 dark:text-greentrail-400 dark:hover:text-greentrail-300"
                      onClick={() => setActiveTab('signup')}
                    >
                      Sign Up
                    </button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="signup" className="mt-0">
              <Card>
                <CardHeader className="pb-2">
                  <h1 className="text-2xl font-bold text-greentrail-800 dark:text-greentrail-200 text-center">
                    Create an Account
                  </h1>
                </CardHeader>
                <CardContent>
                  {!ageVerified ? (
                    <AgeVerification onVerify={handleAgeVerification} />
                  ) : (
                    <form onSubmit={handleSignUp} className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="your.email@example.com"
                          autoComplete="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <Input
                          id="signup-password"
                          type="password"
                          autoComplete="new-password"
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
                          autoComplete="new-password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                      </Button>
                    </form>
                  )}
                  
                  <div className="mt-6 text-center text-sm text-greentrail-600 dark:text-greentrail-400">
                    Already have an account?{' '}
                    <button
                      type="button"
                      className="font-medium text-greentrail-600 hover:text-greentrail-700 dark:text-greentrail-400 dark:hover:text-greentrail-300"
                      onClick={() => setActiveTab('signin')}
                    >
                      Sign In
                    </button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 text-center text-sm text-greentrail-600 dark:text-greentrail-400">
            By signing in or creating an account, you agree to our{' '}
            <Link to="/terms" className="font-medium text-greentrail-600 hover:text-greentrail-700 dark:text-greentrail-400 dark:hover:text-greentrail-300">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="font-medium text-greentrail-600 hover:text-greentrail-700 dark:text-greentrail-400 dark:hover:text-greentrail-300">
              Privacy Policy
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Auth;
