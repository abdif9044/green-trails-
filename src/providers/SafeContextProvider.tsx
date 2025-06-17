
import React, { ReactNode } from 'react';

interface SafeContextProviderProps {
  children: ReactNode;
}

export const SafeContextProvider: React.FC<SafeContextProviderProps> = ({ children }) => {
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    // Ensure React is fully loaded before rendering children
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-greentrail-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-greentrail-600 mb-4"></div>
          <p className="text-greentrail-600 font-medium">Loading GreenTrails...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
