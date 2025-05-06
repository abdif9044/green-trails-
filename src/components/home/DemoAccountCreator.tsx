
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { DemoCredentialsDisplay } from './DemoCredentialsDisplay';
import { DemoAccountError } from './DemoAccountError';
import { useDemoAccount } from '@/hooks/use-demo-account';

export function DemoAccountCreator() {
  const { 
    loading, 
    error, 
    demoCredentials, 
    createDemoAccount, 
    signInWithDemoAccount,
    clearError
  } = useDemoAccount();

  return (
    <Card className="w-full max-w-md mx-auto border-greentrail-200 dark:border-greentrail-800">
      <CardHeader>
        <CardTitle className="text-xl text-greentrail-700 dark:text-greentrail-300">Quick Demo Account</CardTitle>
        <CardDescription>
          Create a test account to quickly explore GreenTrails without using your personal email
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {error && <DemoAccountError error={error} onDismiss={clearError} />}
        
        {demoCredentials ? (
          <div className="space-y-4">
            <DemoCredentialsDisplay credentials={demoCredentials} />
            <p className="text-sm text-center text-muted-foreground">
              These credentials are temporary and will only work for this session.
            </p>
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
