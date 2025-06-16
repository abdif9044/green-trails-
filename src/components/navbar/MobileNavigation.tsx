
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Users, User, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import ThemeToggle from '@/components/ThemeToggle';
import { NavbarAuth } from '@/components/NavbarAuth';

interface MobileNavigationProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  isMenuOpen,
  setIsMenuOpen,
}) => {
  const navigate = useNavigate();

  const navigationItems = [
    { icon: Compass, label: 'Discover Trails', path: '/discover' },
    { icon: Users, label: 'Social', path: '/social' },
    { icon: User, label: 'Profile', path: '/profile' }
  ];

  return (
    <>
      <button 
        className={cn(
          "md:hidden relative p-2 rounded-lg transition-all duration-300",
          "bg-white/10 backdrop-blur-md border border-white/15",
          "hover:bg-white/20 hover:scale-105",
          "text-greentrail-700 hover:text-greentrail-900 dark:text-greentrail-300 dark:hover:text-white"
        )}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full inset-x-0 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-glass-xl">
          <div className="absolute inset-0 bg-gradient-to-b from-greentrail-500/10 to-transparent" />
          
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4 relative z-10">
            {navigationItems.map(({ icon: Icon, label, path }) => (
              <div 
                key={label}
                className="flex items-center space-x-2 p-3 rounded-lg bg-white/5 hover:bg-white/15 backdrop-blur-sm border border-white/10 hover:border-white/20 text-greentrail-700 dark:text-greentrail-300 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                onClick={() => {
                  navigate(path);
                  setIsMenuOpen(false);
                }}
              >
                <Icon size={20} />
                <span className="font-medium">{label}</span>
              </div>
            ))}
            
            <div className="pt-2 flex gap-3">
              <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-lg p-1">
                <ThemeToggle />
              </div>
              <div className="flex-2">
                <NavbarAuth />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
