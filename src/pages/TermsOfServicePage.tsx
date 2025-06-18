
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOProvider from '@/components/SEOProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-greentrail-50 via-white to-luxury-50">
      <SEOProvider 
        title="Terms of Service - GreenTrails"
        description="GreenTrails terms of service and user agreement"
      />
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="luxury-card">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-greentrail-800">
              Terms of Service
            </CardTitle>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-greentrail-700 mb-3">Acceptance of Terms</h2>
              <p>By accessing and using GreenTrails, you accept and agree to be bound by the terms and provision of this agreement.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-greentrail-700 mb-3">Use License</h2>
              <p>Permission is granted to temporarily use GreenTrails for personal, non-commercial transitory viewing only.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-greentrail-700 mb-3">User Account</h2>
              <p>You must be at least 21 years old to create an account. You are responsible for maintaining the confidentiality of your account credentials.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-greentrail-700 mb-3">Content Guidelines</h2>
              <p>Users must comply with all applicable laws and respect the rights of others when posting content or using our services.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-greentrail-700 mb-3">Limitation of Liability</h2>
              <p>GreenTrails shall not be liable for any indirect, incidental, special, consequential, or punitive damages.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-greentrail-700 mb-3">Contact Information</h2>
              <p>For questions about these Terms of Service, please contact us at legal@greentrails.app</p>
            </section>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsOfServicePage;
