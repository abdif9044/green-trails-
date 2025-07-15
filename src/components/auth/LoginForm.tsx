
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertCircle, Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Real-time email validation
  useEffect(() => {
    if (email && !email.includes('@')) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  }, [email]);

  // Real-time password validation
  useEffect(() => {
    if (password && password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
    } else {
      setPasswordError('');
    }
  }, [password]);

  const validateForm = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!password) {
      setError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await signIn(email.trim().toLowerCase(), password);
      
      if (result.success) {
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in to GreenTrails.",
        });
        navigate('/trails');
      } else {
        setError(result.message || 'Failed to sign in. Please check your credentials.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/auth/forgot-password');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-greentrail-800 mb-2">Welcome Back</h2>
        <p className="text-greentrail-600">Sign in to continue your adventure</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-semibold text-greentrail-700 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email Address
          </Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className={`pl-4 pr-4 py-3 border-2 transition-all duration-200 ${
                emailError 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-greentrail-200 focus:border-greentrail-500'
              } rounded-lg`}
              disabled={loading}
              autoComplete="email"
            />
          </div>
          {emailError && (
            <p className="text-sm text-red-600 mt-1">{emailError}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-semibold text-greentrail-700 flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={`pl-4 pr-12 py-3 border-2 transition-all duration-200 ${
                passwordError 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-greentrail-200 focus:border-greentrail-500'
              } rounded-lg`}
              disabled={loading}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-greentrail-500 hover:text-greentrail-700 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {passwordError && (
            <p className="text-sm text-red-600 mt-1">{passwordError}</p>
          )}
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-greentrail-600 hover:bg-greentrail-700 text-white py-3 rounded-lg font-semibold text-base transition-all duration-200 shadow-lg hover:shadow-xl group"
          disabled={loading || !!emailError || !!passwordError}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
        
        <div className="text-center pt-2">
          <Button
            type="button"
            variant="link"
            className="text-greentrail-600 hover:text-greentrail-800 font-medium"
            onClick={handleForgotPassword}
            disabled={loading}
          >
            Forgot your password?
          </Button>
        </div>
      </form>
    </motion.div>
  );
};
