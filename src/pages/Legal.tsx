
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";

interface LegalContent {
  id: string;
  title: string;
  content: string;
  updated_at: string;
}

const Legal = () => {
  const { type = 'terms-of-service' } = useParams<{ type?: string }>();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['legal-content', type],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('legal_content')
        .select('*')
        .eq('id', type)
        .single();
        
      if (error) throw error;
      return data as LegalContent;
    },
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto flex-grow px-4 py-10">
        <div className="max-w-3xl mx-auto">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-12 w-3/5 mt-8" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <h1 className="text-2xl font-bold text-destructive">Error Loading Content</h1>
              <p className="mt-4 text-muted-foreground">
                We're sorry, but we couldn't load the requested legal document.
              </p>
            </div>
          ) : data ? (
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h1 className="text-3xl font-bold text-greentrail-800 dark:text-greentrail-200 mb-6">
                {data.title}
              </h1>
              <div className="legal-content" dangerouslySetInnerHTML={{ __html: formatMarkdown(data.content) }} />
              <p className="text-sm text-muted-foreground mt-8">
                Last updated: {new Date(data.updated_at).toLocaleDateString()}
              </p>
            </div>
          ) : null}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

// Simple markdown formatter (replace with a proper markdown parser in a production app)
const formatMarkdown = (content: string): string => {
  let html = content;
  // Convert headers
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  
  // Convert paragraphs (double newlines)
  html = html.replace(/\n\n(.*)/gm, '<p>$1</p>');
  
  // Convert bold
  html = html.replace(/\*\*(.*?)\*\*/gm, '<strong>$1</strong>');
  
  // Convert italic
  html = html.replace(/\*(.*?)\*/gm, '<em>$1</em>');
  
  // Convert line breaks
  html = html.replace(/\n/gm, '<br>');
  
  return html;
};

export default Legal;
