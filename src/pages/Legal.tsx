
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { LegalContent as LegalContentType } from '@/types/legal';
import LegalContent from '@/components/legal/LegalContent';

const Legal: React.FC = () => {
  const { type = 'terms-of-service' } = useParams<{ type?: string }>();
  const navigate = useNavigate();
  
  const { data, isLoading } = useQuery<LegalContentType>({
    queryKey: ['legal-content', type],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('legal_content')
        .select('*')
        .eq('id', type)
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Legal content not found');
      
      return data as LegalContentType;
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
              
              <TabsContent value="terms-of-service">
                <LegalContent 
                  data={data} 
                  isLoading={isLoading} 
                  contentType="terms-of-service" 
                />
              </TabsContent>
              
              <TabsContent value="privacy-policy">
                <LegalContent 
                  data={data} 
                  isLoading={isLoading} 
                  contentType="privacy-policy" 
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default Legal;
