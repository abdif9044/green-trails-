
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-greentrail-900 text-greentrail-100 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/lovable-uploads/0c2a9cc4-4fdb-4d4a-965c-47b406e4ec4e.png" 
                alt="GreenTrails Logo" 
                className="h-8 w-auto" 
              />
              <span className="font-bold text-xl text-white">
                GreenTrails
              </span>
            </div>
            <p className="text-greentrail-300 mb-4">
              Discover cannabis-friendly trails and connect with like-minded adventurers.
            </p>
            <p className="text-greentrail-300 text-sm">
              &copy; {new Date().getFullYear()} GreenTrails
              <br />All rights reserved.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-white text-lg mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/discover" className="text-greentrail-300 hover:text-white transition-colors">
                  Discover Trails
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-greentrail-300 hover:text-white transition-colors">
                  Trail Map
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-greentrail-300 hover:text-white transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-greentrail-300 hover:text-white transition-colors">
                  Events
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-white text-lg mb-4">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/auth" className="text-greentrail-300 hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/auth?signup=true" className="text-greentrail-300 hover:text-white transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-greentrail-300 hover:text-white transition-colors">
                  Your Profile
                </Link>
              </li>
              <li>
                <Link to="/settings" className="text-greentrail-300 hover:text-white transition-colors">
                  Settings
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-white text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-greentrail-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-greentrail-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="text-greentrail-300 hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/accessibility" className="text-greentrail-300 hover:text-white transition-colors">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-greentrail-800 text-center text-sm text-greentrail-400">
          <p>GreenTrails is designed for adults 21+. Please consume cannabis responsibly and follow local regulations.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
