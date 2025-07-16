import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Bell, Settings, User, LogOut, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Logo from '@/components/Logo';
import { useAuth } from '@/hooks/use-auth';

const MobileHeader = () => {
  const { user, guestMode, signOut, exitGuestMode } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  const handleExitGuest = () => {
    exitGuestMode();
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border md:hidden">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <Logo size="sm" />
        </Link>

        {/* Right Actions */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          {(user || guestMode) && (
            <Button variant="ghost" size="sm" className="relative">
              <Bell size={20} />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
              >
                3
              </Badge>
            </Button>
          )}

          {/* Menu */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            
            <SheetContent side="right" className="w-80">
              <SheetHeader className="pb-4">
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>

              <div className="space-y-6">
                {/* User Profile Section */}
                {user && (
                  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback>
                        {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {user.user_metadata?.full_name || 'User'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                )}

                {/* Guest Mode Banner */}
                {guestMode && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm font-medium text-amber-800">Guest Mode</p>
                    <p className="text-xs text-amber-600 mt-1">
                      Sign up to save your preferences and activities
                    </p>
                  </div>
                )}

                {/* Navigation Links */}
                <nav className="space-y-1">
                  <Link 
                    to="/profile" 
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={18} />
                    <span className="font-medium">Profile</span>
                  </Link>

                  <Link 
                    to="/settings" 
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings size={18} />
                    <span className="font-medium">Settings</span>
                  </Link>

                  <Link 
                    to="/nearby" 
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <MapPin size={18} />
                    <span className="font-medium">Nearby Trails</span>
                  </Link>
                </nav>

                {/* Actions */}
                <div className="pt-4 border-t border-border space-y-2">
                  {guestMode ? (
                    <>
                      <Button 
                        variant="default" 
                        className="w-full justify-start" 
                        asChild
                      >
                        <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                          Sign Up / Sign In
                        </Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start" 
                        onClick={handleExitGuest}
                      >
                        <LogOut size={18} className="mr-2" />
                        Exit Guest Mode
                      </Button>
                    </>
                  ) : user ? (
                    <Button 
                      variant="outline" 
                      className="w-full justify-start" 
                      onClick={handleSignOut}
                    >
                      <LogOut size={18} className="mr-2" />
                      Sign Out
                    </Button>
                  ) : (
                    <Button 
                      variant="default" 
                      className="w-full justify-start" 
                      asChild
                    >
                      <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;