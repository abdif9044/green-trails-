
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingFallback: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col">
      <img 
        src="/lovable-uploads/0c2a9cc4-4fdb-4d4a-965c-47b406e4ec4e.png" 
        alt="GreenTrails Logo" 
        className="h-16 w-auto mb-6"
      />
      <Loader2 className="h-8 w-8 animate-spin text-greentrail-600" />
      <p className="mt-4 text-gray-600 dark:text-gray-400">Loading GreenTrails...</p>
    </div>
  );
};

export default LoadingFallback;
