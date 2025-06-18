
import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-greentrail-600" />
        <span className="text-lg text-greentrail-600">Loading...</span>
      </div>
    </div>
  );
};

export default Loading;
