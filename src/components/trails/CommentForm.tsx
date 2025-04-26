
import React, { useState } from 'react';
import { useAddComment } from '@/hooks/use-trail-interactions';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

interface CommentFormProps {
  trailId: string;
}

const CommentForm: React.FC<CommentFormProps> = ({ trailId }) => {
  const [comment, setComment] = useState('');
  const { user } = useAuth();
  const { mutate: addComment, isPending } = useAddComment(trailId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim()) return;
    
    addComment(comment, {
      onSuccess: () => {
        setComment('');
      }
    });
  };

  if (!user) {
    return (
      <div className="bg-muted/40 rounded-lg p-4 text-center">
        <p className="text-muted-foreground">Sign in to leave a comment</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        placeholder="Share your experience on this trail..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="min-h-[100px] bg-background border-greentrail-200 dark:border-greentrail-800 focus-visible:ring-greentrail-500"
      />
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={!comment.trim() || isPending}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Post Comment
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
