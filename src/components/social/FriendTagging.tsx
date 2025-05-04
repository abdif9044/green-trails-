
import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useSocialFollows, SocialUser } from '@/hooks/social/use-social-follows';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Check, ChevronsUpDown, User, UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface FriendTaggingProps {
  onTagged: (ids: string[]) => void;
  initialTagged?: string[];
  maxTags?: number;
}

interface UserOption {
  id: string;
  name?: string;
  username?: string;
  avatar?: string;
}

const FriendTagging: React.FC<FriendTaggingProps> = ({
  onTagged,
  initialTagged = [],
  maxTags = 5
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [taggedUsers, setTaggedUsers] = useState<UserOption[]>([]);

  // Get user's friends (followers/following)
  const { following = [], isLoading } = useSocialFollows(user?.id || '');
  
  // Filter users based on search
  const filteredUsers = following
    .filter(u => 
      !taggedUsers.some(t => t.id === u.id) && 
      (u.username?.toLowerCase().includes(search.toLowerCase()) ||
       u.full_name?.toLowerCase().includes(search.toLowerCase()))
    )
    .map(u => ({
      id: u.id,
      name: u.full_name || u.username || 'Unknown User',
      username: u.username || '',
      avatar: u.avatar_url
    }));

  const handleSelect = (user: UserOption) => {
    if (taggedUsers.length >= maxTags) {
      toast({
        title: `Maximum ${maxTags} tags`,
        description: `You can only tag up to ${maxTags} friends`,
        variant: "destructive"
      });
      return;
    }

    const updatedTags = [...taggedUsers, user];
    setTaggedUsers(updatedTags);
    onTagged(updatedTags.map(u => u.id));
    setOpen(false);
  };

  const handleRemove = (id: string) => {
    const updatedTags = taggedUsers.filter(u => u.id !== id);
    setTaggedUsers(updatedTags);
    onTagged(updatedTags.map(u => u.id));
  };

  // Load initial tagged users
  React.useEffect(() => {
    if (initialTagged?.length && followingUsers.length) {
      const users = followingUsers
        .filter(u => initialTagged.includes(u.id))
        .map(u => ({
          id: u.id,
          name: u.full_name || u.username || 'Unknown User',
          username: u.username || '',
          avatar: u.avatar_url
        }));
      setTaggedUsers(users);
    }
  }, [initialTagged, followingUsers]);

  if (!user) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-2">
        {taggedUsers.map(user => (
          <Badge key={user.id} variant="secondary" className="pl-1 pr-1">
            <div className="flex items-center gap-1">
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-xs">
                  {user.name?.[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="ml-1">{user.name}</span>
              <button 
                onClick={() => handleRemove(user.id)}
                className="ml-1 hover:text-destructive rounded-full h-4 w-4 inline-flex items-center justify-center"
              >
                ×
              </button>
            </div>
          </Badge>
        ))}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <div className="flex items-center">
              <UserPlus className="mr-2 h-4 w-4" />
              <span>Tag friends</span>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput 
              placeholder="Search people..." 
              value={search}
              onValueChange={setSearch}
            />
            <CommandEmpty>No people found</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {isLoading ? (
                <div className="p-2 text-center text-sm">Loading...</div>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((person) => (
                  <CommandItem
                    key={person.id}
                    value={person.id}
                    onSelect={() => handleSelect(person)}
                  >
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarFallback>
                          {person.name?.[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{person.name}</p>
                        {person.username && (
                          <p className="text-xs text-gray-500">@{person.username}</p>
                        )}
                      </div>
                    </div>
                    <Check
                      className="ml-auto h-4 w-4 opacity-0"
                    />
                  </CommandItem>
                ))
              ) : (
                <div className="p-2 text-center text-sm text-gray-500">
                  {!user ? "Sign in to tag friends" : "Follow people to tag them"}
                </div>
              )}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FriendTagging;
