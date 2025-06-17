
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEnhancedAuth } from '@/providers/enhanced-auth-provider';
import { Compass, Users, User } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import NotificationCenter from '@/components/social/NotificationCenter';
import { NavbarAuth } from '@/components/NavbarAuth';

export const DesktopNavigation: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useEnhancedAuth();

  const navigationItems = [
    { icon: Compass, label: 'Discover', path: '/discover' },
    { icon: Users, label: 'Social', path: '/social' },
    { icon: User, label: 'Profile', path: '/profile' }
  ];

  return (
    <div className="hidden md:flex items-center space-x-6">
      {navigationItems.map(({ icon: Icon, label, path }) => (
        <div 
          key={label}
          className="relative group cursor-pointer"
          onClick={() => navigate(path)}
        >
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100" />
          
          <div className="flex items-center space-x-1 text-greentrail-700 hover:text-greentrail-900 dark:text-greentrail-300 dark:hover:text-white transition-colors duration-300 px-3 py-2 relative z-10">
            <Icon size={18} className="transition-transform duration-300 group-hover:scale-110" />
            <span className="font-medium">{label}</span>
          </div>
        </div>
      ))}
      
      {user && (
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-sm rounded-full blur-sm" />
          <NotificationCenter />
        </div>
      )}
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-lg" />
          <ThemeToggle />
        </div>
        <NavbarAuth />
      </div>
    </div>
  );
};
