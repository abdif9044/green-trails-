
import React from 'react';
import ImportDebugDashboard from '@/components/trails/ImportDebugDashboard';

const ImportDebugPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Trail Import Debug Center</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive debugging and mass import system for trail data
          </p>
        </div>
        <ImportDebugDashboard />
      </div>
    </div>
  );
};

export default ImportDebugPage;
