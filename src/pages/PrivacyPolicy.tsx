
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from '../components/layout/layout';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <Helmet>
        <title>Privacy Policy | GreenTrails</title>
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-4 flex items-center" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="prose prose-green dark:prose-invert max-w-none">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          
          <p className="mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-semibold mt-6 mb-3">Introduction</h2>
          <p>
            GreenTrails ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and website (collectively, the "Service").
          </p>
          
          <h2 className="text-2xl font-semibold mt-6 mb-3">Information We Collect</h2>
          <p>We collect information that you provide directly to us when you:</p>
          <ul className="list-disc pl-8 my-4">
            <li>Create an account</li>
            <li>Complete your profile</li>
            <li>Upload photos or videos</li>
            <li>Create and share trail albums</li>
            <li>Interact with other users</li>
            <li>Use location-based features</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-6 mb-3">How We Use Your Information</h2>
          <p>We may use the information we collect to:</p>
          <ul className="list-disc pl-8 my-4">
            <li>Provide, maintain, and improve our Service</li>
            <li>Process and complete transactions</li>
            <li>Send you technical notices and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Develop new products and services</li>
            <li>Monitor and analyze trends, usage, and activities</li>
            <li>Personalize your experience</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-6 mb-3">Age Restriction</h2>
          <p>
            GreenTrails is only available to individuals who are at least 21 years of age. We require age verification during account creation and do not knowingly collect personal information from anyone under 21.
          </p>
          
          <h2 className="text-2xl font-semibold mt-6 mb-3">Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>
          
          <h2 className="text-2xl font-semibold mt-6 mb-3">Your Choices</h2>
          <p>
            You can access and update certain information about you from within the Service. You can also request deletion of your account at any time.
          </p>
          
          <h2 className="text-2xl font-semibold mt-6 mb-3">Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>
          
          <h2 className="text-2xl font-semibold mt-6 mb-3">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
            <br />
            <a href="mailto:support@greentrails.app" className="text-greentrail-600 hover:text-greentrail-800">support@greentrails.app</a>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
