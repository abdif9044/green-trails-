
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AlbumCard from "@/components/social/AlbumCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Compass, Users, FilterX } from "lucide-react";
import { useAlbums } from '@/hooks/use-albums';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from '@/components/ui/skeleton';

const Social = () => {
  const [currentTab, setCurrentTab] = useState<'feed' | 'following'>('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const { user, session } = useAuth();
  const { data: albums, isLoading } = useAlbums(currentTab === 'following' ? 'following' : 'feed');
  const isMobile = useIsMobile();

  const handleTabChange = (tab: 'feed' | 'following') => {
    if (tab === 'following' && !session) {
      toast({
        title: "Sign in required",
        description: "You need to sign in to see albums from people you follow.",
        variant: "destructive",
      });
      return;
    }
    
    setCurrentTab(tab);
  };

  // Filter albums based on search query
  const filteredAlbums = albums?.filter(album => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase().trim();
    return (
      album.title?.toLowerCase().includes(query) ||
      album.description?.toLowerCase().includes(query) ||
      album.location?.toLowerCase().includes(query) ||
      album.user?.email?.toLowerCase().includes(query) ||
      album.user?.username?.toLowerCase().includes(query)
    );
  });
  
  const renderAlbumsList = (albumsToRender: typeof albums) => {
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
    
    if (!albumsToRender || albumsToRender.length === 0) {
      if (searchQuery) {
        return (
          <div className="text-center py-12">
            <FilterX className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No matching albums</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or clear the search
            </p>
            <Button onClick={() => setSearchQuery('')} variant="outline">
              Clear Search
            </Button>
          </div>
        );
      }
      
      return (
        <div className="text-center py-12">
          {currentTab === 'following' ? (
            <>
              <Users className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Follow Some Trailblazers</h3>
              <p className="text-muted-foreground mb-4">
                Connect with other members to see their adventures in your feed
              </p>
              <Button asChild>
                <Link to="/discover">Discover Users</Link>
              </Button>
            </>
          ) : (
            <>
              <Compass className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No albums found</h3>
              <p className="text-muted-foreground mb-4">
                Explore trails and create your own albums
              </p>
              {session && (
                <Button asChild>
                  <Link to="/albums/new">Create Album</Link>
                </Button>
              )}
            </>
          )}
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        {albumsToRender.map((album) => (
          <AlbumCard key={album.id} album={album} />
        ))}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-background">
        <div className="container mx-auto px-4 py-6 lg:py-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Social Feed
            </h1>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search input */}
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search albums..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-8 w-full sm:w-auto min-w-[200px]"
                />
                {searchQuery && (
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchQuery('')}
                  >
                    &times;
                  </button>
                )}
              </div>
              
              {session && (
                <Link to="/albums/new" className="inline-flex">
                  <Button className="bg-greentrail-600 hover:bg-greentrail-700 w-full sm:w-auto">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Create Album
                  </Button>
                </Link>
              )}
            </div>
          </div>
          
          <Tabs 
            value={currentTab} 
            onValueChange={(value) => handleTabChange(value as 'feed' | 'following')}
            className="space-y-6"
          >
            <TabsList className={`${isMobile ? 'w-full' : ''}`}>
              <TabsTrigger 
                value="feed" 
                className={`flex items-center gap-2 ${isMobile ? 'flex-1 justify-center' : ''}`}
              >
                <Compass className="h-4 w-4" />
                Feed
              </TabsTrigger>
              <TabsTrigger 
                value="following" 
                className={`flex items-center gap-2 ${isMobile ? 'flex-1 justify-center' : ''}`}
              >
                <Users className="h-4 w-4" />
                Following
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="feed" className="space-y-6">
              {renderAlbumsList(filteredAlbums)}
            </TabsContent>
            
            <TabsContent value="following" className="space-y-6">
              {!session ? (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Sign in to Follow Trailblazers</h3>
                  <p className="text-muted-foreground mb-4">
                    Create an account to connect with other members and see their adventures
                  </p>
                  <Button asChild>
                    <Link to="/auth">Sign In</Link>
                  </Button>
                </div>
              ) : (
                renderAlbumsList(filteredAlbums)
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Social;
