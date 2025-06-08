
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useAlbums } from '@/hooks/use-albums';
import { toast } from '@/hooks/use-toast';
import AlbumsList from './AlbumsList';
import SocialTabs from './SocialTabs';
import StoriesSection from './StoriesSection';
import { TabsContent } from "@/components/ui/tabs";
import SignInRequired from './SignInRequired';

interface SocialFeedProps {
  searchQuery: string;
  onClearSearch: () => void;
}

const SocialFeed = ({ searchQuery, onClearSearch }: SocialFeedProps) => {
  const [currentTab, setCurrentTab] = useState<'feed' | 'following'>('feed');
  const { session } = useAuth();
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

  // Filter albums based on search query
  const filteredAlbums = albums?.filter(album => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase().trim();
    return (
      album.title?.toLowerCase().includes(query) ||
      album.description?.toLowerCase().includes(query) ||
      album.location?.toLowerCase().includes(query) ||
      album.user?.email?.toLowerCase().includes(query)
    );
  });
  
  return (
    <div className="space-y-6">
      {/* Stories Section - Always visible at top */}
      <StoriesSection />
      
      <SocialTabs currentTab={currentTab} onTabChange={handleTabChange}>
        <TabsContent value="feed" className="space-y-6">
          <AlbumsList
            albums={filteredAlbums}
            isLoading={isLoading}
            searchQuery={searchQuery}
            currentTab={currentTab}
            onClearSearch={onClearSearch}
          />
        </TabsContent>
        
        <TabsContent value="following" className="space-y-6">
          {!session ? (
            <SignInRequired />
          ) : (
            <AlbumsList
              albums={filteredAlbums}
              isLoading={isLoading}
              searchQuery={searchQuery}
              currentTab={currentTab}
              onClearSearch={onClearSearch}
            />
          )}
        </TabsContent>
      </SocialTabs>
    </div>
  );
};

export default SocialFeed;
