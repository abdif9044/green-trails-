import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Mountain, 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle,
  ArrowLeft,
  Users
} from 'lucide-react';
import { UnifiedAuthService } from '@/services/auth/unified-auth-service';

type AuthMode = 'signin' | 'signup' | 'reset' | 'guest';

interface MobileAuthScreenProps {
  onGuestMode?: () => void;
}

export function MobileAuthScreen({ onGuestMode }: MobileAuthScreenProps) {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { signIn, signUp, resetPassword, signInWithSocial } = useAuth();

  const validateForm = () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    
    if (mode !== 'reset' && (!password || password.length < 6)) {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    if (mode === 'signup') {
      if (!fullName.trim()) {
        setError('Please enter your full name');
        return false;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) return;

    setLoading(true);

    try {
      let result;
      
      if (mode === 'signin') {
        result = await signIn(email, password);
      } else if (mode === 'signup') {
        result = await signUp({ 
          email, 
          password, 
          full_name: fullName,
          username: fullName.toLowerCase().replace(/\s+/g, ''),
          year_of_birth: new Date().getFullYear() - 25 // Default age, can be updated later
        });
      } else if (mode === 'reset') {
        result = await resetPassword(email);
      }

      if (result?.success) {
        if (mode === 'reset' || mode === 'signup') {
          setSuccess(result.message || 'Operation completed successfully');
          if (mode === 'signup') {
            setTimeout(() => setMode('signin'), 2000);
          }
        }
      } else {
        setError(result?.message || 'Operation failed');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'apple') => {
    setLoading(true);
    setError(null);

    try {
      const result = await signInWithSocial({ provider });
      if (!result.success) {
        setError(result.message || `${provider} sign in failed`);
      }
    } catch (err: any) {
      setError(`Failed to sign in with ${provider}`);
    } finally {
      setLoading(false);
    }
  };

  const enableGuestMode = () => {
    if (onGuestMode) {
      onGuestMode();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Mobile Header */}
      <div className="relative z-10 px-4 pt-safe">
        {mode !== 'signin' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMode('signin')}
            className="mt-4 mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader className="space-y-4 pb-4">
                  {/* Logo */}
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                      <Mountain className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                      GreenTrails
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {mode === 'signin' && 'Welcome back to your adventure'}
                      {mode === 'signup' && 'Join the trail community'}
                      {mode === 'reset' && 'Reset your password'}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Alerts */}
                  {error && (
                    <Alert variant="destructive" className="bg-red-50 border-red-200">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-sm">{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  {success && (
                    <Alert className="bg-green-50 border-green-200">
                      <AlertCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-sm text-green-800">{success}</AlertDescription>
                    </Alert>
                  )}

                  {/* Main Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Full Name (signup only) */}
                    {mode === 'signup' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Full Name
                        </label>
                        <Input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Enter your full name"
                          className="h-12"
                          required
                        />
                      </div>
                    )}

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="h-12"
                        required
                      />
                    </div>

                    {/* Password */}
                    {mode !== 'reset' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="h-12 pr-12"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Confirm Password (signup only) */}
                    {mode === 'signup' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Confirm Password
                        </label>
                        <Input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm your password"
                          className="h-12"
                          required
                        />
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {mode === 'signin' && 'Signing in...'}
                          {mode === 'signup' && 'Creating account...'}
                          {mode === 'reset' && 'Sending reset email...'}
                        </>
                      ) : (
                        <>
                          {mode === 'signin' && 'Sign In'}
                          {mode === 'signup' && 'Create Account'}
                          {mode === 'reset' && 'Send Reset Email'}
                        </>
                      )}
                    </Button>
                  </form>

                  {/* Social Auth (not for reset) */}
                  {mode !== 'reset' && (
                    <div className="space-y-4">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-3 bg-white dark:bg-gray-800 text-gray-500">
                            Or continue with
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleSocialAuth('google')}
                          disabled={loading}
                          className="h-12"
                        >
                          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="currentColor"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="currentColor"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                              fill="currentColor"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                          </svg>
                          Google
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleSocialAuth('apple')}
                          disabled={loading}
                          className="h-12"
                        >
                          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
                            />
                          </svg>
                          Apple
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Mode Switching */}
                  <div className="text-center space-y-3">
                    {mode === 'signin' && (
                      <>
                        <Button
                          type="button"
                          variant="link"
                          onClick={() => setMode('reset')}
                          className="text-sm text-green-600 hover:text-green-800"
                        >
                          Forgot your password?
                        </Button>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Don't have an account?{' '}
                          <Button
                            type="button"
                            variant="link"
                            onClick={() => setMode('signup')}
                            className="p-0 h-auto font-medium text-green-600 hover:text-green-800"
                          >
                            Sign up
                          </Button>
                        </div>
                      </>
                    )}

                    {mode === 'signup' && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Button
                          type="button"
                          variant="link"
                          onClick={() => setMode('signin')}
                          className="p-0 h-auto font-medium text-green-600 hover:text-green-800"
                        >
                          Sign in
                        </Button>
                      </div>
                    )}

                    {mode === 'reset' && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Remember your password?{' '}
                        <Button
                          type="button"
                          variant="link"
                          onClick={() => setMode('signin')}
                          className="p-0 h-auto font-medium text-green-600 hover:text-green-800"
                        >
                          Sign in
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Guest Mode (signin only) */}
                  {mode === 'signin' && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={enableGuestMode}
                        className="w-full h-12 text-gray-600 dark:text-gray-400 hover:text-green-600"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Continue as Guest
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}