
import React from 'react';
import { Link } from 'react-router-dom';

const FooterLinks: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 text-sm text-greentrail-600 dark:text-greentrail-400">
      <Link to="/legal/terms" className="hover:text-greentrail-800 dark:hover:text-greentrail-200 transition-colors">
        Terms of Service
      </Link>
      <Link to="/legal/privacy" className="hover:text-greentrail-800 dark:hover:text-greentrail-200 transition-colors">
        Privacy Policy
      </Link>
      <Link to="/privacy-policy" className="hover:text-greentrail-800 dark:hover:text-greentrail-200 transition-colors">
        Mobile App Privacy Policy
      </Link>
      <Link to="/legal/cookies" className="hover:text-greentrail-800 dark:hover:text-greentrail-200 transition-colors">
        Cookie Policy
      </Link>
      <Link to="/legal/contact" className="hover:text-greentrail-800 dark:hover:text-greentrail-200 transition-colors">
        Contact Us
      </Link>
    </div>
  );
};

export default FooterLinks;
