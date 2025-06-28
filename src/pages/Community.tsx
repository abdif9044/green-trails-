
import React from 'react';
import SimpleLeaderboards from '@/components/community/SimpleLeaderboards';

const Community: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <SimpleLeaderboards />
      </div>
    </div>
  );
};

export default Community;
