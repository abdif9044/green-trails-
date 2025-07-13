
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
                <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>
                
                <h3>1. Acceptance of Terms</h3>
                <p>By downloading, installing, or using GreenTrails ("the App"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the App.</p>
                
                <h3>2. Eligibility and Age Requirement</h3>
                <p>You must be at least 21 years old to use GreenTrails. By using the App, you represent that you meet this age requirement and have the legal capacity to enter into these terms.</p>
                
                <h3>3. Description of Service</h3>
                <p>GreenTrails is a mobile application that provides:</p>
                <ul>
                  <li>Trail discovery and mapping services</li>
                  <li>Hiking session tracking and recording</li>
                  <li>Social networking features for outdoor enthusiasts</li>
                  <li>Weather information for outdoor activities</li>
                  <li>Photo and experience sharing capabilities</li>
                </ul>
                
                <h3>4. User Accounts and Registration</h3>
                <p>To access certain features, you must create an account. You agree to:</p>
                <ul>
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your login credentials</li>
                  <li>Notify us immediately of unauthorized access</li>
                  <li>Be responsible for all activities under your account</li>
                </ul>
                
                <h3>5. User Conduct and Prohibited Activities</h3>
                <p>You agree NOT to:</p>
                <ul>
                  <li>Share content that is illegal, harmful, or offensive</li>
                  <li>Harass, threaten, or abuse other users</li>
                  <li>Provide false trail information or safety hazards</li>
                  <li>Upload inappropriate or explicit content</li>
                  <li>Violate intellectual property rights</li>
                  <li>Attempt to hack or compromise the App's security</li>
                  <li>Use the App for commercial purposes without permission</li>
                </ul>
                
                <h3>6. User-Generated Content</h3>
                <p>You retain ownership of content you create but grant GreenTrails a worldwide, royalty-free license to use, display, and distribute your content within the App. You are responsible for ensuring your content doesn't violate these terms or applicable laws.</p>
                
                <h3>7. Outdoor Activity Risks and Safety</h3>
                <p><strong>IMPORTANT SAFETY NOTICE:</strong></p>
                <ul>
                  <li>Outdoor activities involve inherent risks including injury or death</li>
                  <li>You participate in activities at your own risk</li>
                  <li>Always inform others of your hiking plans</li>
                  <li>Check weather conditions and trail reports</li>
                  <li>Carry appropriate safety equipment</li>
                  <li>Trail information may be outdated or inaccurate</li>
                </ul>
                
                <h3>8. Disclaimers and Limitation of Liability</h3>
                <p>GreenTrails is provided "as is" without warranties. We disclaim liability for:</p>
                <ul>
                  <li>Accuracy of trail information or maps</li>
                  <li>Weather data reliability</li>
                  <li>Injuries or accidents during outdoor activities</li>
                  <li>Loss of data or service interruptions</li>
                  <li>Actions of other users</li>
                </ul>
                
                <h3>9. Intellectual Property</h3>
                <p>GreenTrails and its content are protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works without written permission.</p>
                
                <h3>10. Service Availability</h3>
                <p>We strive to maintain service availability but cannot guarantee uninterrupted access. We reserve the right to modify, suspend, or discontinue features with reasonable notice.</p>
                
                <h3>11. Termination</h3>
                <p>We may suspend or terminate your account for violations of these terms. You may delete your account at any time through the App settings.</p>
                
                <h3>12. Privacy Policy</h3>
                <p>Your privacy is important to us. Please review our Privacy Policy to understand how we collect and use your information.</p>
                
                <h3>13. Updates to Terms</h3>
                <p>We may update these terms periodically. Continued use after changes constitutes acceptance of new terms.</p>
                
                <h3>14. Governing Law and Disputes</h3>
                <p>These terms are governed by the laws of [Your Jurisdiction]. Disputes will be resolved through binding arbitration where legally permissible.</p>
                
                <h3>15. Contact Information</h3>
                <p>For questions about these terms:</p>
                <ul>
                  <li>Email: legal@greentrails.app</li>
                  <li>Contact: Via app support section</li>
                </ul>
                
                <p><strong>By using GreenTrails, you acknowledge that you have read, understood, and agree to these Terms of Service.</strong></p>
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
