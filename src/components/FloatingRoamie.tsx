
import { useState, useEffect } from 'react';

const FloatingRoamie = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show the floating logo after scrolling 100px
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
      }`}
    >
      <div className="relative group">
        <img 
          src="/lovable-uploads/f1f69aac-d6e2-4389-8835-f83b42f87d98.png" 
          alt="Roamie" 
          className="w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 rounded-full bg-greentrail-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </div>
  );
};

export default FloatingRoamie;
