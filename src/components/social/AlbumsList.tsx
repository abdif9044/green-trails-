
import { useState } from 'react';
import AlbumCard from "@/components/social/AlbumCard";
import { Skeleton } from '@/components/ui/skeleton';
import NoAlbumsFound from "@/components/social/NoAlbumsFound";
import { Album } from '@/hooks/use-albums';

interface AlbumsListProps {
  albums: Album[] | undefined;
  currentTab: 'feed' | 'following'; 
  isLoading: boolean;
  searchQuery: string;
  onClearSearch: () => void;
}

const AlbumsList = ({ 
  albums, 
  isLoading, 
  searchQuery, 
  currentTab, 
  onClearSearch 
}: AlbumsListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="w-24 h-4" />
                <Skeleton className="w-16 h-3" />
              </div>
            </div>
            <Skeleton className="w-full h-40 rounded-lg" />
            <Skeleton className="w-3/4 h-4" />
            <Skeleton className="w-1/2 h-3" />
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
    <div className="space-y-6">
      {albums.map((album) => (
        <AlbumCard key={album.id} album={album} />
      ))}
    </div>
  );
};

export default AlbumsList;
