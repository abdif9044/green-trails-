
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import Logo from '@/components/Logo';
import { NavbarAuth } from '@/components/NavbarAuth';
import { GoldenDots } from '@/components/ui/golden-dots';
import { useAuth } from '@/hooks/use-auth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Discover', href: '/discover' },
    { name: 'Social', href: '/social' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <Logo size="sm" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-greentrail-600 bg-greentrail-50 dark:text-greentrail-400 dark:bg-greentrail-900'
                    : 'text-gray-700 hover:text-greentrail-600 dark:text-gray-300 dark:hover:text-greentrail-400'
                }`}
              >
                {item.name}
                {isActive(item.href) && (
                  <div className="absolute -top-1 -right-1">
                    <GoldenDots variant="small" count={1} />
                  </div>
                )}
              </Link>
            ))}
          </div>

          {/* Auth and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <NavbarAuth />
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="relative"
                showGoldenDots
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-greentrail-600 bg-greentrail-50 dark:text-greentrail-400 dark:bg-greentrail-900'
                    : 'text-gray-700 hover:text-greentrail-600 dark:text-gray-300 dark:hover:text-greentrail-400'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
                {isActive(item.href) && (
                  <div className="absolute top-2 right-2">
                    <GoldenDots variant="small" count={1} />
                  </div>
                )}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <NavbarAuth />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
