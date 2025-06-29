
import React from 'react';
import { useParams } from 'react-router-dom';
import { useAlbum } from '@/hooks/use-albums';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, User, Globe, Lock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOProvider from '@/components/SEOProvider';
import { formatDistanceToNow } from 'date-fns';

const AlbumDetail: React.FC = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const { data: album, isLoading, error } = useAlbum(albumId || '');

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Album Not Found</h2>
            <p className="text-gray-600">The album you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SEOProvider
        title={`${album.title} - GreenTrails Album`}
        description={album.description || 'A beautiful trail album on GreenTrails'}
        type="website"
      />
      
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl font-bold">{album.title}</CardTitle>
                <CardDescription className="text-lg mt-2">
                  {album.description || 'No description provided'}
                </CardDescription>
              </div>
              <Badge variant={album.is_public ? "default" : "secondary"}>
                {album.is_public ? (
                  <>
                    <Globe className="w-4 h-4 mr-1" />
                    Public
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-1" />
                    Private
                  </>
                )}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {album.cover_image_url && (
              <div className="aspect-video rounded-lg overflow-hidden">
                <img
                  src={album.cover_image_url}
                  alt={album.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Created {formatDistanceToNow(new Date(album.created_at), { addSuffix: true })}</span>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="w-4 h-4" />
                <span>By Trail Explorer</span>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Location Available</span>
              </div>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="text-xl font-semibold mb-4">Album Media</h3>
              <p className="text-muted-foreground">
                Media content will be displayed here once the media system is fully implemented.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button>Like Album</Button>
              <Button variant="outline">Share</Button>
              <Button variant="outline">Follow Trail</Button>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default AlbumDetail;
