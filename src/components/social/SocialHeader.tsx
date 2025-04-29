
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { PlusCircle } from "lucide-react";
import { useAuth } from '@/hooks/use-auth';

interface SocialHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SocialHeader = ({ searchQuery, setSearchQuery }: SocialHeaderProps) => {
  const { session } = useAuth();
  
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
        Social Feed
      </h1>
      
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search input */}
        <div className="relative">
          <Input
            type="text"
            placeholder="Search albums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-8 w-full sm:w-auto min-w-[200px]"
          />
          {searchQuery && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setSearchQuery('')}
            >
              &times;
            </button>
          )}
        </div>
        
        {session && (
          <Link to="/albums/new" className="inline-flex">
            <Button className="bg-greentrail-600 hover:bg-greentrail-700 w-full sm:w-auto">
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Album
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default SocialHeader;
