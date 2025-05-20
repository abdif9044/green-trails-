
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - GreenTrails</title>
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">GreenTrails Mobile App Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p><strong>Last Updated: May 20, 2025</strong></p>
              
              <h2>Introduction</h2>
              <p>
                GreenTrails ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
                explains how your information is collected, used, and disclosed by GreenTrails when you use our mobile 
                application and associated services (collectively, the "Service").
              </p>
              
              <h2>Information We Collect</h2>
              <p>We collect the following types of information:</p>
              <ul>
                <li><strong>Personal Information:</strong> Name, email address, phone number, and date of birth for age verification purposes (21+).</li>
                <li><strong>Location Data:</strong> With your permission, we collect precise location data to show you nearby trails and provide navigation.</li>
                <li><strong>Usage Data:</strong> Information about how you use the app, including trails viewed, favorites, and interactions.</li>
                <li><strong>User Content:</strong> Photos, videos, comments, ratings, and other content you submit to the Service.</li>
                <li><strong>Device Information:</strong> Device type, operating system, unique device identifiers, and IP address.</li>
              </ul>
              
              <h2>How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul>
                <li>Provide, maintain, and improve the Service</li>
                <li>Process transactions and send related information</li>
                <li>Verify your age (21+) for access to age-restricted content</li>
                <li>Personalize your experience and provide content recommendations</li>
                <li>Send service notifications and respond to your comments and questions</li>
                <li>Monitor and analyze usage patterns and trends</li>
                <li>Protect against, identify, and prevent fraud and other illegal activities</li>
              </ul>
              
              <h2>Sharing of Information</h2>
              <p>We may share your information:</p>
              <ul>
                <li>With other users according to your privacy settings (photos, comments, etc.)</li>
                <li>With service providers who perform services on our behalf</li>
                <li>To comply with legal obligations</li>
                <li>In connection with a business transaction such as a merger or acquisition</li>
              </ul>
              
              <h2>Data Storage and Security</h2>
              <p>
                Your data is stored using Supabase, a secure database platform. We implement appropriate security 
                measures designed to protect your information from unauthorized access, disclosure, alteration, and destruction.
              </p>
              
              <h2>Your Choices</h2>
              <p>You can:</p>
              <ul>
                <li>Update or correct your account information</li>
                <li>Opt out of marketing communications</li>
                <li>Control location data access through your device settings</li>
                <li>Delete your account and associated data</li>
                <li>Control app permissions through your device settings</li>
              </ul>
              
              <h2>California Privacy Rights</h2>
              <p>
                California residents have certain rights regarding their personal information, including the right to know what 
                personal information is collected, used, shared, or sold.
              </p>
              
              <h2>Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
                Privacy Policy on this page and updating the "Last Updated" date.
              </p>
              
              <h2>Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at privacy@greentrails.app.
              </p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicy;
