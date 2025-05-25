
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrail } from '@/features/trails/hooks/use-trail';
import { useTrailInteractions } from '@/hooks/use-trail-interactions';
import TrailHeader from '@/components/trails/TrailHeader';
import TrailImageGallery from '@/components/trails/TrailImageGallery';
import TrailContent from '@/components/trails/TrailContent';
import TrailSidebar from '@/components/trails/TrailSidebar';
import SimilarTrails from '@/components/trails/SimilarTrails';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const Trail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: trail, isLoading, error } = useTrail(id || '');
  const { 
    isLiked, 
    likes, 
    toggleLike,
    isLoading: interactionsLoading 
  } = useTrailInteractions(id || '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !trail) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Trail Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The trail you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/discover')}>
            Back to Discover
          </Button>
        </div>
      </div>
    );
  }

  const handleLikeClick = async () => {
    await toggleLike();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: trail.name,
        text: `Check out this amazing trail: ${trail.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <TrailHeader 
              trail={trail} 
              likes={likes}
              onLike={handleLikeClick}
              onShare={handleShare}
              isLiked={isLiked}
            />
            
            <TrailImageGallery trailId={trail.id} />
            
            <TrailContent trail={trail} />
          </div>
          
          <div className="space-y-6">
            <TrailSidebar trail={trail} />
          </div>
        </div>

        <div className="mt-12">
          <SimilarTrails currentTrailId={trail.id} />
        </div>
      </div>
    </div>
  );
};

export default Trail;
