
import React, { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';

const SplashScreen: React.FC<{ onFinished: () => void }> = ({ onFinished }) => {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Only show splash screen for a few seconds in mobile environments
    if (Capacitor.isNativePlatform()) {
      // Animate progress bar
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 5;
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            // Wait a bit after reaching 100%
            setTimeout(() => {
              setVisible(false);
              onFinished();
            }, 500);
            return 100;
          }
          return newProgress;
        });
      }, 100);
      
      return () => clearInterval(progressInterval);
    } else {
      // On web, show a quick splash screen
      const timer = setTimeout(() => {
        setVisible(false);
        onFinished();
      }, 1500);
      
      // Animate progress bar more quickly
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 10;
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return newProgress;
        });
      }, 100);
      
      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
      };
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
      <div className="w-64 bg-greentrail-700 rounded-full h-2 mt-6">
        <div 
          className="bg-greentrail-300 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-greentrail-300 text-sm mt-2">Loading trail data...</p>
    </div>
  );
};

export default SplashScreen;
