
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AlbumCard from "@/components/social/AlbumCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Compass, Users } from "lucide-react";
import { useAlbums } from '@/hooks/use-albums';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';

const Social = () => {
  const [currentTab, setCurrentTab] = useState<'feed' | 'following'>('feed');
  const { user, session } = useAuth();
  const { data: albums, isLoading } = useAlbums(currentTab === 'following' ? 'following' : 'feed');

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
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">Social Feed</h1>
            {session && (
              <Link to="/albums/new">
                <Button className="bg-greentrail-600 hover:bg-greentrail-700">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Create Album
                </Button>
              </Link>
            )}
          </div>
          
          <Tabs 
            value={currentTab} 
            onValueChange={(value) => handleTabChange(value as 'feed' | 'following')}
            className="space-y-6"
          >
            <TabsList>
              <TabsTrigger value="feed" className="flex items-center gap-2">
                <Compass className="h-4 w-4" />
                Feed
              </TabsTrigger>
              <TabsTrigger value="following" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Following
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="feed" className="space-y-6">
              {isLoading ? (
                <div className="text-center py-12">Loading albums...</div>
              ) : albums && albums.length > 0 ? (
                albums.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No albums found in your feed</p>
                </div>
              )}
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
              ) : isLoading ? (
                <div className="text-center py-12">Loading following feed...</div>
              ) : albums && albums.length > 0 ? (
                albums.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))
              ) : (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Follow Some Trailblazers</h3>
                  <p className="text-muted-foreground mb-4">
                    Connect with other members to see their adventures in your feed
                  </p>
                  <Button asChild>
                    <Link to="/discover">Discover Users</Link>
                  </Button>
                </div>
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
