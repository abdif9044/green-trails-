
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Check } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface AgeVerificationFormProps {
  onVerified: () => void;
  onCancel: () => void;
}

const AgeVerificationForm: React.FC<AgeVerificationFormProps> = ({ onVerified, onCancel }) => {
  const [day, setDay] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [verifying, setVerifying] = useState(false);
  
  // Generate data for select fields
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const handleVerify = () => {
    setError('');
    
    // Basic validation
    if (!day || !month || !year) {
      setError('Please complete all date fields');
      return;
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
      setError('Please enter a valid date');
      return;
    }
    
    // Check if date is in the future
    if (birthDate > today) {
      setError('Date cannot be in the future');
      return;
    }
    
    // Check if user is 21 or older
    if (age < 21) {
      setError('You must be 21 or older to use this app');
      return;
    }
    
    // Simulate verification
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      onVerified();
    }, 1500);
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Age Verification</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center mb-4">
            <p className="text-greentrail-700 dark:text-greentrail-300">
              You must be 21 years or older to use GreenTrails.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Please verify your date of birth.
            </p>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="day">Day</Label>
              <Input 
                id="day" 
                placeholder="DD"
                value={day}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value === '' || (parseInt(value) > 0 && parseInt(value) <= 31)) {
                    setDay(value);
                  }
                }}
                maxLength={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="month">Month</Label>
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger id="month">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger id="year">
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
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={handleVerify} 
          disabled={verifying}
          className="bg-greentrail-600 hover:bg-greentrail-700"
        >
          {verifying ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center"
            >
              <Check className="mr-2 h-4 w-4" />
              Verifying...
            </motion.div>
          ) : (
            'Verify Age'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AgeVerificationForm;
