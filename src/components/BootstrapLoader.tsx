
import React from 'react';

const BootstrapLoader: React.FC = () => {
  // Use a ref to ensure the effect only runs once and avoid hook dispatcher issues
  const hasBootstrapped = React.useRef(false);
  
  React.useEffect(() => {
    if (!hasBootstrapped.current) {
      hasBootstrapped.current = true;
      // Bootstrap any necessary initialization
      console.log('GreenTrails app bootstrapped successfully');
    }
  }, []);

  return null;
};

export default BootstrapLoader;
