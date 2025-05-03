import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface SignUpFormProps {
  onSuccess: () => void;
}

export const SignUpForm = ({ onSuccess }: SignUpFormProps) => {
  // Form field states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  
  // Form state management
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDobFields, setShowDobFields] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  
  // Validation states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [dobError, setDobError] = useState('');
  
  const { signUp } = useAuth();
  const { toast } = useToast();

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  // Days in month array
  const getDaysInMonth = (month: string, year: string): number[] => {
    if (!month || !year) return Array.from({ length: 31 }, (_, i) => i + 1);
    
    const monthIndex = months.indexOf(month);
    const daysInMonth = new Date(parseInt(year), monthIndex + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const days = getDaysInMonth(month, year);

  // Reset day if it's greater than the days in the current month
  useEffect(() => {
    if (day && month && year) {
      const maxDay = getDaysInMonth(month, year).length;
      if (parseInt(day) > maxDay) {
        setDay(maxDay.toString());
      }
    }
  }, [month, year]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = (password: string, confirmPassword: string): boolean => {
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      return false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const validateDateOfBirth = (): Date | null => {
    if (!day || !month || !year) {
      setDobError('Please complete all date fields');
      return null;
    }
    
    const monthIndex = months.indexOf(month);
    const birthDate = new Date(parseInt(year), monthIndex, parseInt(day));
    const today = new Date();
    
    // Calculate age
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    // Check if birthdate is valid
    if (isNaN(birthDate.getTime())) {
      setDobError('Please enter a valid date');
      return null;
    }
    
    // Check if date is in the future
    if (birthDate > today) {
      setDobError('Date cannot be in the future');
      return null;
    }
    
    // Check if user is 21 or older
    if (age < 21) {
      setDobError('You must be 21 or older to use this app');
      return null;
    }
    
    setDobError('');
    return birthDate;
  };

  const handleFieldChange = () => {
    if (!formTouched) setFormTouched(true);
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(password, confirmPassword);
    
    if (!showDobFields) {
      return isEmailValid && isPasswordValid && isConfirmPasswordValid;
    }
    
    const isDateValid = validateDateOfBirth() !== null;
    return isEmailValid && isPasswordValid && isConfirmPasswordValid && isDateValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    if (!showDobFields) {
      setShowDobFields(true);
      return;
    }
    
    const dateOfBirth = validateDateOfBirth();
    if (!dateOfBirth) return;
    
    setLoading(true);
    
    try {
      const { success, message } = await signUp(email, password, {
        birthdate: dateOfBirth.toISOString()
      });
      
      if (!success) {
        console.error('Signup error details:', message);
        if (message?.includes('captcha')) {
          setError('Captcha verification failed. Please try again with a different browser or contact support.');
        } else if (message?.includes('already registered')) {
          setError('This email is already registered. Please sign in instead.');
        } else {
          setError(message || 'Failed to create account');
        }
        return;
      }
      
      toast({
        title: "Account created!",
        description: "Check your email to confirm your account. You can now sign in.",
      });
      
      onSuccess();
    } catch (err: any) {
      console.error('Sign up error:', err);
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          onChange={(e) => {
            setEmail(e.target.value);
            handleFieldChange();
          }}
          onBlur={() => validateEmail(email)}
          className={cn(
            formTouched && emailError ? "border-red-500 focus-visible:ring-red-500" : ""
          )}
          required
        />
        {formTouched && emailError && (
          <p className="text-xs text-red-500 mt-1">{emailError}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password-signup">Password</Label>
        <Input
          id="password-signup"
          type="password"
          placeholder="Create a password (min. 6 characters)"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            handleFieldChange();
          }}
          onBlur={() => validatePassword(password)}
          className={cn(
            formTouched && passwordError ? "border-red-500 focus-visible:ring-red-500" : ""
          )}
          required
        />
        {formTouched && passwordError && (
          <p className="text-xs text-red-500 mt-1">{passwordError}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <Input
          id="confirm-password"
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            handleFieldChange();
          }}
          onBlur={() => validateConfirmPassword(password, confirmPassword)}
          className={cn(
            formTouched && confirmPasswordError ? "border-red-500 focus-visible:ring-red-500" : ""
          )}
          required
        />
        {formTouched && confirmPasswordError && (
          <p className="text-xs text-red-500 mt-1">{confirmPasswordError}</p>
        )}
      </div>
      
      {showDobFields && (
        <div className="space-y-4">
          <div className="text-sm font-medium">Date of Birth (must be 21+)</div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="day">Day</Label>
              <Select value={day} onValueChange={(value) => {
                setDay(value);
                handleFieldChange();
              }}>
                <SelectTrigger id="day" className={cn(
                  formTouched && dobError && !day ? "border-red-500 focus-visible:ring-red-500" : ""
                )}>
                  <SelectValue placeholder="Day" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {days.map((d) => (
                    <SelectItem key={d} value={d.toString()}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="month">Month</Label>
              <Select value={month} onValueChange={(value) => {
                setMonth(value);
                handleFieldChange();
              }}>
                <SelectTrigger id="month" className={cn(
                  formTouched && dobError && !month ? "border-red-500 focus-visible:ring-red-500" : ""
                )}>
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {months.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Select value={year} onValueChange={(value) => {
                setYear(value);
                handleFieldChange();
              }}>
                <SelectTrigger id="year" className={cn(
                  formTouched && dobError && !year ? "border-red-500 focus-visible:ring-red-500" : ""
                )}>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent className="h-[200px]">
                  {years.map((y) => (
                    <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {formTouched && dobError && (
            <p className="text-xs text-red-500 mt-1">{dobError}</p>
          )}
        </div>
      )}
      
      <div className="text-xs text-muted-foreground">
        By signing up, you agree to the <a href="#" className="text-greentrail-600 hover:underline">Terms of Service</a> and <a href="#" className="text-greentrail-600 hover:underline">Privacy Policy</a>.
        <br />
        <strong>You must be 21 years or older to create an account.</strong>
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={loading || (formTouched && !validateForm())}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {showDobFields ? 'Creating account...' : 'Validating...'}
          </>
        ) : (
          showDobFields ? 'Create Account' : 'Continue'
        )}
      </Button>
    </form>
  );
};
