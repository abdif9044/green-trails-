
import React from 'react';
import { useParams } from 'react-router-dom';
import { useTrailInteractions } from '@/hooks/use-trail-interactions';
import { useTrailQueryBase } from '@/features/trails/hooks/use-trail-query-base';
import TrailSidebar from '@/components/trails/TrailSidebar';
import SimilarTrails from '@/components/trails/SimilarTrails';

const Trail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const trailId = id || '';
  
  const { data: trail, isLoading: trailLoading } = useTrailQueryBase(trailId);
  const { isLiked, likeCount, toggleLike, isLoading } = useTrailInteractions(trailId);

  if (trailLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading trail...</div>
      </div>
    );
  }

  if (!trail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Trail not found</div>
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
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <TrailSidebar trailId={trailId} trail={trail} />
            <SimilarTrails currentTrailId={trailId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trail;
