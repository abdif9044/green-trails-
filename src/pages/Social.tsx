
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AlbumCard from "@/components/social/AlbumCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Compass, Users } from "lucide-react";

const Social = () => {
  // Temporary mock data - to be replaced with Supabase data
  const mockAlbums = [
    {
      id: "1",
      title: "Sunset Hike at Emerald Trail",
      description: "Amazing evening spent watching the sunset from the peak. Perfect spot for meditation and relaxation.",
      coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop",
      location: "Emerald Trail, Boulder, CO",
      authorName: "Jane Cooper",
      authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop",
      likesCount: 124,
      commentsCount: 12,
      isPrivate: false,
      createdAt: "2024-04-20"
    },
    {
      id: "2",
      title: "Morning Meditation Group",
      description: "Great session with the community this morning. The weather was perfect!",
      location: "Green Mountain Trail",
      authorName: "Alex Johnson",
      likesCount: 89,
      commentsCount: 8,
      isPrivate: false,
      createdAt: "2024-04-19"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">Social Feed</h1>
            <Link to="/albums/new">
              <Button className="bg-greentrail-600 hover:bg-greentrail-700">
                <PlusCircle className="mr-2 h-5 w-5" />
                Create Album
              </Button>
            </Link>
          </div>
          
          <Tabs defaultValue="feed" className="space-y-6">
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
              {mockAlbums.map((album) => (
                <AlbumCard key={album.id} {...album} />
              ))}
            </TabsContent>
            
            <TabsContent value="following" className="space-y-6">
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
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Social;
