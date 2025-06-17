
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LegalContent from '@/components/legal/LegalContent';

interface LegalContent {
  id: string;
  title: string;
  content: string;
  last_updated: string;
}

const Legal = () => {
  const { data: legalContent, isLoading } = useQuery({
    queryKey: ['legal-content'],
    queryFn: async (): Promise<LegalContent[]> => {
      try {
        // Since legal_content table doesn't exist, return mock data
        console.warn('Legal content table does not exist, returning mock data');
        return [
          {
            id: '1',
            title: 'Terms of Service',
            content: 'Terms of Service content will be available once the legal content feature is implemented.',
            last_updated: new Date().toISOString(),
          },
          {
            id: '2',
            title: 'Privacy Policy',
            content: 'Privacy Policy content will be available once the legal content feature is implemented.',
            last_updated: new Date().toISOString(),
          }
        ];
      } catch (error) {
        console.error('Error fetching legal content:', error);
        return [];
      }
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <LegalContent content={legalContent || []} isLoading={isLoading} />
      </main>
      <Footer />
    </div>
  );
};

export default Legal;
