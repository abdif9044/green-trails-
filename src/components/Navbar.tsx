
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { NavbarLogo } from '@/components/navbar/NavbarLogo';
import { DesktopNavigation } from '@/components/navbar/DesktopNavigation';
import { MobileNavigation } from '@/components/navbar/MobileNavigation';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
      <div className="absolute inset-0 bg-gradient-to-r from-greentrail-500/5 via-transparent to-greentrail-500/5" />
      
      <div className="container mx-auto px-4 py-4 flex items-center justify-between relative z-10">
        <NavbarLogo />
        <DesktopNavigation />
        <MobileNavigation 
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />
      </div>
    </header>
  );
};

export default Navbar;
