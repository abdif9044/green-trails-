
import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SocialHeader from "@/components/social/SocialHeader";
import SocialFeed from "@/components/social/SocialFeed";
import ActivityFeed from "@/components/social/ActivityFeed";
import Leaderboards from "@/components/community/Leaderboards";
import StoryCreator from "@/components/social/StoryCreator";
import SEOProvider from "@/components/SEOProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/hooks/use-auth';
import { Trophy, Activity, Users, Image } from 'lucide-react';

const Social = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <SEOProvider
        title="Nature Feed - GreenTrails"
        description="Connect with fellow nature lovers, share your trail adventures, and discover amazing outdoor experiences through the GreenTrails community."
        type="website"
      />
      
      <Navbar />
      
      <main className="flex-grow bg-background">
        <div className="container mx-auto px-4 py-6 lg:py-8">
          <SocialHeader 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          
          {user && (
            <div className="mb-6">
              <StoryCreator onStoryCreated={() => window.location.reload()} />
            </div>
          )}

          <Tabs defaultValue="feed" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="feed" className="flex items-center gap-1">
                <Image className="h-4 w-4" />
                Albums
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-1">
                <Activity className="h-4 w-4" />
                Activity
              </TabsTrigger>
              <TabsTrigger value="leaderboards" className="flex items-center gap-1">
                <Trophy className="h-4 w-4" />
                Leaderboards
              </TabsTrigger>
              <TabsTrigger value="community" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                Community
              </TabsTrigger>
            </TabsList>

            <TabsContent value="feed" className="mt-6">
              <SocialFeed 
                searchQuery={searchQuery} 
                onClearSearch={() => setSearchQuery('')} 
              />
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <ActivityFeed />
            </TabsContent>

            <TabsContent value="leaderboards" className="mt-6">
              <Leaderboards />
            </TabsContent>

            <TabsContent value="community" className="mt-6">
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Community Features</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Discover hiking groups, join challenges, and connect with fellow outdoor enthusiasts in your area.
                </p>
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
