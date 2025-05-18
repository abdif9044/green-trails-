
import React from 'react';
import { Button } from "@/components/ui/button";
import { useDemoAccount } from '@/hooks/use-demo-account';
import { DemoCredentialsDisplay } from './DemoCredentialsDisplay';
import { DemoAccountError } from './DemoAccountError';
import { Loader2, UserPlus } from 'lucide-react';

export const DemoAccountCreator = () => {
  const { 
    loading, 
    error, 
    demoCredentials, 
    createDemoAccount, 
    signInWithDemoAccount,
    clearError 
  } = useDemoAccount();

  return (
    <div className="max-w-lg mx-auto">
      {error ? (
        <DemoAccountError error={error} onClose={clearError} />
      ) : demoCredentials ? (
        <DemoCredentialsDisplay 
          credentials={demoCredentials} 
          onSignIn={signInWithDemoAccount}
          loading={loading}
        />
      ) : (
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-center text-muted-foreground mb-4">
            Get instant access to all features with a pre-loaded demo account.
            <br />No email verification required!
          </p>
          <Button
            onClick={createDemoAccount}
            disabled={loading}
            className="bg-greentrail-600 hover:bg-greentrail-700 text-white py-2 px-4 rounded-md"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Demo Account...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Create Demo Account
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
