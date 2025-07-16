import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Map, Heart, User, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';

const MobileBottomNav = () => {
  const location = useLocation();
  const { user, guestMode } = useAuth();
  
  // Don't show bottom nav if not authenticated and not in guest mode
  if (!user && !guestMode) {
    return null;
  }

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/discover', icon: Search, label: 'Discover' },
    { to: '/map', icon: Map, label: 'Map' },
    { to: '/favorites', icon: Heart, label: 'Favorites' },
    { to: '/profile', icon: User, label: 'Profile' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40 md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(({ to, icon: Icon, label }, index) => {
          // Add create button in the middle
          if (index === 2) {
            return (
              <React.Fragment key="create-button">
                <Link
                  to={to}
                  className={`flex flex-col items-center justify-center min-w-[60px] py-1 px-2 rounded-lg transition-all duration-200 ${
                    isActive(to)
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  <Icon size={20} strokeWidth={2} />
                  <span className="text-xs mt-1 font-medium">{label}</span>
                </Link>
                
                {/* Create/Add Button */}
                <Button
                  size="sm"
                  className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
                  asChild
                >
                  <Link to="/create">
                    <Plus size={20} strokeWidth={2.5} />
                  </Link>
                </Button>
              </React.Fragment>
            );
          }

          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center justify-center min-w-[60px] py-1 px-2 rounded-lg transition-all duration-200 ${
                isActive(to)
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <Icon size={20} strokeWidth={2} />
              <span className="text-xs mt-1 font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;