import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

export interface PasswordStrength {
  score: number;
  requirements: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
  isValid: boolean;
}

export const validatePasswordStrength = (password: string): PasswordStrength => {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const score = Object.values(requirements).filter(Boolean).length;
  const isValid = score === 5;

  return { score, requirements, isValid };
};

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ 
  password, 
  className = "" 
}) => {
  const strength = validatePasswordStrength(password);

  if (!password) return null;

  const getStrengthColor = () => {
    if (strength.score <= 2) return 'text-red-500';
    if (strength.score <= 3) return 'text-yellow-500';
    if (strength.score <= 4) return 'text-blue-500';
    return 'text-green-500';
  };

  const getStrengthText = () => {
    if (strength.score <= 2) return 'Weak';
    if (strength.score <= 3) return 'Fair';
    if (strength.score <= 4) return 'Good';
    return 'Strong';
  };

  const getBarColor = () => {
    if (strength.score <= 2) return 'bg-red-500';
    if (strength.score <= 3) return 'bg-yellow-500';
    if (strength.score <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-muted-foreground">Password Strength</span>
          <span className={`text-xs font-semibold ${getStrengthColor()}`}>
            {getStrengthText()}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getBarColor()}`}
            style={{ width: `${(strength.score / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="space-y-1">
        <div className="text-xs font-medium text-muted-foreground mb-2">Requirements:</div>
        <div className="grid grid-cols-1 gap-1 text-xs">
          <RequirementItem
            met={strength.requirements.length}
            text="At least 8 characters"
          />
          <RequirementItem
            met={strength.requirements.uppercase}
            text="One uppercase letter"
          />
          <RequirementItem
            met={strength.requirements.lowercase}
            text="One lowercase letter"
          />
          <RequirementItem
            met={strength.requirements.number}
            text="One number"
          />
          <RequirementItem
            met={strength.requirements.special}
            text="One special character (!@#$%^&*)"
          />
        </div>
      </div>
    </div>
  );
};

interface RequirementItemProps {
  met: boolean;
  text: string;
}

const RequirementItem: React.FC<RequirementItemProps> = ({ met, text }) => (
  <div className="flex items-center space-x-2">
    {met ? (
      <Check className="w-3 h-3 text-green-500" />
    ) : (
      <X className="w-3 h-3 text-gray-400" />
    )}
    <span className={met ? 'text-green-600' : 'text-gray-500'}>{text}</span>
  </div>
);

export default PasswordStrengthIndicator;