
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
  
  if (searchQuery) {
    return (
      <div className="text-center py-12">
        <FilterX className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-semibold mb-2">No matching albums</h3>
        <p className="text-muted-foreground mb-4">
          Try adjusting your search terms or clear the search
        </p>
        <Button onClick={onClearSearch} variant="outline">
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
};

export default NoAlbumsFound;
