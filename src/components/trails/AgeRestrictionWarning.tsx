
import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BadgeAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { verifyUserAge } from '@/services/age-verification-service';
import AgeVerification from '../auth/AgeVerification';

interface AgeRestrictionWarningProps {
  onVerified: () => void;
}

const AgeRestrictionWarning: React.FC<AgeRestrictionWarningProps> = ({ onVerified }) => {
  const { user } = useAuth();
  const [showVerification, setShowVerification] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  
  const checkVerificationStatus = async () => {
    if (!user) return;
    
    setIsCheckingStatus(true);
    const isVerified = await verifyUserAge(user.id);
    
    if (isVerified) {
      onVerified();
    } else {
      setShowVerification(true);
    }
    setIsCheckingStatus(false);
  };
  
  const handleVerification = (isVerified: boolean) => {
    setShowVerification(false);
    if (isVerified) {
      onVerified();
    }
  };
  
  return (
    <div className="space-y-4">
      {showVerification ? (
        <AgeVerification onVerify={handleVerification} />
      ) : (
        <>
          <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <BadgeAlert className="h-4 w-4" />
            <AlertTitle>Age-Restricted Content</AlertTitle>
            <AlertDescription className="space-y-3">
              <p>
                This content is only available to verified users 21 years of age or older.
                You must verify your age to access this content.
              </p>
              
              <Button 
                onClick={checkVerificationStatus} 
                disabled={isCheckingStatus || !user}
                size="sm"
              >
                {isCheckingStatus ? 'Checking...' : 'Verify Age'}
              </Button>
              
              {!user && (
                <p className="text-sm text-muted-foreground">
                  Please sign in to verify your age.
                </p>
              )}
            </AlertDescription>
          </Alert>
        </>
      )}
    </div>
  );
};

export default AgeRestrictionWarning;
