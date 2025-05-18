
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowRightIcon, Sparkles } from 'lucide-react';
import { DemoCredentialsDisplay } from './DemoCredentialsDisplay';
import { DemoAccountError } from './DemoAccountError';
import { useDemoAccount } from '@/hooks/use-demo-account';
import { motion } from 'framer-motion';

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md mx-auto border-green-300 dark:border-green-700 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-green-700 h-2" />
        
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-2 text-greentrail-700 dark:text-greentrail-300">
            <Sparkles className="h-5 w-5 text-green-500" />
            Instant Demo Account
          </CardTitle>
          <CardDescription>
            Try GreenTrails now with a pre-loaded demo account - no email required
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
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
                Get instant access to GreenTrails with a demo account that includes pre-filled trails, photos, and comments.
              </p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center">
          {demoCredentials ? (
            <Button 
              onClick={signInWithDemoAccount} 
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in with Demo Account
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          ) : (
            <Button 
              onClick={createDemoAccount} 
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating demo account...
                </>
              ) : (
                <>
                  Try GreenTrails Now
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
