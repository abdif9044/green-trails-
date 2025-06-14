
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, MapPin, Search, Plus, Crown, Star, Calendar, MessageCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SocialGroup {
  id: string;
  name: string;
  description: string;
  location: string;
  member_count: number;
  max_members: number;
  is_private: boolean;
  activity_level: 'beginner' | 'intermediate' | 'advanced';
  created_at: string;
  owner_id: string;
  image_url?: string;
  tags: string[];
}

const SocialGroups: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Mock data - replace with actual queries
  const mockGroups: SocialGroup[] = [
    {
      id: '1',
      name: 'Bay Area Weekend Warriors',
      description: 'Join us for amazing weekend hikes around the San Francisco Bay Area. All skill levels welcome!',
      location: 'San Francisco Bay Area, CA',
      member_count: 247,
      max_members: 500,
      is_private: false,
      activity_level: 'intermediate',
      created_at: new Date().toISOString(),
      owner_id: 'owner1',
      tags: ['weekend', 'bay-area', 'community']
    },
    {
      id: '2', 
      name: 'Summit Seekers',
      description: 'For experienced hikers who love challenging peaks and high-altitude adventures.',
      location: 'Rocky Mountains, CO',
      member_count: 89,
      max_members: 150,
      is_private: false,
      activity_level: 'advanced',
      created_at: new Date().toISOString(),
      owner_id: 'owner2',
      tags: ['advanced', 'mountains', 'challenging']
    },
    {
      id: '3',
      name: 'Nature Photography Hikers',
      description: 'Combining hiking with photography. Learn techniques while exploring beautiful trails.',
      location: 'Pacific Northwest',
      member_count: 156,
      max_members: 200,
      is_private: false,
      activity_level: 'beginner',
      created_at: new Date().toISOString(),
      owner_id: 'owner3',
      tags: ['photography', 'nature', 'learning']
    }
  ];

  const getActivityLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
      case 'advanced': return 'bg-red-500/20 text-red-600 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  const filteredGroups = mockGroups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="luxury-card bg-white/5 backdrop-blur-luxury border-white/10 p-6 rounded-xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center">
              <Users className="h-5 w-5 text-luxury-900" />
            </div>
            <div>
              <h2 className="text-xl luxury-heading text-white">Hiking Groups</h2>
              <p className="text-sm luxury-text text-luxury-400">Connect with local hiking communities</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-400 h-4 w-4" />
              <Input
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-luxury-300"
              />
            </div>
            
            {user && (
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button className="gold-button">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Group
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Hiking Group</DialogTitle>
                  </DialogHeader>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Group creation form coming soon...</p>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredGroups.map((group) => (
          <Card key={group.id} className="luxury-card bg-white/5 backdrop-blur-luxury border-white/10 hover:border-gold-500/30 transition-all duration-300 group">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={group.image_url} />
                    <AvatarFallback className="bg-greentrail-gradient text-white">
                      {group.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-white luxury-heading text-lg">{group.name}</CardTitle>
                    <div className="flex items-center text-luxury-400 text-sm">
                      <MapPin className="h-3 w-3 mr-1" />
                      {group.location}
                    </div>
                  </div>
                </div>
                <Badge className={`luxury-text ${getActivityLevelColor(group.activity_level)}`}>
                  {group.activity_level}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-luxury-300 luxury-text text-sm line-clamp-3">
                {group.description}
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {group.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs bg-luxury-800/50 border-luxury-600/30 text-luxury-300">
                    {tag}
                  </Badge>
                ))}
                {group.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs bg-luxury-800/50 border-luxury-600/30 text-luxury-300">
                    +{group.tags.length - 3}
                  </Badge>
                )}
              </div>
              
              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-luxury-400">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {group.member_count}/{group.max_members}
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Active
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button 
                  size="sm" 
                  className="flex-1 bg-greentrail-600/20 hover:bg-greentrail-600/30 text-greentrail-300 border-greentrail-500/30"
                  variant="outline"
                >
                  View Group
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1 gold-button"
                >
                  Join Group
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredGroups.length === 0 && (
        <div className="luxury-card bg-white/5 backdrop-blur-luxury border-white/10 p-12 rounded-xl text-center">
          <Users className="h-16 w-16 text-luxury-400 mx-auto mb-6" />
          <h3 className="text-xl luxury-heading text-white mb-4">No Groups Found</h3>
          <p className="text-luxury-400 luxury-text max-w-md mx-auto mb-6">
            {searchQuery 
              ? "No groups match your search criteria. Try adjusting your search terms."
              : "No hiking groups available in your area yet. Be the first to create one!"
            }
          </p>
          {user && (
            <Button 
              className="gold-button"
              onClick={() => setShowCreateDialog(true)}
            >
              Create First Group
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default SocialGroups;
