
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Compass, FilterX, Users } from "lucide-react";
import { useAuth } from '@/hooks/use-auth';

interface NoAlbumsFoundProps {
  searchQuery: string;
  currentTab: 'feed' | 'following';
  onClearSearch?: () => void;
}

const NoAlbumsFound = ({ searchQuery, currentTab, onClearSearch }: NoAlbumsFoundProps) => {
  const { session } = useAuth();
  
  // If there's a search query but no results were found
  if (searchQuery) {
    return (
      <div className="text-center py-12 px-4">
        <FilterX className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-semibold mb-2">No matching albums</h3>
        <p className="text-muted-foreground mb-4 max-w-md mx-auto">
          No albums found matching "{searchQuery}". Try adjusting your search terms.
        </p>
        <Button onClick={onClearSearch} variant="outline">
          Clear Search
        </Button>
      </div>
    );
  }
  
  // Following tab with no results
  if (currentTab === 'following') {
    return (
      <div className="text-center py-12 px-4">
        <Users className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Follow Some Trailblazers</h3>
        <p className="text-muted-foreground mb-4 max-w-md mx-auto">
          Connect with other members to see their adventures in your feed
        </p>
        <Button asChild className="bg-greentrail-600 hover:bg-greentrail-700">
          <Link to="/discover">Discover Users</Link>
        </Button>
      </div>
    );
  }
  
  // Feed tab with no results
  return (
    <div className="text-center py-12 px-4">
      <Compass className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
      <h3 className="text-lg font-semibold mb-2">No albums found</h3>
      <p className="text-muted-foreground mb-4 max-w-md mx-auto">
        {session 
          ? "Start by creating your own adventure album or follow other trailblazers."
          : "Sign in to share your adventures or follow other trailblazers."}
      </p>
      {session ? (
        <Button asChild className="bg-greentrail-600 hover:bg-greentrail-700">
          <Link to="/albums/new">Create Album</Link>
        </Button>
      ) : (
        <Button asChild className="bg-greentrail-600 hover:bg-greentrail-700">
          <Link to="/auth">Sign In</Link>
        </Button>
      )}
    </div>
  );
};

export default NoAlbumsFound;
