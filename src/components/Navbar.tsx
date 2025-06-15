
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { NavbarAuth } from './NavbarAuth';
import { useAuth } from '@/hooks/use-auth';
import { 
  MapPin, 
  User, 
  Compass,
  Users,
  Menu, 
  X 
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import NotificationCenter from '@/components/social/NotificationCenter';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
      scrolled 
        ? "bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-glass-lg" 
        : "bg-white/5 backdrop-blur-md border-b border-white/10"
    )}>
      {/* Glass background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-greentrail-500/5 via-transparent to-greentrail-500/5" />
      
      <div className="container mx-auto px-4 py-4 flex items-center justify-between relative z-10">
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
            {/* Glass glow effect around logo */}
            <div className="absolute inset-0 bg-greentrail-400/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <span className="font-bold text-2xl text-greentrail-800 dark:text-greentrail-300 group-hover:text-greentrail-600 transition-colors duration-300">
            GreenTrails
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          {[
            { icon: Compass, label: 'Discover', path: '/discover' },
            { icon: Users, label: 'Social', path: '/social' },
            { icon: User, label: 'Profile', path: '/profile' }
          ].map(({ icon: Icon, label, path }) => (
            <div 
              key={label}
              className="relative group cursor-pointer"
              onClick={() => navigate(path)}
            >
              {/* Glass button background */}
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
      </div>

      {/* Mobile menu with enhanced glass effect */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full inset-x-0 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-glass-xl">
          {/* Enhanced glass overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-greentrail-500/10 to-transparent" />
          
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4 relative z-10">
            {[
              { icon: Compass, label: 'Discover Trails', path: '/discover' },
              { icon: Users, label: 'Social', path: '/social' },
              { icon: User, label: 'Profile', path: '/profile' }
            ].map(({ icon: Icon, label, path }) => (
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
    </header>
  );
};

export default Navbar;
