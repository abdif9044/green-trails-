
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-greentrail-50 dark:bg-greentrail-950">
      <div className="text-center p-8">
        <h1 className="text-6xl font-bold text-greentrail-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-greentrail-800 dark:text-greentrail-200 mb-4">
          Trail Not Found
        </h2>
        <p className="text-greentrail-600 dark:text-greentrail-400 mb-8">
          Looks like this trail doesn't exist. Let's get you back on the right path!
        </p>
        <Link to="/">
          <Button className="bg-greentrail-600 hover:bg-greentrail-700">
            Return to Base Camp
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
