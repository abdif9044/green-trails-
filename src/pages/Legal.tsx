
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { LegalContent } from '@/types/legal';

const Legal: React.FC = () => {
  const { type = 'terms-of-service' } = useParams();
  const navigate = useNavigate();
  
  const { data, isLoading } = useQuery<LegalContent>({
    queryKey: ['legal-content', type],
    queryFn: async () => {
      // Using execute_sql function to get around TypeScript limitations
      const { data, error } = await supabase.rpc('execute_sql', {
        sql_query: `SELECT * FROM legal_content WHERE id = '${type}'`
      });
      
      if (error) throw error;
      if (!data || data.length === 0) throw new Error('Legal content not found');
      
      // Properly convert the data to LegalContent type
      const legalDoc = data[0];
      if (typeof legalDoc === 'object' && legalDoc !== null) {
        return {
          id: String(legalDoc.id || ''),
          title: String(legalDoc.title || ''),
          content: String(legalDoc.content || ''),
          updated_at: legalDoc.updated_at ? String(legalDoc.updated_at) : undefined
        };
      }
      
      throw new Error('Invalid legal content format');
    }
  });
  
  const handleTabChange = (value: string) => {
    navigate(`/legal/${value}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <Tabs value={type} onValueChange={handleTabChange}>
              <TabsList className="mb-6">
                <TabsTrigger value="terms-of-service">Terms of Service</TabsTrigger>
                <TabsTrigger value="privacy-policy">Privacy Policy</TabsTrigger>
              </TabsList>
              
              <TabsContent value="terms-of-service" className="prose prose-green dark:prose-invert max-w-none">
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-3/4" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-5/6" />
                    <Skeleton className="h-12 w-2/3 mt-8" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                ) : data?.id === 'terms-of-service' ? (
                  <div dangerouslySetInnerHTML={{ __html: formatMarkdown(data.content) }} />
                ) : (
                  <p>Terms of Service document not found.</p>
                )}
              </TabsContent>
              
              <TabsContent value="privacy-policy" className="prose prose-green dark:prose-invert max-w-none">
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-3/4" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-5/6" />
                    <Skeleton className="h-12 w-2/3 mt-8" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                ) : data?.id === 'privacy-policy' ? (
                  <div dangerouslySetInnerHTML={{ __html: formatMarkdown(data.content) }} />
                ) : (
                  <p>Privacy Policy document not found.</p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

// Simple markdown to HTML converter for basic formatting
const formatMarkdown = (content: string): string => {
  if (!content) return '';
  
  // Convert headers
  let html = content
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/\n/gim, '<br>');
    
  return html;
};

export default Legal;
