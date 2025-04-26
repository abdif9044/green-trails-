
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { MessageSquare } from 'lucide-react';
import CommentForm from './CommentForm';
import CommentsList from './CommentsList';

interface TrailCommentsProps {
  trailId: string;
}

const TrailComments: React.FC<TrailCommentsProps> = ({ trailId }) => {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-greentrail-600" />
        <h2 className="text-xl font-semibold text-greentrail-800 dark:text-greentrail-200">
          Comments
        </h2>
      </div>
      
      <Separator className="bg-greentrail-200 dark:bg-greentrail-700" />
      
      <div className="space-y-6">
        <CommentForm trailId={trailId} />
        <CommentsList trailId={trailId} />
      </div>
    </section>
  );
};

export default TrailComments;
