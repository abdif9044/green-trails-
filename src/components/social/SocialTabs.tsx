
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Compass, Users } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';

interface SocialTabsProps {
  currentTab: 'feed' | 'following';
  onTabChange: (tab: 'feed' | 'following') => void;
  children: React.ReactNode;
}

const SocialTabs = ({ currentTab, onTabChange, children }: SocialTabsProps) => {
  const isMobile = useIsMobile();
  
  return (
    <Tabs 
      value={currentTab} 
      onValueChange={(value) => onTabChange(value as 'feed' | 'following')}
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
      
      {children}
    </Tabs>
  );
};

export default SocialTabs;
