
import React from 'react';
import { Link } from 'react-router-dom';

const FooterLinks: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      <div>
        <h3 className="font-semibold text-greentrail-800 dark:text-greentrail-200 mb-4">Explore</h3>
        <ul className="space-y-2">
          <li><Link to="/discover" className="text-gray-600 dark:text-gray-300 hover:text-greentrail-600 transition-colors">Discover Trails</Link></li>
          <li><Link to="/weather-prophet" className="text-gray-600 dark:text-gray-300 hover:text-greentrail-600 transition-colors">Weather Prophet</Link></li>
          <li><Link to="/social" className="text-gray-600 dark:text-gray-300 hover:text-greentrail-600 transition-colors">Community</Link></li>
        </ul>
      </div>
      
      <div>
        <h3 className="font-semibold text-greentrail-800 dark:text-greentrail-200 mb-4">Account</h3>
        <ul className="space-y-2">
          <li><Link to="/profile" className="text-gray-600 dark:text-gray-300 hover:text-greentrail-600 transition-colors">Profile</Link></li>
          <li><Link to="/badges" className="text-gray-600 dark:text-greentrail-600 transition-colors">Badges</Link></li>
          <li><Link to="/settings" className="text-gray-600 dark:text-gray-300 hover:text-greentrail-600 transition-colors">Settings</Link></li>
        </ul>
      </div>
      
      <div>
        <h3 className="font-semibold text-greentrail-800 dark:text-greentrail-200 mb-4">Legal</h3>
        <ul className="space-y-2">
          <li><Link to="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-greentrail-600 transition-colors">Privacy Policy</Link></li>
          <li><Link to="/terms" className="text-gray-600 dark:text-gray-300 hover:text-greentrail-600 transition-colors">Terms of Service</Link></li>
        </ul>
      </div>
      
      <div>
        <h3 className="font-semibold text-greentrail-800 dark:text-greentrail-200 mb-4">Support</h3>
        <ul className="space-y-2">
          <li><a href="mailto:support@greentrails.app" className="text-gray-600 dark:text-gray-300 hover:text-greentrail-600 transition-colors">Contact Us</a></li>
          <li><a href="mailto:feedback@greentrails.app" className="text-gray-600 dark:text-gray-300 hover:text-greentrail-600 transition-colors">Feedback</a></li>
        </ul>
      </div>
    </div>
  );
};

export default FooterLinks;
