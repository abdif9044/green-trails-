
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  User, 
  Compass, 
  Menu, 
  X 
} from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full glass-effect border-b border-greentrail-200 dark:border-greentrail-900">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/0c2a9cc4-4fdb-4d4a-965c-47b406e4ec4e.png" 
            alt="GreenTrails Logo" 
            className="h-8 w-auto" 
          />
          <span className="font-bold text-2xl text-greentrail-800 dark:text-greentrail-300">
            GreenTrails
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/discover" className="flex items-center space-x-1 text-greentrail-700 hover:text-greentrail-900 dark:text-greentrail-300 dark:hover:text-white transition-colors">
            <Compass size={18} />
            <span>Discover</span>
          </Link>
          <Link to="/profile" className="flex items-center space-x-1 text-greentrail-700 hover:text-greentrail-900 dark:text-greentrail-300 dark:hover:text-white transition-colors">
            <User size={18} />
            <span>Profile</span>
          </Link>
          <Link to="/auth">
            <Button variant="outline" className="border-greentrail-500 text-greentrail-700 hover:bg-greentrail-100 hover:text-greentrail-800 dark:border-greentrail-400 dark:text-greentrail-200 dark:hover:bg-greentrail-800 dark:hover:text-greentrail-100">
              Sign In
            </Button>
          </Link>
          <Link to="/auth?signup=true">
            <Button className="bg-greentrail-600 hover:bg-greentrail-700 text-white">
              Join Now
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-greentrail-700 hover:text-greentrail-900 dark:text-greentrail-300 dark:hover:text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 bg-white dark:bg-greentrail-950 shadow-lg border-b border-greentrail-200 dark:border-greentrail-800 z-50">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link 
              to="/discover" 
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-greentrail-100 dark:hover:bg-greentrail-900 text-greentrail-700 dark:text-greentrail-300"
              onClick={() => setIsMenuOpen(false)}
            >
              <Compass size={20} />
              <span>Discover Trails</span>
            </Link>
            <Link 
              to="/profile" 
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-greentrail-100 dark:hover:bg-greentrail-900 text-greentrail-700 dark:text-greentrail-300"
              onClick={() => setIsMenuOpen(false)}
            >
              <User size={20} />
              <span>Profile</span>
            </Link>
            <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-greentrail-200 dark:border-greentrail-800">
              <Link to="/auth" className="w-full" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full border-greentrail-500 text-greentrail-700 hover:bg-greentrail-100 dark:border-greentrail-400 dark:text-greentrail-200 dark:hover:bg-greentrail-800">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth?signup=true" className="w-full" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-greentrail-600 hover:bg-greentrail-700 text-white">
                  Join Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
