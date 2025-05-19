
import React, { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';

const SplashScreen: React.FC<{ onFinished: () => void }> = ({ onFinished }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Only show splash screen for a few seconds in mobile environments
    if (Capacitor.isNativePlatform()) {
      const timer = setTimeout(() => {
        setVisible(false);
        onFinished();
      }, 3000);
      
      return () => clearTimeout(timer);
    } else {
      // On web, don't show the splash screen
      setVisible(false);
      onFinished();
    }
  }, [onFinished]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-greentrail-800 z-50">
      <div className="w-40 h-40 mb-4">
        <img 
          src="/lovable-uploads/0c2a9cc4-4fdb-4d4a-965c-47b406e4ec4e.png" 
          alt="GreenTrails Logo" 
          className="w-full h-full object-contain"
        />
      </div>
      <h1 className="text-white text-2xl font-bold">GreenTrails</h1>
      <p className="text-greentrail-200 mt-2">Discover Nature's Path, Find Your Peace</p>
      <div className="mt-6">
        <div className="w-12 h-12 rounded-full border-4 border-greentrail-200 border-t-greentrail-500 animate-spin"></div>
      </div>
    </div>
  );
};

export default SplashScreen;
