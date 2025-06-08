
import { useState } from 'react';
import EnhancedAlbumCard from "@/components/social/EnhancedAlbumCard";
import { Skeleton } from '@/components/ui/skeleton';
import NoAlbumsFound from "@/components/social/NoAlbumsFound";
import { Album } from '@/hooks/use-albums';

interface EnhancedAlbumsListProps {
  albums: Album[] | undefined;
  currentTab: 'feed' | 'following'; 
  isLoading: boolean;
  searchQuery: string;
  onClearSearch: () => void;
}

const EnhancedAlbumsList = ({ 
  albums, 
  isLoading, 
  searchQuery, 
  currentTab, 
  onClearSearch 
}: EnhancedAlbumsListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-8">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="luxury-card bg-white/5 backdrop-blur-luxury border-white/10 p-6 rounded-xl space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-full bg-luxury-800/50" />
              <div className="space-y-2">
                <Skeleton className="w-32 h-4 bg-luxury-800/50" />
                <Skeleton className="w-20 h-3 bg-luxury-800/50" />
              </div>
            </div>
            <Skeleton className="w-full h-64 rounded-lg bg-luxury-800/50" />
            <div className="space-y-2">
              <Skeleton className="w-3/4 h-4 bg-luxury-800/50" />
              <Skeleton className="w-1/2 h-3 bg-luxury-800/50" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (!albums || albums.length === 0) {
    return (
      <NoAlbumsFound 
        searchQuery={searchQuery}
        currentTab={currentTab}
        onClearSearch={onClearSearch} 
      />
    );
  }
  
  return (
    <div className="space-y-8">
      {albums.map((album, index) => (
        <div 
          key={album.id}
          className="animate-fade-in-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <EnhancedAlbumCard album={album} />
        </div>
      ))}
    </div>
  );
};

export default EnhancedAlbumsList;
