
import React from 'react';
import { useTrailComments } from '@/hooks/use-trail-comments';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

interface CommentsListProps {
  trailId: string;
}

const CommentsList: React.FC<CommentsListProps> = ({ trailId }) => {
  const { data: comments = [], isLoading, error } = useTrailComments(trailId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-destructive py-3">Error loading comments: {error?.message ?? 'Unknown error'}</div>;
  }

  if (!comments?.length) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <p>No comments yet. Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-4">
          <Avatar>
            <AvatarImage src={comment.user?.avatar_url || ''} />
            <AvatarFallback className="bg-greentrail-600 text-white">
              {comment.user?.username?.charAt(0)?.toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-baseline justify-between">
              <h4 className="font-medium text-greentrail-800 dark:text-greentrail-200">
                {comment.user?.username || 'Anonymous'}
              </h4>
              <span className="text-xs text-muted-foreground">
                {comment.created_at ? formatDistanceToNow(new Date(comment.created_at), { addSuffix: true }) : 'Recently'}
              </span>
            </div>
            <p className="mt-1 text-greentrail-700 dark:text-greentrail-300">{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentsList;
