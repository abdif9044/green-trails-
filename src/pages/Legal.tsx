
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
import { format } from 'date-fns';

const Legal: React.FC = () => {
  const { type = 'terms-of-service' } = useParams();
  const navigate = useNavigate();
  
  const { data, isLoading } = useQuery<LegalContent>({
    queryKey: ['legal-content', type],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('legal_content')
        .select('*')
        .eq('id', type)
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Legal content not found');
      
      return data as LegalContent;
    }
  });
  
  const handleTabChange = (value: string) => {
    navigate(`/legal/${value}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-greentrail-50 dark:bg-greentrail-950">
      <Navbar />
      
      <div className="flex-grow container mx-auto px-4 py-8">
        <Card className="border border-greentrail-200 dark:border-greentrail-800 shadow-md">
          <CardContent className="pt-6">
            <Tabs value={type} onValueChange={handleTabChange}>
              <TabsList className="mb-6 w-full justify-start bg-greentrail-100 dark:bg-greentrail-900">
                <TabsTrigger 
                  value="terms-of-service"
                  className="data-[state=active]:bg-greentrail-600 data-[state=active]:text-white"
                >
                  Terms of Service
                </TabsTrigger>
                <TabsTrigger 
                  value="privacy-policy"
                  className="data-[state=active]:bg-greentrail-600 data-[state=active]:text-white"
                >
                  Privacy Policy
                </TabsTrigger>
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
                  <div>
                    <div className="text-sm text-right text-greentrail-600 dark:text-greentrail-400 mb-4">
                      Last updated: {data.updated_at ? format(new Date(data.updated_at), 'MMMM d, yyyy') : 'N/A'}
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: formatMarkdown(data.content) }} />
                  </div>
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
                  <div>
                    <div className="text-sm text-right text-greentrail-600 dark:text-greentrail-400 mb-4">
                      Last updated: {data.updated_at ? format(new Date(data.updated_at), 'MMMM d, yyyy') : 'N/A'}
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: formatMarkdown(data.content) }} />
                  </div>
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

// Enhanced markdown to HTML converter for better formatting
const formatMarkdown = (content: string): string => {
  if (!content) return '';
  
  // Convert headers
  let html = content
    // Headers
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
    
    // Bold and italic
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    
    // Lists
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    
    // Wrap lists in ul tags
    .replace(/(<li>.*<\/li>)/gims, '<ul>$1</ul>')
    
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-greentrail-600 dark:text-greentrail-400 hover:underline">$1</a>')
    
    // Paragraphs and line breaks
    .replace(/\n\n/gim, '</p><p>')
    .replace(/\n/gim, '<br>');
  
  // Wrap in paragraph tags if not already done
  if (!html.startsWith('<h') && !html.startsWith('<p>')) {
    html = '<p>' + html + '</p>';
  }
    
  return html;
};

export default Legal;
