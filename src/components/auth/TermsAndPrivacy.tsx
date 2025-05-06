
import React from 'react';

export const TermsAndPrivacy: React.FC = () => {
  return (
    <div className="text-xs text-muted-foreground">
      By signing up, you agree to the <a href="#" className="text-greentrail-600 hover:underline">Terms of Service</a> and <a href="#" className="text-greentrail-600 hover:underline">Privacy Policy</a>.
      <br />
      <strong>You must be 21 years or older to create an account.</strong>
    </div>
  );
};
