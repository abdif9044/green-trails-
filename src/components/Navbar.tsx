import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { NavbarAuth } from './NavbarAuth';
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

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div 
          className="flex items-center space-x-2 cursor-pointer" 
          onClick={() => navigate('/')}
        >
          <img 
            src="/lovable-uploads/0c2a9cc4-4fdb-4d4a-965c-47b406e4ec4e.png" 
            alt="GreenTrails Logo" 
            className="h-8 w-auto" 
          />
          <span className="font-bold text-2xl text-greentrail-800 dark:text-greentrail-300">
            GreenTrails
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <div 
            className="flex items-center space-x-1 text-greentrail-700 hover:text-greentrail-900 dark:text-greentrail-300 dark:hover:text-white transition-colors cursor-pointer"
            onClick={() => navigate('/discover')}
          >
            <Compass size={18} />
            <span>Discover</span>
          </div>
          <div 
            className="flex items-center space-x-1 text-greentrail-700 hover:text-greentrail-900 dark:text-greentrail-300 dark:hover:text-white transition-colors cursor-pointer"
            onClick={() => navigate('/social')}
          >
            <Users size={18} />
            <span>Social</span>
          </div>
          <div 
            className="flex items-center space-x-1 text-greentrail-700 hover:text-greentrail-900 dark:text-greentrail-300 dark:hover:text-white transition-colors cursor-pointer"
            onClick={() => navigate('/profile')}
          >
            <User size={18} />
            <span>Profile</span>
          </div>
          {user && <NotificationCenter />}
          <NavbarAuth />
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>

        <button 
          className="md:hidden text-greentrail-700 hover:text-greentrail-900 dark:text-greentrail-300 dark:hover:text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 bg-white dark:bg-greentrail-950 shadow-lg border-b border-greentrail-200 dark:border-greentrail-800 z-50">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <div 
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-greentrail-100 dark:hover:bg-greentrail-900 text-greentrail-700 dark:text-greentrail-300 cursor-pointer"
              onClick={() => {
                navigate('/discover');
                setIsMenuOpen(false);
              }}
            >
              <Compass size={20} />
              <span>Discover Trails</span>
            </div>
            <div 
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-greentrail-100 dark:hover:bg-greentrail-900 text-greentrail-700 dark:text-greentrail-300 cursor-pointer"
              onClick={() => {
                navigate('/social');
                setIsMenuOpen(false);
              }}
            >
              <Users size={20} />
              <span>Social</span>
            </div>
            <div 
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-greentrail-100 dark:hover:bg-greentrail-900 text-greentrail-700 dark:text-greentrail-300 cursor-pointer"
              onClick={() => {
                navigate('/profile');
                setIsMenuOpen(false);
              }}
            >
              <User size={20} />
              <span>Profile</span>
            </div>
            <div className="pt-2">
              <NavbarAuth />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
