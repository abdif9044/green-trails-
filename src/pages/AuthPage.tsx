
import { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { Button } from '@/components/ui/button';
import { AuthGuard } from '@/components/auth/AuthGuard';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-greentrail-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-greentrail-800 mb-2">GreenTrails</h1>
            <p className="text-greentrail-600">Your hiking social network</p>
          </div>
          
          <div className="flex bg-white rounded-lg p-1 shadow-sm">
            <Button
              variant={isLogin ? "default" : "ghost"}
              onClick={() => setIsLogin(true)}
              className="flex-1"
            >
              Sign In
            </Button>
            <Button
              variant={!isLogin ? "default" : "ghost"}
              onClick={() => setIsLogin(false)}
              className="flex-1"
            >
              Sign Up
            </Button>
          </div>
          
          {isLogin ? (
            <LoginForm />
          ) : (
            <SignUpForm onSuccess={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </AuthGuard>
  );
};
