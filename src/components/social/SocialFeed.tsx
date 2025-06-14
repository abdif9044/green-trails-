import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useAlbums } from '@/hooks/use-albums';
import { toast } from '@/components/ui/sonner';
import EnhancedAlbumsList from './EnhancedAlbumsList';
import SocialTabs from './SocialTabs';
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
      toast.error("Sign in required", {
        description: "You need to sign in to see albums from people you follow.",
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
    <div className="space-y-8">
      <SocialTabs currentTab={currentTab} onTabChange={handleTabChange}>
        <TabsContent value="feed" className="space-y-8">
          <EnhancedAlbumsList
            albums={filteredAlbums}
            isLoading={isLoading}
            searchQuery={searchQuery}
            currentTab={currentTab}
            onClearSearch={onClearSearch}
          />
        </TabsContent>
        
        <TabsContent value="following" className="space-y-8">
          {!session ? (
            <SignInRequired />
          ) : (
            <EnhancedAlbumsList
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
