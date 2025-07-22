
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
                <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>
                
                <h3>1. Information We Collect</h3>
                <h4>Personal Information</h4>
                <p>When you create an account, we collect:</p>
                <ul>
                  <li>Email address and username</li>
                  <li>Profile information (name, bio, avatar)</li>
                  <li>Age verification data (18+ requirement)</li>
                </ul>
                
                <h4>Location Data</h4>
                <p>We collect and process location information to:</p>
                <ul>
                  <li>Show nearby trails and hiking opportunities</li>
                  <li>Track your hiking sessions and routes</li>
                  <li>Provide location-based weather information</li>
                  <li>Enable geotagging of photos and posts</li>
                </ul>
                
                <h4>Usage Information</h4>
                <p>We automatically collect:</p>
                <ul>
                  <li>App usage patterns and preferences</li>
                  <li>Device information and technical data</li>
                  <li>Trail interactions, reviews, and ratings</li>
                  <li>Photos and media you upload</li>
                </ul>
                
                <h3>2. How We Use Your Information</h3>
                <p>We use collected information to:</p>
                <ul>
                  <li>Provide personalized trail recommendations</li>
                  <li>Enable social features (following, sharing, comments)</li>
                  <li>Improve app functionality and user experience</li>
                  <li>Send important updates and notifications</li>
                  <li>Ensure compliance with age restrictions</li>
                  <li>Provide customer support</li>
                </ul>
                
                <h3>3. Information Sharing</h3>
                <h4>Third-Party Services</h4>
                <p>We use Supabase as our backend infrastructure provider. Your data is stored securely in accordance with their privacy practices.</p>
                
                <h4>Public Information</h4>
                <p>The following information may be visible to other users:</p>
                <ul>
                  <li>Public profile information</li>
                  <li>Trail reviews and photos</li>
                  <li>Public hiking activities and achievements</li>
                </ul>
                
                <h3>4. Data Security</h3>
                <p>We implement industry-standard security measures:</p>
                <ul>
                  <li>Encrypted data transmission (HTTPS/TLS)</li>
                  <li>Secure authentication and authorization</li>
                  <li>Regular security audits and updates</li>
                  <li>Row-level security policies on database</li>
                </ul>
                
                <h3>5. Your Rights</h3>
                <p>You have the right to:</p>
                <ul>
                  <li>Access your personal data</li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your account and data</li>
                  <li>Export your data</li>
                  <li>Opt-out of non-essential communications</li>
                </ul>
                
                <h3>6. Data Retention</h3>
                <p>We retain your data as long as your account is active. Upon account deletion, we remove personal data within 30 days, except where required by law.</p>
                
                <h3>7. Age Requirements</h3>
                <p>GreenTrails requires users to be 18 or older. We do not knowingly collect information from individuals under 18.</p>
                
                <h3>8. Changes to Privacy Policy</h3>
                <p>We may update this policy periodically. Significant changes will be communicated via app notifications or email.</p>
                
                <h3>9. Contact Information</h3>
                <p>For privacy-related questions or requests:</p>
                <ul>
                  <li>Email: privacy@greentrails.app</li>
                  <li>Contact: Via app support section</li>
                </ul>
                
                <h3>10. Legal Basis (GDPR)</h3>
                <p>For EU users, we process data based on:</p>
                <ul>
                  <li>Consent for location tracking and marketing</li>
                  <li>Contract performance for core app features</li>
                  <li>Legitimate interests for analytics and improvements</li>
                </ul>
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
