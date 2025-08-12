
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSignUpValidation } from './SignUpFormValidation';
import PasswordStrengthIndicator, { validatePasswordStrength } from './PasswordStrengthIndicator';
import BirthYearInput from './BirthYearInput';
import { 
  User, 
  AtSign, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  AlertCircle
} from 'lucide-react';

interface SignUpFormFieldsProps {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthYear: string;
  loading: boolean;
  onFullNameChange: (value: string) => void;
  onUsernameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onBirthYearChange: (value: string) => void;
}

export const SignUpFormFields = ({
  fullName,
  username,
  email,
  password,
  confirmPassword,
  birthYear,
  loading,
  onFullNameChange,
  onUsernameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onBirthYearChange
}: SignUpFormFieldsProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const [fieldTouched, setFieldTouched] = useState<{[key: string]: boolean}>({});
  
  const { 
    validateEmail, 
    validatePassword, 
    validateUsername, 
    validateFullName, 
    validateAge 
  } = useSignUpValidation();

  // Password strength validation
  const passwordStrength = validatePasswordStrength(password);

  // Real-time validation
  useEffect(() => {
    const errors: {[key: string]: string} = {};
    
    if (fieldTouched.fullName && fullName) {
      const nameError = validateFullName(fullName);
      if (nameError) errors.fullName = nameError;
    }
    
    if (fieldTouched.username && username) {
      const usernameError = validateUsername(username);
      if (usernameError) errors.username = usernameError;
    }
    
    if (fieldTouched.email && email) {
      const emailError = validateEmail(email);
      if (emailError) errors.email = emailError;
    }
    
    if (fieldTouched.password && password) {
      if (!passwordStrength.isValid) {
        errors.password = 'Password must meet all requirements';
      }
    }
    
    if (fieldTouched.confirmPassword && confirmPassword) {
      if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }
    
    if (fieldTouched.birthYear && birthYear) {
      const ageValidation = validateAge(birthYear);
      if (ageValidation.error) errors.birthYear = ageValidation.error;
    }
    
    setFieldErrors(errors);
  }, [fullName, username, email, password, confirmPassword, birthYear, fieldTouched]);

  const handleFieldBlur = (fieldName: string) => {
    setFieldTouched(prev => ({ ...prev, [fieldName]: true }));
  };

  const getFieldStatus = (fieldName: string, value: string) => {
    if (!fieldTouched[fieldName] || !value) return 'default';
    return fieldErrors[fieldName] ? 'error' : 'success';
  };

  const getInputClassName = (fieldName: string, value: string) => {
    const status = getFieldStatus(fieldName, value);
    const baseClass = "pl-10 pr-10 py-3 border-2 transition-all duration-200 rounded-lg";
    
    switch (status) {
      case 'error':
        return `${baseClass} border-red-300 focus:border-red-500 bg-red-50`;
      case 'success':
        return `${baseClass} border-green-300 focus:border-green-500 bg-green-50`;
      default:
        return `${baseClass} border-greentrail-200 focus:border-greentrail-500`;
    }
  };

  const renderFieldIcon = (fieldName: string, value: string, Icon: any) => {
    const status = getFieldStatus(fieldName, value);
    
    return (
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <Icon className={`w-5 h-5 ${
          status === 'error' ? 'text-red-500' : 
          status === 'success' ? 'text-green-500' : 
          'text-greentrail-500'
        }`} />
      </div>
    );
  };

  const renderValidationIcon = (fieldName: string, value: string) => {
    const status = getFieldStatus(fieldName, value);
    
    if (status === 'success') {
      return (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <Check className="w-5 h-5 text-green-500" />
        </div>
      );
    } else if (status === 'error') {
      return (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <AlertCircle className="w-5 h-5 text-red-500" />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Full Name Field */}
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Label htmlFor="fullName" className="text-sm font-semibold text-greentrail-700 flex items-center gap-2">
          <User className="w-4 h-4" />
          Full Name
        </Label>
        <div className="relative">
          {renderFieldIcon('fullName', fullName, User)}
          <Input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => onFullNameChange(e.target.value)}
            onBlur={() => handleFieldBlur('fullName')}
            placeholder="John Doe"
            className={getInputClassName('fullName', fullName)}
            disabled={loading}
            autoComplete="name"
          />
          {renderValidationIcon('fullName', fullName)}
        </div>
        {fieldErrors.fullName && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <X className="w-4 h-4" />
            {fieldErrors.fullName}
          </p>
        )}
      </motion.div>
      
      {/* Username Field */}
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Label htmlFor="username" className="text-sm font-semibold text-greentrail-700 flex items-center gap-2">
          <AtSign className="w-4 h-4" />
          Username
        </Label>
        <div className="relative">
          {renderFieldIcon('username', username, AtSign)}
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            onBlur={() => handleFieldBlur('username')}
            placeholder="johndoe"
            className={getInputClassName('username', username)}
            disabled={loading}
            autoComplete="username"
          />
          {renderValidationIcon('username', username)}
        </div>
        {fieldErrors.username && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <X className="w-4 h-4" />
            {fieldErrors.username}
          </p>
        )}
      </motion.div>
      
      {/* Email Field */}
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Label htmlFor="email" className="text-sm font-semibold text-greentrail-700 flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Email Address
        </Label>
        <div className="relative">
          {renderFieldIcon('email', email, Mail)}
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            onBlur={() => handleFieldBlur('email')}
            placeholder="john@example.com"
            className={getInputClassName('email', email)}
            disabled={loading}
            autoComplete="email"
          />
          {renderValidationIcon('email', email)}
        </div>
        {fieldErrors.email && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <X className="w-4 h-4" />
            {fieldErrors.email}
          </p>
        )}
      </motion.div>
      
      {/* Password Field */}
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <Label htmlFor="password" className="text-sm font-semibold text-greentrail-700 flex items-center gap-2">
          <Lock className="w-4 h-4" />
          Password
        </Label>
        <div className="relative">
          {renderFieldIcon('password', password, Lock)}
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            onBlur={() => handleFieldBlur('password')}
            placeholder="Create a strong password"
            className={getInputClassName('password', password)}
            disabled={loading}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-10 top-1/2 transform -translate-y-1/2 text-greentrail-500 hover:text-greentrail-700 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          {getFieldStatus('password', password) !== 'default' && renderValidationIcon('password', password)}
        </div>
        {fieldErrors.password && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <X className="w-4 h-4" />
            {fieldErrors.password}
          </p>
        )}
        {password && (
          <PasswordStrengthIndicator password={password} className="mt-2" />
        )}
      </motion.div>
      
      {/* Confirm Password Field */}
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Label htmlFor="confirmPassword" className="text-sm font-semibold text-greentrail-700 flex items-center gap-2">
          <Lock className="w-4 h-4" />
          Confirm Password
        </Label>
        <div className="relative">
          {renderFieldIcon('confirmPassword', confirmPassword, Lock)}
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            onBlur={() => handleFieldBlur('confirmPassword')}
            placeholder="Confirm your password"
            className={getInputClassName('confirmPassword', confirmPassword)}
            disabled={loading}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-10 top-1/2 transform -translate-y-1/2 text-greentrail-500 hover:text-greentrail-700 transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          {getFieldStatus('confirmPassword', confirmPassword) !== 'default' && renderValidationIcon('confirmPassword', confirmPassword)}
        </div>
        {fieldErrors.confirmPassword && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <X className="w-4 h-4" />
            {fieldErrors.confirmPassword}
          </p>
        )}
        {confirmPassword && !fieldErrors.confirmPassword && password === confirmPassword && (
          <div className="text-xs text-green-600 flex items-center gap-1">
            <Check className="w-3 h-3" />
            Passwords match
          </div>
        )}
      </motion.div>

      {/* Birth Year Field */}
      <BirthYearInput
        value={birthYear}
        onChange={onBirthYearChange}
        onBlur={() => handleFieldBlur('birthYear')}
        error={fieldErrors.birthYear}
        disabled={loading}
      />
    </div>
  );
};
