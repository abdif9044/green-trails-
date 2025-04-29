
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AgeVerificationProps {
  onVerify: (isVerified: boolean) => void;
  className?: string;
}

const AgeVerification: React.FC<AgeVerificationProps> = ({ onVerify, className }) => {
  const [month, setMonth] = useState<string>('');
  const [day, setDay] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [agreed, setAgreed] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Generate options for select fields
  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];
  
  const days = Array.from({ length: 31 }, (_, i) => ({ 
    value: String(i + 1), 
    label: String(i + 1) 
  }));
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => ({ 
    value: String(currentYear - i), 
    label: String(currentYear - i) 
  }));
  
  const verifyAge = async () => {
    setError(null);
    
    if (!month || !day || !year) {
      setError('Please select a complete birth date');
      return;
    }
    
    if (!agreed) {
      setError('You must confirm that you are 21 years of age or older');
      return;
    }
    
    setVerifying(true);
    
    try {
      // Calculate if user is 21+
      const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const today = new Date();
      
      // Calculate age
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      // Check if 21 or older
      if (age >= 21) {
        // Update user metadata with verified status
        const user = supabase.auth.getUser();
        if ((await user).data.user) {
          const { error: updateError } = await supabase.auth.updateUser({
            data: {
              date_of_birth: birthDate.toISOString().split('T')[0],
              age_verified: true
            }
          });
          
          if (updateError) {
            console.error('Failed to update user metadata:', updateError);
            toast({
              title: "Verification Status Update Failed",
              description: "Your age was verified, but we couldn't update your profile. Some features may be limited.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Age Verified Successfully",
              description: "You now have access to all features of GreenTrails.",
            });
          }
        }
        
        onVerify(true);
      } else {
        setError('You must be 21 or older to use GreenTrails');
        onVerify(false);
        toast({
          title: "Age Verification Failed",
          description: "You must be 21 or older to use GreenTrails.",
          variant: "destructive",
        });
      }
    } catch (err) {
      setError('Invalid date. Please check your birth date.');
      onVerify(false);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="pt-6">
        <h2 className="text-2xl font-semibold text-greentrail-800 dark:text-greentrail-200 mb-6 text-center">
          Age Verification
        </h2>
        
        <p className="text-greentrail-600 dark:text-greentrail-400 mb-6 text-center">
          GreenTrails is only available to users 21 years of age or older.
          <br />Please verify your age to continue.
        </p>
        
        <div className="space-y-4">
          <div>
            <Label className="block mb-2">Birth Date</Label>
            <div className="grid grid-cols-3 gap-2">
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map(month => (
                    <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={day} onValueChange={setDay}>
                <SelectTrigger>
                  <SelectValue placeholder="Day" />
                </SelectTrigger>
                <SelectContent>
                  {days.map(day => (
                    <SelectItem key={day.value} value={day.value}>{day.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent className="h-[200px]">
                  {years.map(year => (
                    <SelectItem key={year.value} value={year.value}>{year.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="terms" 
              checked={agreed} 
              onCheckedChange={(checked) => setAgreed(checked === true)}
            />
            <Label htmlFor="terms" className="text-sm text-greentrail-700 dark:text-greentrail-300">
              I confirm that I am 21 years of age or older
            </Label>
          </div>
          
          {error && (
            <div className="text-red-500 text-sm mt-2">
              {error}
            </div>
          )}
          
          <Button 
            className="w-full mt-4" 
            onClick={verifyAge}
            disabled={verifying || !month || !day || !year || !agreed}
          >
            Verify & Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgeVerification;
