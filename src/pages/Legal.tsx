
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import LegalContentComponent from '@/components/legal/LegalContent';

interface LegalContentData {
  id: string;
  title: string;
  content: string;
  last_updated: string;
}

const Legal = () => {
  const { data: legalContent, isLoading } = useQuery({
    queryKey: ['legal-content'],
    queryFn: async () => {
      console.log('Fetching legal content...');
      
      // Since legal_content table doesn't exist, return mock data
      console.warn('Legal content table not available, returning mock data');
      
      const mockLegalContent: LegalContentData[] = [
        {
          id: '1',
          title: 'Terms of Service',
          content: `Welcome to GreenTrails. By using our service, you agree to these terms.

1. Acceptance of Terms
By accessing and using GreenTrails, you accept and agree to be bound by the terms and provision of this agreement.

2. Use License
Permission is granted to temporarily download one copy of GreenTrails for personal, non-commercial transitory viewing only.

3. Disclaimer
The materials on GreenTrails are provided on an 'as is' basis. GreenTrails makes no warranties, expressed or implied.

4. Limitations
In no event shall GreenTrails or its suppliers be liable for any damages arising out of the use or inability to use the materials on GreenTrails.

5. Privacy Policy
Your privacy is important to us. Please review our Privacy Policy.`,
          last_updated: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Privacy Policy',
          content: `This Privacy Policy describes how GreenTrails collects, uses, and protects your information.

1. Information We Collect
We collect information you provide directly to us, such as when you create an account or use our services.

2. How We Use Your Information
We use the information we collect to provide, maintain, and improve our services.

3. Information Sharing
We do not sell, trade, or otherwise transfer your information to third parties without your consent.

4. Data Security
We implement appropriate security measures to protect your personal information.

5. Contact Us
If you have any questions about this Privacy Policy, please contact us.`,
          last_updated: new Date().toISOString(),
        }
      ];

      return mockLegalContent;
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <LegalContentComponent content={legalContent || []} isLoading={isLoading} />
    </div>
  );
};

export default Legal;
