
import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PremiumSocialHeader from "@/components/social/PremiumSocialHeader";
import SocialFeed from "@/components/social/SocialFeed";
import ActivityFeed from "@/components/social/ActivityFeed";
import LiveStoriesSection from "@/components/social/LiveStoriesSection";
import SocialChallenges from "@/components/social/SocialChallenges";
import SocialGroups from "@/components/social/SocialGroups";
import EventSystem from "@/components/social/EventSystem";
import EnhancedUserProfile from "@/components/social/EnhancedUserProfile";
import NotificationCenter from "@/components/social/NotificationCenter";
import Leaderboards from "@/components/community/Leaderboards";
import StoryCreator from "@/components/social/StoryCreator";
import SEOProvider from "@/components/SEOProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/hooks/use-auth';
import { Trophy, Activity, Users, Image, Target, Star, Calendar, UserCheck } from 'lucide-react';

const Social = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col bg-luxury-950">
      <SEOProvider
        title="Nature Community - GreenTrails"
        description="Connect with fellow nature lovers, share your trail adventures, and discover amazing outdoor experiences through the GreenTrails community."
        type="website"
      />
      
      <div className="flex items-center justify-between px-4">
        <Navbar />
        {user && <NotificationCenter />}
      </div>
      
      {/* Premium Header */}
      <PremiumSocialHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          {/* Live Stories Section */}
          <div className="mb-8">
            <LiveStoriesSection />
          </div>

          {/* Story Creator for logged in users */}
          {user && (
            <div className="mb-8">
              <StoryCreator onStoryCreated={() => window.location.reload()} />
            </div>
          )}

          {/* Main Content Tabs */}
          <Tabs defaultValue="feed" className="w-full">
            <TabsList className="grid w-full grid-cols-8 bg-white/5 backdrop-blur-luxury border-white/10 p-1 rounded-xl">
              <TabsTrigger 
                value="feed" 
                className="flex items-center gap-2 data-[state=active]:bg-gold-gradient data-[state=active]:text-luxury-900 text-luxury-300 rounded-lg luxury-text"
              >
                <Image className="h-4 w-4" />
                <span className="hidden sm:inline">Feed</span>
              </TabsTrigger>
              <TabsTrigger 
                value="groups" 
                className="flex items-center gap-2 data-[state=active]:bg-gold-gradient data-[state=active]:text-luxury-900 text-luxury-300 rounded-lg luxury-text"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Groups</span>
              </TabsTrigger>
              <TabsTrigger 
                value="events" 
                className="flex items-center gap-2 data-[state=active]:bg-gold-gradient data-[state=active]:text-luxury-900 text-luxury-300 rounded-lg luxury-text"
              >
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Events</span>
              </TabsTrigger>
              <TabsTrigger 
                value="challenges" 
                className="flex items-center gap-2 data-[state=active]:bg-gold-gradient data-[state=active]:text-luxury-900 text-luxury-300 rounded-lg luxury-text"
              >
                <Target className="h-4 w-4" />
                <span className="hidden sm:inline">Challenges</span>
              </TabsTrigger>
              <TabsTrigger 
                value="activity" 
                className="flex items-center gap-2 data-[state=active]:bg-gold-gradient data-[state=active]:text-luxury-900 text-luxury-300 rounded-lg luxury-text"
              >
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline">Activity</span>
              </TabsTrigger>
              <TabsTrigger 
                value="leaderboards" 
                className="flex items-center gap-2 data-[state=active]:bg-gold-gradient data-[state=active]:text-luxury-900 text-luxury-300 rounded-lg luxury-text"
              >
                <Trophy className="h-4 w-4" />
                <span className="hidden sm:inline">Leaders</span>
              </TabsTrigger>
              <TabsTrigger 
                value="profile" 
                className="flex items-center gap-2 data-[state=active]:bg-gold-gradient data-[state=active]:text-luxury-900 text-luxury-300 rounded-lg luxury-text"
              >
                <UserCheck className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger 
                value="featured" 
                className="flex items-center gap-2 data-[state=active]:bg-gold-gradient data-[state=active]:text-luxury-900 text-luxury-300 rounded-lg luxury-text"
              >
                <Star className="h-4 w-4" />
                <span className="hidden sm:inline">Featured</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="feed" className="mt-8">
              <SocialFeed 
                searchQuery={searchQuery} 
                onClearSearch={() => setSearchQuery('')} 
              />
            </TabsContent>

            <TabsContent value="groups" className="mt-8">
              <SocialGroups />
            </TabsContent>

            <TabsContent value="events" className="mt-8">
              <EventSystem />
            </TabsContent>

            <TabsContent value="challenges" className="mt-8">
              <SocialChallenges />
            </TabsContent>

            <TabsContent value="activity" className="mt-8">
              <ActivityFeed />
            </TabsContent>

            <TabsContent value="leaderboards" className="mt-8">
              <Leaderboards />
            </TabsContent>

            <TabsContent value="profile" className="mt-8">
              {user ? (
                <EnhancedUserProfile />
              ) : (
                <div className="luxury-card bg-white/5 backdrop-blur-luxury border-white/10 p-12 rounded-xl text-center">
                  <UserCheck className="h-16 w-16 text-luxury-400 mx-auto mb-6" />
                  <h3 className="text-2xl luxury-heading text-white mb-4">Sign In Required</h3>
                  <p className="text-luxury-400 luxury-text max-w-md mx-auto mb-8 leading-relaxed">
                    Please sign in to view and manage your enhanced hiking profile with stats, achievements, and social features.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="featured" className="mt-8">
              <div className="luxury-card bg-white/5 backdrop-blur-luxury border-white/10 p-12 rounded-xl text-center">
                <Star className="h-16 w-16 text-gold-400 mx-auto mb-6" />
                <h3 className="text-2xl luxury-heading text-white mb-4">Featured Adventures</h3>
                <p className="text-luxury-400 luxury-text max-w-md mx-auto mb-8 leading-relaxed">
                  Handpicked extraordinary trail experiences and adventures from our most accomplished community members.
                </p>
                <button className="gold-button">
                  View Featured Content
                </button>
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
