
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  // Generate years for dropdown (current year - 110 to current year - 13)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 98 }, (_, i) => currentYear - 13 - i);

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => onFullNameChange(e.target.value)}
          placeholder="Enter your full name"
          required
          disabled={loading}
          autoComplete="name"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          placeholder="Choose a username"
          required
          disabled={loading}
          autoComplete="username"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="Enter your email"
          required
          disabled={loading}
          autoComplete="email"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder="Create a password (min 8 characters)"
          required
          disabled={loading}
          autoComplete="new-password"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => onConfirmPasswordChange(e.target.value)}
          placeholder="Confirm your password"
          required
          disabled={loading}
          autoComplete="new-password"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="birthYear">Year of Birth (Must be 21+)</Label>
        <Select onValueChange={onBirthYearChange} value={birthYear} disabled={loading}>
          <SelectTrigger id="birthYear">
            <SelectValue placeholder="Select your birth year" />
          </SelectTrigger>
          <SelectContent className="max-h-[200px]">
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
