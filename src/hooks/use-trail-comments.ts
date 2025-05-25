
import { useState, useEffect } from 'react';
import { TrailComment } from '@/types/trails';

export const useTrailComments = (trailId: string) => {
  const [comments, setComments] = useState<TrailComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    try {
      // Mock data for now - replace with actual API call
      const mockComments: TrailComment[] = [
        {
          id: '1',
          user_id: 'user1',
          trail_id: trailId,
          content: 'Great trail with amazing views!',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user: {
            username: 'hiker123',
            full_name: 'John Doe',
            avatar_url: '/placeholder.svg'
          }
        }
      ];
      setComments(mockComments);
    } catch (err) {
      setError('Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (content: string) => {
    try {
      const newComment: TrailComment = {
        id: Date.now().toString(),
        user_id: 'current-user',
        trail_id: trailId,
        content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: {
          username: 'current-user',
          full_name: 'Current User',
          avatar_url: '/placeholder.svg'
        }
      };
      setComments(prev => [newComment, ...prev]);
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to add comment' };
    }
  };

  useEffect(() => {
    if (trailId) {
      fetchComments();
    }
  }, [trailId]);

  return {
    comments,
    loading,
    error: error || '',
    addComment,
    refetch: fetchComments
  };
};
