
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const NavbarLogo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="flex items-center space-x-2 cursor-pointer group" 
      onClick={() => navigate('/')}
    >
      <div className="relative">
        <img 
          src="/lovable-uploads/0c2a9cc4-4fdb-4d4a-965c-47b406e4ec4e.png" 
          alt="GreenTrails Logo" 
          className="h-8 w-auto transition-transform duration-300 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-greentrail-400/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <span className="font-bold text-2xl text-greentrail-800 dark:text-greentrail-300 group-hover:text-greentrail-600 transition-colors duration-300">
        GreenTrails
      </span>
    </div>
  );
};
