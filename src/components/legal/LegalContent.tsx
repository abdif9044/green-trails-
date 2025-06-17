
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LegalContent {
  id: string;
  title: string;
  content: string;
  last_updated: string;
}

interface LegalContentProps {
  content: LegalContent[];
  isLoading: boolean;
}

const LegalContent = ({ content, isLoading }: LegalContentProps) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!content || content.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No legal content available at this time.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Legal Information</h1>
      <div className="space-y-6">
        {content.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <p className="text-sm text-gray-500">
                Last updated: {new Date(item.last_updated).toLocaleDateString()}
              </p>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {item.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LegalContent;
