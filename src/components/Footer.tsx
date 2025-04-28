
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-greentrail-900 text-greentrail-100 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold">GreenTrails</span>
            </Link>
            <p className="text-sm text-greentrail-400 mt-2">
              Discover nature's paths with like-minded explorers
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 md:gap-8">
            <Link to="/discover" className="text-greentrail-300 hover:text-greentrail-100 transition-colors">
              Discover
            </Link>
            <Link to="/social" className="text-greentrail-300 hover:text-greentrail-100 transition-colors">
              Community
            </Link>
            <Link to="/legal/terms-of-service" className="text-greentrail-300 hover:text-greentrail-100 transition-colors">
              Terms of Service
            </Link>
            <Link to="/legal/privacy-policy" className="text-greentrail-300 hover:text-greentrail-100 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
        
        <div className="mt-8 border-t border-greentrail-800 pt-8 text-center text-sm text-greentrail-400">
          &copy; {currentYear} GreenTrails. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
