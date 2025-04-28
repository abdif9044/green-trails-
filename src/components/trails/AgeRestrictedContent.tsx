
import React, { useState } from 'react';
import AgeRestrictionWarning from './AgeRestrictionWarning';

interface AgeRestrictedContentProps {
  isAgeRestricted: boolean;
  children: React.ReactNode;
}

const AgeRestrictedContent: React.FC<AgeRestrictedContentProps> = ({ 
  isAgeRestricted,
  children 
}) => {
  const [ageVerified, setAgeVerified] = useState(false);

  if (isAgeRestricted && !ageVerified) {
    return <AgeRestrictionWarning onVerified={() => setAgeVerified(true)} />;
  }

  return <>{children}</>;
};

export default AgeRestrictedContent;
