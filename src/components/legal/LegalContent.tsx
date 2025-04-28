
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import { LegalContent as LegalContentType } from '@/types/legal';
import { formatMarkdown } from '@/utils/markdown-formatter';

interface LegalContentProps {
  data?: LegalContentType;
  isLoading: boolean;
  contentType: 'terms-of-service' | 'privacy-policy';
}

const LegalContent: React.FC<LegalContentProps> = ({ data, isLoading, contentType }) => {
  return (
    <div className="prose prose-green dark:prose-invert max-w-none">
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
      ) : data?.id === contentType ? (
        <div>
          <div className="text-sm text-right text-greentrail-600 dark:text-greentrail-400 mb-4">
            Last updated: {data.updated_at ? format(new Date(data.updated_at), 'MMMM d, yyyy') : 'N/A'}
          </div>
          <div dangerouslySetInnerHTML={{ __html: formatMarkdown(data.content) }} />
        </div>
      ) : (
        <p>{contentType === 'terms-of-service' ? 'Terms of Service' : 'Privacy Policy'} document not found.</p>
      )}
    </div>
  );
};

export default LegalContent;
