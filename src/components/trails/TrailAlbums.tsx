
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Image, Plus } from 'lucide-react';
import { useAlbums } from '@/hooks/use-albums';

const TrailAlbums: React.FC<{ trailId: string }> = ({ trailId }) => {
  const { data: albums, isLoading } = useAlbums(trailId);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-muted rounded-lg" />
        <div className="h-32 bg-muted rounded-lg" />
      </div>
    );
  }

  if (!albums?.length) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-greentrail-100 dark:bg-greentrail-800 text-greentrail-600 dark:text-greentrail-400 mb-4">
          <Image className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-semibold text-greentrail-800 dark:text-greentrail-200 mb-2">
          No Albums Yet
        </h3>
        <p className="text-greentrail-600 dark:text-greentrail-400 max-w-md mx-auto mb-6">
          Be the first to share your experience on this trail with the GreenTrails community.
        </p>
        <Button asChild>
          <Link to={`/albums/new?trailId=${trailId}`}>
            <Plus className="h-4 w-4 mr-2" />
            Create Album
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-greentrail-800 dark:text-greentrail-200">
          Trail Albums
        </h3>
        <Button asChild variant="outline" size="sm">
          <Link to={`/albums/new?trailId=${trailId}`}>
            <Plus className="h-4 w-4 mr-2" />
            New Album
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {albums.map((album) => (
          <Card key={album.id} className="overflow-hidden">
            <CardContent className="p-0">
              <Link to={`/albums/${album.id}`}>
                {/* Album preview content */}
                <div className="relative aspect-video bg-muted">
                  {album.coverImage ? (
                    <img 
                      src={album.coverImage} 
                      alt={album.title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Image className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-semibold mb-1">{album.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {album.description || "No description"}
                  </p>
                </div>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TrailAlbums;
