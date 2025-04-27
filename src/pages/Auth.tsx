
import { useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SignInForm } from '@/components/auth/SignInForm';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { useAuth } from '@/hooks/use-auth';
import AgeVerificationForm from '@/components/auth/AgeVerificationForm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [showAgeVerification, setShowAgeVerification] = useState(false);
  
  const defaultTab = searchParams.get('signup') === 'true' ? 'signup' : 'signin';
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  if (user) {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center bg-greentrail-50 dark:bg-greentrail-950 py-12">
        <div className="w-full max-w-md px-4">
          {showAgeVerification ? (
            <AgeVerificationForm 
              onVerified={() => setShowAgeVerification(false)}
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
                    <SignInForm />
                  </TabsContent>
                  
                  <TabsContent value="signup">
                    <SignUpForm onSuccess={() => setActiveTab('signin')} />
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
