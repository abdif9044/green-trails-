
import React from 'react';
import { Link } from 'react-router-dom';

const FooterLinks: React.FC = () => {
  return (
    <div className="flex flex-wrap gap-4 md:gap-8 justify-center text-sm">
      <Link 
        to="/legal/terms-of-service" 
        className="text-greentrail-600 hover:text-greentrail-800 dark:text-greentrail-400 dark:hover:text-greentrail-200"
      >
        Terms of Service
      </Link>
      <Link 
        to="/legal/privacy-policy" 
        className="text-greentrail-600 hover:text-greentrail-800 dark:text-greentrail-400 dark:hover:text-greentrail-200"
      >
        Privacy Policy
      </Link>
      <a 
        href="mailto:contact@greentrails.com" 
        className="text-greentrail-600 hover:text-greentrail-800 dark:text-greentrail-400 dark:hover:text-greentrail-200"
      >
        Contact Us
      </a>
    </div>
  );
};

export default FooterLinks;
