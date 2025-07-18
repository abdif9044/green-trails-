
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MobileAuthScreen } from '@/components/auth/MobileAuthScreen';
import { SignUpForm } from '@/components/auth/SignUpForm';
import PasswordResetForm from '@/components/auth/PasswordResetForm';
import UpdatePasswordForm from '@/components/auth/UpdatePasswordForm';
import { useAuth } from '@/hooks/use-auth';
import SEOProvider from '@/components/SEOProvider';
import AgeVerification from '@/components/auth/AgeVerification';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const Auth = () => {
  const [activeTab, setActiveTab] = useState('signin');
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we need to show the sign up tab by default based on URL query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const signupParam = searchParams.get('signup');
    if (signupParam === 'true') {
      setActiveTab('signup');
    }
  }, [location.search]);

  useEffect(() => {
    // Redirect to home if already authenticated
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleSignUpSuccess = () => {
    setSignupSuccess(true);
    // Switch to sign-in tab after a successful signup
    setTimeout(() => {
      setActiveTab('signin');
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-greentrail-950 dark:to-greentrail-900">
        <div className="w-10 h-10 border-t-2 border-greentrail-600 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // Special handling for password update route
  if (location.pathname === '/auth/update-password') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-greentrail-950 dark:to-greentrail-900 p-4">
        <SEOProvider title="Update Password | GreenTrails" description="Set a new password for your GreenTrails account" />
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-2">
              <img src="/lovable-uploads/0c2a9cc4-4fdb-4d4a-965c-47b406e4ec4e.png" alt="GreenTrails Logo" className="h-12 w-auto" />
            </div>
            <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
            <CardDescription className="text-center">
              Create a new password for your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UpdatePasswordForm />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-greentrail-950 dark:to-greentrail-900 p-4">
      <SEOProvider title="Sign In | GreenTrails" description="Sign in to your GreenTrails account or create a new one" />
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            <img src="/lovable-uploads/0c2a9cc4-4fdb-4d4a-965c-47b406e4ec4e.png" alt="GreenTrails Logo" className="h-12 w-auto" />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {showPasswordReset ? (
              <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
            ) : (
              <CardTitle className="text-2xl text-center">
                {activeTab === 'signin' ? 'Welcome Back' : 'Create Your Account'}
              </CardTitle>
            )}
          </motion.div>
          
          <motion.div
            key={showPasswordReset ? 'reset' : activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {showPasswordReset ? (
              <CardDescription className="text-center">
                Enter your email to receive a password reset link
              </CardDescription>
            ) : (
              <CardDescription className="text-center">
                {activeTab === 'signin' 
                  ? 'Sign in to explore trails and share your adventures' 
                  : 'Join GreenTrails to discover and share outdoor adventures'}
              </CardDescription>
            )}
          </motion.div>
        </CardHeader>
        
        <CardContent>
          {signupSuccess && (
            <Alert className="mb-4 bg-green-50 text-green-800 dark:bg-green-900/50 dark:text-green-300">
              <AlertCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription>
                Account created successfully! You can now sign in.
              </AlertDescription>
            </Alert>
          )}
          
          {showPasswordReset ? (
            <PasswordResetForm onBack={() => setShowPasswordReset(false)} />
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="mt-4">
                <MobileAuthScreen onGuestMode={() => navigate('/')} />
              </TabsContent>
              
              <TabsContent value="signup" className="mt-4">
                <SignUpForm onSuccess={handleSignUpSuccess} />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
