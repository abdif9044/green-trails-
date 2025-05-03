
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { PlusCircle, Search, X } from "lucide-react";
import { useAuth } from '@/hooks/use-auth';

interface SocialHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SocialHeader = ({ searchQuery, setSearchQuery }: SocialHeaderProps) => {
  const { session } = useAuth();
  
  const handleClearSearch = () => {
    setSearchQuery('');
  };
  
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
        Social Feed
      </h1>
      
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search input with improved accessibility */}
        <div className="relative w-full sm:w-auto">
          <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          
          <Input
            type="text"
            placeholder="Search albums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-8 w-full sm:w-auto min-w-[200px]"
            aria-label="Search albums"
          />
          
          {searchQuery && (
            <button
              className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground"
              onClick={handleClearSearch}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {session ? (
          <Link to="/albums/new" className="inline-flex">
            <Button className="bg-greentrail-600 hover:bg-greentrail-700 w-full sm:w-auto">
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Album
            </Button>
          </Link>
        ) : (
          <Button 
            asChild 
            className="bg-greentrail-600 hover:bg-greentrail-700 w-full sm:w-auto"
          >
            <Link to="/auth">
              <PlusCircle className="mr-2 h-5 w-5" />
              Sign in to Create
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default SocialHeader;
