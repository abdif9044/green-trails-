
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow bg-slate-50 dark:bg-greentrail-950 py-8">
        <div className="container mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle>Terms of Service</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                <h2>GreenTrails Terms of Service</h2>
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                
                <h3>1. Acceptance of Terms</h3>
                <p>By using GreenTrails, you agree to these terms of service.</p>
                
                <h3>2. Age Requirement</h3>
                <p>You must be 21 years or older to use this service.</p>
                
                <h3>3. User Conduct</h3>
                <p>Users must comply with all applicable laws and regulations.</p>
                
                <h3>4. Content</h3>
                <p>Users are responsible for content they post on the platform.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfService;
