import React from 'react';

// This component is no longer needed since we removed age restrictions
// Keeping as placeholder to avoid breaking imports

interface AgeRestrictionFilterProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

const AgeRestrictionFilter: React.FC<AgeRestrictionFilterProps> = () => {
  // Return null since age restrictions are removed
  return null;
};

export default AgeRestrictionFilter;
