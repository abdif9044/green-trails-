
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Calendar, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

interface AgeVerificationProps {
  onVerified: () => void;
  onSkip?: () => void;
}

const AgeVerification: React.FC<AgeVerificationProps> = ({ onVerified, onSkip }) => {
  const [birthdate, setBirthdate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { verifyAge } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!birthdate) {
      setError('Please enter your birth date');
      return;
    }
    
    const birthDate = new Date(birthdate);
    const today = new Date();
    
    if (birthDate > today) {
      setError('Birth date cannot be in the future');
      return;
    }
    
    setLoading(true);
    
    try {
      const isVerified = await verifyAge(birthDate);
      
      if (isVerified) {
        toast({
          title: "Age verified!",
          description: "Welcome to GreenTrails! You can now access all features.",
        });
        onVerified();
      } else {
        setError('You must be 21 or older to use GreenTrails');
      }
    } catch (err) {
      console.error('Age verification error:', err);
      setError('An error occurred during verification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Calendar className="h-12 w-12 text-greentrail-600" />
        </div>
        <CardTitle className="text-2xl">Age Verification Required</CardTitle>
        <CardDescription>
          GreenTrails is a 21+ community. Please verify your age to continue.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="birthdate">Date of Birth</Label>
            <Input
              id="birthdate"
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-greentrail-600 hover:bg-greentrail-700" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify Age'
            )}
          </Button>
          
          {onSkip && (
            <Button 
              type="button" 
              variant="outline" 
              className="w-full" 
              onClick={onSkip}
            >
              Skip for now
            </Button>
          )}
        </form>
        
        <div className="mt-4 text-xs text-muted-foreground text-center">
          Your age information is kept private and secure.
        </div>
      </CardContent>
    </Card>
  );
};

export default AgeVerification;
