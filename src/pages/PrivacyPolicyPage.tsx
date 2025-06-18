
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOProvider from '@/components/SEOProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-greentrail-50 via-white to-luxury-50">
      <SEOProvider 
        title="Privacy Policy - GreenTrails"
        description="GreenTrails privacy policy and data protection information"
      />
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="luxury-card">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-greentrail-800">
              Privacy Policy
            </CardTitle>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-greentrail-700 mb-3">Information We Collect</h2>
              <p>We collect information you provide directly to us, such as when you create an account, update your profile, or use our services.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-greentrail-700 mb-3">How We Use Your Information</h2>
              <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-greentrail-700 mb-3">Information Sharing</h2>
              <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-greentrail-700 mb-3">Data Security</h2>
              <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-greentrail-700 mb-3">Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at privacy@greentrails.app</p>
            </section>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
