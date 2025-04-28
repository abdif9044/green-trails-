
import React from 'react';
import FooterLinks from './FooterLinks';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-greentrail-100 dark:bg-greentrail-900 py-6 border-t border-greentrail-200 dark:border-greentrail-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <div className="mb-4">
            <img 
              src="/lovable-uploads/0c2a9cc4-4fdb-4d4a-965c-47b406e4ec4e.png" 
              alt="GreenTrails Logo"
              className="h-10 w-auto" 
            />
          </div>
          
          <FooterLinks />
          
          <p className="mt-6 text-sm text-greentrail-600 dark:text-greentrail-400 text-center">
            &copy; {currentYear} GreenTrails Global. All rights reserved.
            <br />
            <span className="text-xs">For adults 21+ in legal jurisdictions only.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
