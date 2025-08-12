import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Check, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface BirthYearInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

const BirthYearInput: React.FC<BirthYearInputProps> = ({
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  className = ""
}) => {
  const [focused, setFocused] = useState(false);
  
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 120; // Reasonable maximum age
  const maxYear = currentYear - 21;  // Must be 21+
  
  const calculateAge = (birthYear: string) => {
    const year = parseInt(birthYear);
    if (isNaN(year)) return null;
    return currentYear - year;
  };

  const age = calculateAge(value);
  const isValid = age !== null && age >= 21 && age <= 120;
  const isValidYear = value && parseInt(value) >= minYear && parseInt(value) <= maxYear;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Only allow numbers and limit to 4 characters
    if (inputValue === '' || (/^\d{1,4}$/.test(inputValue))) {
      onChange(inputValue);
    }
  };

  const getInputStatus = () => {
    if (!value || focused) return 'default';
    return error || !isValid ? 'error' : 'success';
  };

  const getInputClassName = () => {
    const status = getInputStatus();
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

  return (
    <motion.div 
      className={`space-y-2 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
    >
      <Label htmlFor="birthYear" className="text-sm font-semibold text-greentrail-700 flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        Birth Year (Must be 21+)
      </Label>
      
      <div className="relative">
        {/* Calendar Icon */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <Calendar className={`w-5 h-5 ${
            getInputStatus() === 'error' ? 'text-red-500' : 
            getInputStatus() === 'success' ? 'text-green-500' : 
            'text-greentrail-500'
          }`} />
        </div>

        {/* Input Field */}
        <Input
          id="birthYear"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            onBlur?.();
          }}
          placeholder="2004"
          className={getInputClassName()}
          disabled={disabled}
          autoComplete="bday-year"
          maxLength={4}
        />

        {/* Validation Icon */}
        {!focused && value && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isValid && !error ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}

      {/* Success Message */}
      {!error && value && isValid && (
        <div className="text-xs text-green-600 flex items-center gap-1">
          <Check className="w-3 h-3" />
          Age verified ({age} years old) - Full access granted
        </div>
      )}

      {/* Helper Text */}
      {!value && !focused && (
        <p className="text-xs text-muted-foreground">
          Enter your birth year (e.g., 2004 for someone born in 2004). Must be 21+ to join.
        </p>
      )}
      
      {/* Age Display */}
      {value && !error && age && age < 21 && (
        <p className="text-xs text-amber-600">
          You must be 21+ to access all features. Current age: {age}
        </p>
      )}
    </motion.div>
  );
};

export default BirthYearInput;