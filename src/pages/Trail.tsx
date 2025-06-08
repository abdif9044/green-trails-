
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrailInteractions } from '@/hooks/use-trail-interactions';
import { useTrailQueryBase } from '@/features/trails/hooks/use-trail-query-base';
import TrailSidebar from '@/components/trails/TrailSidebar';
import SimilarTrails from '@/components/trails/SimilarTrails';
import HikeTracker from '@/components/mobile/HikeTracker';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

const Trail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const trailId = id || '';
  
  // Add debug logging
  console.log('Trail page: trailId =', trailId, 'type:', typeof trailId);
  
  const { data: trail, isLoading: trailLoading, error } = useTrailQueryBase(trailId);
  const { isLiked, likeCount, toggleLike, isLoading } = useTrailInteractions(trailId);

  // Handle loading state
  if (trailLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-greentrail-600 mx-auto mb-4"></div>
          <div className="text-lg">Loading trail...</div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    console.error('Error loading trail:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Error Loading Trail
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We encountered an error while loading this trail. The trail ID might be invalid or the trail may no longer exist.
          </p>
          <div className="space-y-3">
            <Button onClick={() => navigate('/discover')} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Browse All Trails
            </Button>
            <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
              Try Again
            </Button>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 text-xs text-gray-500">
              Trail ID: {trailId} | Error: {error.message}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Handle trail not found
  if (!trail) {
    console.warn('Trail not found for ID:', trailId);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">🥾</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Trail Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The trail you're looking for doesn't exist or may have been removed. Let's help you find other amazing trails!
          </p>
          <div className="space-y-3">
            <Button onClick={() => navigate('/discover')} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Discover Trails
            </Button>
            <Button onClick={() => navigate('/')} variant="outline" className="w-full">
              Go Home
            </Button>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 text-xs text-gray-500">
              Attempted Trail ID: {trailId}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <img 
                src={trail.imageUrl} 
                alt={trail.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {trail.name}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {trail.location}
                    </p>
                  </div>
                  <button
                    onClick={toggleLike}
                    disabled={isLoading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isLiked 
                        ? 'bg-red-500 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span>{isLiked ? '♥' : '♡'}</span>
                    <span>{likeCount}</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{trail.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">miles</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{trail.elevation_gain}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">ft gain</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600 capitalize">{trail.difficulty}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">difficulty</div>
                  </div>
                </div>

                {trail.description && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-3">Description</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                      {trail.description}
                    </p>
                  </div>
                )}

                {trail.tags && trail.tags.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-3">Tags</h2>
                    <div className="flex flex-wrap gap-2">
                      {trail.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hike Tracker Section for logged-in users */}
                {user && (
                  <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Track Your Hike</h2>
                    <HikeTracker trailId={trailId} trailName={trail.name} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <TrailSidebar trail={trail} />
            <SimilarTrails currentTrailId={trailId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trail;
