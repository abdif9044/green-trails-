
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow bg-slate-50 dark:bg-greentrail-950 py-8">
        <div className="container mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                <h2>GreenTrails Privacy Policy</h2>
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                
                <h3>1. Information We Collect</h3>
                <p>We collect information you provide when creating an account and using our services.</p>
                
                <h3>2. How We Use Information</h3>
                <p>We use your information to provide and improve our services.</p>
                
                <h3>3. Data Security</h3>
                <p>We implement security measures to protect your personal information.</p>
                
                <h3>4. Contact Us</h3>
                <p>If you have questions about this privacy policy, please contact us.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
